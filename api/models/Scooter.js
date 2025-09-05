const mongoose = require('mongoose');

const scooterSchema = new mongoose.Schema({
  modelo: {
    type: String,
    required: [true, 'El modelo es obligatorio'],
    trim: true
  },
  estado: {
    type: String,
    enum: ['disponible', 'rentado', 'mantenimiento', 'baja'],
    default: 'disponible'
  },
  ubicacion: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      required: true
    },
    direccion: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Índice geospacial para búsquedas por ubicación
scooterSchema.index({ ubicacion: '2dsphere' });

// Opcional: relación virtual con rentas
scooterSchema.virtual('rentas', {
  ref: 'Renta',
  localField: '_id',
  foreignField: 'scooter'
});

const Scooter = mongoose.model('Scooter', scooterSchema);
module.exports = Scooter