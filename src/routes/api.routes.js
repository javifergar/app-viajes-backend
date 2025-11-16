const router = require('express').Router();

router.use('/viajes', require('./api/viajes.routes'));
router.use('/users', require('../routes/api/users.routes'));
router.use('/ratings', require('./api/ratings.routes'));

module.exports = router;
