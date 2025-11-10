const router = require('express').Router();

router.use('/viajes', require('./api/viajes.routes'));

module.exports = router;
