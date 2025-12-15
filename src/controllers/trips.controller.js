const TripModel = require('../models/trips.model');
const ParticipantsModel = require('../models/participants.model');
const { hasDateChanged } = require('../utils/utils/date.utils');
const { sendTripUpdateNotification } = require('../services/email.service');

const getAllTrips = async (req, res) => {
  try {
    await TripModel.refreshTripsStatus();
    const { status, destination, departure, start_date, end_date, creator, participant, participantStatus, sortBy, sortOrder, cost } = req.query;

    let page = parseInt(req.query.page, 10) || 1;
    let pageSize = parseInt(req.query.pageSize, 10) || 10;

    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 10;

    const { trips, total } = await TripModel.selectTripsPaginated(
      { status, destination, departure, start_date, end_date, creator, participant, participantStatus, sortBy, sortOrder, cost },
      page,
      pageSize
    );

    const totalPages = Math.ceil(total / pageSize);

    res.json({ data: trips, pagination: { total, page, pageSize, totalPages } });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los viajes' });
  }
};

const getTripById = async (req, res) => {
  try {
    const { tripId } = req.params;
    await TripModel.refreshTripsStatus();
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
    await TripModel.refreshTripsStatus();
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
    await TripModel.refreshTripsStatus();
    const trips = await TripModel.selectTrips({
      creatorId: userId,
    });

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tus viajes creados' });
  }
};

const createTrip = async (req, res) => {
  try {
    const creatorId = req.user.id_user;
    const data = { ...req.body, id_creator: creatorId };

    const { insertId } = await TripModel.insertTrip(data);

    const existing = await ParticipantsModel.selectByTripAndUser(insertId, creatorId);
    if (!existing) {
      await ParticipantsModel.insertParticipation(insertId, creatorId, 'Creador', 'accepted');
    }

    const trip = await TripModel.tripsById(insertId);

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el viaje' });
  }
};

const updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const creatorId = req.user.id_user;
    const creatorEmail = req.user.email;

    const oldTrip = await TripModel.tripsById(tripId);
    if (!oldTrip) {
      return res.status(404).json({ message: 'No existe este viaje' });
    }
    if (oldTrip.id_creator !== creatorId) {
      return res.status(403).json({ message: 'No puedes modificar un viaje si no eres el creador' });
    }

    await TripModel.updateTrip(tripId, req.body);
    const updatedTrip = await TripModel.tripsById(tripId);

    if (hasDateChanged(oldTrip, updatedTrip)) {
      notifyParticipantsOfChanges(tripId, oldTrip, updatedTrip, creatorEmail);
    }

    res.json({
      message: 'Viaje modificado correctamente',
      viaje_anterior: oldTrip,
      viaje_actualizado: updatedTrip,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el viaje' });
  }
};

// para manejar la obtención de datos necesarios para el email
const notifyParticipantsOfChanges = async (tripId, oldTrip, updatedTrip, creatorEmail) => {
  try {
    const participants = await ParticipantsModel.selectAcceptedParticipantsEmails(tripId);
    if (participants.length > 0) {
      const results = await sendTripUpdateNotification(participants, oldTrip, updatedTrip, creatorEmail);

      // results es un objeto { sent, failed, total }
      if (results && results.sent > 0) {
        console.log(`✅ Notificaciones procesadas. Enviadas: ${results.sent}/${results.total}`);
      } else if (results && results.total === 0) {
        console.warn('⚠️ No hay participantes a notificar');
      } else {
        console.warn('⚠️ No se enviaron notificaciones correctamente. Revise BREVO_API_KEY en .env');
      }
    }
  } catch (error) {
    console.error('Error enviando notificaciones en segundo plano:', error);
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
