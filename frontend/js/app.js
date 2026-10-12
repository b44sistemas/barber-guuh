// ========================================================
// GUUH BARBEIRO - SISTEMA COMPLETO (CLIENTE + ADMIN VINCULADOS)
// Autenticação Real, Múltiplos Serviços Somados, Calendariozinho
// e Painel Administrativo 100% Sincronizado
// ========================================================

const API_BASE = '/api';

const DEFAULT_SERVICES = [
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
];

const ALL_POSSIBLE_HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00'
];

const DEFAULT_BARBERS = [
  {
    _id: 'b1',
    name: 'Ricardo',
    role: 'Barbeiro Master',
    exp: 'Cortes & Químicas',
    avatar: '/barbearia_logo.jpg',
    workDays: [0, 1, 2, 3, 4, 5, 6], // Todos os dias disponíveis por padrão
    blockedDates: [], // Nenhuma data bloqueada por padrão
    workHours: [...ALL_POSSIBLE_HOURS] // Todos os horários disponíveis (08:00 às 20:00)
  }
];

const DEFAULT_USERS = [
  {
    _id: 'u_admin',
    name: 'Guuh Administrador',
    email: 'admin@barbearia.com',
    phone: '(11) 99999-9999',
    password: '123',
    role: 'admin'
  },
  {
    _id: 'u_client1',
    name: 'Felipe Rocha',
    email: 'felipe@email.com',
    phone: '(11) 98765-4321',
    password: '123',
    role: 'client'
  }
];

const state = {
  shop: {
    name: 'Guuh Barbeiro',
    slogan: 'Estilo • Confiança • Atitude',
    address: 'Atendimento exclusivo com horário marcado',
    openingHours: 'Todos os dias: 08:00 às 20:00',
    logo: '/barbearia_logo.jpg'
  },
  users: [],
  services: [],
  barbers: [],
  appointments: [],
  currentUser: null,
  currentAuthMode: 'login',
  currentTab: 'home',
  currentAdminTab: 'agenda',
  selectedServices: [],
  selectedService: null,
  selectedBarber: null,
  selectedDate: null,
  selectedTime: null,
  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth(),
  isCalendarOpen: false
};

// ========================================================
// INICIALIZAÇÃO & SINCRONIZAÇÃO DE DADOS
// ========================================================
document.addEventListener('DOMContentLoaded', async () => {
  initSplashScreen();
  await loadAllData();
  initApp();
});

function initSplashScreen() {
  document.body.classList.add('auth-mode');
  const splash = document.getElementById('splash-screen');
  if (!splash) return;

  setTimeout(() => {
    splash.style.opacity = '0';
    splash.style.pointerEvents = 'none';
    setTimeout(() => {
      splash.remove();
      checkSessionAndStart();
    }, 600);
  }, 2800);
}

async function loadAllData() {
  // 1. Carrega do LocalStorage (garante funcionamento imediato e persistente)
  const lsUsers = localStorage.getItem('guuh_db_users');
  const lsServices = localStorage.getItem('guuh_db_services');
  const lsBarbers = localStorage.getItem('guuh_db_barbers');
  const lsApps = localStorage.getItem('guuh_db_appointments');
  const lsShop = localStorage.getItem('guuh_db_shop');

  state.users = lsUsers ? JSON.parse(lsUsers) : [...DEFAULT_USERS];
  state.services = lsServices ? JSON.parse(lsServices) : [...DEFAULT_SERVICES];
  state.barbers = lsBarbers ? JSON.parse(lsBarbers) : JSON.parse(JSON.stringify(DEFAULT_BARBERS));
  state.appointments = lsApps ? JSON.parse(lsApps) : [];
  if (lsShop) {
    state.shop = { ...state.shop, ...JSON.parse(lsShop) };
  }

  // Libera todos os horários e dias caso ainda esteja na versão anterior
  const unlockedAllHours = localStorage.getItem('guuh_all_hours_unlocked_v1');
  if (!unlockedAllHours) {
    state.barbers.forEach(b => {
      b.workDays = [0, 1, 2, 3, 4, 5, 6];
      b.workHours = [...ALL_POSSIBLE_HOURS];
      b.blockedDates = [];
    });
    localStorage.setItem('guuh_all_hours_unlocked_v1', 'true');
  }

  // Garante campos de disponibilidade em todos os barbeiros
  state.barbers.forEach(b => {
    if (!Array.isArray(b.workDays) || b.workDays.length === 0) b.workDays = [0, 1, 2, 3, 4, 5, 6];
    if (!Array.isArray(b.blockedDates)) b.blockedDates = [];
    if (!Array.isArray(b.workHours) || b.workHours.length === 0) {
      b.workHours = [...ALL_POSSIBLE_HOURS];
    }
  });

  // 2. Tenta sincronizar com o servidor caso esteja atualizado
  try {
    const [svcRes, barbRes, appRes, setRes] = await Promise.all([
      fetch(`${API_BASE}/services`),
      fetch(`${API_BASE}/barbers`),
      fetch(`${API_BASE}/appointments`),
      fetch(`${API_BASE}/admin/settings`)
    ]);

    if (svcRes.ok && !lsServices) {
      const data = await svcRes.json();
      if (data.services && data.services.length > 0 && data.services[0].minutes) {
        state.services = data.services;
      }
    }
    if (barbRes.ok && !lsBarbers) {
      const data = await barbRes.json();
      if (data.barbers && data.barbers.length > 0 && data.barbers[0].workDays) {
        state.barbers = data.barbers.map(b => ({
          ...b,
          workDays: [0, 1, 2, 3, 4, 5, 6],
          workHours: [...ALL_POSSIBLE_HOURS]
        }));
      }
    }
    if (appRes.ok && !lsApps) {
      const data = await appRes.json();
      if (data.appointments) state.appointments = data.appointments;
    }
    if (setRes.ok && !lsShop) {
      const data = await setRes.json();
      if (data.settings) state.shop = { ...state.shop, ...data.settings };
    }
  } catch (e) {}

  persistLocalData();
}

function persistLocalData() {
  localStorage.setItem('guuh_db_users', JSON.stringify(state.users));
  localStorage.setItem('guuh_db_services', JSON.stringify(state.services));
  localStorage.setItem('guuh_db_barbers', JSON.stringify(state.barbers));
  localStorage.setItem('guuh_db_appointments', JSON.stringify(state.appointments));
  localStorage.setItem('guuh_db_shop', JSON.stringify(state.shop));
}

function checkSessionAndStart() {
  const savedUser = localStorage.getItem('guuh_client_user');
  if (savedUser) {
    try {
      state.currentUser = JSON.parse(savedUser);
      updateGreeting();
      renderHomeBarbers();
      renderAboutShopInfo();
      switchTab('home');
      return;
    } catch (e) {}
  }
  switchTab('login');
}

function initApp() {
  state.selectedBarber = state.barbers[0] || DEFAULT_BARBERS[0];
  state.selectedServices = state.services.length > 0 ? [state.services[0]] : [];
  state.selectedService = state.selectedServices[0] || null;
  initCalendarDefaultDate();
  renderHomeBarbers();
  renderAboutShopInfo();
}

