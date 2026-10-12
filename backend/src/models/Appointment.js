const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Barber',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    serviceName: {
      type: String,
    },
    barberName: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: String, // Formato YYYY-MM-DD
      required: true,
    },
    time: {
      type: String, // Formato HH:MM
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Índice composto para busca rápida de horários por barbeiro e data
appointmentSchema.index({ barber: 1, date: 1, time: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
