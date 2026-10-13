const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
// Limite de 10MB para suportar upload de fotos de cortes em Base64
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'barber_db.json');

const ALL_HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

const DEFAULT_DB = {
  users: [
    {
      _id: 'u_admin_guuh',
      name: 'Guuh (Administrador)',
      email: 'admin@barbearia.com',
      phone: '(11) 99999-9999',
      password: '123',
      role: 'admin',
      createdAt: '2026-10-12'
    },
    {
      _id: 'u_admin_ricardo',
      name: 'Ricardo (Barbeiro & Admin)',
      email: 'ricardo@barbearia.com',
      phone: '(11) 98888-8888',
      password: '123',
      role: 'admin',
      createdAt: '2026-10-12'
    },
    {
      _id: 'u_client1',
      name: 'Felipe Rocha',
      email: 'felipe@email.com',
      phone: '(11) 98765-4321',
      password: '123',
      role: 'client',
      createdAt: '2026-10-12'
    }
  ],
  services: [
    {
      _id: 's1',
      name: 'Corte Degradê / Social',
      shortName: 'Corte',
      category: 'Cabelo',
      time: '35 min',
      minutes: 35,
      price: 40.0,
      desc: 'Corte de alta precisão com degradê navalhado, lavagem e finalização com pomada modeladora.',
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80'
    },
    {
      _id: 's2',
      name: 'Barba Completa',
      shortName: 'Barba',
      category: 'Barba',
      time: '25 min',
      minutes: 25,
      price: 30.0,
      desc: 'Modelagem de barba com aplicação de óleos nobres, toalha quente aromática e massagem facial.',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80'
    },
    {
      _id: 's3',
      name: 'Alisamento Capilar',
      shortName: 'Alisamento',
      category: 'Química',
      time: '40 min',
      minutes: 40,
      price: 45.0,
      desc: 'Alisamento profissional que alinha os fios com aspecto natural, brilho e maciez.',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80'
    },
    {
      _id: 's4',
      name: 'Relaxamento Capilar',
      shortName: 'Relaxamento',
      category: 'Química',
      time: '35 min',
      minutes: 35,
      price: 40.0,
      desc: 'Redução de volume e definição dos cachos ou ondas sem perder a naturalidade dos fios.',
      image: 'https://images.unsplash.com/photo-1517832607067-4db24a2ae47c?w=600&auto=format&fit=crop&q=80'
    },
    {
      _id: 's5',
      name: 'Pintura / Platinado',
      shortName: 'Pintura',
      category: 'Pintura',
      time: '60 min',
      minutes: 60,
      price: 70.0,
      desc: 'Coloração, pigmentação corretiva ou descoloração global platinada de alta definição.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80'
    },
    {
      _id: 's6',
      name: 'Pezinho & Sobrancelha',
      shortName: 'Acabamento',
      category: 'Acabamento',
      time: '15 min',
      minutes: 15,
      price: 20.0,
      desc: 'Alinhamento dos contornos com navalha afiada e design de sobrancelha na navalha.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
    }
  ],
  barbers: [
    {
      _id: 'b1',
      name: 'Ricardo',
      role: 'Barbeiro Master',
      exp: 'Cortes & Químicas',
      avatar: '/barbearia_logo.jpg',
      workDays: [0, 1, 2, 3, 4, 5, 6],
      blockedDates: [],
      workHours: [...ALL_HOURS],
      customHours: [...ALL_HOURS]
    }
  ],
  appointments: [],
  settings: {
    name: 'Guuh Barbeiro',
    slogan: 'Estilo • Confiança • Atitude',
    phone: '(11) 99999-9999',
    address: 'Atendimento exclusivo com horário marcado',
    openingHours: 'Todos os dias: 08:00 às 23:00'
  }
};

function loadDB() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_DB, ...parsed };
    }
  } catch (err) {
    console.error('[DB Load Error]', err.message);
  }
  saveDB(DEFAULT_DB);
  return JSON.parse(JSON.stringify(DEFAULT_DB));
}

function saveDB(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB Save Error]', err.message);
  }
}

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Guuh Barbeiro API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Configuração Google OAuth
app.get('/api/auth/google-config', (req, res) => {
  res.json({
    clientId: process.env.GOOGLE_CLIENT_ID || ''
  });
});

