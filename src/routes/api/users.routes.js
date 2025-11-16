const router = require('express').Router();
const users = require('../../controllers/users.controller'); 

// GET /api/usuarios
router.get('/', users.getAll);
router.get('/:userId', users.getById);
router.post('/', users.create);
router.post('/login', users.login)
router.patch('/:userId', users.update)
router.put('/:userId', users.updateAllUser)
router.delete('/:userId', users.remove)

module.exports = router;