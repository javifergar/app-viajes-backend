const path = require('path');
const nodemailer = require('nodemailer');
const { nodemailerMjmlPlugin } = require('nodemailer-mjml');
const { formatDate } = require('../utils/utils/date.utils'); 
const jwt = require('jsonwebtoken');
const TripsModel = require('../models/trips.model');
const UsersModel = require('../models/users.model');
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
  const UrlBase = process.env.FRONTEND_URL || 'http://localhost:3000';
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

//Envio de notificaciones por cambio de fechas de un viaje
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




//Envio de notificación de nueva solicitud de participación
const sendPendingRequestEmail = async (newParticipation) => {
  if (!transporter) return;

  try {
    const { id_participation, id_trip, id_user, message } = newParticipation;

    // Obtener datos necesarios
    const participant = await UsersModel.selectById(id_user);
    const trip = await TripsModel.tripsById(id_trip);
    const creator = await UsersModel.selectById(trip.id_creator);

    // Validar que existen los datos
    if (!participant || !trip || !creator) return;

    // Leer la plantilla HTML
    const templatePath = path.join(__dirname, '../templates/pendingRequest.html');
    let html = fs.readFileSync(templatePath, 'utf-8');

    // **IMPORTANTE:** Definimos las dos URLs
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000'; // <-- Usa la variable dedicada para el API

    // Generar tokens JWT
    const acceptToken = jwt.sign({ id_participation, action: 'accept' }, process.env.SECRET_KEY, { expiresIn: '7d' });
    const rejectToken = jwt.sign({ id_participation, action: 'reject' }, process.env.SECRET_KEY, { expiresIn: '7d' });

    // Interpolar variables
    html = html
      .replace(/{{creatorName}}/g, creator.name)
      .replace(/{{userName}}/g, participant.name)
      .replace(/{{tripTitle}}/g, trip.title)
      .replace(/{{startDate}}/g, formatDate(trip.start_date))
      .replace(/{{endDate}}/g, formatDate(trip.end_date))
      .replace(/{{userMessage}}/g, message || 'Sin mensaje')
      .replace(/{{appUrl}}/g, `${frontendUrl}/requests`)
      // Los enlaces de acción ahora apuntan a la URL pública del API (Render)
      .replace(/{{acept}}/g, `${apiBaseUrl}/api/participants/${id_participation}/action?token=${acceptToken}`)
      .replace(/{{reject}}/g, `${apiBaseUrl}/api/participants/${id_participation}/action?token=${rejectToken}`);

    return transporter.sendMail({
      from: `Viajes Compartidos <${process.env.GMAIL_USER}>`,
      to: creator.email,
      subject: `📨 ${participant.name} solicita unirse a tu viaje`,
      html: html,
    });
  } catch (error) {
    console.error('Error sending pending request email:', error);
  }
};


module.exports = { sendTripUpdateNotification, sendVerifyEmailTo, sendPendingRequestEmail };



// Necesito:
//     - UsersModel.selectById(userId) - usuario que solicita
//     - TripsModel.selectById(tripId) - datos del viaje
//     - UsersModel.selectById(creatorId) - creador del viaje

// Respuesta:
// {

//   "id_participation": 12,
//   "id_trip": 101,
//   "id_user": 1,
//   "status": "pending",
//   "message": "Quiero unirme al viaje.",
//   "created_at": "2025-11-17T18:26:28.000Z",
//   "updated_at": "2025-11-17T18:26:28.000Z"
// }

// nota: si envias al usuario a una pagina que no está alojada en el front, no se va renderizar ues no está desplegada en ningun sito....averiguar como hacerlo