const express = require('express');
const router = express.Router();
const Renta = require('../models/Renta');
const Scooter = require('../models/Scooter');
const Usuario = require('../models/Usuario');

// Obtener todas las rentas
router.get('/', async (req, res) => {
  try {
    const rentas = await Renta.find()
      .populate('usuario')
      .populate('scooter');
    res.json(rentas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener una renta específica
router.get('/:id', getRenta, (req, res) => {
  res.json(res.renta);
});

// Crear una nueva renta
router.post('/', async (req, res) => {
  // Verificar que el usuario y el scooter existen
  const [usuario, scooter] = await Promise.all([
    Usuario.findById(req.body.usuario),
    Scooter.findById(req.body.scooter)
  ]);

  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  if (!scooter) {
    return res.status(404).json({ message: 'Scooter no encontrado' });
  }
  if (scooter.estado !== 'disponible') {
    return res.status(400).json({ message: 'El scooter no está disponible para renta' });
  }

  const renta = new Renta({
    usuario: req.body.usuario,
    scooter: req.body.scooter,
    horaRenta: req.body.horaRenta || Date.now(),
    estado: 'activa'
  });

  try {
    const nuevaRenta = await renta.save();
    res.status(201).json(nuevaRenta);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Finalizar una renta
router.patch('/:id/finalizar', getRenta, async (req, res) => {
  if (res.renta.estado !== 'activa') {
    return res.status(400).json({ message: 'Solo se pueden finalizar rentas activas' });
  }

  res.renta.estado = 'finalizada';
  res.renta.horaDevolucion = Date.now();

  try {
    const rentaFinalizada = await res.renta.save();
    res.json(rentaFinalizada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar una renta
router.delete('/:id', getRenta, async (req, res) => {
  try {
    await res.renta.remove();
    res.json({ message: 'Renta eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener renta por ID
async function getRenta(req, res, next) {
  let renta;
  try {
    renta = await Renta.findById(req.params.id)
      .populate('usuario')
      .populate('scooter');
    if (renta == null) {
      return res.status(404).json({ message: 'Renta no encontrada' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.renta = renta;
  next();
}

module.exports = router;