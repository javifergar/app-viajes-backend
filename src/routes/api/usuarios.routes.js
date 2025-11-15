const router = require('express').Router();
const usuariosController = require('../../controllers/usuarios.controller'); 

// GET /api/usuarios
router.get('/', usuariosController.getUsers);

module.exports = router;