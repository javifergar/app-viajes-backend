const TripModel = require('../models/trips.model');

const getAllTrips = async (req, res) => {
  try {
    const trips = await TripModel.selectTrips(req.query);

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

const createTrip = async (req, res) => {
  try {
    const creatorId = req.user.id_user;
    const data = { ...req.body, id_creator: creatorId };

    const { insertId } = await TripModel.insertTrip(data);
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

    const trip = await TripModel.tripsById(tripId);

    if (!trip) {
      return res.json({
        message: 'No existe este viaje',
      });
    }

    if (trip.id_creator !== creatorId) {
      return res.status(403).json({ message: 'No puedes modificar un viaje si no eres el creador' });
    }

    const data = { ...req.body, id_creator: creatorId };

    await TripModel.updateTrip(tripId, data);
    const updatedTrip = await TripModel.tripsById(tripId);

    res.json({ message: 'Viaje modificado correctamente', viaje_anterior: trip, viaje_actualizado: updatedTrip });
    // res.json({ message: 'Actualizando viaje...', trip, message: 'Viaje actualizado: ', updatedTrip });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el viaje' });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const creatorId = req.user.id_user;

    const trip = await TripModel.tripsById(tripId);
    await TripModel.deleteTrip(tripId);

    if (!trip) {
      return res.json({
        message: 'No existe este viaje',
      });
    }

    if (trip.id_creator !== creatorId) {
      return res.status(403).json({ message: 'No puedes eliminar un viaje si no eres el creador' });
    }

    res.json({ message: 'Viaje borrado correctamente', trip });
  } catch (error) {
    res.status(500).json({ message: 'Error al borrar el viaje' });
  }
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };
