const router = require('express').Router();

router.use('/viajes', require('./api/viajes.routes'));
router.use('/users', require('../routes/api/users.routes'));

module.exports = router;
