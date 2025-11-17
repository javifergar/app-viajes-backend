const router = require('express').Router();

const participants = require('../../controllers/participants.controller'); 


router.get('/trip/:trip_id', participants.getParticipantsByTrip);
router.get('/my-requests', participants.getMyRequests);
router.get('/my-creator-requests', participants.getMyCreatorRequests);
router.get('/:participation_id', participants.getParticipation);
router.post('/:trip_id', participants.createParticipation);
router.patch('/:participation_id', participants.updateParticipationStatus);

module.exports = router;
