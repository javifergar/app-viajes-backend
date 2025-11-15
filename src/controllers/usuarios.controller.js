
const pool = require('../config/db'); // Ajusta la ruta a donde guardaste db.js

async function getUsers(req, res) {
    try {
        // Obtenemos una conexión del pool y ejecutamos la consulta
        const [rows, fields] = await pool.execute('SELECT * FROM users'); 
        
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error del servidor al obtener usuarios');
    }
}
module.exports = { getUsers };
