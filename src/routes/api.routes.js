//API routes file
const router = require('express').Router();
const trips = require('./api/trips.routes');
const auth = require('./api/auth.routers');
const users = require('./api/users.routes');
const ratings = require('./api/ratings.routes');
const participants = require('./api/participants.routes');
const messages = require('./api/messages.routes');

//Middlewares
const { checkToken } = require('../middlewares/auth.middleware');

//Routes
router.use('/trips', trips);
router.use('/auth', auth);
router.use('/users', checkToken, users);
router.use('/ratings', checkToken, ratings);
router.use('/participants', checkToken, participants);
router.use('/messages', checkToken, messages);

module.exports = router;
