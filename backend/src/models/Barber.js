const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=60',
    },
    phone: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      default: 'Especialista em cortes modernos, degradê navalhado e barba terapia.',
    },
    specialties: {
      type: [String],
      default: ['Corte Cabelo', 'Barba', 'Degradê', 'Sobrancelha'],
    },
    workingHours: {
      daysOfWeek: {
        type: [Number], // 0 = Domingo, 1 = Segunda, 2 = Terça... 6 = Sábado
        default: [1, 2, 3, 4, 5, 6],
      },
      startTime: {
        type: String,
        default: '09:00',
      },
      endTime: {
        type: String,
        default: '19:00',
      },
      lunchStart: {
        type: String,
        default: '12:00',
      },
      lunchEnd: {
        type: String,
        default: '13:00',
      },
      slotDurationMinutes: {
        type: Number,
        default: 30,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Barber', barberSchema);