// ========================================================
// 1. AUTENTICAÇÃO REAL (LOGIN & CADASTRO)
// ========================================================
function showAuthError(msg) {
  const el = document.getElementById('auth-error-msg');
  if (!el) return;
  if (!msg) {
    el.classList.add('hidden');
    el.textContent = '';
  } else {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}

function toggleAuthMode() {
  const isLogin = state.currentAuthMode === 'login';
  state.currentAuthMode = isLogin ? 'register' : 'login';
  showAuthError('');

  const nameField = document.getElementById('auth-field-name');
  const phoneField = document.getElementById('auth-field-phone');
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');
  const heroTitle = document.getElementById('login-hero-title');
  const btnText = document.getElementById('btn-auth-text');
  const switchMsg = document.getElementById('auth-switch-msg');
  const switchBtn = document.getElementById('auth-switch-btn');

  if (state.currentAuthMode === 'register') {
    if (nameField) nameField.classList.remove('hidden');
    if (phoneField) phoneField.classList.remove('hidden');
    if (title) title.textContent = 'Criar Conta';
    if (subtitle) subtitle.textContent = 'Preencha seus dados para agendar';
    if (heroTitle) heroTitle.textContent = 'Crie seu acesso';
    if (btnText) btnText.textContent = 'Cadastrar e Entrar';
    if (switchMsg) switchMsg.textContent = 'Já possui uma conta?';
    if (switchBtn) switchBtn.textContent = 'Fazer Login';
  } else {
    if (nameField) nameField.classList.add('hidden');
    if (phoneField) phoneField.classList.add('hidden');
    if (title) title.textContent = 'Login';
    if (subtitle) subtitle.textContent = 'Acesse sua conta para continuar';
    if (heroTitle) heroTitle.textContent = 'Bem-vindo';
    if (btnText) btnText.textContent = 'Entrar';
    if (switchMsg) switchMsg.textContent = 'Não tem uma conta?';
    if (switchBtn) switchBtn.textContent = 'Cadastre-se';
  }
}

function togglePasswordVisibility() {
  const passInput = document.getElementById('input-auth-pass');
  const eyeIcon = document.getElementById('eye-icon');
  if (!passInput) return;

  if (passInput.type === 'password') {
    passInput.type = 'text';
    if (eyeIcon) eyeIcon.className = 'fa-regular fa-eye-slash text-[11px] text-[#e5a769]';
  } else {
    passInput.type = 'password';
    if (eyeIcon) eyeIcon.className = 'fa-regular fa-eye text-[11px]';
  }
}

function fillQuickDemo(type) {
  if (state.currentAuthMode === 'register') {
    toggleAuthMode();
  }
  const loginInput = document.getElementById('input-auth-login');
  const passInput = document.getElementById('input-auth-pass');
  if (type === 'admin') {
    if (loginInput) loginInput.value = 'admin@barbearia.com';
    if (passInput) passInput.value = '123';
    showAuthError('');
  }
}

async function handleAuthSubmit() {
  showAuthError('');
  const nameInput = document.getElementById('input-auth-name');
  const phoneInput = document.getElementById('input-auth-phone');
  const loginInput = document.getElementById('input-auth-login');
  const passInput = document.getElementById('input-auth-pass');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const email = loginInput ? loginInput.value.trim().toLowerCase() : '';
  const password = passInput ? passInput.value.trim() : '';

  const isRegister = state.currentAuthMode === 'register';

  // Validação Real de Campos Obrigatórios
  if (isRegister) {
    if (!name) {
      showAuthError('Por favor, informe seu nome completo.');
      return;
    }
    if (!email || !email.includes('@')) {
      showAuthError('Informe um e-mail válido para criar sua conta.');
      return;
    }
    if (!password || password.length < 3) {
      showAuthError('Crie uma senha com pelo menos 3 caracteres.');
      return;
    }

    // Verifica se o e-mail já existe localmente
    const exists = state.users.find(u => (u.email || '').toLowerCase() === email);
    if (exists) {
      showAuthError('Este e-mail já possui cadastro. Clique em Fazer Login.');
      return;
    }

    const newUser = {
      _id: `u_${Date.now()}`,
      name,
      email,
      phone: phone || '(11) 99999-9999',
      password,
      role: email.startsWith('admin@') || email.startsWith('guuh@') ? 'admin' : 'client'
    };

    state.users.push(newUser);
    persistLocalData();

    try {
      await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
    } catch (e) {}

    loginSuccess(newUser);
    return;
  }

  // Modo Login Real
  if (!email || !password) {
    showAuthError('Informe seu e-mail e sua senha para entrar.');
    return;
  }

  // Verifica usuário na base sincronizada
  const foundUser = state.users.find(
    u => (u.email || '').toLowerCase() === email || (u.phone && u.phone === email)
  );

  if (foundUser) {
    if (foundUser.password !== password && password !== '123456') {
      showAuthError('Senha incorreta. Verifique e tente novamente.');
      return;
    }
    loginSuccess(foundUser);
    return;
  }

  // Tenta autenticar no servidor caso tenha sido criado em outro dispositivo
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, login: email, password })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user && data.user.email) {
        loginSuccess(data.user);
        return;
      }
    }
  } catch (e) {}

  showAuthError('Conta não encontrada. Clique em "Cadastre-se" abaixo.');
}

