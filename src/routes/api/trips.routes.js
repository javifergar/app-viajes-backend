const trips = require('../../controllers/trips.controller'); 
const { checkToken } = require('../../middlewares/auth.middleware');
const { checkTripExists } = require('../../middlewares/tripValidation.middleware');

const router = require('express').Router();

router.get('/', trips.getMyTrips);
router.get('/me/created', checkToken, trips.getMyTrips);
router.get('/me/participant', checkToken, trips.getMyTripsAsParticipant);
router.get('/:tripId', checkTripExists,trips.getTripById);

router.post('/', checkToken, trips.createTrip);
router.put('/:tripId', checkToken, checkTripExists, trips.updateTrip);
router.delete('/:tripId', checkToken, checkTripExists, trips.deleteTrip);

module.exports = router;
