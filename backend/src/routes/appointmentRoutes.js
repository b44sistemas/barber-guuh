const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   POST /api/appointments
// @desc    Criar novo agendamento com validação anti-conflito
router.post('/', async (req, res) => {
  try {
    const { barberId, serviceId, date, time, clientName, clientPhone, notes, clientId } = req.body;

    if (!barberId || !serviceId || !date || !time || !clientName || !clientPhone) {
      return res.status(400).json({
        error: 'Todos os campos obrigatórios devem ser preenchidos (barbeiro, serviço, data, horário, nome e telefone).',
      });
    }

    // Buscar dados do barbeiro e serviço
    const barber = await Barber.findById(barberId);
    if (!barber || !barber.isActive) {
      return res.status(404).json({ error: 'Barbeiro selecionado não está disponível.' });
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ error: 'Serviço selecionado não está disponível.' });
    }

    // Verificar se já existe agendamento ativo no mesmo horário para o mesmo barbeiro
    const conflict = await Appointment.findOne({
      barber: barberId,
      date: date,
      time: time,
      status: { $in: ['confirmed', 'pending'] },
    });

    if (conflict) {
      return res.status(409).json({
        error: 'Este horário acabou de ser reservado por outro cliente. Por favor, escolha outro horário.',
      });
    }

    const appointment = await Appointment.create({
      client: clientId || null,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      barber: barber._id,
      barberName: barber.name,
      service: service._id,
      serviceName: service.name,
      price: service.price,
      durationMinutes: service.durationMinutes,
      date,
      time,
      status: 'confirmed',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Agendamento confirmado com sucesso!',
      appointment,
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao processar agendamento.' });
  }
});

// @route   GET /api/appointments/my
// @desc    Listar agendamentos do cliente (por telefone ou usuário logado)
router.get('/my', async (req, res) => {
  try {
    const { phone } = req.query;

    let filter = {};
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      filter.$or = [
        { clientPhone: phone },
        { clientPhone: cleanPhone },
        { clientPhone: { $regex: cleanPhone } },
      ];
    } else {
      return res.status(400).json({ error: 'Informe o telefone para localizar os agendamentos.' });
    }

    const appointments = await Appointment.find(filter)
      .populate('barber', 'name avatar phone')
      .populate('service', 'name price durationMinutes')
      .sort({ date: -1, time: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
  }
});

// @route   GET /api/appointments
// @desc    Listar todos os agendamentos (para painel administrativo)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { date, barberId, status } = req.query;
    const filter = {};

    if (date) filter.date = date;
    if (barberId) filter.barber = barberId;
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('barber', 'name avatar')
      .populate('service', 'name price durationMinutes')
      .sort({ date: 1, time: 1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar agendamentos.' });
  }
});

// @route   PUT /api/appointments/:id/status
// @desc    Atualizar status do agendamento (confirmed, completed, cancelled)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status do agendamento.' });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancelar agendamento
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    res.json({ success: true, message: 'Agendamento cancelado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cancelar agendamento.' });
  }
});

module.exports = router;
