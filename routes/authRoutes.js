const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/Usuario');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const {nombre, correo, password } = req.body;

    // 1. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }

    // 2. Crear nuevo usuario
    const newUser = await User.create({ nombre, correo, password });

    // 3. Generar JWT
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 4. Enviar respuesta (omite el password en el json)
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: { ...newUser._doc, password: undefined }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verificar si el usuario existe y la contraseña es correcta
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // 2. Generar JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 3. Enviar respuesta
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: { ...user._doc, password: undefined }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;