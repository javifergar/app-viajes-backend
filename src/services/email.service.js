const path = require('path');
const nodemailer = require('nodemailer');
const { nodemailerMjmlPlugin } = require('nodemailer-mjml');
const { formatDate } = require('../utils/utils/date.utils'); 
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const fs = require('fs');

// Configuración del Transporter de NodeMailer para Gmail
let transporter = null;
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER, // Tu email de Gmail
            pass: process.env.GMAIL_APP_PASSWORD, // La Contraseña de Aplicación de Google (App Password)
        },
    });

    // Incluir el plugin MJML para plantillas
    transporter.use('compile', nodemailerMjmlPlugin({
        // La ruta asume que tienes una carpeta 'templates' en la raíz de tu proyecto (junto a 'config', 'controllers', etc.)
        templateFolder: path.join(__dirname, '../templates'), 
    }));
}


//Envio de un correo electrónico de verificación agnóstico a creación o modificación
const sendVerifyEmailTo = async (userData) => {
  if (!transporter) return;

  // Leer la plantilla HTML
  const templatePath = path.join(__dirname, '../templates/verify.html');
  let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

  // Generamos un JWT para identificar al usuario en la ruta de verificación
  const token = jwt.sign({ userId: userData.id_user }, process.env.SECRET_KEY);
  const UrlBase = process.env.BASE_URL || 'http://localhost:3000';
  const verificationLink = `${UrlBase}/api/auth/verify?token=${token}`;

  // Interpolar variables en la plantilla
  let html = htmlTemplate.replace(/{{verificationLink}}/g, verificationLink);

  await transporter.sendMail({
      from: `Viajes Compartidos <${process.env.GMAIL_USER}>`,
      to: userData.email,
      subject: 'Verificación de email - Viajes Compartidos',
      html: html,
  });
};

const sendTripUpdateNotification = async (participants, oldTrip, updatedTrip, creatorEmail) => {
  if (!transporter || participants.length === 0) return;

  // Leer la plantilla HTML
  const templatePath = path.join(__dirname, '../templates/datesModified.html');
  let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

  // URL del frontend para ver detalles del viaje
  const frontendUrl = process.env.FRONTEND_URL || 'https://app-viajes.netlify.app';
  const tripDetailsUrl = `${frontendUrl}/trips/${updatedTrip.id_trip}`;

  const emailPromises = participants.map(participant => {
    // Lógica de exclusión del creador
    if (participant.email === creatorEmail) return Promise.resolve();

    // Interpolar variables en la plantilla
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

  // Retornamos la promesa para que el controlador decida si esperar o no
  return Promise.allSettled(emailPromises);
};

module.exports = { sendTripUpdateNotification, sendVerifyEmailTo };