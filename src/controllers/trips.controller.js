const TripModel = require('../models/trips.model');

const getAllTrips = async (req, res) => {
  const trips = await TripModel.selectTrips(req.query);
  res.json(trips);
};
const getTripById = async (req, res) => {
  const { id } = req.params;
  const trip = await TripModel.tripsById(id);
  if (!trip) return res.status(404).json({ message: 'Trip doesn´t exist' });
  res.json(trip);
};
const createTrip = async (req, res) => {
  const { insertId } = await TripModel.insertTrip(req.body);
  const trip = await TripModel.tripsById(insertId);
  res.json(trip);
};
const updateTrip = async (req, res) => {
  const { id } = req.params;
  await TripModel.updateTrip(id, req.body);
  const trip = await TripModel.tripsById(id);
  res.json(trip);
};
const deleteTrip = async (req, res) => {
  const { id } = req.params;
  const trip = await TripModel.tripsById(id);
  await TripModel.deleteTrip(id);
  if (!trip) {
    return res.json({
      message: 'No existe este viaje',
    });
  }
  res.json({ message: 'Viaje borrado correctamente', trip });
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };
