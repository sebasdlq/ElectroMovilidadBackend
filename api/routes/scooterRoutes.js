const express = require('express');
const router = express.Router();
const Scooter = require('../models/Scooter');

// Obtener todos los scooters
router.get('/', async (req, res) => {
  try {
    const scooters = await Scooter.find().populate('rentas');
    res.json(scooters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener scooters por ubicación (geocerca)
router.get('/cercanos', async (req, res) => {
  const { lng, lat, maxDistance = 1000 } = req.query;
  
  if (!lng || !lat) {
    return res.status(400).json({ message: 'Se requieren longitud y latitud' });
  }

  try {
    const scooters = await Scooter.find({
      ubicacion: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      estado: 'disponible'
    });
    res.json(scooters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un scooter específico
router.get('/:id', getScooter, (req, res) => {
  res.json(res.scooter);
});

// Crear un scooter
router.post('/', async (req, res) => {
  const scooter = new Scooter({
    modelo: req.body.modelo,
    estado: req.body.estado || 'disponible',
    ubicacion: {
      type: 'Point',
      coordinates: req.body.ubicacion.coordinates,
      direccion: req.body.ubicacion.direccion
    }
  });

  try {
    const nuevoScooter = await scooter.save();
    res.status(201).json(nuevoScooter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un scooter
router.patch('/:id', getScooter, async (req, res) => {
  if (req.body.modelo != null) {
    res.scooter.modelo = req.body.modelo;
  }
  if (req.body.estado != null) {
    res.scooter.estado = req.body.estado;
  }
  if (req.body.ubicacion != null) {
    res.scooter.ubicacion = req.body.ubicacion;
  }

  try {
    const scooterActualizado = await res.scooter.save();
    res.json(scooterActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un scooter
router.delete('/:id', getScooter, async (req, res) => {
  try {
    await res.scooter.remove();
    res.json({ message: 'Scooter eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener scooter por ID
async function getScooter(req, res, next) {
  let scooter;
  try {
    scooter = await Scooter.findById(req.params.id).populate('rentas');
    if (scooter == null) {
      return res.status(404).json({ message: 'Scooter no encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.scooter = scooter;
  next();
}

module.exports = router;