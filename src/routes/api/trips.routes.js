const { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip } = require('../../controllers/trips.controller');

const router = require('express').Router();

router.get('/', getAllTrips);
router.get('/:tripId', getTripById);
router.post('/', createTrip);
router.put('/:tripId', updateTrip);
router.delete('/:tripId', deleteTrip);

module.exports = router;
