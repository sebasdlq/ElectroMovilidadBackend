const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().populate('rentas');
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un usuario específico
router.get('/:id', getUsuario, (req, res) => {
  res.json(res.usuario);
});

// Crear un usuario
router.post('/', async (req, res) => {
  const usuario = new Usuario({
    nombre: req.body.nombre,
    correo: req.body.correo
  });

  try {
    const nuevoUsuario = await usuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un usuario
router.patch('/:id', getUsuario, async (req, res) => {
  if (req.body.nombre != null) {
    res.usuario.nombre = req.body.nombre;
  }
  if (req.body.correo != null) {
    res.usuario.correo = req.body.correo;
  }

  try {
    const usuarioActualizado = await res.usuario.save();
    res.json(usuarioActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un usuario
router.delete('/:id', getUsuario, async (req, res) => {
  try {
    await res.usuario.remove();
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener usuario por ID
async function getUsuario(req, res, next) {
  let usuario;
  try {
    usuario = await Usuario.findById(req.params.id).populate('rentas');
    if (usuario == null) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.usuario = usuario;
  next();
}

module.exports = router;