# VALORACIONES (Ratings)

Documentación de los endpoints para gestionar las valoraciones entre usuarios tras un viaje.

**Nota:** 
- Requieren autenticación (Header `Authorization: {{TOKEN}}`).
- Los usuarios deben haber compartido el mismo viaje para poder valorarse.

---

### Obtener valoraciones de un viaje

Recupera todas las reseñas asociadas a un viaje específico.

**Method:** GET  
**Url:** `/api/ratings/trip/:tripId`  
**Headers:** `Authorization: {{TOKEN}}`

**Response:**
- Array de valoraciones.

---

### Obtener valoraciones de un usuario

Recupera todas las reseñas que ha recibido un usuario en su historial.

**Method:** GET  
**Url:** `/api/ratings/user/:userId`  
**Headers:** `Authorization: {{TOKEN}}`

**Response:**
- Array de valoraciones con información del autor de la reseña.

---

### Crear una valoración

Permite a un usuario valorar a otro compañero de viaje.

**Method:** POST  
**Url:** `/api/ratings`  
**Headers:** `Authorization: {{TOKEN}}`  
**Body:**
```json
{
  "id_trip": 45,
  "id_reviewed": 28,  // ID del usuario al que valoras
  "score": 9,         // 0-10
  "comment": "Gran compañero de viaje, muy puntual."
}
```

**Validaciones:**
- No puedes valorarte a ti mismo.
- Ambos usuarios deben pertenecer al viaje indicado.
- El score debe ser entre 0 y 10.
- Solo una valoración por par de usuarios/viaje.

**Response (201):**
- Objeto de la valoración creada.

---

### Modificar una valoración

Edita el comentario o la puntuación de una reseña propia.

**Method:** PATCH  
**Url:** `/api/ratings/:ratingId`  
**Headers:** `Authorization: {{TOKEN}}`  
**Body:**
```json
{
  "score": 10,
  "comment": "Mejorando la nota, todo excelente."
}
```

**Response:**
- Valoración actualizada.

---

### Eliminar valoración

Borra una reseña realizada por el usuario.

**Method:** DELETE  
**Url:** `/api/ratings/:ratingId`  
**Headers:** `Authorization: {{TOKEN}}`

**Response:**
- Mensaje de confirmación.
