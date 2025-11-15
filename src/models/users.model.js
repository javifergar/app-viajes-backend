const db = require('../config/db');

const selectUsers = async () => {
    const [result] = await db.query('select * from users'); 
    return result;
}

const selectById = async (userId) => {
    const [result] = await db.query(`
        select * from users
        where id_user = ?
        `, [userId] );
    if (result.length === 0) return null;
    return result[0];
};

const insertUser = async (userData) => {
    const { name, email, password, phone, photo_url, bio, interests, average_rating, rating_count } = userData;
    const query = `
            insert into users 
            (name, email, password, phone, photo_url, bio, interests, average_rating, rating_count) 
            values (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const values = [ name, email, password, phone, photo_url, bio, interests, average_rating, rating_count];
    const [result] = await db.query(query, values);
    return result.insertId;
    
}

module.exports = { selectUsers , insertUser, selectById };
