// db.js

// 1. Importar librerías
const mysql = require('mysql2/promise'); // Usamos la API de 'promise' para Async/Await
const fs = require('fs'); // Necesario para leer el certificado SSL
require('dotenv').config(); // Carga las variables del archivo .env

// 2. Definir la configuración del pool de conexión
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  decimalNumbers: true, // ESTO hace que se resuelva lo de los decimales, pero puede perder precision....

  // ** CONFIGURACIÓN SSL CRÍTICA PARA AIVEN **
  ssl: {
    // Lee el contenido del archivo CA que descargaste

    //UTILIZAR MIENTRAS SE DESARROLLA
   // ca: fs.readFileSync(process.env.SSL_CA_PATH),

    //UTILIZAR CUANDO SE HAGA PUSH
   ca: process.env.SSL_CA,
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 3. Exportar el pool para usarlo en tus controladores (CRUD)
module.exports = pool;