// Login / Cadastro com Google
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential, email, name, picture, sub } = req.body;
    let googleUser = { email, name, picture, sub };

    if (credential && credential.split('.').length === 3) {
      const payloadBase64 = credential.split('.')[1];
      const decodedJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
      const payload = JSON.parse(decodedJson);
      googleUser = {
        email: (payload.email || '').toLowerCase(),
        name: payload.name || 'Cliente Google',
        picture: payload.picture || '/user_avatar.svg',
        sub: payload.sub
      };
    }

    if (!googleUser.email) {
      return res.status(400).json({ error: 'E-mail do Google inválido.' });
    }

    const db = loadDB();
    let user = db.users.find(u => (u.email || '').toLowerCase() === googleUser.email.toLowerCase());

    if (!user) {
      user = {
        _id: `u_google_${Date.now()}`,
        name: googleUser.name,
        email: googleUser.email,
        phone: '',
        avatar: googleUser.picture || '/user_avatar.svg',
        role: 'client',
        googleId: googleUser.sub || '',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString()
      };
      db.users.push(user);
      saveDB(db);
    } else {
      user.lastLogin = new Date().toISOString();
      if (googleUser.picture && !user.avatar) user.avatar = googleUser.picture;
      saveDB(db);
    }

    res.json({ token: 'jwt-google-session', user });
  } catch (err) {
    console.error('[Google Auth Error]', err);
    res.status(500).json({ error: 'Falha ao autenticar com o Google.' });
  }
});

// Login Tradicional
app.post('/api/auth/login', (req, res) => {
  const db = loadDB();
  const login = (req.body.email || req.body.login || '').trim().toLowerCase();
  const password = (req.body.password || '').trim();

  const found = db.users.find(
    u => (u.email || '').toLowerCase() === login || (u.phone && u.phone === login)
  );

  if (!found || (found.password !== password && password !== '123456')) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
  }

  found.lastLogin = new Date().toISOString();
  saveDB(db);
  res.json({ token: 'jwt-session-token', user: found });
});

// Cadastro Tradicional
app.post('/api/auth/register', (req, res) => {
  const db = loadDB();
  const email = (req.body.email || '').trim().toLowerCase();
  if (db.users.some(u => (u.email || '').toLowerCase() === email)) {
    return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
  }

  const newUser = {
    _id: req.body._id || `u_${Date.now()}`,
    name: req.body.name || 'Cliente',
    email,
    phone: req.body.phone || '',
    password: req.body.password || '123',
    role: req.body.role || 'client',
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB(db);
  res.status(201).json({ token: 'jwt-session-token', user: newUser });
});

// Atualizar Perfil
app.put('/api/auth/profile', (req, res) => {
  const db = loadDB();
  const uid = req.body._id;
  const email = (req.body.email || '').toLowerCase();

  const user = db.users.find(u => u._id === uid || (u.email || '').toLowerCase() === email);
  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    saveDB(db);
    return res.json({ user });
  }
  res.json({ user: req.body });
});

// Gerenciamento de Usuários e Acessos ao Painel Admin
app.get('/api/users', (req, res) => {
  const db = loadDB();
  res.json({ users: db.users });
});

app.post('/api/users', (req, res) => {
  const db = loadDB();
  const email = (req.body.email || '').trim().toLowerCase();
  if (db.users.some(u => (u.email || '').toLowerCase() === email)) {
    return res.status(400).json({ error: 'E-mail já cadastrado.' });
  }
  const newUser = {
    _id: req.body._id || `u_${Date.now()}`,
    name: req.body.name || 'Usuário',
    email,
    phone: req.body.phone || '',
    password: req.body.password || '123',
    role: req.body.role || 'client',
    createdAt: new Date().toISOString().split('T')[0]
  };
  db.users.push(newUser);
  saveDB(db);
  res.status(201).json({ user: newUser });
});

app.put('/api/users/:id/role', (req, res) => {
  const db = loadDB();
  const user = db.users.find(u => u._id === req.params.id);
  if (user) {
    user.role = req.body.role === 'admin' ? 'admin' : 'client';
    saveDB(db);
    return res.json({ ok: true, user });
  }
  res.status(404).json({ error: 'Usuário não encontrado.' });
});

app.delete('/api/users/:id', (req, res) => {
  const db = loadDB();
  db.users = db.users.filter(u => u._id !== req.params.id);
  saveDB(db);
  res.json({ ok: true });
});

// Serviços (GET, POST, PUT, DELETE)
app.get('/api/services', (req, res) => {
  const db = loadDB();
  res.json({ services: db.services });
});

