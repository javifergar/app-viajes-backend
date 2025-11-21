const { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip, getMyTripsAsParticipant, getMyTrips } = require('../../controllers/trips.controller');
const { checkToken } = require('../../middlewares/auth.middleware');

const router = require('express').Router();

router.get('/', getAllTrips);
router.get('/me/created', checkToken, getMyTrips);
router.get('/me/participant', checkToken, getMyTripsAsParticipant);
router.get('/:tripId', getTripById);

router.post('/', checkToken, createTrip);
router.put('/:tripId', checkToken, updateTrip);
router.delete('/:tripId', checkToken, deleteTrip);

module.exports = router;
