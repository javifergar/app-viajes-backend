// Define your model here
const db = require('../config/db');

/*
 *  Obtener un mensaje por id
 */
const selectMessageById = async (messageId) => {
  const [result] = await db.query(
    `
      SELECT *
      FROM trip_messages
      WHERE id_message = ?
    `,
    [messageId]
  );

  if (result.length === 0) return null;
  return result[0];
};

/*
 * Obtener todos los mensajes de un viaje   
 */
const selectMessagesByTrip = async (tripId) => {
  const [result] = await db.query(
    `
      SELECT *
      FROM trip_messages
      WHERE id_trip = ?
      ORDER BY created_at ASC
    `,
    [tripId]
  );

  return result; 
};

/*
 * Crear un mensaje
 */
const insertMessage = async ({ id_trip, id_author, id_parent_message = null, content }) => {
  const [result] = await db.query(
    `
      INSERT INTO trip_messages (id_trip, id_author, id_parent_message, content)
      VALUES (?, ?, ?, ?)
    `,
    [id_trip, id_author, id_parent_message || null, content]
  );

  return result.insertId;
};

/*
 * Update mensaje
 */
const updateMessageContent = async (messageId, content) => {
  const [result] = await db.query(
    `
      UPDATE trip_messages
      SET content = ?
      WHERE id_message = ?
    `,
    [content, messageId]
  );

  return result.affectedRows; // 0 o 1
};

/**
 * Comprobar si mensaje tiene hijos
 * (para montar arbol de mensajes)
 */
const hasChildren = async (messageId) => {
  const [rows] = await db.query(
    `
      SELECT COUNT(*) AS children_count
      FROM trip_messages
      WHERE id_parent_message = ?
    `,
    [messageId]
  );

  return rows[0].children_count > 0;
};

/**
 * Borrado físico  de un mensaje
 * (para los mensajes q no tienen hijos)
 */
const deleteMessageHard = async (messageId) => {
  const [result] = await db.query(
    `
      DELETE FROM trip_messages
      WHERE id_message = ?
    `,
    [messageId]
  );

  return result.affectedRows; // 0 o 1
};

/**
 * Borrado lógico 
 *    (para los mensajes que tienen hijos)
 *  Update y  Se pone 'deleted mensaje'
 */
const softDeleteMessage = async (messageId) => {
  const [result] = await db.query(
    `
      UPDATE trip_messages
      SET content = '[Deleted Message]'
      WHERE id_message = ?
    `,
    [messageId]
  );

  return result.affectedRows; // 0 o 1
};

module.exports = {
  selectMessageById,
  selectMessagesByTrip,
  insertMessage,
  updateMessageContent,
  hasChildren,
  deleteMessageHard,
  softDeleteMessage,
};
