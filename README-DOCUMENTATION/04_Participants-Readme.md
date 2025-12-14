# PARTICIPANTES

Documentación de los endpoints relacionados con la gestión de solicitudes y participantes en los viajes.

**Nota:** La mayoría de los endpoints requieren autenticación (Header `Authorization: {{TOKEN}}`).

---

### Ver información de participantes (Público/Privado)

Devuelve la lista de participantes aceptados de un viaje. Si el usuario que consulta es un participante aceptado o el creador, incluye información de contacto (email, teléfono). Si no, solo muestra datos públicos (nombre, foto).

**Method:** GET  
**Url:** `/api/participants/trip-info/:tripId`  
**Headers:** `Authorization` (Opcional, para ver datos privados)

**Response:**
- Array de participantes con info filtrada según permisos.

---

### Mis solicitudes realizadas

Recupera todas las solicitudes que el usuario logueado ha enviado a diversos viajes.

**Method:** GET  
**Url:** `/api/participants/my-requests`  
**Headers:** `Authorization: {{TOKEN}}`  
**QueryParams:** `status` (opcional: pending, accepted, rejected, left)

**Response:**
- Array de solicitudes propias.

---

### Solicitudes recibidas (Como Creador)

Recupera todas las solicitudes recibidas en los viajes creados por el usuario logueado.

**Method:** GET  
**Url:** `/api/participants/my-creator-requests`  
**Headers:** `Authorization: {{TOKEN}}`  
**QueryParams:** `status` (opcional)

**Response:**
- Array de solicitudes de otros usuarios a mis viajes.

---

### Unirse a un viaje (Crear solicitud)

Crea una solicitud de participación para un viaje. Envía notificación por email al creador.

**Method:** POST  
**Url:** `/api/participants/:tripId`  
**Headers:** `Authorization: {{TOKEN}}`  
**Body:**
```json
{
  "message": "Hola, me gustaría unirme a vuestro viaje a Perú."
}
```

**Validaciones:**
- El viaje debe existir y estar en estado `open`.
- No puedes unirte a tu propio viaje.
- No puedes unirte si ya tienes una solicitud previa.

**Response (201 Created):**
- Objeto de la nueva participación creada (`status: pending`).

---

### Actualizar estado de solicitud (Aceptar/Rechazar/Salir)

Permite aceptar o rechazar a un participante (si eres el creador), o salir de un viaje (si eres participante).

**Method:** PATCH  
**Url:** `/api/participants/:participationId`  
**Headers:** `Authorization: {{TOKEN}}`  
**Body:**
```json
{
  "status": "accepted" 
}
```
**Valores posibles de status:** `accepted`, `rejected`, `left`.

**Response:**
- Objeto de la participación actualizada.

---

### Cancelar/Borrar solicitud

Elimina una solicitud de participación.

**Method:** DELETE  
**Url:** `/api/participants/:participationId`  
**Headers:** `Authorization: {{TOKEN}}`  

**Reglas:**
- Solo el usuario que creó la solicitud puede borrarla.

**Response:**
- Mensaje de confirmación.

---

### Acción por Token (Email)

Endpoint utilizado por los enlaces de los correos electrónicos para aceptar/rechazar solicitudes sin login.

**Method:** GET  
**Url:** `/api/participants/:participationId/action`  
**QueryParams:** `token`

**Comportamiento:**
- Verifica el token JWT.
- Actualiza el estado a `accepted` o `rejected`.
- Redirige al frontend.

---

### Obtener participantes por viaje (Admin/Debug)

Recupera los participantes de un viaje específico, permitiendo filtrar por estado.

**Method:** GET  
**Url:** `/api/participants/trip/:tripId`  
**Headers:** `Authorization: {{TOKEN}}`  
**QueryParams:** `status` (opcional)

**Response:**
- Array de participantes.
