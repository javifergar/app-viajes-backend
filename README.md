# app-viajes-backend

## Usuarios

## Recuperar todos los usuarios

Method: GET
Url: /api/usuarios
Headers: X
Body: X

Response:

- Array con todos los usuarios

## Recuperar datos de un usuario

Method: GET
Url: /api/usuarios/:idUser
Headers: X
Body: X

Response:

- Array con todos los datos del usuario

## Creación de un usuario

Method: POST
Url:/api/usuarios
Headers: X
Body: ...

Response:

- Los datos del nuevo usuario

## Actualizar datos de un usuario

Method: PATCH
Url: /api/usuarios/:idUser
Headers: X
Body: ...

Response:

- Array con todos los datos del usuario

### Borrar datos de usuarios

Method: DELETE
url: /api/usuarios/:idUser
Headres : X
Body: X
Response: ...

- Borra los datos del usuario

## Viajes

## Recuperar todos los viajes

Method: GET
Url: /api/trips
Headers: X
Body: X

Ejemplo:
{
"id_trip": 1,
"id_creator": 1,
"title": "Aventura en Islandia",
"description": "Exploración de glaciares, géiseres y auroras boreales",
"destination": "Islandia",
"start_date": "2026-01-14T23:00:00.000Z",
"end_date": "2026-01-21T23:00:00.000Z",
"cost_per_person": "1200.00",
"min_participants": 4,
"transport_info": "Vuelo directo a Reikiavik, coche alquilado",
"accommodation_info": "Cabañas rurales en el norte",
"itinerary": "Día 1: llegada, Día 2: excursiones, Día 3: termas",
"status": "open",
"created_at": "2025-11-16T19:05:21.000Z",
"updated_at": "2025-11-16T19:05:21.000Z",
"creator_name": "Juan Marquez"
}

Response:

- Array con todos los viajes

  ## Filtros

  ## Recuperar viajes por estado

  Method: GET
  Url: /api/trips?status=estado
  Headers: X
  Body: X

  Response:

  - Array con todos los viajes con status = estado

  ## Recuperar viajes por destino

  Method: GET
  Url: /api/trips?destination=pais, provincia o ciudad
  Headers: X
  Body: X

  Response:

  - Array con todos los viajes con destination = pais, provincia o ciudad

  ## Recuperar viajes por fecha

  Method: GET
  Url: /api/trips?date=yyyy-mm-dd
  Headers: X
  Body: X

  Response:

  - Array con todos los viajes con start_date = yyyy-mm-dd

  ## Recuperar viajes por organizador

  Method: GET
  Url: /api/trips?creator={nombre_creador}
  Headers: X
  Body: X

  Response:

  - Array con todos los viajes con creator = nombre_creador
  - Los espacios entre palabras deben sustituirse por %20 Ejemplo: Jose Antonio -> Jose%20Antonio

  ## Recuperar viajes activos de un usuario

  Method: GET
  Url: /api/trips?destination={destination}&participants={id_usuario}
  Headers: X
  Body: X

  Response:

  - Array con todos los viajes del usuario

## Recuperar datos de un viaje

Method: GET
Url: /api/trips/:id
Headers: X
Body: X

Response:

- Array con todos los datos del viaje

## Creación de un viaje

Method: POST
Url:/api/trips
Headers: X
Body: id_creator, title, description, destination, start_date, end_date, cost_per_person, min_participants, transport_info, accommodation_info, itinerary, status

Response:

- Los datos del nuevo viaje

## Actualizar datos de un viaje

Method: PUT
Url: /api/trips/:id
Headers: X
Body: id_creator, title, description, destination, start_date, end_date, cost_per_person, min_participants, transport_info, accommodation_info, itinerary, status, trip_id

Response:

- Array con todos los datos del viaje

### Borrar datos de viaje

Method: DELETE
url: /api/trips/:id
Headres : X
Body: X
Response:

- Borra los datos del viaje

### Login usuarios

Method: POST
url: /api/users/login
Headres : X
Body: { username, email, password}

Response:

- Mensaje de confirmacion y Token

## Valoraciones

### Crear una valoración

Method: POST
Url: /api/valoraciones
Headers: Token
Body: { id_trip, id_reviewed, score (0-10), comment? }

Response:

- Datos de la nueva valoración y medias del usuario valorado si se recalculan

### Listar valoraciones de un viaje

Method: GET
Url: /api/valoraciones/viaje/:idTrip
Headers: X
Body: X

Response:

- Array con las valoraciones hechas en ese viaje, con autor (id_reviewer), usuario valorado (id_reviewed), puntuación y comentario

### Listar valoraciones recibidas por un usuario

Method: GET
Url: /api/valoraciones/usuario/:idUser
Headers: X
Body: X

Response:

- Array con valoraciones recibidas por el usuario y datos como puntuación media, rating_count

### Actualizar una valoración

Method: PATCH
Url: /api/valoraciones/:idRating
Headers: ?
Body: { score?, comment? }

Response:

- Valoración actualizada

### Borrar una valoración

Method: DELETE
Url: /api/valoraciones/:idRating
Headers: Token
Body: X

Response:

- Confirmación de borrado de la valoración (dando la valoración borrada),


## Participants

### 1. Ver una determinada solicitud

Method: GET  
Url: /api/participants/:participation_id  
Headers: X  
Body: X  

Ejemplo de respuesta:

{
  "id_participation": 10,
  "id_trip": 1,
  "id_user": 2,
  "status": "accepted",
  "message": "Solicitud pendiente del usuario 2 en el viaje 1.",
  "created_at": "2025-11-16T21:19:13.000Z",
  "updated_at": "2025-11-16T22:35:25.000Z"
}

Response:

- Objeto con los datos de la solicitud


### 2. Ver solicitudes/participantes de un viaje (todos los estados)

Method: GET  
Url: /api/participants/trip/:trip_id  
Headers: X  
Body: X  

Ejemplo de respuesta:

[
  {
    "id_participation": 10,
    "id_trip": 1,
    "id_user": 2,
    "status": "accepted",
    "message": "Solicitud pendiente extra del usuario 2 en el viaje 1.",
    "created_at": "2025-11-16T21:19:13.000Z",
    "updated_at": "2025-11-16T22:35:25.000Z"
  },
  {
    "id_participation": 1,
    "id_trip": 1,
    "id_user": 1,
    "status": "accepted",
    "message": "Esto es un mensaje",
    "created_at": "2025-11-16T21:13:51.000Z",
    "updated_at": "2025-11-16T21:13:51.000Z"
  },
  {
    "id_participation": 2,
    "id_trip": 1,
    "id_user": 3,
    "status": "pending",
    "message": "Quiero ir pero no sé a dónde vamos.",
    "created_at": "2025-11-16T21:13:51.000Z",
    "updated_at": "2025-11-16T21:13:51.000Z"
  },
  {
    "id_participation": 3,
    "id_trip": 1,
    "id_user": 4,
    "status": "rejected",
    "message": "Solicitud rechazada por motivos misteriosos.",
    "created_at": "2025-11-16T21:13:51.000Z",
    "updated_at": "2025-11-16T21:13:51.000Z"
  }
]

Response:

- Array con todas las solicitudes de ese viaje, independientemente del estado


### 2.1 Ver solicitudes/participantes de un viaje por estado

Method: GET  
Url: /api/participants/trip/:trip_id?status={estado}  
Headers: X  
Body: X  

Valores posibles de status:

- pending
- accepted
- rejected
- left

Ejemplo:

GET /api/participants/trip/1?status=accepted

Ejemplo de respuesta:

