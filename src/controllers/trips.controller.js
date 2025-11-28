const TripModel = require('../models/trips.model');
const ParticipantsModel = require('../models/participants.model');

const getAllTrips = async (req, res) => {
  try {
    const { status, destination, departure, date, creator } = req.query;
    const trips = await TripModel.selectTrips({ status, destination, departure, date, creator });

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los viajes' });
  }
};

const getTripById = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await TripModel.tripsById(tripId);

    if (!trip) return res.status(404).json({ message: 'No existe este viaje' });

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el viaje' });
  }
};

const getMyTripsAsParticipant = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const participantStatus = req.query.participantStatus;

    const trips = await TripModel.selectTrips({
      participant: userId,
      participantStatus,
      excludeCreatorForParticipant: true,
    });

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tus viajes como participante' });
  }
};

const getMyTrips = async (req, res) => {
  try {
    const userId = req.user.id_user;

    const trips = await TripModel.selectTrips({
      creatorId: userId,
    });

    res.json(trips);
  } catch (error) {
    console.error('Error en getMyCreatedTrips:', error);
    res.status(500).json({ message: 'Error al obtener tus viajes creados' });
  }
};

const createTrip = async (req, res) => {
  try {
    const creatorId = req.user.id_user;
    const data = { ...req.body, id_creator: creatorId };

    const { insertId } = await TripModel.insertTrip(data);

    // Crear participación automática del creador del viaje
    const existing = await ParticipantsModel.selectByTripAndUser(insertId, creatorId);
    if (!existing) {
      await ParticipantsModel.insertParticipation(insertId, creatorId, 'Creator auto-join', 'accepted');
    }

    const trip = await TripModel.tripsById(insertId);

    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el viaje' });
  }
};

// NOTIFICACIONES POR EMAIL AL MODIFICAR FECHAS DE VIAJE

// 1. Configuración de Resend
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY); // Asegúrate de tener la KEY en tu .env

// Función auxiliar para formatear fechas en el correo (ej: 25/12/2023)
const formatDate = (dateString) => {
  if (!dateString) return 'Por definir';
  return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const creatorId = req.user.id_user;

    // 1. Recuperamos el viaje ANTES de actualizar (Old Trip)
    const oldTrip = await TripModel.tripsById(tripId);

    if (!oldTrip) {
      return res.json({ message: 'No existe este viaje' });
    }

    if (oldTrip.id_creator !== creatorId) {
      return res.status(403).json({ message: 'No puedes modificar un viaje si no eres el creador' });
    }

    // 2. Actualizamos el viaje en la BBDD
    await TripModel.updateTrip(tripId, req.body);
    
    // 3. Recuperamos el viaje actualizado (New Trip)
    const updatedTrip = await TripModel.tripsById(tripId);

    // --- LÓGICA DE NOTIFICACIONES ---

    // Comparamos las fechas (convertimos a ISO string para evitar errores de objetos Date)
    const oldStart = new Date(oldTrip.start_date).toISOString();
    const newStart = new Date(updatedTrip.start_date).toISOString();
    const oldEnd = new Date(oldTrip.end_date).toISOString();
    const newEnd = new Date(updatedTrip.end_date).toISOString();

    // Si cambió alguna de las fechas...
    if (oldStart !== newStart || oldEnd !== newEnd) {
        
        // Obtenemos los participantes aceptados usando la nueva función del modelo
        const participants = await ParticipantsModel.selectAcceptedParticipantsEmails(tripId);

        if (participants.length > 0) {
            // Preparamos los envíos (Promise.allSettled para que un error de email no rompa el flujo)
            const emailPromises = participants.map(participant => {
                // Opcional: No enviar correo al propio creador si está en la lista de participantes
                if (participant.email === req.user.email) return Promise.resolve();

                return resend.emails.send({
                    from: 'Viajes Compartidos <onboarding@resend.dev>', // Usa tu remitente verificado en producción
                    to: participant.email,
                    subject: `⚠️ Cambio de fechas: ${updatedTrip.title}`,
                    html: `
                        <h2>¡Hola ${participant.name}!</h2>
                        <p>Te informamos que las fechas del viaje <strong>"${updatedTrip.title}"</strong> han sido modificadas.</p>
                        
                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>📅 Nuevas fechas:</strong></p>
                            <ul style="list-style: none; padding-left: 0;">
                                <li>Salida: ${formatDate(updatedTrip.start_date)}</li>
                                <li>Regreso: ${formatDate(updatedTrip.end_date)}</li>
                            </ul>
                            <hr style="border: 0; border-top: 1px solid #ccc;">
                            <p style="font-size: 0.9em; color: #666;">(Anteriormente: ${formatDate(oldTrip.start_date)} - ${formatDate(oldTrip.end_date)})</p>
                        </div>

                        <p>Por favor, revisa la aplicación para más detalles.</p>
                    `
                });
            });

            // Ejecutamos el envío en "segundo plano" (no esperamos con await bloqueante estricto si no queremos retrasar la respuesta HTTP)
            Promise.allSettled(emailPromises).then(results => {
                console.log(`Notificaciones enviadas: ${results.length} intentos.`);
            });
        }
    }
    // --------------------------------

    res.json({ message: 'Viaje modificado correctamente', viaje_anterior: oldTrip, viaje_actualizado: updatedTrip });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error al actualizar el viaje' });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const creatorId = req.user.id_user;

    const trip = await TripModel.tripsById(tripId);

    if (!trip) {
      return res.json({
        message: 'No existe este viaje',
      });
    }

    if (trip.id_creator !== creatorId) {
      return res.status(403).json({ message: 'No puedes eliminar un viaje si no eres el creador' });
    }

    await TripModel.deleteTrip(tripId);

    res.json({ message: 'Viaje borrado correctamente', trip });
  } catch (error) {
    res.status(500).json({ message: 'Error al borrar el viaje' });
  }
};

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getMyTripsAsParticipant,
  getMyTrips,
};
