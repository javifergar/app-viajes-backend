const { getAllViajes, getViajeById, getViajesFromUser, createViaje, updateViaje, deleteViaje } = require('../../controllers/viajes.controller');

const router = require('express').Router();

router.get('/', getAllViajes);
router.get('/:id', getViajeById);
router.get('/:id/usuario', getViajesFromUser);
router.post('/', createViaje);
router.put('/:id', updateViaje);
router.delete('/:id', deleteViaje);

module.exports = router;
