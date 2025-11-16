
const pool = require('../config/db');  
const UsersModel = require('../models/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

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
    delete user.password; // Mario recomienda no enviar la pass aunque esté encriptada
    if (!user) return res.status(404).json({message: 'Id Usuario no existe'});
    res.json(user);
};

const create = async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    try {
        const insertId = await UsersModel.insertUser(req.body);
        const newUser = await UsersModel.selectById(insertId);
        res.json(newUser);
    } catch (error) {
        return res.status(500).json({error: 'Error al insertar el nuevo usuario!'});
    }

};

const login = async (req, res) => {
    const { email, password } = req.body;
    // ¿existe email?
        // recupero el usuario
    const user = await UsersModel.selectByEmail(email);
    if (!user) return res.status(401).json({message: 'Error email y/o password'}) // no se pone solo email par no dar pistas (ciberseguridad)
    // ¡coinciden las passw?
    const success = bcrypt.compareSync(password, user.password);
    if (!success) return res.status(401).json({message: 'Error email y/o password'});
    res.json({ 
        message: 'Login correcto!',
        token: jwt.sign( 
            { userId: user.userId }, 
            process.env.SECRET_KEY 
        ) 
    });
};

const update = async (req, res) => {
    try {
        // Extracción de parámetros (no usar await)
        const { userId } = req.params;
        const userData = req.body; // Datos a actualizar
        // Llamada al modelo
        const affectedRows = await UsersModel.updateUser(userId, userData);
        // El usuario no fue encontrado o no se proporcionaron campos para actualizar
        if (affectedRows === 0) return res.status(404).json({ message: 'Id de Usuario no existe o no hay campos para modificar' });
        // Devolvemos el recurso modificado
        const userModified = await UsersModel.selectById(userId);
        
        res.json(userModified); 

    } catch (error) {
        console.error('Error al modificar el usuario:', error);
        return res.status(500).json({ error: 'Error interno al modificar el usuario!' });
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

module.exports = { getAll, getById, create, login, remove, update };
