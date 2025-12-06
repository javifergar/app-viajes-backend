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

  // Generamos un JWT para identificar al usuario en la ruta de verificación
  const token = jwt.sign({ userId: userData.id_user }, process.env.SECRET_KEY);
  const UrlBase = process.env.BASE_URL || 'http://localhost:3000';
  const verificationLink = `${UrlBase}/api/auth/verify?token=${token}`;

  await transporter.sendMail({
      from: `Viajes Compartidos <${process.env.GMAIL_USER}>`, // Usar el email configurado en el .env
      to: userData.email,
      subject: 'Verificación de email',
      // **Asumimos una plantilla MJML llamada 'verify.mjml' en la carpeta 'templates'**
      template: 'verify', 
      context: {
          verificationLink: verificationLink,
          // Puedes pasar más variables a la plantilla MJML aquí
      },
  });
};

const sendTripUpdateNotification = async (participants, oldTrip, updatedTrip, creatorEmail) => {
  if (!transporter || participants.length === 0) return;

  // Leer la plantilla HTML
  const templatePath = path.join(__dirname, '../templates/datesModified.html');
  let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

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
      .replace(/{{oldEndDate}}/g, formatDate(oldTrip.end_date));

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