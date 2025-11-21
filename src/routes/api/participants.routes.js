const router = require('express').Router();

const participants = require('../../controllers/participants.controller');
const { checkToken } = require('../../middlewares/auth.middleware');
const { checkTripExists } = require('../../middlewares/tripValidation.middleware');

// TESTING
router.get('/', participants.getAllParticipations);
// TESTING
router.get('/trip/:trip_id', checkToken, checkTripExists, participants.getParticipantsByTrip);
router.get('/my-requests', checkToken, participants.getMyRequests);
router.get('/my-creator-requests', checkToken, participants.getMyCreatorRequests);
router.get('/:participation_id', checkToken, participants.getParticipation);
router.post('/:trip_id', checkToken, checkTripExists, participants.createParticipation);
router.patch('/:participation_id', checkToken, participants.updateParticipationStatus);

module.exports = router;
