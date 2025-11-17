const router = require('express').Router();
const {
  listByTrip,
  listForUser,
  createRating,
  updateRating,
  deleteRating,
} = require('../../controllers/ratings.controller');

// Valoraciones de un viaje concreto
// TODO: Crear el midlleWare que verifique que esta el viaje en la base de datos.
router.get('/trip/:idTrip', listByTrip);

// Valoraciones recibidas por un usuario
// TODO: Crear el MiddleWare que verifique que el usuario existe. 
router.get('/user/:idUser', listForUser);

// Crear una valoración tras finalizar un viaje
// TODO: El middleWare debe verificar que existe el usuario y el viaje y que esta asociados. 
router.post('/', createRating);

// Editar la valoración realizada por el usuario autenticado
router.patch('/:idRating', updateRating);

// Eliminar una valoración creada por el usuario autenticado
router.delete('/:idRating', deleteRating);

module.exports = router;
