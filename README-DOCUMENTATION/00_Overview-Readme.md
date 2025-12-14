# 🌍 Meet & Go - Backend API

Bienvenido a la documentación de la API del backend para la aplicación **Meet & Go**.

Este proyecto proporciona servicios RESTful para gestionar usuarios, viajes, chats, valoraciones y notificaciones de una plataforma de viajes colaborativos "Meet & Go".

---

## 📚 Documentación por Módulos

La documentación se ha dividido en diferentes archivos para facilitar su lectura y mantenimiento:

### 🔐 [Autenticación](./01_Auth-Readme.md)
Guía sobre **Registro**, **Login**, **Verificación por Email** y uso de **Tokens JWT**.

### 👥 [Usuarios](./02_Users-Readme.md)
Gestión de cuentas de usuario: recuperación de perfiles, actualización de datos (incluido password y fotos) y eliminación de cuantas.

### ✈️ [Viajes (Trips)](./03_Trips-Readme.md)
El núcleo de la aplicación. Incluye:
- Búsqueda y filtrado de viajes (destino, fechas, precio...).
- Creación, edición y borrado de viajes.
- Paginación y ordenación de resultados.

### 🤝 [Participantes](./04_Participants-Readme.md)
Gestión de la lógica de unión a los viajes:
- Solicitudes de unión (pendientes, aceptadas, rechazadas).
- Gestión de plazas por parte del creador.
- Historial de solicitudes enviadas y recibidas.

### 💬 [Mensajería (Chat)](./05_Messages-Readme.md)
Sistema de chat interno para cada viaje:
- Envío y recepción de mensajes.
- Respuestas (hilos).
- Historial de conversación del grupo.

### ⭐ [Valoraciones (Ratings)](./06_Ratings-Readme.md)
Sistema de reputación:
- Valorar a compañeros tras un viaje.
- Ver reputación de un usuario.
- Cálculo de medias.

### 📊 [Encuestas](./07_Surveys-Readme.md)
Herramienta para toma de decisiones en grupo dentro de un viaje (ej. "¿Playa o Montaña?").
- Creación de encuestas.
- Votación de opciones.
- Cierre de votaciones.

### 📧 [Notificaciones](./08_Notifications-Readme.md)
Detalles técnicos sobre el sistema de envío de correos electrónicos transaccionales con **Brevo** (Confirmación de cuenta, alertas de cambios, nuevas solicitudes...).

---

## 🛠️ Tecnologías Principales

- **Node.js** con **Express**: Framework principal.
- **MySQL**: Base de datos relacional.
- **JWT (JsonWebToken)**: Seguridad y manejo de sesiones.
- **Brevo (Sendinblue)**: Servicio de email.
- **Bcrypt.js**: Encriptado de contraseñas.

## ☁️ Despliegue (Deployment)

Esta aplicación se encuentra actualmente desplegada en la nube utilizando los siguientes proveedores:

- **Backend (API):** Hospedado en **[Render](https://render.com/)**, lo cual facilita el despliegue continuo desde GitHub.
- **Base de Datos (MySQL):** Hospedada en **[Aiven](https://aiven.io/)** (plan gratuito de MySQL), garantizando una base de datos gestionada y accesible remotamente.
- **Frontend (Web):** Hospedado en **[Netlify](https://meetandgo.netlify.app/)**, accesible públicamente.

## 🚀 Puesta en marcha rápida

1. Clonar el repositorio.
2. Copiar `.env.example` a `.env` y rellenar las variables (DB, SECRET_KEY, BREVO_API_KEY).
3. Instalar dependencias: `npm install`.
4. Iniciar servidor: `npm run dev`.

---