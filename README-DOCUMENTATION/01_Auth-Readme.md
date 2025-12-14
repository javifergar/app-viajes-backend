# AUTENTICACIÓN

Documentación de los endpoints relacionados con el registro, inicio de sesión y verificación de usuarios.

---

### Registro de nuevo usuario

Crea una nueva cuenta de usuario en la plataforma. Envía automáticamente un email de verificación.

**Method:** POST  
**Url:** `/api/auth/new-user`  
**Headers:** `Content-Type: application/json`  
**Body:** JSON con los datos del usuario.

**Parámetros del Body:**
- `name` (required): Nombre del usuario
- `surname` (required): Apellidos
- `email` (required): Correo electrónico (debe ser único)
- `password` (required): Contraseña (será encriptada en el servidor)
- `photo` (optional): URL de la foto de perfil

**Ejemplo de Request:**
```json
{
  "name": "Juan",
  "surname": "Pérez",
  "email": "juan.perez@example.com",
  "password": "securePassword123",
  "photo": "https://example.com/avatar.jpg"
}
```

**Response (201 Created):**
```json
{
  "message": "Usuario creado. Revisa tu correo para verificar.",
  "user": {
    "id_user": 25,
    "name": "Juan",
    "surname": "Pérez",
    "email": "juan.perez@example.com",
    "photo": "https://example.com/avatar.jpg",
    "verified_email": 0
    // ... otros campos del usuario
  }
}
```

**Errores posibles:**
- `400 Bad Request`: Si el email ya está registrado (`{ "error": "El email ya está registrado!" }`).

---

### Login de usuario

Autentica a un usuario existente y devuelve un token JWT para acceder a las rutas protegidas.

**Method:** POST  
**Url:** `/api/auth/login`  
**Headers:** `Content-Type: application/json`  
**Body:** JSON con credenciales.

**Parámetros del Body:**
- `email` (required)
- `password` (required)

**Ejemplo de Request:**
```json
{
  "email": "juan.perez@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login correcto!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Token JWT
}
```

**Errores posibles:**
- `401 Unauthorized`: Email o contraseña incorrectos (`{ "message": "Error email y/o password" }`).

---

### Verificación de Email

Este endpoint es utilizado principalmente a través del enlace enviado por correo electrónico al registrarse.

**Method:** GET  
**Url:** `/api/auth/verify`  
**QueryParams:** `token` (Token JWT temporal de verificación)

**Comportamiento:**
- Valida el token.
- Marca el email del usuario como verificado en la base de datos.
- Redirige al frontend (`/auth/verify`) con un parámetro `status=success` y un nuevo `token` de sesión autogenerado (login automático), o con `status=error` si falla.

---

## USO DEL TOKEN (Autenticación en otros endpoints)

Para acceder a las rutas protegidas (ej. crear viajes, ver perfil, etc.), se debe incluir el token JWT obtenido en el Login en los headers de la petición.

**Header:** `Authorization`  
**Valor:** `Bearer <TU_TOKEN_JWT>` (o simplemente el token, aunque se recomienda el prefijo Bearer).

**Ejemplo:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuestas de Middleware de Auth:**
- `403 Forbidden`: 
  - "Debes incluir el header Authorization"
  - "Token incorrecto"
  - "No existe usuario" (si el token es válido pero el usuario fue borrado)
