const TripsModel = require('../models/trips.model');

const checkTripExists = async (req, res, next) => {
  const id = req.params.trip_id || req.body.id_trip;
  const trip = await TripsModel.tripsById(id);
  if (!trip) return res.status(404).json({ message: 'VEl viaje no existe' });
  req.trip = trip;
  next();
};

module.exports = { checkTripExists };
