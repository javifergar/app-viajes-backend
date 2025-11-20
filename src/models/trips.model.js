const db = require('../config/db');

const selectTrips = async (filters = {}) => {
  let sql = 'select t.*, u.name as creator_name from trips t inner join users u on t.id_creator = u.id_user where 1=1';
  const params = [];
  const { status, destination, date, creator, participant } = filters;
  if (status) {
    sql += ' and t.status = ?';
    params.push(status);
  }
  if (destination) {
    sql += ' and t.destination LIKE ?';
    params.push(`%${destination}%`);
  }
  if (date) {
    sql += ' and t.start_date = ?';
    params.push(date);
  }
  if (creator) {
    sql += ' and u.name LIKE ?';
    params.push(`%${creator}%`);
  }
  if (participant) {
    sql += ` and exists (select 1 from trip_participants tp where tp.id_trip = t.id_trip and tp.id_user = ? and tp.status = 'accepted')`;
    params.push(participant);
  }

  const [result] = await db.query(sql, params);
  return result;
};

const tripsById = async (tripId) => {
  const [result] = await db.query('select * from trips where id_trip = ?', [tripId]);
  if (result.length === 0) return null;
  return result[0];
};

const insertTrip = async ({
  id_creator,
  title,
  description,
  destination,
  start_date,
  end_date,
  cost_per_person,
  min_participants,
  transport_info,
  accommodation_info,
  itinerary,
  status,
  departure,
}) => {
  const [result] = await db.query(
    `insert into trips 
    (id_creator, title, description, destination, start_date, end_date, cost_per_person, min_participants, transport_info, accommodation_info, itinerary, status,departure) 
    values (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id_creator, title, description, destination, start_date, end_date, cost_per_person, min_participants, transport_info, accommodation_info, itinerary, status, departure]
  );

  return result;
};

const updateTrip = async (
  tripId,
  { id_creator, title, description, destination, start_date, end_date, cost_per_person, min_participants, transport_info, accommodation_info, itinerary, status, departure }
) => {
  const [result] = await db.query(
    `update trips set
       id_creator = ?,
       title = ?,
       description = ?,
       destination = ?,
       start_date = ?,
       end_date = ?,
       cost_per_person = ?,
       min_participants = ?,
       transport_info = ?,
       accommodation_info = ?,
       itinerary = ?,
       status = ?,
       departure = ?
     where id_trip = ?`,
    [id_creator, title, description, destination, start_date, end_date, cost_per_person, min_participants, transport_info, accommodation_info, itinerary, status, departure, tripId]
  );

  return result;
};

const deleteTrip = async (tripId) => {
  const [result] = await db.query('delete from trips where id_trip = ?', [tripId]);
  return result;
};

module.exports = { selectTrips, tripsById, insertTrip, updateTrip, deleteTrip };
