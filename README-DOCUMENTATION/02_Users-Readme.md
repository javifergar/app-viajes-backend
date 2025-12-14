# USUARIOS

Documentación de los endpoints relacionados con la gestión de usuarios.

**Nota:** Todos los endpoints de `/api/users` requieren autenticación (Header `Authorization: {{TOKEN}}`).

---

### Recuperar todos los usuarios

Method: GET
Url: /api/users
Headers: Authorization: {{TOKEN}}
Body: X

Response:
- Array con todos los usuarios registrados en la plataforma.

Ejemplo:
GET /api/users

---

### Recuperar usuario por ID

Method: GET
Url: /api/users/:userId
Headers: Authorization: {{TOKEN}}
Body: X

Response:
- Objeto con la información del usuario solicitado.

Ejemplo:
GET /api/users/25

---

### Recuperar usuario por Email

Method: GET
Url: /api/users/email/:email
Headers: Authorization: {{TOKEN}}
Body: X

Response:
- Objeto con la información del usuario buscado.

Ejemplo:
GET /api/users/email/juan.perez@example.com

---

### Actualizar usuario (Parcial)

Method: PATCH
Url: /api/users/:userId
Headers: Authorization: {{TOKEN}}
Body: JSON con los campos a modificar.

Parámetros opcionales del Body:
- name
- surname
- email
- password
- photo
- ... otros campos del modelo

Comportamiento:
- Si se envía `password`, se encripta antes de guardar.
- Verifica que la nueva contraseña no sea igual a la anterior.

Ejemplo:
PATCH /api/users/25
{
  "name": "Juan Carlos"
}

---

### Actualizar usuario (Completo)

Method: PUT
Url: /api/users/:userId
Headers: Authorization: {{TOKEN}}
Body: JSON con los campos a modificar.

Nota: Aunque semánticamente PUT suele requerir el objeto completo, en este controlador funciona de manera similar a PATCH (actualiza los campos enviados), pero usando la ruta definida para PUT.

Ejemplo:
PUT /api/users/25
{
  "name": "Juan",
  "surname": "Pérez",
  "photo": "https://nuevafoto.com/perfil.jpg"
}

---

### Eliminar usuario

Method: DELETE
Url: /api/users/:userId
Headers: Authorization: {{TOKEN}}
Body: X

Response:
- Mensaje de confirmación.

Ejemplo:
DELETE /api/users/25
