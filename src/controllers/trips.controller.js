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
    const { insertId } = await TripModel.insertTrip(req.body);
    const trip = await TripModel.tripsById(insertId);
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el viaje' });
  }
};

const updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    await TripModel.updateTrip(tripId, req.body);
    const trip = await TripModel.tripsById(tripId);
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el viaje' });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await TripModel.tripsById(tripId);
    await TripModel.deleteTrip(tripId);
    if (!trip) {
      return res.json({
        message: 'No existe este viaje',
      });
    }
    res.json({ message: 'Viaje borrado correctamente', trip });
  } catch (error) {
    res.status(500).json({ message: 'Error al borrar el viaje' });
  }
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };
