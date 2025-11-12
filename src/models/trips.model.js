const db = require('../config/db');

const selectTrips = async (filters = {}) => {
  let sql = 'select v.*, u.nombre as creator_name from viajes v inner join usuarios u on v.id_creador = u.id_usuario where 1=1';
  const params = [];
  const { estado, destino, fecha, organizador, participante } = filters;
  if (estado) {
    sql += ' and v.estado = ?';
    params.push(estado);
  }
  if (destino) {
    sql += ' and v.destino LIKE ?';
    params.push(`%${destino}%`);
  }
  if (fecha) {
    sql += ' and v.start_date = ?';
    params.push(fecha);
  }
  if (organizador) {
    sql += ' and u.nombre LIKE ?';
    params.push(`%${organizador}%`);
  }
  if (participante) {
    sql += ` and exists (select 1 from participantes_viaje pv where pv.id_viaje = v.id_viaje and pv.id_usuario = ? and pv.estado = 'aceptado')`;
    params.push(participante);
  }

  const [result] = await db.query(sql, params);
  return result;
};

const tripsById = async (tripId) => {
  const [result] = await db.query('select * from viajes where id_viaje = ?', [tripId]);
  if (result.length === 0) return null;
  return result[0];
};

const insertTrip = async ({
  id_creador,
  titulo,
  descripcion,
  destino,
  start_date,
  end_date,
  coste_por_persona,
  minimo_participantes,
  informacion_transporte,
  informacion_alojamiento,
  itinerario,
  estado,
}) => {
  const [result] = await db.query(
    'insert into viajes (id_creador,titulo, descripcion, destino, start_date, end_date, coste_por_persona, minimo_participantes, informacion_transporte, informacion_alojamiento, itinerario, estado ) values (?,?,?,?,?,?,?,?,?,?,?,?)',
    [id_creador, titulo, descripcion, destino, start_date, end_date, coste_por_persona, minimo_participantes, informacion_transporte, informacion_alojamiento, itinerario, estado]
  );
  return result;
};

const updateTrip = async (
  viajeId,
  { id_creador, titulo, descripcion, destino, start_date, end_date, coste_por_persona, minimo_participantes, informacion_transporte, informacion_alojamiento, itinerario, estado }
) => {
  const [result] = await db.query(
    'update viajes set id_creador=?,titulo=?, descripcion=?, destino=?, start_date=?, end_date=?, coste_por_persona=?, minimo_participantes=?, informacion_transporte=?, informacion_alojamiento=?, itinerario=?, estado=? where id_viaje = ?',
    [id_creador, titulo, descripcion, destino, start_date, end_date, coste_por_persona, minimo_participantes, informacion_transporte, informacion_alojamiento, itinerario, estado, viajeId]
  );
  return result;
};

const deleteTrip = async (tripId) => {
  const [result] = await db.query('delete from viajes where id_viaje = ?', [tripId]);
  return result;
};

module.exports = { selectTrips, tripsById, insertTrip, updateTrip, deleteTrip };
