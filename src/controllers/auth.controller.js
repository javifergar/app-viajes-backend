
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

const verify = () => {
  console.log('LLegue al verify');
  res.json({
    message:'Hola mundo'
  })
};


module.exports = { login, create, verify };
