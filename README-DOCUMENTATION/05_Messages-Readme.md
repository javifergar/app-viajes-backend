# MENSAJERÍA (Chat de Viaje)

Documentación de los endpoints relacionados con el chat de grupo de cada viaje.

**Nota:** 
- Requieren autenticación (Header `Authorization: {{TOKEN}}`).
- El usuario debe ser un participante **aceptado** del viaje (o el creador) para acceder a estos endpoints.

---

### Obtener mensajes del chat

Recupera el historial de mensajes de un viaje.

**Method:** GET  
**Url:** `/api/trips/:tripId/messages`  
**Headers:** `Authorization: {{TOKEN}}`

**Response:**
- Array de mensajes ordenados cronológicamente.
- Incluye info del autor (id, nombre, foto).

**Ejemplo:**
GET /api/trips/45/messages

---

### Enviar un mensaje

Publica un nuevo mensaje en el chat del viaje.

**Method:** POST  
**Url:** `/api/trips/:tripId/messages`  
**Headers:** `Authorization: {{TOKEN}}`  
**Body:**
```json
{
  "message": "Hola a todos! ¿Qué tal si quedamos antes?",
  "id_parent_message": 12 // Opcional (para responder a otro mensaje)
}
```

**Validaciones:**
- Mensaje no vacío.
- Máximo 1000 caracteres.
- Si es respuesta (`id_parent_message`), el mensaje padre debe existir y pertenecer al mismo viaje.

**Response (201):**
- Objeto del mensaje creado.

---

### Borrar mensaje

Elimina un mensaje propio.

**Method:** DELETE  
**Url:** `/api/messages/:messageId`  
**Headers:** `Authorization: {{TOKEN}}`

**Comportamiento:**
- Solo el autor puede borrar su mensaje.
- Si el mensaje tiene respuestas (hilos), se realiza un "borrado lógico" (el contenido se oculta pero la estructura se mantiene).
- Si no tiene respuestas, se elimina físicamente de la base de datos.

**Ejemplo:**
DELETE /api/messages/158
