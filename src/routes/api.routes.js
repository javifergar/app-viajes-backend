const router = require('express').Router();

router.use('/trips', require('./api/trips.routes'));

module.exports = router;
