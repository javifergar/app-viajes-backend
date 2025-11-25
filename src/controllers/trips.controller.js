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

const updateTrip = async (req, res) => {
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
      return res.status(403).json({ message: 'No puedes modificar un viaje si no eres el creador' });
    }

    await TripModel.updateTrip(tripId, req.body);
    const updatedTrip = await TripModel.tripsById(tripId);

    res.json({ message: 'Viaje modificado correctamente', viaje_anterior: trip, viaje_actualizado: updatedTrip });
  } catch (error) {
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
