const router = require('express').Router();

router.use('/viajes', require('./api/viajes.routes'));
router.use('/usuarios', require('../routes/api/usuarios.routes'));

module.exports = router;
