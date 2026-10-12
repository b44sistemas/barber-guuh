const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/services
// @desc    Listar todos os serviços ativos
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ price: 1 });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviços.' });
  }
});

// @route   POST /api/services (Admin)
// @desc    Cadastrar novo serviço
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, durationMinutes, category, icon } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
    }

    const service = await Service.create({
      name,
      description,
      price,
      durationMinutes: durationMinutes || 30,
      category: category || 'Cabelo',
      icon: icon || 'scissors',
    });

    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao cadastrar serviço.' });
  }
});

// @route   PUT /api/services/:id (Admin)
// @desc    Atualizar serviço
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ error: 'Serviço não encontrado.' });
    res.json({ success: true, service });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar serviço.' });
  }
});

// @route   DELETE /api/services/:id (Admin)
// @desc    Desativar serviço
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!service) return res.status(404).json({ error: 'Serviço não encontrado.' });
    res.json({ success: true, message: 'Serviço desativado com sucesso.' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao desativar serviço.' });
  }
});

module.exports = router;
