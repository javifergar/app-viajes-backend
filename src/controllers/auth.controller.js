
const UsersModel = require('../models/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {sendVerifyEmailTo} = require('../services/email.service');


const create = async (req, res) => {
  const findEmail = await UsersModel.selectByEmail(req.body.email);
  if (findEmail) return res.status(400).json({ error: 'El email ya está registrado!' });
  req.body.password = bcrypt.hashSync(req.body.password, 8);

  try {
    const insertId = await UsersModel.insertUser(req.body);
    const newUser = await UsersModel.selectById(insertId);
    //Se envía en la creación el correo de verificación
    await sendVerifyEmailTo(newUser);
    res.json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al insertar el nuevo usuario!' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // ¿existe email?
  // recupero el usuario
  const user = await UsersModel.selectByEmail(email);
  if (!user) return res.status(401).json({ message: 'Error email y/o password' }); // no se pone solo email par no dar pistas (ciberseguridad)
  // ¡coinciden las passw?
  const success = bcrypt.compareSync(password, user.password);
  if (!success) return res.status(401).json({ message: 'Error email y/o password' });
  res.json({
    message: 'Login correcto!',
    token: jwt.sign({ userId: user.id_user }, process.env.SECRET_KEY),
  });
};

const verify = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Falta token');
  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY); 
    const userId = payload.userId;
    // Esperar a que se implemente el verify_email en la BBDD
    //await UsersModel.updateUser(userId, { verify_email: 1 });
    const loginUrl = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/login` : 'http://localhost:4200/login';
    res.send(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>Email verificado</title>
          <meta http-equiv="refresh" content="2;url=${loginUrl}" />
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 80px;">
          <h1>Email verificado</h1>
          <p>Tu correo ha sido verificado correctamente.</p>
          <p>Seras redirigido al login en unos segundos...</p>
          <p><a href="${loginUrl}">Ir al login ahora</a></p>
          <script>
            setTimeout(function () {
              window.location.href = '${loginUrl}';
            }, 2000);
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(400).send('Token inválido o expirado');
  }
};



module.exports = { login, create, verify };
