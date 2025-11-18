const router = require('express').Router();

router.use('/trips', require('./api/trips.routes'));
router.use('/users', require('../routes/api/users.routes'));
router.use('/ratings', require('./api/ratings.routes'));
router.use('/participants', require('./api/participants.routes'));

module.exports = router;
