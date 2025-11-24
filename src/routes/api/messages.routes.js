// src/routes/api/messages.routes.js
const router = require('express').Router();
const messages = require('../../controllers/messages.controller');
const { checkToken } = require('../../middlewares/auth.middleware');



router.get('/trip/:trip_id', checkToken, messages.getMessagesByTrip);
router.get('/trip/:trip_id/tree', checkToken, messages.getMessagesTreeByTrip);
router.get('/:message_id', checkToken, messages.getMessageById);
router.post('/trip/:trip_id', checkToken, messages.createMessage);
router.patch('/:message_id', checkToken, messages.updateMessage);
router.delete('/:message_id', checkToken, messages.deleteMessage);

module.exports = router;
