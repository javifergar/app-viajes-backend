const { getAllTrips, getTripById, getTripsFromUser, createTrip, updateTrip, deleteTrip } = require('../../controllers/trips.controller');

const router = require('express').Router();

router.get('/', getAllTrips);
router.get('/:id', getTripById);
router.post('/', createTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

module.exports = router;
