# ENCUESTAS (Votaciones)

Documentación de los endpoints para gestionar encuestas dentro de un viaje (ej. decidir fecha, destino, presupuesto).

**Nota:** 
- Requieren autenticación (Header `Authorization: {{TOKEN}}`).
- Solo accesibles para participantes **aceptados** del viaje (o el creador).

---

### Ver encuestas del viaje

Recupera todas las encuestas activas y cerradas de un viaje.

**Method:** GET  
**Url:** `/api/trips/:tripId/surveys`  
**Headers:** `Authorization: {{TOKEN}}`

**Response:**
- Array de encuestas con sus opciones y el recuento de votos.
- Indica si el usuario actual ya ha votado y qué opción.

---

### Crear una encuesta

Permite a cualquier participante lanzar una nueva votación.

**Method:** POST  
**Url:** `/api/trips/:tripId/surveys`  
**Headers:** `Authorization: {{TOKEN}}`  
**Body:**
```json
{
  "question": "¿Cenamos pizza o sushi?",
  "options": ["Pizza", "Sushi", "Tacos"]
}
```

**Validaciones:**
- Mínimo 2 opciones, máximo 10.
- Pregunta máximo 200 caracteres.
- Opciones máximo 100 caracteres.

**Response (201):**
- Objeto de la encuesta creada.

---

### Votar

Permite votar por una opción (o cambiar el voto si ya se había votado).

**Method:** POST  
**Url:** `/api/surveys/:surveyId/vote`  
**Headers:** `Authorization: {{TOKEN}}`  
**Body:**
```json
{
  "id_option": 5
}
```

**Validaciones:**
- La encuesta debe estar abierta (`is_closed: 0`).
- La opción debe pertenecer a la encuesta indicada.

**Response:**
- Encuesta actualizada con los nuevos totales.

---

### Cerrar encuesta

Finaliza la votación.

**Method:** PATCH  
**Url:** `/api/surveys/:surveyId/close`  
**Headers:** `Authorization: {{TOKEN}}`

**Validaciones:**
- Solo el usuario que creó la encuesta puede cerrarla.
- No se puede reabrir una encuesta cerrada.

**Response:**
- Mensaje de confirmación.
