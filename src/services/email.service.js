
const { Resend } = require('resend');
const { formatDate } = require('../utils/utils/date.utils'); 

// Inicializar solo si existe la key, buena práctica para evitar crash en dev
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Plantilla HTML privada (no se exporta)
const generateDateChangeTemplate = (participantName, tripTitle, oldTrip, newTrip) => {
  return `
    <h2>¡Hola ${participantName}!</h2>
    <p>Te informamos que las fechas del viaje <strong>"${tripTitle}"</strong> han sido modificadas.</p>
    
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>📅 Nuevas fechas:</strong></p>
        <ul style="list-style: none; padding-left: 0;">
            <li>Salida: ${formatDate(newTrip.start_date)}</li>
            <li>Regreso: ${formatDate(newTrip.end_date)}</li>
        </ul>
        <hr style="border: 0; border-top: 1px solid #ccc;">
        <p style="font-size: 0.9em; color: #666;">(Anteriormente: ${formatDate(oldTrip.start_date)} - ${formatDate(oldTrip.end_date)})</p>
    </div>
    <p>Por favor, revisa la aplicación para más detalles.</p>
  `;
};

const sendTripUpdateNotification = async (participants, oldTrip, updatedTrip, creatorEmail) => {
  if (!resend || participants.length === 0) return;

  const emailPromises = participants.map(participant => {
    // Lógica de exclusión del creador
    if (participant.email === creatorEmail) return Promise.resolve();

    return resend.emails.send({
      from: 'Viajes Compartidos <onboarding@resend.dev>',
      to: participant.email,
      subject: `⚠️ Cambio de fechas: ${updatedTrip.title}`,
      html: generateDateChangeTemplate(participant.name, updatedTrip.title, oldTrip, updatedTrip)
    });
  });

  // Retornamos la promesa para que el controlador decida si esperar o no
  return Promise.allSettled(emailPromises);
};

module.exports = { sendTripUpdateNotification };