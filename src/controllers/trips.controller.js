const TripModel = require('../models/trips.model');

const getAllTrips = async (req, res) => {
  const trips = await TripModel.selectTrips(req.query);
  res.json(trips);
};
const getTripById = async (req, res) => {
  const { tripId } = req.params;
  const trip = await TripModel.tripsById(tripId);
  if (!trip) return res.status(404).json({ message: 'Trip doesn´t exist' });
  res.json(trip);
};
const createTrip = async (req, res) => {
  const { insertId } = await TripModel.insertTrip(req.body);
  const trip = await TripModel.tripsById(insertId);
  res.json(trip);
};
const updateTrip = async (req, res) => {
  const { tripId } = req.params;
  await TripModel.updateTrip(tripId, req.body);
  const trip = await TripModel.tripsById(tripId);
  res.json(trip);
};
const deleteTrip = async (req, res) => {
  const { tripId } = req.params;
  const trip = await TripModel.tripsById(tripId);
  await TripModel.deleteTrip(tripId);
  if (!trip) {
    return res.json({
      message: 'No existe este viaje',
    });
  }
  res.json({ message: 'Viaje borrado correctamente', trip });
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };
