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
Url: /api/viajes
Headers: X
Body: X

Response:

- Array con todos los viajes

  ## Filtros

  ## Recuperar viajes por estado

  Method: GET
  Url: /api/viajes?estado={estado}
  Headers: X
  Body: X

  Response:

  - Array con todos los viajes con estado = {estado}

  ## Recuperar viajes por destino

  Method: GET
  Url: /api/viajes?destino={pais}
  Headers: X
  Body: X

  Response:

  - Array con todos los viajes con destino = {pais}

  ## Recuperar viajes por fecha

  Method: GET
  Url: /api/viajes?fecha={yyyy-mm-dd}
  Headers: X
  Body: X

  Response:

  - Array con todos los viajes con fecha = {yyyy-mm-dd}

  ## Recuperar viajes por organizador

  Method: GET
  Url: /api/viajes?organizador={id_creador}
  Headers: X
  Body: X

  Response:

  - Array con todos los viajes con organizador = {id_creador}

## Recuperar datos de un viaje

Method: GET
Url: /api/viajes/:id
Headers: X
Body: X

Response:

- Array con todos los datos del viaje

## Recuperar viajes activos de un usuario

Method: GET
Url: /api/viajes/:id/usuario
Headers: X
Body: X

Response:

- Array con todos los viajes del usuario

## Creación de un viaje

Method: POST
Url:/api/viajes
Headers: X
Body: ...

Response:

- Los datos del nuevo viaje

## Actualizar datos de un viaje

Method: PUT
Url: /api/viajes/:id
Headers: X
Body: ...

Response:

- Array con todos los datos del viaje

### Borrar datos de viaje

Method: DELETE
url: /api/viajes/:id
Headres : X
Body: X
Response: ...

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
