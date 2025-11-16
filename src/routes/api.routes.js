const router = require('express').Router();

router.use('/trips', require('./api/trips.routes'));
router.use('/users', require('../routes/api/users.routes'));

module.exports = router;
