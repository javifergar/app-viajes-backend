
const pool = require('../config/db'); // Ajusta la ruta a donde guardaste db.js
const UsersModel = require('../models/users.model');

async function getAll(req, res) {
    try {
    const users = await UsersModel.selectUsers();
    res.json(users)
    } catch (error) {
        return res.status(500).json({error: 'Error al obtener clientes.'})
    }
}
module.exports = { getAll };
