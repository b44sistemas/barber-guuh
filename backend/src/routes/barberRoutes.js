const express = require('express');
const router = express.Router();
const Barber = require('../models/Barber');
const Appointment = require('../models/Appointment');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/barbers
// @desc    Listar todos os barbeiros ativos
router.get('/', async (req, res) => {
  try {
    const barbers = await Barber.find({ isActive: true });
    res.json({ success: true, barbers });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar barbeiros.' });
  }
});

// @route   GET /api/barbers/:id
// @desc    Obter barbeiro específico
router.get('/:id', async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);
    if (!barber) {
      return res.status(404).json({ error: 'Barbeiro não encontrado.' });
    }
    res.json({ success: true, barber });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados do barbeiro.' });
  }
});

// @route   GET /api/barbers/:id/slots?date=YYYY-MM-DD
// @desc    Obter horários disponíveis de um barbeiro para determinada data
router.get('/:id/slots', async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // Formato 'YYYY-MM-DD'

    if (!date) {
      return res.status(400).json({ error: 'Data não informada. Formato esperado: YYYY-MM-DD' });
    }

    const barber = await Barber.findById(id);
    if (!barber || !barber.isActive) {
      return res.status(404).json({ error: 'Barbeiro não encontrado ou inativo.' });
    }

    // Calcula o dia da semana a partir da data informada
    const [year, month, day] = date.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    const dayOfWeek = targetDate.getDay(); // 0 = Domingo, 1 = Segunda...

    const { daysOfWeek, startTime, endTime, lunchStart, lunchEnd, slotDurationMinutes } = barber.workingHours;

    // Se o barbeiro não atende neste dia
    if (!daysOfWeek.includes(dayOfWeek)) {
      return res.json({
        success: true,
        date,
        isWorkingDay: false,
        message: 'Barbeiro não atende neste dia da semana.',
        slots: [],
      });
    }

    // Gerar todos os slots possíveis
    const timeToMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const minutesToTime = (totalMinutes) => {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);
    const lunchStartMin = lunchStart ? timeToMinutes(lunchStart) : null;
    const lunchEndMin = lunchEnd ? timeToMinutes(lunchEnd) : null;
    const step = slotDurationMinutes || 30;

    const allSlots = [];
    for (let m = startMin; m + step <= endMin; m += step) {
      // Ignora horário de almoço
      if (lunchStartMin !== null && lunchEndMin !== null) {
        if (m >= lunchStartMin && m < lunchEndMin) {
          continue;
        }
      }
      allSlots.push(minutesToTime(m));
    }

    // Buscar agendamentos existentes para este barbeiro e data
    const existingAppointments = await Appointment.find({
      barber: id,
      date: date,
      status: { $in: ['confirmed', 'pending'] },
    }).select('time');

    const bookedTimes = new Set(existingAppointments.map((app) => app.time));

    // Filtrar horários passados se a data for hoje
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const availableSlots = allSlots.filter((slot) => {
      if (bookedTimes.has(slot)) return false;
      if (date === todayStr && timeToMinutes(slot) <= currentMinutes) {
        return false;
      }
      return true;
    });

    res.json({
      success: true,
      date,
      isWorkingDay: true,
      allSlots,
      bookedSlots: Array.from(bookedTimes),
      slots: availableSlots,
    });
  } catch (error) {
    console.error('Erro ao calcular slots:', error);
    res.status(500).json({ error: 'Erro ao calcular horários disponíveis.' });
  }
});

// @route   POST /api/barbers (Admin)
// @desc    Cadastrar novo barbeiro
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const barber = await Barber.create(req.body);
    res.status(201).json({ success: true, barber });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Erro ao criar barbeiro.' });
  }
});

// @route   PUT /api/barbers/:id (Admin)
// @desc    Atualizar barbeiro
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const barber = await Barber.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!barber) return res.status(404).json({ error: 'Barbeiro não encontrado.' });
    res.json({ success: true, barber });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar barbeiro.' });
  }
});

// @route   DELETE /api/barbers/:id (Admin)
// @desc    Desativar barbeiro
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const barber = await Barber.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!barber) return res.status(404).json({ error: 'Barbeiro não encontrado.' });
    res.json({ success: true, message: 'Barbeiro desativado com sucesso.' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao desativar barbeiro.' });
  }
});

module.exports = router;
