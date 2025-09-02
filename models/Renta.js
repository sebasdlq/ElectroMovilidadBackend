const mongoose = require('mongoose');

const rentaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El usuario es obligatorio']
  },
  scooter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scooter',
    required: [true, 'El scooter es obligatorio']
  },
  horaRenta: {
    type: Date,
    default: Date.now
  },
  horaDevolucion: Date,
  estado: {
    type: String,
    enum: ['activa', 'finalizada', 'cancelada'],
    default: 'activa'
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

// Middleware para actualizar el estado del scooter al rentar
rentaSchema.post('save', async function(doc) {
  const Scooter = mongoose.model('Scooter');
  if (doc.estado === 'activa') {
    await Scooter.findByIdAndUpdate(doc.scooter, { estado: 'rentado' });
  }
});

// Middleware para actualizar el estado del scooter al finalizar/cancelar
rentaSchema.post('findOneAndUpdate', async function(doc) {
  if (this._update.estado === 'finalizada' || this._update.estado === 'cancelada') {
    const Scooter = mongoose.model('Scooter');
    await Scooter.findByIdAndUpdate(doc.scooter, { estado: 'disponible' });
  }
});

const Renta = mongoose.model('Renta', rentaSchema);
module.exports = Renta