[
  {
    "id_participation": 10,
    "id_trip": 1,
    "id_user": 2,
    "status": "accepted",
    "message": "Solicitud pendiente extra del usuario 2 en el viaje 1.",
    "created_at": "2025-11-16T21:19:13.000Z",
    "updated_at": "2025-11-16T22:35:25.000Z"
  },
  {
    "id_participation": 1,
    "id_trip": 1,
    "id_user": 1,
    "status": "accepted",
    "message": "Soy el creador pero también figuro como participante.",
    "created_at": "2025-11-16T21:13:51.000Z",
    "updated_at": "2025-11-16T21:13:51.000Z"
  }
]

Response:

- Array con las solicitudes de ese viaje filtradas por estado


### 3. Ver todas las solicitudes que ha realizado un usuario (como solicitante)

Method: GET  
Url: /api/participants/my-requests  
Headers: X  
Body: X  

Ejemplo de respuesta:

[
  {
    "id_participation": 1,
    "id_trip": 1,
    "id_user": 1,
    "status": "accepted",
    "message": "Esto es un mensaje",
    "created_at": "2025-11-16T21:13:51.000Z",
    "updated_at": "2025-11-16T21:13:51.000Z"
  },
  {
    "id_participation": 6,
    "id_trip": 2,
    "id_user": 1,
    "status": "pending",
    "message": "También quiero pasear por Lisboa inventada.",
    "created_at": "2025-11-16T21:13:51.000Z",
    "updated_at": "2025-11-16T21:13:51.000Z"
  }
]

Response:

- Array con todas las solicitudes que el usuario ha enviado a distintos viajes


### 3.1 Ver solicitudes del usuario filtradas por estado

Method: GET  
Url: /api/participants/my-requests?status={estado}  
Headers: X  
Body: X  

Ejemplo:

GET /api/participants/my-requests?status=pending

Ejemplo de respuesta:

[
  {
    "id_participation": 10,
    "id_trip": 1,
    "id_user": 2,
    "status": "pending",
    "message": "Solicitud pendiente extra del usuario 2 en el viaje 1.",
    "created_at": "2025-11-16T21:19:13.000Z",
    "updated_at": "2025-11-16T22:35:25.000Z"
  }
]

Response:

- Array con las solicitudes del usuario filtradas por estado


### 4. Ver todas las solicitudes que han recibido los viajes creados por el usuario (como creador)

Method: GET  
Url: /api/participants/my-creator-requests  
Headers: X  
Body: X  

Response:

- Array con todas las solicitudes que han llegado a los viajes creados por el usuario


### 4.1 Ver solicitudes de mis viajes (creador) filtradas por estado

Method: GET  
Url: /api/participants/my-creator-requests?status={estado}  
Headers: X  
Body: X  

Response:

- Array con las solicitudes a los viajes creados por el usuario, filtradas por estado


### 5. Crear una solicitud de participación para un viaje

Method: POST  
Url: /api/participants/:trip_id  
Headers: Content-Type: application/json  
Body:

{
  "message": "Quiero unirme al viaje."
}

Ejemplo de respuesta:

{
  "id_participation": 12,
  "id_trip": 101,
  "id_user": 1,
  "status": "pending",
  "message": "Quiero unirme al viaje.",
  "created_at": "2025-11-17T18:26:28.000Z",
  "updated_at": "2025-11-17T18:26:28.000Z"
}

Response:

- Objeto con la nueva solicitud creada (estado inicial: pending)


### 6. Cambiar el estado de una solicitud/participación

Method: PATCH  
Url: /api/participants/:participation_id  
Headers: Content-Type: application/json  
Body:

{
  "status": "accepted"
}

o

{
  "status": "rejected"
}

o

{
  "status": "left"
}

Ejemplo de respuesta:

{
  "id_participation": 12,
  "id_trip": 101,
  "id_user": 1,
  "status": "accepted",
  "message": "Quiero unirme al viaje.",
  "created_at": "2025-11-17T18:26:28.000Z",
  "updated_at": "2025-11-17T18:28:45.000Z"
}

Response:

- Objeto con la solicitud actualizada (estado y updated_at modificados)
