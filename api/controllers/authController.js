const User = require('../models/Usuario')
const jwt = require('jsonwebtoken')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.registro = async (req, res) => {
    try {
        const {
            nombre,
            correo,
            password
        } = req.body;

        const usuarioExistente = await User.findOne({
            correo : correo.toLowerCase()
        });
        if (usuarioExistente) {
            return res.status(400).json({
                status: 'error',
                message: 'El usuario ya existe con este email o licencia de conducir'
            });
        }

        const nuevoUsuario = await User.create(
            {
                nombre,
                correo,
                password
            }
        );

         // Generar token JWT
        const token = signToken(nuevoUsuario._id);

        // Remover password de la respuesta
        nuevoUsuario.password = undefined;

        res.status(201).json({
            status: 'success',
            token,
            data: {
                usuario: nuevoUsuario
            }
        });
    } catch{
        res.status(400).json({
        status: 'error',
        message: error.message
        });
    }
}

exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // 1) Verificar si existe el email y password
    if (!correo || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor proporciona email y contraseña'
      });
    }

    // 2) Verificar si el usuario existe y la contraseña es correcta
    const usuario = await User.findOne({ correo: correo.toLowerCase() }).select('+password');
    
    if (!usuario || !(await usuario.correctPassword(password, usuario.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Email o contraseña incorrectos'
      });
    }

    // 3) Si todo está bien, enviar token al cliente
    const token = signToken(usuario._id);

    usuario.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        usuario
      }
    });

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};