const router = require('express').Router();
const users = require('../../controllers/users.controller'); 

// GET /api/usuarios
router.get('/', users.getAll);

module.exports = router;