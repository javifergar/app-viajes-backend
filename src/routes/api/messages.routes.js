// src/routes/api/messages.routes.js
const router = require('express').Router();
const messages = require('../../controllers/messages.controller');
const { checkToken } = require('../../middlewares/auth.middleware');

router.get('/trip/:tripId', messages.getMessagesByTrip);
router.get('/trip/:tripId/tree', messages.getMessagesTreeByTrip);
router.get('/:messageId', messages.getMessageById);
router.post('/trip/:tripId', messages.createMessage);
router.patch('/:messageId', messages.updateMessage);
router.delete('/:messageId', messages.deleteMessage);

module.exports = router;
