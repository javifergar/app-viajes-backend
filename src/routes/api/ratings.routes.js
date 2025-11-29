const router = require('express').Router();
const { getRatingsByTrip, getRatingsByUserId, createRating, updateRating, deleteRating } = require('../../controllers/ratings.controller');
const { checkTripExists } = require('../../middlewares/tripValidation.middleware');

// Valoraciones de un viaje concreto
router.get('/trip/:tripId', checkTripExists, getRatingsByTrip);

// Valoraciones recibidas por un usuario
router.get('/user/:userId', getRatingsByUserId);

// Crear una valoración tras finalizar un viaje
router.post('/', checkTripExists, createRating);

// Editar la valoración realizada por el usuario autenticado
router.patch('/:ratingId', updateRating);

// Eliminar una valoración creada por el usuario autenticado
router.delete('/:ratingId', deleteRating);

module.exports = router;
