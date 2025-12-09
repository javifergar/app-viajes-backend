const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs/promises'); // Usamos promesas para no bloquear el hilo
const { formatDate } = require('../utils/utils/date.utils'); 
const jwt = require('jsonwebtoken');
const TripsModel = require('../models/trips.model');
const UsersModel = require('../models/users.model');
require('dotenv').config();


// --- AGREGA ESTO PARA DEPURAR ---
console.log('--- DEBUG EMAIL SERVICE ---');
console.log('1. Ruta del archivo .env esperada:', path.resolve(__dirname, '../../.env')); // Ajusta los ../ según tu estructura
console.log('2. GMAIL_USER:', process.env.GMAIL_USER ? 'CARGADO CORRECTAMENTE' : '❌ NO DEFINIDO');
console.log('3. GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'CARGADO (longitud: ' + process.env.GMAIL_APP_PASSWORD.length + ')' : '❌ NO DEFINIDO');
console.log('---------------------------');
// --------------------------------

// ================= CONFIGURACIÓN =================
// Configuración del Transporter
let transporter = null;
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
} else {
    console.warn("⚠️ No se han configurado credenciales de correo. Los emails no se enviarán.");
}

// Helper para leer plantillas HTML de forma asíncrona
const loadTemplate = async (templateName) => {
    const templatePath = path.join(__dirname, `../templates/${templateName}`);
    return await fs.readFile(templatePath, 'utf-8');
};

// ================= FUNCIONES DE ENVÍO =================

// 1. Verificación de Email
const sendVerifyEmailTo = async (userData) => {
    if (!transporter) return;

    try {
        const htmlTemplate = await loadTemplate('verify.html'); // Lectura asíncrona
        
        const token = jwt.sign({ userId: userData.id_user }, process.env.SECRET_KEY, { expiresIn: '1d' });
        
        // Este link apunta al BACKEND, el cual debe hacer res.redirect() al FRONTEND
        const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
        const verificationLink = `${apiBaseUrl}/api/auth/verify?token=${token}`;
        
        const html = htmlTemplate.replace(/{{verificationLink}}/g, verificationLink);

        await transporter.sendMail({
            from: `Viajes Compartidos <${process.env.GMAIL_USER}>`,
            to: userData.email,
            subject: 'Verificación de email - Viajes Compartidos',
            html: html,
        });
    } catch (error) {
        console.error('❌ Error sending verification email:', error);
    }
};

// 2. Notificación de Cambio de Fechas
const sendTripUpdateNotification = async (participants, oldTrip, updatedTrip, creatorEmail) => {
    if (!transporter || participants.length === 0) return;

    try {
        const htmlTemplate = await loadTemplate('datesModified.html');
        
        const frontendUrl = process.env.FRONTEND_URL || 'https://app-viajes.netlify.app';
        const tripDetailsUrl = `${frontendUrl}/trips/${updatedTrip.id_trip}`;

        const emailPromises = participants.map(participant => {
            if (participant.email === creatorEmail) return Promise.resolve();

            let html = htmlTemplate
                .replace(/{{participantName}}/g, participant.name)
                .replace(/{{tripTitle}}/g, updatedTrip.title)
                .replace(/{{newStartDate}}/g, formatDate(updatedTrip.start_date))
                .replace(/{{newEndDate}}/g, formatDate(updatedTrip.end_date))
                .replace(/{{oldStartDate}}/g, formatDate(oldTrip.start_date))
                .replace(/{{oldEndDate}}/g, formatDate(oldTrip.end_date))
                .replace(/{{tripDetailsUrl}}/g, tripDetailsUrl);

            return transporter.sendMail({
                from: `Viajes Compartidos <${process.env.GMAIL_USER}>`,
                to: participant.email,
                subject: `⚠️ Cambio de fechas: ${updatedTrip.title}`,
                html: html,
            });
        });

        return Promise.allSettled(emailPromises);
    } catch (error) {
        console.error('❌ Error preparing update emails:', error);
    }
};

// 3. Solicitud Pendiente (Aceptar/Rechazar)
const sendPendingRequestEmail = async (newParticipation) => {
    if (!transporter) return;

    try {
        const { id_participation, id_trip, id_user, message } = newParticipation;

        const participant = await UsersModel.selectById(id_user);
        const trip = await TripsModel.tripsById(id_trip);

        if (!participant || !trip) {
            console.error('Missing data for email');
            return;
        }

        const creator = await UsersModel.selectById(trip.id_creator);
        if (!creator) return;

        let html = await loadTemplate('pendingRequest.html');

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

        const acceptToken = jwt.sign({ id_participation, action: 'accepted' }, process.env.SECRET_KEY, { expiresIn: '7d' });
        const rejectToken = jwt.sign({ id_participation, action: 'rejected' }, process.env.SECRET_KEY, { expiresIn: '7d' });

        // NOTA: Estos enlaces también apuntan al BACKEND.
        // El endpoint /api/participants/.../action debe hacer res.redirect() al FRONTEND
        // Ejemplo: res.redirect(`${frontendUrl}/requests?status=success`)
        
        html = html
            .replace(/{{creatorName}}/g, creator.name)
            .replace(/{{userName}}/g, participant.name)
            .replace(/{{tripTitle}}/g, trip.title)
            .replace(/{{startDate}}/g, formatDate(trip.start_date))
            .replace(/{{endDate}}/g, formatDate(trip.end_date))
            .replace(/{{userMessage}}/g, message || 'Sin mensaje')
            .replace(/{{appUrl}}/g, `${frontendUrl}/requests`)
            .replace(/{{accepted}}/g, `${apiBaseUrl}/api/participants/${id_participation}/action?token=${acceptToken}`)
            .replace(/{{rejected}}/g, `${apiBaseUrl}/api/participants/${id_participation}/action?token=${rejectToken}`);

        return transporter.sendMail({
            from: `Viajes Compartidos <${process.env.GMAIL_USER}>`,
            to: creator.email,
            subject: `📨 ${participant.name} solicita unirse a tu viaje`,
            html: html,
        });
    } catch (error) {
        console.error('❌ Error sending pending request email:', error.message);
        throw error;
    }
};

module.exports = { sendTripUpdateNotification, sendVerifyEmailTo, sendPendingRequestEmail };