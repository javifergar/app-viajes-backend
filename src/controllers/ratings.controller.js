const RatingsModel = require('../models/ratings.model');

const listByTrip = async (req, res) => {
  try {
    const { idTrip } = req.params;
    const ratings = await RatingsModel.selectByTrip(idTrip);
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las valoraciones del viaje' });
  }
};

const listForUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const ratings = await RatingsModel.selectForUser(idUser);
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las valoraciones del usuario' });
  }
};

const createRating = async (req, res) => {
  try {
    const { id_trip, id_reviewed, score, comment } = req.body;

    const id_reviewer = req.user.id_user;

    if (!id_reviewer) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (id_reviewer === id_reviewed) {
      return res.status(400).json({ message: 'No puedes valorarte a ti mismo' });
    }

    // TODO: Posibilidad de hacerlo al MiddleWare.
    if (id_trip === undefined || id_reviewer === undefined || id_reviewed === undefined || score === undefined) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: id_trip, id_reviewer, id_reviewed, score' });
    }
    if (Number.isNaN(Number(score)) || score < 0 || score > 10) {
      return res.status(400).json({ message: 'El campo score debe estar entre 0 y 10' });
    }

    // Comprobar que ambos están en el mismo viaje
    const bothInTrip = await RatingsModel.checkUsersBelongToTrip(id_trip, id_reviewer, id_reviewed);

    if (!bothInTrip) {
      return res.status(403).json({
        message: 'Solo puedes valorar a usuarios que han participado en el mismo viaje que tú',
      });
    }

    const insertId = await RatingsModel.insertRating({ id_trip, id_reviewer, id_reviewed, score, comment });
    const newRating = await RatingsModel.selectById(insertId);
    await RatingsModel.recalcUserAggregates(id_reviewed);
    res.status(201).json(newRating);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe una valoración para este viaje y usuario' });
    }
    console.error('Error creando valoración:', error);
    res.status(500).json({ error: 'Error al crear la valoración' });
  }
};

const updateRating = async (req, res) => {
  try {
    const { idRating } = req.params;
    const { score, comment } = req.body;
    const id_reviewer = req.user.id_user;
    const rating = await RatingsModel.selectById(idRating);

    if (rating.id_reviewer !== id_reviewer) {
      return res.status(403).json({ message: 'Solo puedes modificar tus valoraciones' });
    }
    if (!rating) return res.status(404).json({ message: 'Valoración no encontrada' });

    if (score !== undefined && (Number.isNaN(Number(score)) || score < 0 || score > 10)) {
      return res.status(400).json({ message: 'El campo score debe estar entre 0 y 10' });
    }

    const affectedRows = await RatingsModel.updateRating(idRating, { score, comment });

    if (affectedRows === 0) return res.status(400).json({ message: 'No hay campos válidos para actualizar' });

    const updated = await RatingsModel.selectById(idRating);
    await RatingsModel.recalcUserAggregates(rating.id_reviewed);
    res.json(updated);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe una valoración para este viaje y usuario' });
    }
    console.error('Error actualizando valoración:', error);
    res.status(500).json({ error: 'Error al actualizar la valoración' });
  }
};

const deleteRating = async (req, res) => {
  try {
    const { idRating } = req.params;
    const id_reviewer = req.user.id_user;

    const rating = await RatingsModel.selectById(idRating);

    if (rating.id_reviewer !== id_reviewer) {
      return res.status(403).json({ message: 'Solo puedes modificar tus valoraciones' });
    }
    if (!rating) return res.status(404).json({ message: 'Valoración no encontrada' });

    const success = await RatingsModel.deleteRating(idRating);
    if (!success) return res.status(500).json({ error: 'No se pudo borrar la valoración' });
    //Actualizamos la media rating del usuario afectado.
    await RatingsModel.recalcUserAggregates(rating.id_reviewed);
    res.json({ message: 'Valoración eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando valoración:', error);
    res.status(500).json({ error: 'Error al eliminar la valoración' });
  }
};

module.exports = { listByTrip, listForUser, createRating, updateRating, deleteRating };