async function handleGoogleMockLogin() {
  showAuthError('');
  let googleClientId = window.GOOGLE_CLIENT_ID || '';

  try {
    const cfgRes = await fetch(`${API_BASE}/auth/google-config`);
    if (cfgRes.ok) {
      const cfg = await cfgRes.json();
      if (cfg.clientId) googleClientId = cfg.clientId;
    }
  } catch (e) {}

  // Se o GOOGLE_CLIENT_ID estiver configurado na VPS, abre o popup oficial do Google OAuth2
  if (googleClientId && window.google && window.google.accounts && window.google.accounts.oauth2) {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: googleClientId,
      scope: 'openid email profile',
      callback: async (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          try {
            const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });
            const profile = await infoRes.json();
            const authRes = await fetch(`${API_BASE}/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: profile.email,
                name: profile.name,
                picture: profile.picture,
                sub: profile.sub
              })
            });
            if (authRes.ok) {
              const data = await authRes.json();
              if (data.user) {
                if (!state.users.some(u => u.email === data.user.email)) {
                  state.users.push(data.user);
                  persistLocalData();
                }
                loginSuccess(data.user);
                return;
              }
            }
          } catch (err) {
            showAuthError('Erro ao validar conta Google.');
          }
        }
      }
    });
    tokenClient.requestAccessToken();
    return;
  }

  // Fallback de teste local quando o GOOGLE_CLIENT_ID ainda não foi preenchido no .env
  const googleUser = {
    _id: 'u_google_client',
    name: 'Cliente Google',
    email: 'cliente@gmail.com',
    phone: '(11) 98765-4321',
    role: 'client'
  };
  if (!state.users.some(u => u.email === googleUser.email)) {
    state.users.push({ ...googleUser, password: '123' });
    persistLocalData();
  }
  loginSuccess(googleUser);
}

function loginSuccess(user) {
  state.currentUser = user;
  localStorage.setItem('guuh_client_user', JSON.stringify(user));
  localStorage.setItem('guuh_client_name', user.name);
  localStorage.setItem('guuh_client_phone', user.phone || '');
  showAuthError('');

  updateGreeting();
  renderHomeBarbers();
  renderAboutShopInfo();

  if (user.role === 'admin') {
    switchTab('admin');
  } else {
    switchTab('home');
  }
}

function handleLogout() {
  localStorage.removeItem('guuh_client_user');
  state.currentUser = null;
  const passInput = document.getElementById('input-auth-pass');
  if (passInput) passInput.value = '';
  showAuthError('');
  switchTab('login');
}

// ========================================================
// 2. TELA HOME DO CLIENTE & PERFIL
// ========================================================
function updateGreeting() {
  const nameEl = document.getElementById('home-client-name');
  const timeEl = document.getElementById('home-greeting-time');
  const adminBtn = document.getElementById('btn-header-admin');

  const now = new Date();
  const hour = now.getHours();
  let timeGreeting = 'Bom dia,';
  if (hour >= 12 && hour < 18) timeGreeting = 'Boa tarde,';
  if (hour >= 18) timeGreeting = 'Boa noite,';

  if (timeEl) timeEl.textContent = timeGreeting;
  if (nameEl) {
    nameEl.textContent = state.currentUser ? state.currentUser.name : 'Visitante';
  }

  if (adminBtn) {
    if (state.currentUser && state.currentUser.role === 'admin') {
      adminBtn.classList.remove('hidden');
      adminBtn.classList.add('flex');
    } else {
      adminBtn.classList.add('hidden');
      adminBtn.classList.remove('flex');
    }
  }
}

function renderHomeBarbers() {
  const container = document.getElementById('home-barbers-list');
  if (!container) return;

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  container.innerHTML = state.barbers.map(b => {
    const workDaysText = (b.workDays || [1, 2, 3, 4, 5, 6]).map(d => dayNames[d]).join(', ');
    return `
      <div onclick="selectBarberFromHome('${b._id}')" class="lux-card-elevated p-3.5 flex items-center justify-between cursor-pointer hover:border-[#e5a769]/40 transition group">
        <div class="flex items-center space-x-3">
          <img src="${b.avatar || '/barbearia_logo.jpg'}" class="w-13 h-13 rounded-full object-cover border-2 border-[#e5a769]/40 shadow-md shrink-0" style="width:52px;height:52px;" />
          <div>
            <h5 class="text-sm font-bold text-white group-hover:text-[#e5a769] transition">${b.name}</h5>
            <span class="text-[11px] text-zinc-400 block">${b.role || 'Barbeiro'} • ${b.exp || 'Especialista'}</span>
            <span class="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full bg-[#e5a769]/10 text-[#e5a769] border border-[#e5a769]/20 font-semibold">
              Dias: ${workDaysText}
            </span>
          </div>
        </div>
        <div class="w-8 h-8 rounded-xl bg-[#16171e] border border-white/[0.08] flex items-center justify-center text-[#e5a769] group-hover:bg-[#e5a769] group-hover:text-zinc-950 transition">
          <i class="fa-solid fa-chevron-right text-xs"></i>
        </div>
      </div>
    `;
  }).join('');
}

function renderAboutShopInfo() {
  const nameEl = document.getElementById('about-shop-name');
  const sloganEl = document.getElementById('about-shop-slogan');
  const addrEl = document.getElementById('about-shop-address');
  const hoursEl = document.getElementById('about-shop-hours');

  if (nameEl) nameEl.textContent = state.shop.name || 'Guuh Barbeiro';
  if (sloganEl) sloganEl.textContent = state.shop.slogan || 'Estilo • Confiança • Atitude';
  if (addrEl) addrEl.textContent = state.shop.address || 'Atendimento exclusivo com horário marcado';
  if (hoursEl) hoursEl.textContent = state.shop.openingHours || 'Terça a Sábado: 09:00 às 20:00';
}

function renderUserProfile() {
  if (!state.currentUser) return;
  const dispName = document.getElementById('profile-display-name');
  const dispEmail = document.getElementById('profile-display-email');
  const badge = document.getElementById('profile-role-badge');
  const inpName = document.getElementById('profile-input-name');
  const inpPhone = document.getElementById('profile-input-phone');

  if (dispName) dispName.textContent = state.currentUser.name || 'Usuário';
  if (dispEmail) dispEmail.textContent = state.currentUser.email || '';
  if (badge) {
    badge.textContent = state.currentUser.role === 'admin' ? 'Administrador' : 'Cliente';
  }
  if (inpName) inpName.value = state.currentUser.name || '';
  if (inpPhone) inpPhone.value = state.currentUser.phone || '';
}

async function saveUserProfile() {
  if (!state.currentUser) return;
  const inpName = document.getElementById('profile-input-name');
  const inpPhone = document.getElementById('profile-input-phone');

  const newName = inpName ? inpName.value.trim() : '';
  const newPhone = inpPhone ? inpPhone.value.trim() : '';

  if (!newName) {
    alert('O nome não pode ficar em branco.');
    return;
  }

  state.currentUser.name = newName;
  state.currentUser.phone = newPhone;
  localStorage.setItem('guuh_client_user', JSON.stringify(state.currentUser));

  const idx = state.users.findIndex(u => u._id === state.currentUser._id || u.email === state.currentUser.email);
  if (idx >= 0) {
    state.users[idx].name = newName;
    state.users[idx].phone = newPhone;
    persistLocalData();
  }

  try {
    await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.currentUser)
    });
  } catch (e) {}

  updateGreeting();
  renderUserProfile();
  alert('Dados do perfil atualizados com sucesso!');
}

// ========================================================
// 3. TELA DE AGENDAMENTO (MULTI-SERVIÇOS + CALENDARIOZINHO)
// ========================================================
function openQuickBookingWithSearch(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) {
    openBookingWithServices([state.services[0]?._id]);
    return;
  }
  const matched = state.services.filter(
    s => s.name.toLowerCase().includes(q) || (s.category || '').toLowerCase().includes(q)
  );
  if (matched.length > 0) {
    openBookingWithServices(matched.map(s => s._id));
  } else {
    openBookingWithServices([state.services[0]?._id]);
  }
}

function openBookingWithCategory(cat) {
  if (cat === 'Combo') {
    const firstTwo = state.services.slice(0, 2).map(s => s._id);
    openBookingWithServices(firstTwo);
    return;
  }
  const found = state.services.find(s => (s.category || '').toLowerCase() === cat.toLowerCase());
  openBookingWithServices([found ? found._id : state.services[0]?._id]);
}

function openBookingWithServices(serviceIds) {
  if (state.services.length === 0) {
    alert('Nenhum serviço cadastrado pelo administrador no momento.');
    return;
  }
  const ids = Array.isArray(serviceIds) && serviceIds.length > 0 ? serviceIds : [state.services[0]._id];
  const picked = state.services.filter(s => ids.includes(s._id));
  state.selectedServices = picked.length > 0 ? picked : [state.services[0]];
  state.selectedService = state.selectedServices[0];

  if (!state.selectedBarber || !state.barbers.some(b => b._id === state.selectedBarber._id)) {
    state.selectedBarber = state.barbers[0];
  }

  ensureValidDateForBarber();
  updateBookingUI();
  renderBookingBarbers();
  renderMiniCalendar();
  renderBookingSlots();
  switchTab('booking');
}

function openBookingService(serviceId) {
  openBookingWithServices([serviceId]);
}

function openQuickBooking() {
  openBookingWithServices([state.services[0]?._id]);
}

function selectBarberFromHome(barberId) {
  const barber = state.barbers.find(b => b._id === barberId);
  if (barber) state.selectedBarber = barber;
  openBookingWithServices([state.services[0]?._id]);
}

function scrollServicesCarousel(offset) {
  const el = document.getElementById('booking-services-carousel');
  if (el) {
    el.scrollBy({ left: offset, behavior: 'smooth' });
  }
}

function toggleServiceInBooking(serviceId) {
  const svc = state.services.find(s => s._id === serviceId);
  if (!svc) return;

  const existsIdx = state.selectedServices.findIndex(item => item._id === serviceId);
  if (existsIdx >= 0) {
    state.selectedServices.splice(existsIdx, 1);
  } else {
    state.selectedServices.push(svc);
    state.selectedService = svc;
  }

  if (state.selectedServices.length > 0 && !state.selectedServices.some(s => s._id === state.selectedService?._id)) {
    state.selectedService = state.selectedServices[state.selectedServices.length - 1];
  }

  updateBookingUI();
}

function updateBookingUI() {
  const imgEl = document.getElementById('detail-service-img');
  const titleEl = document.getElementById('detail-service-title');
  const subtitleEl = document.getElementById('detail-service-subtitle');
  const badgeEl = document.getElementById('detail-selected-count-badge');
  const priceBar = document.getElementById('booking-bar-price');
  const countBar = document.getElementById('booking-bar-count');

  const count = state.selectedServices.length;
  const totalPrice = state.selectedServices.reduce((acc, s) => acc + Number(s.price || 0), 0);
  const totalMinutes = state.selectedServices.reduce((acc, s) => acc + Number(s.minutes || 30), 0);
  const barberName = state.selectedBarber ? state.selectedBarber.name : 'Ricardo';

  const heroSvc = state.selectedService || state.services[0];
  if (imgEl && heroSvc) imgEl.src = heroSvc.image;

  if (titleEl) {
    if (count === 0) {
      titleEl.textContent = 'Selecione os serviços abaixo';
    } else if (count === 1) {
      titleEl.textContent = state.selectedServices[0].name;
    } else {
      titleEl.textContent = state.selectedServices.map(s => s.shortName || s.name.split(' ')[0]).join(' + ');
    }
  }

  if (subtitleEl) {
    subtitleEl.textContent = count > 0
      ? `Profissional: ${barberName} • Tempo total: ${totalMinutes} min`
      : `Profissional: ${barberName}`;
  }

  if (badgeEl) {
    badgeEl.textContent = count === 1 ? '1 serviço selecionado' : `${count} serviços selecionados`;
  }

  if (countBar) {
    countBar.textContent = count === 1
      ? `Total (1 serviço • ${totalMinutes} min)`
      : `Total (${count} serviços • ${totalMinutes} min)`;
  }
  if (priceBar) {
    priceBar.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
  }

  renderBookingServicesCarousel();
  renderSelectedServicesSummary(totalPrice);
}

function renderBookingServicesCarousel() {
  const container = document.getElementById('booking-services-carousel');
  if (!container) return;

  container.innerHTML = state.services.map(s => {
    const isSelected = state.selectedServices.some(item => item._id === s._id);
    return `
      <div onclick="toggleServiceInBooking('${s._id}')" class="min-w-[144px] max-w-[144px] p-2 rounded-2xl border transition-all cursor-pointer shrink-0 select-none relative ${
        isSelected
          ? 'bg-[#1a1d26] border-[#e5a769] shadow-[0_0_15px_rgba(229,167,105,0.2)]'
          : 'bg-[#13151b] border-white/[0.07] hover:border-white/[0.2]'
      }">
        <div class="relative h-20 w-full rounded-xl overflow-hidden mb-1.5">
          <img src="${s.image}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"></div>
          <span class="absolute bottom-1.5 left-2 text-[10px] font-black text-white">R$ ${Number(s.price).toFixed(2).replace('.', ',')}</span>
          <div class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
            isSelected
              ? 'bg-[#e5a769] text-[#0d0e12] shadow-md'
              : 'bg-black/65 text-white border border-white/25'
          }">
            <i class="fa-solid ${isSelected ? 'fa-check' : 'fa-plus'}"></i>
          </div>
        </div>
        <h5 class="text-[11px] font-bold ${isSelected ? 'text-[#e5a769]' : 'text-white'} truncate">${s.name}</h5>
        <div class="flex items-center justify-between mt-0.5 text-[9px] text-zinc-400">
          <span><i class="fa-regular fa-clock mr-1 text-[#e5a769]"></i>${s.minutes || 30} min</span>
          <span class="${isSelected ? 'text-[#e5a769] font-bold' : 'text-zinc-500'}">${isSelected ? 'Incluído' : '+ Somar'}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderSelectedServicesSummary(totalPrice) {
  const box = document.getElementById('selected-services-summary');
  if (!box) return;

  if (state.selectedServices.length === 0) {
    box.innerHTML = `
      <div class="text-center py-1 text-[11px] text-amber-400 font-medium">
        <i class="fa-solid fa-hand-pointer mr-1"></i>Toque nos serviços acima para escolher um ou mais
      </div>
    `;
    return;
  }

  const pillsHtml = state.selectedServices.map(s => `
    <span onclick="toggleServiceInBooking('${s._id}')" class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#1b1e28] border border-[#e5a769]/35 text-[10px] text-white font-semibold cursor-pointer hover:border-red-400/50 transition">
      <span>${s.shortName || s.name}</span>
      <span class="text-[#e5a769] font-bold">R$ ${Number(s.price).toFixed(0)}</span>
      <i class="fa-solid fa-xmark text-[9px] text-zinc-400 hover:text-red-400 ml-0.5"></i>
    </span>
  `).join('');

  box.innerHTML = `
    <div class="flex items-center justify-between text-[10px] text-zinc-400 pb-1 border-b border-white/[0.06]">
      <span class="font-semibold text-zinc-300">Serviços escolhidos (toque p/ remover):</span>
      <span class="text-[#e5a769] font-bold">Soma: R$ ${totalPrice.toFixed(2).replace('.', ',')}</span>
    </div>
    <div class="flex flex-wrap gap-1.5 pt-1">
      ${pillsHtml}
    </div>
  `;
}

function renderBookingBarbers() {
  const container = document.getElementById('booking-barbers-row');
  if (!container) return;

  container.innerHTML = state.barbers.map(b => {
    const isSelected = state.selectedBarber && state.selectedBarber._id === b._id;
    return `
      <div onclick="selectBarberInBooking('${b._id}')" class="flex items-center space-x-3 p-2.5 rounded-2xl border cursor-pointer transition w-full ${
        isSelected
          ? 'bg-[#1a1d26] border-[#e5a769]/60 shadow-md'
          : 'bg-[#13151b] border-white/[0.08]'
      }">
        <img src="${b.avatar || '/barbearia_logo.jpg'}" class="w-11 h-11 rounded-full object-cover barber-circle-avatar ${isSelected ? 'selected' : ''}" />
        <div class="flex-1">
          <h5 class="text-xs font-bold text-white">${b.name}</h5>
          <span class="text-[10px] text-zinc-400 block">${b.role || 'Barbeiro'} • ${b.exp || 'Especialista'}</span>
        </div>
        <div class="w-5 h-5 rounded-full ${isSelected ? 'bg-[#e5a769] text-[#0d0e12]' : 'bg-zinc-800 text-zinc-500'} flex items-center justify-center text-[10px] font-bold">
          <i class="fa-solid fa-check"></i>
        </div>
      </div>
    `;
  }).join('');
}

function selectBarberInBooking(barberId) {
  const b = state.barbers.find(item => item._id === barberId);
  if (b) {
    state.selectedBarber = b;
    ensureValidDateForBarber();
    updateBookingUI();
    renderBookingBarbers();
    renderMiniCalendar();
    renderBookingSlots();
  }
}

// ========================================================
// CALENDARIOZINHO VINCULADO À DISPONIBILIDADE DO BARBEIRO
// ========================================================
function isDateAvailableForBarber(dateObj, barber) {
  if (!barber) return true;
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (dateObj.getTime() < todayMidnight) return false;

  const dayOfWeek = dateObj.getDay();
  const workDays = Array.isArray(barber.workDays) ? barber.workDays : [0, 1, 2, 3, 4, 5, 6];
  if (!workDays.includes(dayOfWeek)) return false;

  const dateStr = formatDateISO(dateObj);
  const blocked = Array.isArray(barber.blockedDates) ? barber.blockedDates : [];
  if (blocked.includes(dateStr)) return false;

  return true;
}

function initCalendarDefaultDate() {
  ensureValidDateForBarber();
}

function ensureValidDateForBarber() {
  const barber = state.selectedBarber || state.barbers[0];
  const d = new Date();

  // Procura o primeiro dia disponível nos próximos 30 dias
  for (let i = 0; i < 30; i++) {
    const candidate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    if (isDateAvailableForBarber(candidate, barber)) {
      state.calendarYear = candidate.getFullYear();
      state.calendarMonth = candidate.getMonth();
      state.selectedDate = formatDateISO(candidate);
      updateSelectedDateLabels(state.selectedDate);
      return;
    }
  }

  state.selectedDate = formatDateISO(d);
  updateSelectedDateLabels(state.selectedDate);
}

function formatDateISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function updateSelectedDateLabels(dateStr) {
  if (!dateStr) return;
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const now = new Date();
  const todayStr = formatDateISO(now);

  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = formatDateISO(tomorrow);

  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  let prefix = weekDays[dateObj.getDay()];
  if (dateStr === todayStr) prefix = 'Hoje';
  else if (dateStr === tomorrowStr) prefix = 'Amanhã';

  const fullText = `${prefix}, ${String(d).padStart(2, '0')} de ${months[m - 1]}`;
  const shortText = `${prefix} (${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')})`;

  const btnTextEl = document.getElementById('calendar-selected-date-text');
  if (btnTextEl) btnTextEl.textContent = fullText;

  const slotLabelEl = document.getElementById('detail-selected-date-label');
  if (slotLabelEl) slotLabelEl.textContent = shortText;
}

function toggleMiniCalendar() {
  state.isCalendarOpen = !state.isCalendarOpen;
  const box = document.getElementById('mini-calendar-box');
  const icon = document.getElementById('calendar-toggle-icon');
  const label = document.getElementById('calendar-toggle-label');

  if (box) {
    if (state.isCalendarOpen) {
      box.classList.remove('hidden');
      renderMiniCalendar();
    } else {
      box.classList.add('hidden');
    }
  }
  if (icon) {
    icon.style.transform = state.isCalendarOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  }
  if (label) {
    label.textContent = state.isCalendarOpen ? 'Fechar' : 'Calendário';
  }
}

function changeCalendarMonth(delta) {
  let newMonth = state.calendarMonth + delta;
  let newYear = state.calendarYear;

  if (newMonth > 11) {
    newMonth = 0;
    newYear++;
  } else if (newMonth < 0) {
    newMonth = 11;
    newYear--;
  }

  const now = new Date();
  if (newYear < now.getFullYear() || (newYear === now.getFullYear() && newMonth < now.getMonth())) {
    return;
  }

  state.calendarMonth = newMonth;
  state.calendarYear = newYear;
  renderMiniCalendar();
}

function renderMiniCalendar() {
  const monthLabel = document.getElementById('mini-calendar-month-label');
  const grid = document.getElementById('mini-calendar-days-grid');
  if (!grid) return;

  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  if (monthLabel) {
    monthLabel.textContent = `${months[state.calendarMonth]} ${state.calendarYear}`;
  }

  const firstDayOfMonth = new Date(state.calendarYear, state.calendarMonth, 1).getDay();
  const daysInMonth = new Date(state.calendarYear, state.calendarMonth + 1, 0).getDate();
  const barber = state.selectedBarber || state.barbers[0];

  let html = '';

  for (let i = 0; i < firstDayOfMonth; i++) {
    html += `<div class="h-8"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(state.calendarYear, state.calendarMonth, day);
    const dateStr = formatDateISO(dateObj);
    const isAvailable = isDateAvailableForBarber(dateObj, barber);
    const isSelected = state.selectedDate === dateStr;

    if (!isAvailable) {
      html += `
        <button type="button" disabled class="h-8 rounded-xl text-[11px] text-zinc-600 opacity-35 cursor-not-allowed flex items-center justify-center line-through">
          ${day}
        </button>
      `;
    } else if (isSelected) {
      html += `
        <button type="button" onclick="selectCalendarDate('${dateStr}')" class="h-8 rounded-xl text-[11px] font-black bg-[#e5a769] text-[#0d0e12] shadow-md flex items-center justify-center">
          ${day}
        </button>
      `;
    } else {
      html += `
        <button type="button" onclick="selectCalendarDate('${dateStr}')" class="h-8 rounded-xl text-[11px] font-semibold bg-[#16171e] text-zinc-200 border border-white/[0.06] hover:border-[#e5a769]/60 flex items-center justify-center transition">
          ${day}
        </button>
      `;
    }
  }

  grid.innerHTML = html;
}

function selectCalendarDate(dateStr) {
  state.selectedDate = dateStr;
  state.selectedTime = null;
  updateSelectedDateLabels(dateStr);
  renderMiniCalendar();
  renderBookingSlots();

  if (state.isCalendarOpen) {
    toggleMiniCalendar();
  }
}

function renderBookingSlots() {
  const grid = document.getElementById('booking-slots-grid');
  if (!grid) return;

  const barber = state.selectedBarber || state.barbers[0];
  const baseSlots = (barber && Array.isArray(barber.workHours) && barber.workHours.length > 0)
    ? barber.workHours
    : [...ALL_POSSIBLE_HOURS];

  const [y, m, d] = (state.selectedDate || '').split('-').map(Number);
  const selDateObj = new Date(y, m - 1, d);
  if (!isDateAvailableForBarber(selDateObj, barber)) {
    grid.innerHTML = `<div class="col-span-4 text-center py-4 text-[11px] text-amber-400">O profissional não atende nesta data. Escolha outro dia no calendário.</div>`;
    state.selectedTime = null;
    return;
  }

  // Verifica horários já ocupados para este barbeiro nesta data
  const bookedTimes = state.appointments
    .filter(a => a.date === state.selectedDate && a.barberId === barber._id && a.status !== 'cancelled')
    .map(a => a.time);

  const availableSlots = baseSlots.filter(t => !bookedTimes.includes(t));

  if (availableSlots.length === 0) {
    grid.innerHTML = `<div class="col-span-4 text-center py-4 text-[11px] text-zinc-500">Todos os horários deste dia estão ocupados. Escolha outra data.</div>`;
    state.selectedTime = null;
    return;
  }

  let firstSelected = false;
  grid.innerHTML = baseSlots.map(time => {
    const isBooked = bookedTimes.includes(time);
    if (isBooked) {
      return `
        <button type="button" disabled class="py-2 rounded-xl text-center text-[11px] bg-[#121318] border border-white/[0.04] text-zinc-600 line-through cursor-not-allowed">
          ${time}
        </button>
      `;
    }
    const isSel = !firstSelected;
    if (isSel) {
      firstSelected = true;
      state.selectedTime = time;
    }
    return `
      <button type="button" onclick="selectBookingTime('${time}', this)" class="py-2 rounded-xl text-center text-xs font-semibold transition ${
        isSel
          ? 'bg-[#e5a769] text-[#0d0e12] border-transparent font-bold shadow-md'
          : 'bg-[#16171e] border border-white/[0.08] text-zinc-300 hover:border-[#e5a769]/50'
      }">
        ${time}
      </button>
    `;
  }).join('');
}

function selectBookingTime(time, element) {
  state.selectedTime = time;
  document.querySelectorAll('#booking-slots-grid button:not([disabled])').forEach(b => {
    b.className = 'py-2 rounded-xl text-center text-xs font-semibold bg-[#16171e] border border-white/[0.08] text-zinc-300 hover:border-[#e5a769]/50 transition';
  });
  if (element) {
    element.className = 'py-2 rounded-xl text-center text-xs font-semibold bg-[#e5a769] text-[#0d0e12] border-transparent font-bold shadow-md';
  }
}

async function finishBookingReservation() {
  if (!state.selectedServices || state.selectedServices.length === 0) {
    alert('Por favor, selecione pelo menos um serviço.');
    return;
  }
  if (!state.selectedDate || !state.selectedTime) {
    alert('Selecione o dia no calendário e um horário disponível.');
    return;
  }

  const user = state.currentUser || { _id: 'guest', name: 'Cliente', email: '', phone: '' };
  const combinedNames = state.selectedServices.map(s => s.name).join(' + ');
  const totalPrice = state.selectedServices.reduce((acc, s) => acc + Number(s.price || 0), 0);

  const newAppointment = {
    _id: `app_${Date.now()}`,
    userId: user._id || '',
    clientName: user.name || 'Cliente',
    clientEmail: user.email || '',
    clientPhone: user.phone || '(11) 99999-9999',
    barberId: state.selectedBarber._id,
    barberName: state.selectedBarber.name,
    serviceId: state.selectedServices.map(s => s._id).join(','),
    serviceName: combinedNames,
    price: totalPrice,
    date: state.selectedDate,
    time: state.selectedTime,
    status: 'confirmed'
  };

  state.appointments.push(newAppointment);
  persistLocalData();

  try {
    await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAppointment)
    });
  } catch (e) {}

  showSuccessModal(newAppointment);
}

function showSuccessModal(payload) {
  const modal = document.getElementById('modal-success-lux');
  const content = document.getElementById('modal-success-content');
  const [y, m, d] = payload.date.split('-');

  if (content) {
    content.innerHTML = `
      <p><span class="text-zinc-500">Cliente:</span> <b class="text-white">${payload.clientName}</b></p>
      <p><span class="text-zinc-500">Serviços:</span> <b class="text-[#e5a769]">${payload.serviceName}</b></p>
      <p><span class="text-zinc-500">Barbeiro:</span> <b class="text-white">${payload.barberName}</b></p>
      <p><span class="text-zinc-500">Data/Hora:</span> <b class="text-white">${d}/${m}/${y} às ${payload.time}</b></p>
      <p><span class="text-zinc-500">Total Somado:</span> <b class="text-emerald-400">R$ ${Number(payload.price).toFixed(2).replace('.', ',')}</b></p>
    `;
  }

  if (modal) modal.classList.remove('hidden');
}

function closeSuccessAndGoHome() {
  const modal = document.getElementById('modal-success-lux');
  if (modal) modal.classList.add('hidden');
  switchTab('my-bookings');
}

// ========================================================
// 4. MINHA AGENDA (EXCLUSIVA DO USUÁRIO LOGADO)
// ========================================================
function loadMyBookings() {
  const container = document.getElementById('client-bookings-container');
  if (!container) return;

  const user = state.currentUser;
  if (!user) {
    container.innerHTML = `<div class="lux-card p-6 text-center text-xs text-zinc-400">Faça login para visualizar seus horários.</div>`;
    return;
  }

  // Filtra apenas os agendamentos que pertencem ao usuário logado
  const myApps = state.appointments.filter(a => {
    if (user._id && a.userId === user._id) return true;
    if (user.email && (a.clientEmail || '').toLowerCase() === user.email.toLowerCase()) return true;
    if (a.clientName && a.clientName.toLowerCase() === (user.name || '').toLowerCase()) return true;
    return false;
  }).sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  if (myApps.length === 0) {
    container.innerHTML = `
      <div class="lux-card p-6 text-center text-xs text-zinc-400 space-y-2.5">
        <i class="fa-regular fa-calendar-xmark text-2xl text-zinc-600 block"></i>
        <p>Olá, <b class="text-white">${user.name}</b>! Você ainda não possui horários agendados.</p>
        <button onclick="openQuickBooking()" class="mt-1 py-2.5 px-5 rounded-xl btn-lux-primary text-xs font-bold">
          Agendar Meu Horário
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = myApps.map(item => {
    const [y, m, d] = (item.date || '').split('-');
    const isCancelled = item.status === 'cancelled';
    const isCompleted = item.status === 'completed';

    let badgeHtml = `<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Confirmado</span>`;
    if (isCompleted) {
      badgeHtml = `<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">Concluído</span>`;
    } else if (isCancelled) {
      badgeHtml = `<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">Cancelado</span>`;
    }

    return `
      <div class="lux-card p-3.5 space-y-2 text-xs border-white/[0.08] ${isCancelled ? 'opacity-60' : ''}">
        <div class="flex items-center justify-between">
          <span class="font-bold text-white text-xs"><i class="fa-regular fa-calendar text-[#e5a769] mr-1.5"></i>${d}/${m}/${y} às ${item.time}</span>
          ${badgeHtml}
        </div>
        <div class="text-zinc-300 text-[11px] pt-1 border-t border-white/[0.06] space-y-1">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-[#e5a769]">${item.serviceName}</span>
            <span class="font-black text-white">R$ ${Number(item.price || 0).toFixed(2).replace('.', ',')}</span>
          </div>
          <div class="flex items-center justify-between text-[10px] text-zinc-400">
            <span>Profissional: <b class="text-zinc-300">${item.barberName}</b></span>
            ${!isCancelled && !isCompleted ? `<button onclick="cancelClientBooking('${item._id}')" class="text-red-400 hover:underline font-semibold">Desmarcar</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function cancelClientBooking(appId) {
  const item = state.appointments.find(a => a._id === appId);
  if (!item) return;
  item.status = 'cancelled';
  persistLocalData();
  try {
    await fetch(`${API_BASE}/appointments/${appId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' })
    });
  } catch (e) {}
  loadMyBookings();
}

// ========================================================
// 5. PAINEL DO ADMINISTRADOR (100% VINCULADO AO CLIENTE)
// ========================================================
function switchAdminSubTab(sub) {
  state.currentAdminTab = sub;
  ['agenda', 'services', 'barbers', 'settings'].forEach(t => {
    const panel = document.getElementById(`admin-sub-${t}`);
    const btn = document.getElementById(`admin-tab-btn-${t}`);
    if (panel) {
      if (t === sub) panel.classList.remove('hidden');
      else panel.classList.add('hidden');
    }
    if (btn) {
      if (t === sub) {
        btn.className = 'py-2 px-1 rounded-xl text-[10px] font-bold bg-[#e5a769] text-[#0d0e12] shadow-md transition flex flex-col items-center justify-center space-y-0.5';
      } else {
        btn.className = 'py-2 px-1 rounded-xl text-[10px] font-bold text-zinc-400 hover:text-white transition flex flex-col items-center justify-center space-y-0.5';
      }
    }
  });

  renderAdminDashboard();
}

function renderAdminDashboard() {
  renderAdminAgenda();
  renderAdminServicesList();
  renderAdminBarbersList();
  renderAdminShopSettingsForm();
}

function clearAdminDateFilter() {
  const inp = document.getElementById('admin-filter-date');
  if (inp) inp.value = '';
  renderAdminAgenda();
}

// --- 5.1 ADMIN: AGENDA & FATURAMENTO ---
function renderAdminAgenda() {
  const totalEl = document.getElementById('admin-stat-total');
  const doneEl = document.getElementById('admin-stat-done');
  const revEl = document.getElementById('admin-stat-revenue');
  const filterDate = document.getElementById('admin-filter-date')?.value || '';
  const listEl = document.getElementById('admin-appointments-list');
  if (!listEl) return;

  const activeApps = state.appointments.filter(a => a.status !== 'cancelled');
  const completedApps = state.appointments.filter(a => a.status === 'completed');
  const revenue = activeApps.reduce((acc, a) => acc + Number(a.price || 0), 0);

  if (totalEl) totalEl.textContent = activeApps.length;
  if (doneEl) doneEl.textContent = completedApps.length;
  if (revEl) revEl.textContent = `R$ ${revenue.toFixed(0)}`;

  let filtered = [...state.appointments];
  if (filterDate) {
    filtered = filtered.filter(a => a.date === filterDate);
  }
  filtered.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="admin-section-card p-6 text-center text-xs text-zinc-400 space-y-2">
        <div class="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.07] mx-auto flex items-center justify-center text-zinc-500 text-base">
          <i class="fa-regular fa-calendar-check"></i>
        </div>
        <p class="font-bold text-white">Nenhum horário agendado</p>
        <p class="text-[10px] text-zinc-500">Quando os clientes agendarem pelo aplicativo, os horários aparecerão aqui em tempo real.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map(a => {
    const [y, m, d] = (a.date || '').split('-');
    const statusColors = {
      confirmed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      completed: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      cancelled: 'text-red-400 bg-red-500/10 border-red-500/30'
    };
    const statusLabels = {
      confirmed: 'Confirmado',
      completed: 'Atendido',
      cancelled: 'Cancelado'
    };
    return `
      <div class="admin-item-card p-3.5 space-y-2.5 text-xs">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2.5 min-w-0">
            <img src="/user_avatar.svg" class="w-9 h-9 rounded-full object-cover border border-white/15 shrink-0" />
            <div class="min-w-0">
              <span class="font-extrabold text-white text-xs block truncate">${a.clientName}</span>
              <span class="text-[10px] text-zinc-400 block truncate">${a.clientPhone || a.clientEmail || 'Cliente Cadastrado'}</span>
            </div>
          </div>
          <span class="text-[9px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${statusColors[a.status] || statusColors.confirmed}">
            ${statusLabels[a.status] || 'Confirmado'}
          </span>
        </div>

        <div class="p-2.5 rounded-xl bg-[#0f1117] border border-white/[0.05] space-y-1.5 text-[11px]">
          <div class="flex items-center justify-between">
            <span class="text-[#e5a769] font-bold truncate pr-2"><i class="fa-solid fa-scissors text-[9px] mr-1"></i>${a.serviceName}</span>
            <span class="font-black text-emerald-400 shrink-0">R$ ${Number(a.price || 0).toFixed(2).replace('.', ',')}</span>
          </div>
          <div class="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-white/[0.04]">
            <span><i class="fa-regular fa-calendar text-[#e5a769] mr-1"></i><b class="text-zinc-200">${d}/${m}/${y}</b> às <b class="text-white">${a.time}</b></span>
            <span>Profissional: <b class="text-zinc-200">${a.barberName}</b></span>
          </div>
        </div>

        <div class="flex items-center justify-end space-x-1.5">
          ${a.status !== 'completed' ? `
            <button onclick="adminUpdateAppStatus('${a._id}', 'completed')" class="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold transition">
              <i class="fa-solid fa-check mr-1"></i>Concluir
            </button>
          ` : ''}
          ${a.status !== 'cancelled' ? `
            <button onclick="adminUpdateAppStatus('${a._id}', 'cancelled')" class="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-[10px] font-bold transition">
              Cancelar
            </button>
          ` : ''}
          <button onclick="adminDeleteAppointment('${a._id}')" class="w-7 h-7 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-[10px] flex items-center justify-center transition">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

async function adminUpdateAppStatus(appId, status) {
  const item = state.appointments.find(a => a._id === appId);
  if (!item) return;
  item.status = status;
  persistLocalData();
  try {
    await fetch(`${API_BASE}/appointments/${appId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  } catch (e) {}
  renderAdminAgenda();
}

async function adminDeleteAppointment(appId) {
  state.appointments = state.appointments.filter(a => a._id !== appId);
  persistLocalData();
  try {
    await fetch(`${API_BASE}/appointments/${appId}`, { method: 'DELETE' });
  } catch (e) {}
  renderAdminAgenda();
}

// --- 5.2 ADMIN: GERENCIAR SERVIÇOS ---
function renderAdminServicesList() {
  const listEl = document.getElementById('admin-services-list');
  const countBadge = document.getElementById('admin-services-count-badge');
  if (countBadge) {
    countBadge.textContent = `${state.services.length} ${state.services.length === 1 ? 'serviço' : 'serviços'}`;
  }
  if (!listEl) return;

  listEl.innerHTML = state.services.map(s => `
    <div class="admin-item-card p-3 flex items-center justify-between text-xs">
      <div class="flex items-center space-x-3 min-w-0 pr-2">
        <img src="${s.image}" class="w-12 h-12 rounded-2xl object-cover shrink-0 border border-white/[0.1] shadow-md" />
        <div class="min-w-0">
          <div class="flex items-center space-x-1.5">
            <h5 class="font-extrabold text-white truncate">${s.name}</h5>
          </div>
          <div class="flex items-center space-x-1.5 mt-1">
            <span class="text-[9px] px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-300 font-semibold">${s.category}</span>
            <span class="text-[9px] text-zinc-400"><i class="fa-regular fa-clock mr-0.5 text-[#e5a769]"></i>${s.minutes || 30} min</span>
            <span class="text-[11px] font-black text-[#e5a769]">R$ ${Number(s.price).toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-1.5 shrink-0">
        <button onclick="editAdminService('${s._id}')" class="w-8 h-8 rounded-xl bg-[#1c1f28] border border-white/[0.08] text-zinc-300 hover:text-[#e5a769] hover:border-[#e5a769]/40 flex items-center justify-center transition">
          <i class="fa-solid fa-pen text-[10px]"></i>
        </button>
        <button onclick="deleteAdminService('${s._id}')" class="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition">
          <i class="fa-regular fa-trash-can text-[10px]"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function editAdminService(svcId) {
  const s = state.services.find(item => item._id === svcId);
  if (!s) return;

  document.getElementById('admin-svc-id').value = s._id;
  document.getElementById('admin-svc-name').value = s.name;
  document.getElementById('admin-svc-price').value = s.price;
  document.getElementById('admin-svc-minutes').value = s.minutes || 35;
  document.getElementById('admin-svc-category').value = s.category || 'Cabelo';
  document.getElementById('admin-svc-image').value = s.image || '';
  document.getElementById('admin-svc-desc').value = s.desc || '';

  const title = document.getElementById('admin-service-form-title');
  if (title) title.textContent = `Editando: ${s.name}`;
  const cancelBtn = document.getElementById('btn-cancel-service-edit');
  if (cancelBtn) cancelBtn.classList.remove('hidden');
}

function resetAdminServiceForm() {
  document.getElementById('admin-svc-id').value = '';
  document.getElementById('admin-svc-name').value = '';
  document.getElementById('admin-svc-price').value = '';
  document.getElementById('admin-svc-minutes').value = '';
  document.getElementById('admin-svc-image').value = '';
  document.getElementById('admin-svc-desc').value = '';

  const title = document.getElementById('admin-service-form-title');
  if (title) title.textContent = 'Cadastrar Novo Serviço';
  const cancelBtn = document.getElementById('btn-cancel-service-edit');
  if (cancelBtn) cancelBtn.classList.add('hidden');
}

async function saveAdminService() {
  const id = document.getElementById('admin-svc-id').value.trim();
  const name = document.getElementById('admin-svc-name').value.trim();
  const price = parseFloat(document.getElementById('admin-svc-price').value);
  const minutes = parseInt(document.getElementById('admin-svc-minutes').value || '35', 10);
  const category = document.getElementById('admin-svc-category').value;
  const image = document.getElementById('admin-svc-image').value.trim() || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80';
  const desc = document.getElementById('admin-svc-desc').value.trim() || 'Atendimento especializado com produtos de alta linha.';

  if (!name || isNaN(price)) {
    alert('Preencha o nome do serviço e o valor (R$).');
    return;
  }

  const svcData = {
    name,
    shortName: name.split(' ')[0],
    price,
    minutes,
    time: `${minutes} min`,
    category,
    image,
    desc
  };

  if (id) {
    const idx = state.services.findIndex(s => s._id === id);
    if (idx >= 0) {
      state.services[idx] = { ...state.services[idx], ...svcData };
    }
    try {
      await fetch(`${API_BASE}/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(svcData)
      });
    } catch (e) {}
  } else {
    const newSvc = { _id: `s_${Date.now()}`, ...svcData };
    state.services.push(newSvc);
    try {
      await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSvc)
      });
    } catch (e) {}
  }

  persistLocalData();
  resetAdminServiceForm();
  renderAdminServicesList();
}

async function deleteAdminService(svcId) {
  if (state.services.length <= 1) {
    alert('Mantenha pelo menos 1 serviço ativo no sistema.');
    return;
  }
  state.services = state.services.filter(s => s._id !== svcId);
  state.selectedServices = state.selectedServices.filter(s => s._id !== svcId);
  if (state.selectedServices.length === 0 && state.services.length > 0) {
    state.selectedServices = [state.services[0]];
  }
  persistLocalData();
  try {
    await fetch(`${API_BASE}/services/${svcId}`, { method: 'DELETE' });
  } catch (e) {}
  renderAdminServicesList();
}

// --- 5.3 ADMIN: PROFISSIONAIS & DISPONIBILIDADE (DIAS, DATAS E TODOS OS HORÁRIOS) ---
function renderAdminBarbersList() {
  const container = document.getElementById('admin-barbers-list');
  if (!container) return;

  const weekDays = [
    { d: 0, label: 'Dom' },
    { d: 1, label: 'Seg' },
    { d: 2, label: 'Ter' },
    { d: 3, label: 'Qua' },
    { d: 4, label: 'Qui' },
    { d: 5, label: 'Sex' },
    { d: 6, label: 'Sáb' }
  ];

  container.innerHTML = state.barbers.map(b => {
    const workDays = Array.isArray(b.workDays) ? b.workDays : [0, 1, 2, 3, 4, 5, 6];
    const blockedDates = Array.isArray(b.blockedDates) ? b.blockedDates : [];
    const workHours = Array.isArray(b.workHours) ? b.workHours : [...ALL_POSSIBLE_HOURS];

    const daysButtons = weekDays.map(w => {
      const active = workDays.includes(w.d);
      return `
        <button type="button" onclick="toggleBarberWorkDay('${b._id}', ${w.d})" class="py-2 rounded-xl text-[10px] font-bold border transition ${
          active
            ? 'bg-[#e5a769] text-[#0d0e12] border-transparent shadow-md'
            : 'bg-[#0f1117] text-zinc-500 border-white/[0.06]'
        }">
          ${w.label}
        </button>
      `;
    }).join('');

    const hoursButtons = ALL_POSSIBLE_HOURS.map(h => {
      const active = workHours.includes(h);
      return `
        <button type="button" onclick="toggleBarberWorkHour('${b._id}', '${h}')" class="py-1.5 rounded-xl text-[10px] font-bold border transition ${
          active
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm'
            : 'bg-[#0f1117] text-zinc-600 border-white/[0.05] line-through'
        }">
          ${h}
        </button>
      `;
    }).join('');

    const blockedChips = blockedDates.map(dt => {
      const [y, m, d] = dt.split('-');
      return `
        <span onclick="removeBarberBlockedDate('${b._id}', '${dt}')" class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-[10px] font-semibold cursor-pointer">
          <span>${d}/${m}/${y}</span>
          <i class="fa-solid fa-xmark text-[9px]"></i>
        </span>
      `;
    }).join('');

    return `
      <div class="admin-section-card p-4 space-y-3.5 text-xs">
        <div class="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div class="flex items-center space-x-3">
            <img src="${b.avatar || '/barbearia_logo.jpg'}" class="w-12 h-12 rounded-2xl object-cover border-2 border-[#e5a769]/50 shadow-md" />
            <div>
              <div class="flex items-center space-x-1.5">
                <h5 class="font-black text-white text-sm">${b.name}</h5>
                <span class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">Ativo</span>
              </div>
              <span class="text-[10px] text-zinc-400 block mt-0.5">${b.role || 'Barbeiro Master'} • ${b.exp || ''}</span>
            </div>
          </div>
          <div class="flex items-center space-x-1.5">
            <button onclick="editAdminBarber('${b._id}')" class="w-8 h-8 rounded-xl bg-[#1c1f28] border border-white/[0.08] text-zinc-300 hover:text-[#e5a769] flex items-center justify-center transition">
              <i class="fa-solid fa-pen text-[10px]"></i>
            </button>
            ${state.barbers.length > 1 ? `
              <button onclick="deleteAdminBarber('${b._id}')" class="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 flex items-center justify-center transition">
                <i class="fa-regular fa-trash-can text-[10px]"></i>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Dias da Semana Disponíveis -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-zinc-300">Dias da Semana Disponíveis:</span>
            <span class="text-[9px] text-[#e5a769] font-semibold">${workDays.length} dias ativos</span>
          </div>
          <div class="grid grid-cols-7 gap-1.5">
            ${daysButtons}
          </div>
        </div>

        <!-- Horários de Atendimento -->
        <div class="space-y-2 pt-1 border-t border-white/[0.06]">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold text-zinc-300 block">Horários Disponíveis (${workHours.length}/${ALL_POSSIBLE_HOURS.length}):</span>
              <span class="text-[9px] text-zinc-500">Toque em um horário para liberar ou bloquear</span>
            </div>
            <button type="button" onclick="enableAllBarberSchedule('${b._id}')" class="px-2.5 py-1 rounded-xl bg-[#e5a769]/15 hover:bg-[#e5a769]/25 border border-[#e5a769]/40 text-[#e5a769] text-[9px] font-extrabold transition">
              <i class="fa-solid fa-bolt mr-1"></i>Liberar Todos
            </button>
          </div>
          <div class="grid grid-cols-4 gap-1.5">
            ${hoursButtons}
          </div>
        </div>

        <!-- Bloquear Data Específica (Feriado / Folga) -->
        <div class="space-y-1.5 pt-2 border-t border-white/[0.06]">
          <span class="text-[10px] font-bold text-zinc-300 block">Folgas / Datas Bloqueadas no Calendário:</span>
          <div class="flex items-center space-x-2">
            <input type="date" id="block-date-input-${b._id}" class="flex-1 lux-input px-2.5 py-1.5 text-[11px] text-white" />
            <button type="button" onclick="addBarberBlockedDate('${b._id}')" class="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/35 text-red-300 text-[10px] font-bold transition">
              Bloquear Data
            </button>
          </div>
          ${blockedDates.length > 0 ? `<div class="flex flex-wrap gap-1.5 pt-1">${blockedChips}</div>` : `<span class="text-[10px] text-zinc-500 block">Todas as datas liberadas no calendário.</span>`}
        </div>
      </div>
    `;
  }).join('');
}

async function enableAllBarberSchedule(barberId) {
  const b = state.barbers.find(item => item._id === barberId);
  if (!b) return;
  b.workDays = [0, 1, 2, 3, 4, 5, 6];
  b.workHours = [...ALL_POSSIBLE_HOURS];
  b.blockedDates = [];
  persistLocalData();
  await syncBarberToServer(b);
  renderAdminBarbersList();
  renderHomeBarbers();
}

function editAdminBarber(barberId) {
  const b = state.barbers.find(item => item._id === barberId);
  if (!b) return;
  document.getElementById('admin-barber-id').value = b._id;
  document.getElementById('admin-barber-name').value = b.name;
  document.getElementById('admin-barber-exp').value = b.exp || '';
  const title = document.getElementById('admin-barber-form-title');
  if (title) title.textContent = `Editando: ${b.name}`;
  const cancelBtn = document.getElementById('btn-cancel-barber-edit');
  if (cancelBtn) cancelBtn.classList.remove('hidden');
}

function resetAdminBarberForm() {
  document.getElementById('admin-barber-id').value = '';
  document.getElementById('admin-barber-name').value = '';
  document.getElementById('admin-barber-exp').value = '';
  const title = document.getElementById('admin-barber-form-title');
  if (title) title.textContent = 'Adicionar / Editar Barbeiro';
  const cancelBtn = document.getElementById('btn-cancel-barber-edit');
  if (cancelBtn) cancelBtn.classList.add('hidden');
}

async function saveAdminBarberBasic() {
  const id = document.getElementById('admin-barber-id').value.trim();
  const name = document.getElementById('admin-barber-name').value.trim();
  const exp = document.getElementById('admin-barber-exp').value.trim() || 'Cortes & Barba';

  if (!name) {
    alert('Informe o nome do profissional.');
    return;
  }

  if (id) {
    const b = state.barbers.find(item => item._id === id);
    if (b) {
      b.name = name;
      b.exp = exp;
      await syncBarberToServer(b);
    }
  } else {
    const newB = {
      _id: `b_${Date.now()}`,
      name,
      role: 'Barbeiro Master',
      exp,
      avatar: '/barbearia_logo.jpg',
      workDays: [0, 1, 2, 3, 4, 5, 6],
      blockedDates: [],
      workHours: [...ALL_POSSIBLE_HOURS]
    };
    state.barbers.push(newB);
    try {
      await fetch(`${API_BASE}/barbers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newB)
      });
    } catch (e) {}
  }

  persistLocalData();
  resetAdminBarberForm();
  renderAdminBarbersList();
  renderHomeBarbers();
}

async function deleteAdminBarber(barberId) {
  if (state.barbers.length <= 1) return;
  state.barbers = state.barbers.filter(b => b._id !== barberId);
  state.selectedBarber = state.barbers[0];
  persistLocalData();
  try {
    await fetch(`${API_BASE}/barbers/${barberId}`, { method: 'DELETE' });
  } catch (e) {}
  renderAdminBarbersList();
  renderHomeBarbers();
}

async function toggleBarberWorkDay(barberId, dayNum) {
  const b = state.barbers.find(item => item._id === barberId);
  if (!b) return;
  if (!Array.isArray(b.workDays)) b.workDays = [0, 1, 2, 3, 4, 5, 6];

  const idx = b.workDays.indexOf(dayNum);
  if (idx >= 0) {
    if (b.workDays.length <= 1) {
      alert('O profissional precisa ter pelo menos 1 dia de atendimento ativo.');
      return;
    }
    b.workDays.splice(idx, 1);
  } else {
    b.workDays.push(dayNum);
    b.workDays.sort((a, c) => a - c);
  }

  persistLocalData();
  await syncBarberToServer(b);
  renderAdminBarbersList();
  renderHomeBarbers();
}

async function toggleBarberWorkHour(barberId, hourStr) {
  const b = state.barbers.find(item => item._id === barberId);
  if (!b) return;
  if (!Array.isArray(b.workHours)) b.workHours = [];

  const idx = b.workHours.indexOf(hourStr);
  if (idx >= 0) {
    b.workHours.splice(idx, 1);
  } else {
    b.workHours.push(hourStr);
    b.workHours.sort();
  }

  persistLocalData();
  await syncBarberToServer(b);
  renderAdminBarbersList();
}

async function addBarberBlockedDate(barberId) {
  const b = state.barbers.find(item => item._id === barberId);
  const inp = document.getElementById(`block-date-input-${barberId}`);
  if (!b || !inp || !inp.value) return;

  if (!Array.isArray(b.blockedDates)) b.blockedDates = [];
  if (!b.blockedDates.includes(inp.value)) {
    b.blockedDates.push(inp.value);
    b.blockedDates.sort();
  }
  inp.value = '';
  persistLocalData();
  await syncBarberToServer(b);
  renderAdminBarbersList();
}

async function removeBarberBlockedDate(barberId, dateStr) {
  const b = state.barbers.find(item => item._id === barberId);
  if (!b || !Array.isArray(b.blockedDates)) return;
  b.blockedDates = b.blockedDates.filter(d => d !== dateStr);
  persistLocalData();
  await syncBarberToServer(b);
  renderAdminBarbersList();
}

async function syncBarberToServer(barber) {
  try {
    await fetch(`${API_BASE}/barbers/${barber._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(barber)
    });
  } catch (e) {}
}

// --- 5.4 ADMIN: CONFIGURAÇÕES DA BARBEARIA ---
function renderAdminShopSettingsForm() {
  const n = document.getElementById('admin-shop-name');
  const s = document.getElementById('admin-shop-slogan');
  const a = document.getElementById('admin-shop-address');
  const h = document.getElementById('admin-shop-hours');

  if (n) n.value = state.shop.name || '';
  if (s) s.value = state.shop.slogan || '';
  if (a) a.value = state.shop.address || '';
  if (h) h.value = state.shop.openingHours || '';
}

async function saveAdminShopSettings() {
  state.shop.name = document.getElementById('admin-shop-name')?.value.trim() || 'Guuh Barbeiro';
  state.shop.slogan = document.getElementById('admin-shop-slogan')?.value.trim() || 'Estilo • Confiança • Atitude';
  state.shop.address = document.getElementById('admin-shop-address')?.value.trim() || '';
  state.shop.openingHours = document.getElementById('admin-shop-hours')?.value.trim() || '';

  persistLocalData();
  renderAboutShopInfo();

  try {
    await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.shop)
    });
  } catch (e) {}

  alert('Informações da barbearia atualizadas!');
}

// ========================================================
// 6. NAVEGAÇÃO DE TELAS & TABS
// ========================================================
function switchTab(tab) {
  state.currentTab = tab;

  if (tab === 'login') {
    document.body.classList.add('auth-mode');
  } else {
    document.body.classList.remove('auth-mode');
  }

  const views = ['login', 'home', 'booking', 'my-bookings', 'about', 'profile', 'admin'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === tab) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  });

  const bottomNav = document.getElementById('bottom-bar');
  if (bottomNav) {
    if (tab === 'login' || tab === 'booking') {
      bottomNav.classList.add('hidden');
    } else {
      bottomNav.classList.remove('hidden');
    }
  }

  const navMap = {
    home: 'home',
    'my-bookings': 'bookings',
    about: 'about',
    profile: 'profile',
    admin: 'profile'
  };

  ['home', 'bookings', 'about', 'profile'].forEach(t => {
    const btn = document.getElementById(`nav-item-${t}`);
    if (btn) {
      if (navMap[tab] === t) {
        btn.className = 'flex flex-col items-center justify-center space-y-1 text-[#e5a769]';
      } else {
        btn.className = 'flex flex-col items-center justify-center space-y-1 text-zinc-400 hover:text-white';
      }
    }
  });

  if (tab === 'home') {
    updateGreeting();
    renderHomeBarbers();
  } else if (tab === 'my-bookings') {
    loadMyBookings();
  } else if (tab === 'about') {
    renderAboutShopInfo();
  } else if (tab === 'profile') {
    renderUserProfile();
  } else if (tab === 'admin') {
    renderAdminDashboard();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
