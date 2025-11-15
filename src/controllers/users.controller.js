
const pool = require('../config/db'); // Ajusta la ruta a donde guardaste db.js
const UsersModel = require('../models/users.model');

const getAll = async (req, res) => {
    try {
    const users = await UsersModel.selectUsers();
    res.json(users)
    } catch (error) {
        return res.status(500).json({error: 'Error al obtener todos los usuarios.'})
    }
};

const getById = async (req, res) => {
    const { userId } = req.params;
    const user = await UsersModel.selectById(userId);
    if (!user) return res.status(404).json({message: 'Id Usuario no existe'});
    res.json(user);
};

const create = async (req, res) => {
    try {
        const insertId = await UsersModel.insertUser(req.body);
        const newUser = await UsersModel.selectById(insertId);
        res.json(newUser);
    } catch (error) {
        return res.status(500).json({error: 'Error al insertar el nuevo usuario!'});
    }

};

const remove = async (req, res) => {
    try {
        const { userId } = req.params;
        const success = await UsersModel.deleteUser(userId); 
        if (!success) return res.status(404).json({ message: 'Id de Usuario no existe' });
        res.json({message: `El usuario con id [${userId}] ha sido eliminado con éxito.`});
    } catch (error) {
        console.error('Error en controlador remove:', error);
        return res.status(500).json({ error: 'Error interno al eliminar el usuario' });
    }
};

module.exports = { getAll, getById, create, remove };
