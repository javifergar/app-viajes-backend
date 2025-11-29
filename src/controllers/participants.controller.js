const ParticipantsModel = require('../models/participants.model');
const TripsModel = require('../models/trips.model');
const jwt = require('jsonwebtoken');
const UsersModel = require('../models/users.model');

/**
 * 1. VER UNA DETERMINADA SOLICITUD
 * GET /api/participants/:participation_id
 */
const getParticipation = async (req, res) => {
  try {
    const { participationId } = req.params;

    const participation = await ParticipantsModel.selectParticipationById(participationId);

    if (!participation) {
      return res.status(404).json({ message: 'Participation not found' });
    }

    res.json(participation);
  } catch (error) {
    console.error('Error in getParticipation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 2. VER SOLICITUDES/PARTICIPANTES DE UN VIAJE (todas o por estado)
 * GET /api/participants/trip/:trip_id
 * GET /api/participants/trip/:trip_id?status=pending
 * GET /api/participants/trip/:trip_id?status=accepted
 * GET /api/participants/trip/:trip_id?status=rejected
 * GET /api/participants/trip/:trip_id?status=left
 */
const getParticipantsByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { status } = req.query;

    const participants = await ParticipantsModel.selectParticipantsByTrip(tripId, status);

    res.json(participants);
  } catch (error) {
    console.error('Error in getParticipantsByTrip:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 3. VER TODAS LAS SOLICITUDES QUE TIENE UN USUARIO COMO SOLICITANTE
 * GET /api/participants/my-requests
 * GET /api/participants/my-requests?status=pending
 * GET /api/participants/my-requests?status=accepted
 * GET /api/participants/my-requests?status=rejected
 * GET /api/participants/my-requests?status=left
 */
const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { status } = req.query;

    const requests = await ParticipantsModel.selectMyRequests(userId, status);

    res.json(requests);
  } catch (error) {
    console.error('Error in getMyRequests:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 4. VER TODAS LAS SOLICITUDES DE LOS VIAJES QUE HE CREADO (como CREADOR)
 * GET /api/participants/my-creator-requests
 * GET /api/participants/my-creator-requests?status=pending
 * GET /api/participants/my-creator-requests?status=accepted
 * GET /api/participants/my-creator-requests?status=rejected
 * GET /api/participants/my-creator-requests?status=left
 */
const getMyCreatorRequests = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { status } = req.query;

    const requests = await ParticipantsModel.selectMyCreatorRequests(userId, status);

    res.json(requests);
  } catch (error) {
    console.error('Error in getMyCreatorRequests:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 5. CREAR UNA SOLICITUD DE PARTICIPACIÓN PARA UN VIAJE
 * POST /api/participants/:trip_id
 * { "message": "Quiero unirme al viaje" }
 */
const createParticipation = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id_user;
    const { message } = req.body;

    // Verifica que el viaje existe
    const trip = await TripsModel.tripsById(tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Verifica que el viaje está abierto/open
    if (trip.status !== 'open') {
      return res.status(400).json({ error: 'Trip is not open for requests' });
    }

    // Verifica que el usuario NO puede unirse a su propio viaje
    if (trip.id_creator === userId) {
      return res.status(400).json({ error: 'You cant join your own trip' });
    }

    // Verifica si ya hay registro para este viaje/usuario
    const existing = await ParticipantsModel.selectByTripAndUser(tripId, userId);

    if (existing) {
      return res.status(400).json({
        error: 'You already have a request for this trip',
      });
    }

    // Insertar en la bbdd la solicitud de participación
    const insertId = await ParticipantsModel.insertParticipation(tripId, userId, message);

    const newParticipation = await ParticipantsModel.selectParticipationById(insertId);

    return res.status(201).json(newParticipation);
  } catch (error) {
    console.error('Error in createParticipation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 6. CAMBIAR EL ESTADO DE UNA SOLICITUD/PARTICIPANTE
 * PATCH /api/participants/:participation_id
 * { "status": "accepted" }
 * { "status": "rejected" }
 * { "status": "left" }
 * { "status": "pending" }
 */
const updateParticipationStatus = async (req, res) => {
  try {
    const { participationId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const affectedRows = await ParticipantsModel.updateParticipationStatus(participationId, status);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Participation not found' });
    }

    const updatedParticipation = await ParticipantsModel.selectParticipationById(participationId);

    return res.status(200).json(updatedParticipation);
  } catch (error) {
    console.error('Error in updateParticipationStatus:', error);

    if (error.code === 'INVALID_STATUS') {
      return res.status(400).json({ error: 'Invalid status value. Set accepted, rejected, left or pending' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 7. VER LA INFORMACION DE LOS PARTICIPANTES DEL VIAJE
 *  GET /api/participants/:trip_id
 */
const getParticipantsInfo = async (req, res) => {
  try {
    const { tripId } = req.params;

    // usuario logueado (si hay token)
    let loggedUser = null;

    const authHeader = req.headers['authorization'];

    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const data = jwt.verify(token, process.env.SECRET_KEY);

        const user = await UsersModel.selectById(data.userId);
        if (user) {
          loggedUser = user;
        }
      } catch (error) {
        // Token inválido/expirado → lo ignoramos y seguimos como público
        loggedUser = null;
      }
    }

    let includePrivate = false;

    // Si hay usuario logueado, comprobamos si está ACCEPTED en ese viaje
    if (loggedUser?.id_user) {
      const participations = await ParticipantsModel.selectParticipantsByTrip(tripId, 'accepted');

      includePrivate = participations.some((p) => p.id_user === loggedUser.id_user);
    }

    const participantsInfo = await ParticipantsModel.selectParticipantsInfo(tripId, includePrivate);

    return res.json(participantsInfo);
  } catch (error) {
    console.error('Error in getParticipantsInfo:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// TESTING
const getAllParticipations = async (req, res) => {
  try {
    const users = await ParticipantsModel.selectParticipations();
    res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener todos los participantes.' });
  }
};

module.exports = {
  getParticipation,
  getParticipantsByTrip,
  getParticipantsInfo,
  getMyRequests,
  getMyCreatorRequests,
  createParticipation,
  updateParticipationStatus,
  getAllParticipations,
};
