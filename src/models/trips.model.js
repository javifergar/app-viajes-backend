const db = require('../config/db');

const selectTrips = async (filters = {}) => {
  let sql = `select t.*, u.name as creator_name, 
    (select count(*) from trip_participants tp where tp.id_trip = t.id_trip and tp.status = 'accepted') 
    as accepted_participants
    from trips t
    inner join users u ON t.id_creator = u.id_user
    where 1=1
  `;
  const params = [];
  const { status, departure, destination, date, creator, participant, participantStatus, creatorId, excludeCreatorForParticipant } = filters;
  if (status) {
    sql += ' and t.status = ?';
    params.push(status);
  }
  if (departure) {
    sql += ' and t.departure LIKE ?';
    params.push(`%${departure}%`);
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
    if (participantStatus) {
      sql += `
        and exists (select 1 from trip_participants tp where tp.id_trip = t.id_trip and tp.id_user = ? and tp.status = ?)`;
      params.push(participant, participantStatus);
    } else {
      sql += `
        and exists (select 1 from trip_participants tp where tp.id_trip = t.id_trip and tp.id_user = ?)`;
      params.push(participant);
    }
    if (excludeCreatorForParticipant) {
      sql += ' and t.id_creator <> ?';
      params.push(participant);
    }
  }
  if (creatorId) {
    sql += ' and t.id_creator = ?';
    params.push(creatorId);
  }

  const [result] = await db.query(sql, params);
  return result;
};

const tripsById = async (tripId) => {
  const [result] = await db.query(
    `select t.*, u.name as creator_name, 
    (select count(*) from trip_participants tp where tp.id_trip = t.id_trip and tp.status = 'accepted') 
    as accepted_participants
    from trips t
    inner join users u ON t.id_creator = u.id_user
    where id_trip = ?`,
    [tripId]
  );
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
  image_url,
  status,
  departure,
}) => {
  const [result] = await db.query(
    `insert into trips 
    (id_creator, title, description, destination, start_date, end_date, cost_per_person, min_participants, transport_info, accommodation_info, itinerary,image_url, status,departure) 
    values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id_creator, title, description, destination, start_date, end_date, cost_per_person, min_participants, transport_info, accommodation_info, itinerary, image_url, status, departure]
  );

  return result;
};

const updateTrip = async (
  tripId,
  { title, description, destination, start_date, end_date, cost_per_person, min_participants, transport_info, accommodation_info, itinerary, image_url, status, departure }
) => {
  const [result] = await db.query(
    `update trips set       
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
       image_url = ?,
       status = ?,
       departure = ?
     where id_trip = ?`,
    [title, description, destination, start_date, end_date, cost_per_person, min_participants, transport_info, accommodation_info, itinerary, image_url, status, departure, tripId]
  );

  return result;
};

const deleteTrip = async (tripId) => {
  const [result] = await db.query('delete from trips where id_trip = ?', [tripId]);
  return result;
};

module.exports = { selectTrips, tripsById, insertTrip, updateTrip, deleteTrip };
