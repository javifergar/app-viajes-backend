// src/routes/api/messages.routes.js
const router = require('express').Router();
const messages = require('../../controllers/messages.controller');
const { checkToken } = require('../../middlewares/auth.middleware');

router.get('/trip/:trip_id', messages.getMessagesByTrip);
router.get('/trip/:trip_id/tree', messages.getMessagesTreeByTrip);
router.get('/:message_id', messages.getMessageById);
router.post('/trip/:trip_id', messages.createMessage);
router.patch('/:message_id', messages.updateMessage);
router.delete('/:message_id', messages.deleteMessage);

module.exports = router;
