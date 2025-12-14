# Sistema de Notificaciones por Email

Este documento describe cómo funciona el sistema de notificaciones por email en la aplicación **Meet & Go**.

El sistema utiliza **Brevo (anteriormente Sendinblue)** como proveedor de servicios de email transaccional.

## ⚙️ Configuración

Para que el sistema funcione, es necesario configurar las siguientes variables de entorno en el archivo `.env`:

```env
BREVO_API_KEY=xkeysib-... (Tu clave API de Brevo)
API_BASE_URL=http://localhost:3000 (URL del Backend para los links de verificación/acción)
FRONTEND_URL=https://app-viajes.netlify.app (URL del Frontend para redirecciones)
SECRET_KEY=... (Usada para firmar tokens de acciones en emails)
```

Las notificaciones son enviadas desde: GMAIL_USER (guardado como variable de entorno).

## 📧 Flujos de Notificación

Actualmente existen 3 flujos principales de notificación:

### 1. Verificación de Email en Registro

- **Disparador (Trigger):** Se activa cuando un usuario se registra exitosamente (`POST /auth/register`).
- **Controlador:** `auth.controller.js` -> `create`
- **Servicio:** `email.service.js` -> `sendVerifyEmailTo`
- **Destinatario:** El usuario recién registrado.
- **Funcionamiento:**
  1. Se genera un token JWT temporal (expira en 1 día).
  2. Se envía un email con un enlace de verificación: `/api/auth/verify?token=...`.
  3. Al hacer clic, el backend valida el token y marca `verified_email = true`.

### 2. Notificación de Cambio de Fechas de Viaje

- **Disparador (Trigger):** Se activa cuando el creador de un viaje modifica las fechas (inicio o fin) de un viaje existente (`PUT /trips/:id`).
- **Controlador:** `trips.controller.js` -> `updateTrip`
- **Servicio:** `email.service.js` -> `sendTripUpdateNotification`
- **Destinatarios:** Todos los participantes aceptados del viaje (excluyendo al creador).
- **Funcionamiento:**
  1. El sistema detecta si las fechas han cambiado comparando el viaje anterior con el actualizado.
  2. Si hay cambios, recupera la lista de participantes aceptados.
  3. Envía un correo individual a cada participante informando de las nuevas fechas.
  4. Este proceso se ejecuta en segundo plano para no bloquear la respuesta al usuario.

### 3. Solicitud de Unión a Viaje (Pendiente de Aprobación)

- **Disparador (Trigger):** Se activa cuando un usuario solicita unirse a un viaje (`POST /participants/:tripId`).
- **Controlador:** `participants.controller.js` -> `createParticipation`
- **Servicio:** `email.service.js` -> `sendPendingRequestEmail`
- **Destinatario:** El creador del viaje.
- **Funcionamiento:**
  1. Se genera una nueva participación con estado `pending`.
  2. Se generan dos tokens JWT (para aceptar y rechazar) que expiran en 7 días.
  3. Se envía un email al creador con los detalles del solicitante y dos enlaces directos: "Aceptar" y "Rechazar".
  4. Al hacer clic en uno de los enlaces, el endpoint `handleParticipationAction` procesa la decisión sin necesidad de que el creador inicie sesión manualmente.

---

## 📂 Plantillas HTML

Las plantillas de los correos se encuentran en la carpeta `src/templates/`:

- `verify.html`: Plantilla para verificación de cuenta.
- `datesModified.html`: Plantilla para aviso de cambio de fechas.
- `pendingRequest.html`: Plantilla para solicitud de participación pendiente.

El servicio `email.service.js` carga estas plantillas y realiza la sustitución de variables (ej. `{{userName}}`, `{{tripTitle}}`) antes de enviar el correo.

## 🛠️ Debugging

- Si `BREVO_API_KEY` no está configurada, los servicios imprimirán un aviso en consola y no intentarán enviar el correo.
- Los errores en el envío de emails son capturados y logueados en la consola del servidor (`console.error`), pero **no interrumpen** el flujo principal de la aplicación (el usuario recibe su respuesta HTTP normal).
