# app-viajes-backend

## Viajes

## Recuperar todos los viajes

Method: GET
Url: /api/trips
Headers: X
Body: X

Response:

- Array con todos los viajes

  ## Filtros

  ## Recuperar viajes por estado

  Method: GET
  Url: /api/trips?estado=estado
  Headers: X
  Body: X

  Response:

  - Array con todos los viajes con estado = estado

  ## Recuperar viajes por destino

  Method: GET
  Url: /api/trips?destino=pais, provincia o ciudad
  Headers: X
  Body: X

  Response:

  - Array con todos los viajes con destino = pais, provincia o ciudad

  ## Recuperar viajes por fecha

  Method: GET
  Url: /api/trips?fecha=yyyy-mm-dd
  Headers: X
  Body: X

  Response:

  - Array con todos los viajes con fecha = yyyy-mm-dd

  ## Recuperar viajes por organizador

  Method: GET
  Url: /api/trips?organizador={nombre_creador}
  Headers: X
  Body: X

  Response:

  - Array con todos los viajes con organizador = nombre_creador
  - Los espacios entre palabras deben sustituirse por %20 Ejemplo: Jose Antonio -> Jose%20Antonio

  ## Recuperar viajes activos de un usuario

  Method: GET
  Url: /api/trips?estado={estado}&participante={id_usuario}
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
Body: titulo, descripcion, destino, start_date, end_date, coste_por_persona, minimo_participantes,informacion_transporte, itinerario, estado

Response:

- Los datos del nuevo viaje

## Actualizar datos de un viaje

Method: PUT
Url: /api/trips/:id
Headers: X
Body: titulo, descripcion, destino, start_date, end_date, coste_por_persona, minimo_participantes,informacion_transporte, itinerario, estado

Response:

- Array con todos los datos del viaje

### Borrar datos de viaje

Method: DELETE
url: /api/trips/:id
Headres : X
Body: X
Response:

- Borra los datos del viaje
