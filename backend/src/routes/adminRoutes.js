const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const Setting = require('../models/Setting');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/admin/dashboard
// @desc    Obter métricas e resumo do dashboard
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Agendamentos de hoje
    const todayAppointments = await Appointment.find({ date: todayStr });
    const todayTotal = todayAppointments.length;
    const todayCompleted = todayAppointments.filter((a) => a.status === 'completed').length;
    const todayConfirmed = todayAppointments.filter((a) => a.status === 'confirmed').length;
    const todayCancelled = todayAppointments.filter((a) => a.status === 'cancelled').length;

    // Faturamento de hoje (confirmados + concluídos)
    const todayRevenue = todayAppointments
      .filter((a) => a.status !== 'cancelled')
      .reduce((acc, curr) => acc + (curr.price || 0), 0);

    // Agendamentos do mês
    const monthAppointments = await Appointment.find({
      date: { $regex: `^${currentMonthPrefix}` },
      status: { $ne: 'cancelled' },
    });
    const monthTotal = monthAppointments.length;
    const monthRevenue = monthAppointments.reduce((acc, curr) => acc + (curr.price || 0), 0);

    // Totais de cadastros
    const totalBarbers = await Barber.countDocuments({ isActive: true });
    const totalServices = await Service.countDocuments({ isActive: true });

    // Próximos 10 agendamentos (a partir de hoje)
    const upcomingAppointments = await Appointment.find({
      date: { $gte: todayStr },
      status: { $in: ['confirmed', 'pending'] },
    })
      .sort({ date: 1, time: 1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        todayTotal,
        todayCompleted,
        todayConfirmed,
        todayCancelled,
        todayRevenue,
        monthTotal,
        monthRevenue,
        totalBarbers,
        totalServices,
      },
      upcomingAppointments,
    });
  } catch (error) {
    console.error('Erro no dashboard admin:', error);
    res.status(500).json({ error: 'Erro ao gerar dados do painel.' });
  }
});

// @route   GET /api/admin/settings
// @desc    Obter configurações gerais
router.get('/settings', async (req, res) => {
  try {
    const config = await Setting.findOne({ key: 'shop_info' });
    res.json({
      success: true,
      settings: config ? config.value : {
        name: 'BvIt Barber Club',
        phone: '(11) 99999-9999',
        whatsapp: '5511999999999',
        address: 'Av. Principal, 1000 - Centro',
        openingHours: 'Segunda a Sábado: 09:00 às 19:00',
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar configurações.' });
  }
});

// @route   PUT /api/admin/settings
// @desc    Atualizar configurações da barbearia
router.put('/settings', protect, adminOnly, async (req, res) => {
  try {
    const { name, phone, whatsapp, address, openingHours, instagram, slogan } = req.body;

    const updated = await Setting.findOneAndUpdate(
      { key: 'shop_info' },
      {
        key: 'shop_info',
        value: { name, phone, whatsapp, address, openingHours, instagram, slogan },
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, settings: updated.value });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar configurações.' });
  }
});

module.exports = router;
