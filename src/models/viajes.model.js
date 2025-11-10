const db = require('../config/db');

const selectViajes = async () => {
  const [result] = await db.query('select * from viajes');
  return result;
};

module.exports = { selectViajes };
