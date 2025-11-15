const router = require('express').Router();
const users = require('../../controllers/users.controller'); 

// GET /api/usuarios
router.get('/', users.getAll);
router.get('/:userId', users.getById);
router.post('/', users.create);

module.exports = router;