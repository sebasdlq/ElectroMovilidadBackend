exports.validarRegistro = (req, res, next) => {
  const {
    nombre,
    correo,
    password
  } = req.body;

  const errors = [];

  if (!nombre) errors.push('El nombre es requerido');
  if (!correo) errors.push('El email es requerido');
  if (!password || password.length < 6) errors.push('La contraseña debe tener al menos 6 caracteres');

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Datos de registro inválidos',
      errors
    });
  }

  next();
};