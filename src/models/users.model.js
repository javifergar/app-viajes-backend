const db = require('../config/db');

const selectUsers = async () => {
    const [result] = await db.query('SELECT * FROM users'); 
    return result;
}

module.exports = { selectUsers };
