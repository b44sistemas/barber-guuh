const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'barber_secret_jwt_key_2026_bvitsystem',
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/register
// @desc    Cadastrar novo cliente
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Nome, telefone e senha são obrigatórios.' });
    }

    // Verificar se já existe usuário com este telefone ou email
    const cleanPhone = phone.replace(/\D/g, '');
    const userExists = await User.findOne({
      $or: [
        { phone: cleanPhone },
        ...(email ? [{ email: email.toLowerCase() }] : []),
      ],
    });

    if (userExists) {
      return res.status(400).json({ error: 'Já existe uma conta com este telefone ou e-mail.' });
    }

    const user = await User.create({
      name,
      phone: cleanPhone,
      email: email ? email.toLowerCase() : undefined,
      password,
      role: 'client',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno ao realizar cadastro.' });
  }
});

// @route   POST /api/auth/login
// @desc    Autenticar usuário (email ou telefone)
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: 'Informe usuário/telefone e senha.' });
    }

    const cleanLogin = login.trim();
    const cleanPhone = cleanLogin.replace(/\D/g, '');

    // Busca por email ou telefone
    const user = await User.findOne({
      $or: [
        { email: cleanLogin.toLowerCase() },
        { phone: cleanPhone },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas. Verifique seu login e senha.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas. Verifique seu login e senha.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
});

// @route   GET /api/auth/me
// @desc    Obter usuário atual
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