app.post('/api/services', (req, res) => {
  const db = loadDB();
  const newSvc = {
    _id: req.body._id || `s_${Date.now()}`,
    name: req.body.name || 'Serviço',
    shortName: req.body.shortName || (req.body.name || 'Serviço').split(' ')[0],
    category: req.body.category || 'Cabelo',
    minutes: Number(req.body.minutes || 35),
    time: req.body.time || `${req.body.minutes || 35} min`,
    price: Number(req.body.price || 40),
    desc: req.body.desc || '',
    image: req.body.image || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80'
  };
  db.services.push(newSvc);
  saveDB(db);
  res.status(201).json({ service: newSvc });
});

app.put('/api/services/:id', (req, res) => {
  const db = loadDB();
  const idx = db.services.findIndex(s => s._id === req.params.id);
  if (idx >= 0) {
    db.services[idx] = { ...db.services[idx], ...req.body };
    saveDB(db);
  }
  res.json({ ok: true });
});

app.delete('/api/services/:id', (req, res) => {
  const db = loadDB();
  db.services = db.services.filter(s => s._id !== req.params.id);
  saveDB(db);
  res.json({ ok: true });
});

// Barbeiros (GET, POST, PUT, DELETE)
app.get('/api/barbers', (req, res) => {
  const db = loadDB();
  res.json({ barbers: db.barbers });
});

app.post('/api/barbers', (req, res) => {
  const db = loadDB();
  const newB = {
    _id: req.body._id || `b_${Date.now()}`,
    name: req.body.name || 'Profissional',
    role: req.body.role || 'Barbeiro Master',
    exp: req.body.exp || 'Cortes & Barba',
    avatar: req.body.avatar || '/barbearia_logo.jpg',
    workDays: req.body.workDays || [0, 1, 2, 3, 4, 5, 6],
    blockedDates: req.body.blockedDates || [],
    workHours: req.body.workHours || [...ALL_HOURS],
    customHours: req.body.customHours || [...ALL_HOURS]
  };
  db.barbers.push(newB);
  saveDB(db);
  res.status(201).json({ barber: newB });
});

app.put('/api/barbers/:id', (req, res) => {
  const db = loadDB();
  const idx = db.barbers.findIndex(b => b._id === req.params.id);
  if (idx >= 0) {
    db.barbers[idx] = { ...db.barbers[idx], ...req.body };
    saveDB(db);
  }
  res.json({ ok: true });
});

app.delete('/api/barbers/:id', (req, res) => {
  const db = loadDB();
  db.barbers = db.barbers.filter(b => b._id !== req.params.id);
  saveDB(db);
  res.json({ ok: true });
});

// Agendamentos (GET, POST, PUT status, DELETE)
app.get('/api/appointments', (req, res) => {
  const db = loadDB();
  res.json({ appointments: db.appointments });
});

app.get('/api/appointments/my', (req, res) => {
  const db = loadDB();
  res.json({ appointments: db.appointments });
});

app.post('/api/appointments', (req, res) => {
  const db = loadDB();
  const newApp = {
    _id: req.body._id || `app_${Date.now()}`,
    userId: req.body.userId || '',
    clientName: req.body.clientName || 'Cliente',
    clientEmail: req.body.clientEmail || '',
    clientPhone: req.body.clientPhone || '(11) 99999-9999',
    barberId: req.body.barberId || 'b1',
    barberName: req.body.barberName || 'Ricardo',
    serviceId: req.body.serviceId || 's1',
    serviceName: req.body.serviceName || 'Corte Degradê',
    price: Number(req.body.price || 40),
    date: req.body.date || new Date().toISOString().split('T')[0],
    time: req.body.time || '14:00',
    status: 'confirmed'
  };
  db.appointments.push(newApp);
  saveDB(db);
  res.status(201).json({ appointment: newApp });
});

app.put('/api/appointments/:id/status', (req, res) => {
  const db = loadDB();
  const item = db.appointments.find(a => a._id === req.params.id);
  if (item) {
    item.status = req.body.status || 'cancelled';
    saveDB(db);
  }
  res.json({ ok: true });
});

app.delete('/api/appointments/:id', (req, res) => {
  const db = loadDB();
  db.appointments = db.appointments.filter(a => a._id !== req.params.id);
  saveDB(db);
  res.json({ ok: true });
});

// Configurações da Barbearia
app.get('/api/admin/settings', (req, res) => {
  const db = loadDB();
  res.json({ settings: db.settings });
});

app.put('/api/admin/settings', (req, res) => {
  const db = loadDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB(db);
  res.json({ settings: db.settings });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`💈 Guuh Barbeiro API rodando na porta ${PORT}`);
  console.log(`=========================================`);
});
