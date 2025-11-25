const router = require('express').Router();
const { listByTrip, listForUser, createRating, updateRating, deleteRating } = require('../../controllers/ratings.controller');
const { checkTripExists } = require('../../middlewares/tripValidation.middleware');

// Valoraciones de un viaje concreto
router.get('/trip/:idTrip', checkTripExists, listByTrip);

// Valoraciones recibidas por un usuario
router.get('/user/:idUser', listForUser);

// Crear una valoración tras finalizar un viaje
router.post('/', checkTripExists, createRating);

// Editar la valoración realizada por el usuario autenticado
router.patch('/:idRating', updateRating);

// Eliminar una valoración creada por el usuario autenticado
router.delete('/:idRating', deleteRating);

module.exports = router;
