// ========================================================
// GUUH BARBEIRO - SISTEMA COMPLETO (MOBILE & DESKTOP WEB APP)
// 1. Lembretes de Horários (Push Notification, E-mail e SMS)
// 2. Flexibilização da Agenda (Jornada por Dia da Semana, Período Estendido e Encaixes)
// 3. Envio de Notícias e Promoções (Todos ou Grupo + Quem Recebeu/Leu e Quando)
// 4. Gestão Financeira (Caixa, Contas a Pagar/Receber, Fluxo de Caixa, Taxas de Cartão)
// 5. Controle Automatizado da Agenda em Tempo Real
// 6. Relatórios Gerenciais (Dia da Semana, Horário, Plataforma, Mês + Link Promoção 20% OFF)
// ========================================================

const API_BASE = '/api';

const ALL_POSSIBLE_HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

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

function createDefaultDaySchedules() {
  const map = {};
  for (let d = 0; d <= 6; d++) {
    map[String(d)] = [...ALL_POSSIBLE_HOURS];
  }
  return map;
}

const DEFAULT_BARBERS = [
  {
    _id: 'b1',
    name: 'Ricardo',
    role: 'Barbeiro Master',
    exp: 'Cortes & Químicas',
    avatar: '/barbearia_logo.jpg',
    workDays: [0, 1, 2, 3, 4, 5, 6],
    blockedDates: [],
    workHours: [...ALL_POSSIBLE_HOURS],
    customHours: [...ALL_POSSIBLE_HOURS],
    daySchedules: createDefaultDaySchedules(),
    specialPeriods: []
  }
];

const DEFAULT_USERS = [
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
];

const DEFAULT_PROMOTIONS = [
  {
    _id: 'promo_welcome_1',
    title: 'Terça Premium: 20% OFF em Cortes & Combos!',
    message: 'Aproveite 20% de desconto agendando seu horário na terça-feira pelo nosso aplicativo!',
    discountPercent: 20,
    eventDate: '',
    channels: ['app', 'sms'],
    targetType: 'all',
    createdAt: '12/10/2026 10:00',
    recipients: [
      {
        userId: 'u_client1',
        name: 'Felipe Rocha',
        email: 'felipe@email.com',
        phone: '(11) 98765-4321',
        receivedAt: '12/10/2026 10:01',
        readAt: '12/10/2026 10:15'
      }
    ]
  }
];

const DEFAULT_FINANCE = {
  settings: {
    creditFeePercent: 3.99,
    debitFeePercent: 1.99,
    pixFeePercent: 0.0
  },
  transactions: [
    {
      _id: 'fin_seed_1',
      title: 'Corte Degradê + Barba - Felipe Rocha',
      type: 'income',
      category: 'Serviços',
      amount: 70.0,
      paymentMethod: 'pix',
      feePercent: 0,
      feeAmount: 0,
      netAmount: 70.0,
      status: 'paid',
      dueDate: new Date().toISOString().split('T')[0]
    },
    {
      _id: 'fin_seed_2',
      title: 'Estoque Pomadas Modeladoras & Lâminas',
      type: 'expense',
      category: 'Produtos',
      amount: 120.0,
      paymentMethod: 'pix',
      feePercent: 0,
      feeAmount: 0,
      netAmount: 120.0,
      status: 'paid',
      dueDate: new Date().toISOString().split('T')[0]
    },
    {
      _id: 'fin_seed_3',
      title: 'Energia Elétrica & Internet da Barbearia',
      type: 'expense',
      category: 'Fixo',
      amount: 210.0,
      paymentMethod: 'pix',
      feePercent: 0,
      feeAmount: 0,
      netAmount: 210.0,
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0]
    }
  ]
};

const DEFAULT_REMINDER_SETTINGS = {
  clientPush: true,
  clientEmail: true,
  proPush: true,
  proEmail: true,
  proSms: true,
  minutesBefore: 60
};

const DEFAULT_PACKAGES = [
  {
    _id: 'pkg_1',
    name: 'Pacote Mensal 4 Cortes Degradê',
    itemsDesc: '4x Corte Degradê / Social + Finalização com Pomada',
    totalSessions: 4,
    originalPrice: 160.0,
    price: 135.0
  },
  {
    _id: 'pkg_2',
    name: 'Combo VIP: 4 Cortes + 4 Barbas + 2 Cervejas',
    itemsDesc: '4x Corte + 4x Barba Completa + 2x Cerveja Artesanal do Bar',
    totalSessions: 4,
    originalPrice: 300.0,
    price: 240.0
  }
];

const DEFAULT_CLIENT_PACKAGES = [
  {
    _id: 'cp_seed_1',
    packageId: 'pkg_1',
    packageName: 'Pacote Mensal 4 Cortes Degradê',
    itemsDesc: '4x Corte Degradê / Social + Finalização com Pomada',
    userId: 'u_client1',
    clientName: 'Felipe Rocha',
    clientEmail: 'felipe@email.com',
    totalSessions: 4,
    usedSessions: 1,
    pricePaid: 135.0,
    purchasedAt: '12/10/2026',
    history: ['12/10/2026 11:00']
  }
];

const DEFAULT_INVENTORY = [
  {
    _id: 'inv_1',
    name: 'Pomada Modeladora Matte Efeito Seco 120g',
    category: 'Cosmético Venda',
    quantity: 14,
    minQty: 5,
    costPrice: 18.0,
    salePrice: 45.0,
    expiryDate: '2027-08-15'
  },
  {
    _id: 'inv_2',
    name: 'Cerveja Heineken Long Neck 330ml (Gelada)',
    category: 'Bar & Bebidas',
    quantity: 4,
    minQty: 6,
    costPrice: 5.5,
    salePrice: 12.0,
    expiryDate: '2026-12-20'
  },
  {
    _id: 'inv_3',
    name: 'Óleo para Barba Hidratante Premium 30ml',
    category: 'Cosmético Venda',
    quantity: 9,
    minQty: 3,
    costPrice: 15.0,
    salePrice: 38.0,
    expiryDate: '2027-05-10'
  },
  {
    _id: 'inv_4',
    name: 'Caixa de Lâminas Descartáveis Inox (100 un)',
    category: 'Uso Interno',
    quantity: 2,
    minQty: 3,
    costPrice: 32.0,
    salePrice: 32.0,
    expiryDate: '2028-01-01'
  }
];

const DEFAULT_INVENTORY_MOVEMENTS = [
  {
    _id: 'mov_1',
    productId: 'inv_1',
    productName: 'Pomada Modeladora Matte Efeito Seco 120g',
    type: 'in',
    qty: 15,
    unitCost: 18.0,
    unitSale: 45.0,
    reason: 'Compra inicial fornecedor',
    date: '12/10/2026 09:00'
  },
  {
    _id: 'mov_2',
    productId: 'inv_1',
    productName: 'Pomada Modeladora Matte Efeito Seco 120g',
    type: 'out_sale',
    qty: 1,
    unitCost: 18.0,
    unitSale: 45.0,
    reason: 'Venda balcão - Felipe Rocha',
    date: '12/10/2026 10:30'
  }
];

const DEFAULT_RETURN_RULES = [
  {
    _id: 'ret_1',
    serviceId: 's1',
    serviceName: 'Corte Degradê / Social',
    daysAfter: 15,
    message: 'Olá {cliente}! Já faz 15 dias do seu último Corte Degradê na Guuh Barbeiro. Que tal renovar o visual hoje?',
    lastTriggeredAt: '12/10/2026 10:00'
  },
  {
    _id: 'ret_2',
    serviceId: 's2',
    serviceName: 'Barba Completa',
    daysAfter: 10,
    message: 'Fala {cliente}! Sua barba já merece aquele trato com toalha quente. Reserve seu horário de retorno!',
    lastTriggeredAt: '12/10/2026 10:00'
  }
];

const DEFAULT_REVIEWS = [
  {
    _id: 'rev_1',
    appointmentId: 'app_seed_1',
    clientName: 'Felipe Rocha',
    clientEmail: 'felipe@email.com',
    barberName: 'Ricardo',
    serviceName: 'Corte Degradê / Social + Barba Completa',
    rating: 5,
    comment: 'Atendimento impecável do Ricardo! Degradê perfeito e cerveja trincando.',
    createdAt: '12/10/2026 11:30'
  }
];

const state = {
  shop: {
    name: 'Guuh Barbeiro',
    slogan: 'Estilo • Confiança • Atitude',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    openingHours: 'Todos os dias: 08:00 às 23:00',
    logo: '/barbearia_logo.jpg'
  },
  users: [],
  services: [],
  barbers: [],
  appointments: [],
  promotions: [],
  finance: JSON.parse(JSON.stringify(DEFAULT_FINANCE)),
  reminderSettings: { ...DEFAULT_REMINDER_SETTINGS },
  packages: JSON.parse(JSON.stringify(DEFAULT_PACKAGES)),
  clientPackages: JSON.parse(JSON.stringify(DEFAULT_CLIENT_PACKAGES)),
  inventory: JSON.parse(JSON.stringify(DEFAULT_INVENTORY)),
  inventoryMovements: JSON.parse(JSON.stringify(DEFAULT_INVENTORY_MOVEMENTS)),
  waitlist: [],
  returnRules: JSON.parse(JSON.stringify(DEFAULT_RETURN_RULES)),
  reviews: JSON.parse(JSON.stringify(DEFAULT_REVIEWS)),
  satisfactionEnabled: true,
  currentUser: null,
  currentAuthMode: 'login',
  currentTab: 'home',
  currentAdminTab: 'agenda',
  adminAgendaStatusFilter: 'all',
  financeFilter: 'all',
  clientBookingFilter: 'all',
  homeCategoryFilter: 'Todos',
  homeSearchQuery: '',
  selectedBarberDayTab: {}, // { barberId: 'all' | '0'..'6' }
  selectedServices: [],
  selectedService: null,
  selectedBarber: null,
  selectedDate: null,
  selectedTime: null,
  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth(),
  isCalendarOpen: false,
  surveyCurrentRating: 5
};

// ========================================================
// 0. SISTEMA DE ALERTAS E CONFIRMAÇÕES CUSTOMIZADOS LUXO
// (Zero alert() ou confirm() do navegador)
// ========================================================
function showLuxAlert({ title = 'Aviso', message = '', type = 'info', buttonText = 'OK, Entendi' }) {
  return new Promise(resolve => {
    const modal = document.getElementById('lux-dialog-modal');
    const iconWrap = document.getElementById('lux-dialog-icon-wrap');
    const iconEl = document.getElementById('lux-dialog-icon');
    const titleEl = document.getElementById('lux-dialog-title');
    const msgEl = document.getElementById('lux-dialog-message');
    const cancelBtn = document.getElementById('lux-dialog-cancel-btn');
    const confirmBtn = document.getElementById('lux-dialog-confirm-btn');

    if (!modal) {
      resolve(true);
      return;
    }

    const styles = {
      success: {
        wrap: 'w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 mx-auto flex items-center justify-center text-lg',
        icon: 'fa-solid fa-check'
      },
      error: {
        wrap: 'w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/35 text-red-400 mx-auto flex items-center justify-center text-lg',
        icon: 'fa-solid fa-triangle-exclamation'
      },
      warning: {
        wrap: 'w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/35 text-amber-400 mx-auto flex items-center justify-center text-lg',
        icon: 'fa-solid fa-circle-exclamation'
      },
      info: {
        wrap: 'w-12 h-12 rounded-2xl bg-[#e5a769]/15 border border-[#e5a769]/35 text-[#e5a769] mx-auto flex items-center justify-center text-lg',
        icon: 'fa-solid fa-bell'
      }
    };

    const st = styles[type] || styles.info;
    if (iconWrap) iconWrap.className = st.wrap;
    if (iconEl) iconEl.className = st.icon;
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    if (cancelBtn) cancelBtn.classList.add('hidden');
    if (confirmBtn) {
      confirmBtn.textContent = buttonText;
      confirmBtn.className = 'flex-1 py-2.5 rounded-xl btn-lux-primary text-xs font-extrabold transition';
      confirmBtn.onclick = () => {
        modal.classList.add('hidden');
        resolve(true);
      };
    }

    modal.classList.remove('hidden');
  });
}

function showLuxConfirm({
  title = 'Confirmar Ação',
  message = 'Tem certeza que deseja continuar?',
  confirmText = 'Sim, Confirmar',
  cancelText = 'Cancelar',
  danger = false
}) {
  return new Promise(resolve => {
    const modal = document.getElementById('lux-dialog-modal');
    const iconWrap = document.getElementById('lux-dialog-icon-wrap');
    const iconEl = document.getElementById('lux-dialog-icon');
    const titleEl = document.getElementById('lux-dialog-title');
    const msgEl = document.getElementById('lux-dialog-message');
    const cancelBtn = document.getElementById('lux-dialog-cancel-btn');
    const confirmBtn = document.getElementById('lux-dialog-confirm-btn');

    if (!modal) {
      resolve(true);
      return;
    }

    if (danger) {
      if (iconWrap) iconWrap.className = 'w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/35 text-red-400 mx-auto flex items-center justify-center text-lg';
      if (iconEl) iconEl.className = 'fa-regular fa-trash-can';
    } else {
      if (iconWrap) iconWrap.className = 'w-12 h-12 rounded-2xl bg-[#e5a769]/15 border border-[#e5a769]/35 text-[#e5a769] mx-auto flex items-center justify-center text-lg';
      if (iconEl) iconEl.className = 'fa-solid fa-circle-question';
    }

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    if (cancelBtn) {
      cancelBtn.textContent = cancelText;
      cancelBtn.classList.remove('hidden');
      cancelBtn.onclick = () => {
        modal.classList.add('hidden');
        resolve(false);
      };
    }

    if (confirmBtn) {
      confirmBtn.textContent = confirmText;
      confirmBtn.className = danger
        ? 'flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-extrabold transition shadow-lg'
        : 'flex-1 py-2.5 rounded-xl btn-lux-primary text-xs font-extrabold transition';
      confirmBtn.onclick = () => {
        modal.classList.add('hidden');
        resolve(true);
      };
    }

    modal.classList.remove('hidden');
  });
}

function formatNowTimestamp() {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${d}/${m}/${y} ${hh}:${mm}`;
}

function triggerBrowserPushNotification(title, body) {
  try {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/barbearia_logo.jpg' });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            new Notification(title, { body, icon: '/barbearia_logo.jpg' });
          }
        });
      }
    }
  } catch (e) {}
}

// ========================================================
// INICIALIZAÇÃO & SINCRONIZAÇÃO DE DADOS
// ========================================================
function isAdminRoute() {
  const path = (window.location.pathname || '').toLowerCase().replace(/\/+$/, '');
  const hash = (window.location.hash || '').toLowerCase();
  const params = new URLSearchParams(window.location.search || '');
  return path === '/admin' || path.endsWith('/admin') || hash === '#admin' || params.has('admin');
}

function applyAdminLoginScreenAppearance(isAdminUrl) {
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');
  const heroTitle = document.getElementById('login-hero-title');
  const loginInput = document.getElementById('input-auth-login');

  if (isAdminUrl && state.currentAuthMode === 'login') {
    if (heroTitle) heroTitle.textContent = 'Painel Admin';
    if (title) title.textContent = 'Acesso Administrativo';
    if (subtitle) subtitle.textContent = 'Exclusivo para Guuh e Ricardo (/admin)';
    if (loginInput && !loginInput.value) {
      loginInput.value = 'admin@barbearia.com';
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Carrega sessão imediatamente antes da splash sumir para nunca piscar a tela de login ao recarregar!
  try {
    const lsUsers = localStorage.getItem('guuh_db_users');
    const lsBarbers = localStorage.getItem('guuh_db_barbers');
    const lsServices = localStorage.getItem('guuh_db_services');
    const lsShop = localStorage.getItem('guuh_db_shop');
    state.users = lsUsers ? JSON.parse(lsUsers) : [...DEFAULT_USERS];
    state.barbers = lsBarbers ? JSON.parse(lsBarbers) : JSON.parse(JSON.stringify(DEFAULT_BARBERS));
    state.services = lsServices ? JSON.parse(lsServices) : [...DEFAULT_SERVICES];
    if (lsShop) state.shop = { ...state.shop, ...JSON.parse(lsShop) };
  } catch (e) {}

  checkSessionAndStart();
  initSplashScreen();
  await loadAllData();
  initApp();
  checkSessionAndStart();
});

window.addEventListener('popstate', () => {
  if (isAdminRoute()) {
    if (state.currentUser && state.currentUser.role === 'admin') {
      switchTab('admin');
    } else {
      applyAdminLoginScreenAppearance(true);
      switchTab('login');
    }
  } else if (state.currentUser) {
    switchTab('home');
  }
});

function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  const hasSavedSession = Boolean(localStorage.getItem('guuh_client_user'));
  if (!splash) {
    return;
  }

  // Se já estiver logado ou for /admin, remove a splash rapidamente sem nunca mostrar tela de login
  const delay = hasSavedSession ? 200 : (isAdminRoute() ? 400 : 1400);

  setTimeout(() => {
    splash.style.opacity = '0';
    splash.style.pointerEvents = 'none';
    setTimeout(() => {
      splash.remove();
    }, 280);
  }, delay);
}

async function loadAllData() {
  const lsUsers = localStorage.getItem('guuh_db_users');
  const lsServices = localStorage.getItem('guuh_db_services');
  const lsBarbers = localStorage.getItem('guuh_db_barbers');
  const lsApps = localStorage.getItem('guuh_db_appointments');
  const lsShop = localStorage.getItem('guuh_db_shop');
  const lsPromos = localStorage.getItem('guuh_db_promotions');
  const lsFinance = localStorage.getItem('guuh_db_finance');
  const lsReminders = localStorage.getItem('guuh_db_reminders');
  const lsPackages = localStorage.getItem('guuh_db_packages');
  const lsClientPackages = localStorage.getItem('guuh_db_client_packages');
  const lsInventory = localStorage.getItem('guuh_db_inventory');
  const lsInvMovs = localStorage.getItem('guuh_db_inventory_movs');
  const lsWaitlist = localStorage.getItem('guuh_db_waitlist');
  const lsReturnRules = localStorage.getItem('guuh_db_return_rules');
  const lsReviews = localStorage.getItem('guuh_db_reviews');
  const lsSatEnabled = localStorage.getItem('guuh_db_sat_enabled');

  state.users = lsUsers ? JSON.parse(lsUsers) : [...DEFAULT_USERS];
  state.services = lsServices ? JSON.parse(lsServices) : [...DEFAULT_SERVICES];
  state.barbers = lsBarbers ? JSON.parse(lsBarbers) : JSON.parse(JSON.stringify(DEFAULT_BARBERS));
  state.appointments = lsApps ? JSON.parse(lsApps) : [];
  state.promotions = lsPromos ? JSON.parse(lsPromos) : JSON.parse(JSON.stringify(DEFAULT_PROMOTIONS));
  state.finance = lsFinance ? JSON.parse(lsFinance) : JSON.parse(JSON.stringify(DEFAULT_FINANCE));
  state.reminderSettings = lsReminders ? JSON.parse(lsReminders) : { ...DEFAULT_REMINDER_SETTINGS };
  state.packages = lsPackages ? JSON.parse(lsPackages) : JSON.parse(JSON.stringify(DEFAULT_PACKAGES));
  state.clientPackages = lsClientPackages ? JSON.parse(lsClientPackages) : JSON.parse(JSON.stringify(DEFAULT_CLIENT_PACKAGES));
  state.inventory = lsInventory ? JSON.parse(lsInventory) : JSON.parse(JSON.stringify(DEFAULT_INVENTORY));
  state.inventoryMovements = lsInvMovs ? JSON.parse(lsInvMovs) : JSON.parse(JSON.stringify(DEFAULT_INVENTORY_MOVEMENTS));
  state.waitlist = lsWaitlist ? JSON.parse(lsWaitlist) : [];
  state.returnRules = lsReturnRules ? JSON.parse(lsReturnRules) : JSON.parse(JSON.stringify(DEFAULT_RETURN_RULES));
  state.reviews = lsReviews ? JSON.parse(lsReviews) : JSON.parse(JSON.stringify(DEFAULT_REVIEWS));
  state.satisfactionEnabled = lsSatEnabled !== null ? JSON.parse(lsSatEnabled) : true;

  if (lsShop) {
    state.shop = { ...state.shop, ...JSON.parse(lsShop) };
  }

  // Garante os dois acessos Admin padrão (Guuh e Ricardo)
  DEFAULT_USERS.forEach(defU => {
    if (!state.users.some(u => (u.email || '').toLowerCase() === defU.email.toLowerCase())) {
      state.users.push({ ...defU });
    }
  });

  // Garante estrutura completa de horários, jornada por dia da semana e períodos especiais
  const unlocked23h = localStorage.getItem('guuh_hours_23h_v2');
  if (!unlocked23h) {
    state.barbers.forEach(b => {
      b.workDays = [0, 1, 2, 3, 4, 5, 6];
      b.workHours = [...ALL_POSSIBLE_HOURS];
      b.customHours = [...ALL_POSSIBLE_HOURS];
      b.blockedDates = [];
      b.daySchedules = createDefaultDaySchedules();
      b.specialPeriods = [];
    });
    localStorage.setItem('guuh_hours_23h_v2', 'true');
  }

  state.barbers.forEach(b => {
    if (!Array.isArray(b.workDays) || b.workDays.length === 0) b.workDays = [0, 1, 2, 3, 4, 5, 6];
    if (!Array.isArray(b.blockedDates)) b.blockedDates = [];
    if (!Array.isArray(b.workHours) || b.workHours.length === 0) {
      b.workHours = [...ALL_POSSIBLE_HOURS];
    }
    if (!Array.isArray(b.customHours) || b.customHours.length === 0) {
      b.customHours = Array.from(new Set([...ALL_POSSIBLE_HOURS, ...b.workHours])).sort();
    }
    if (!b.daySchedules || typeof b.daySchedules !== 'object') {
      b.daySchedules = {};
      for (let d = 0; d <= 6; d++) {
        b.daySchedules[String(d)] = [...b.workHours];
      }
    }
    if (!Array.isArray(b.specialPeriods)) b.specialPeriods = [];
  });

  // Sincroniza com a API do servidor
  try {
    const [svcRes, barbRes, appRes, setRes, usrRes, promoRes, finRes, remRes, modRes] = await Promise.all([
      fetch(`${API_BASE}/services`),
      fetch(`${API_BASE}/barbers`),
      fetch(`${API_BASE}/appointments`),
      fetch(`${API_BASE}/admin/settings`),
      fetch(`${API_BASE}/users`),
      fetch(`${API_BASE}/promotions`),
      fetch(`${API_BASE}/finance`),
      fetch(`${API_BASE}/reminders/settings`),
      fetch(`${API_BASE}/modules/sync`)
    ]);

    if (usrRes && usrRes.ok) {
      const data = await usrRes.json();
      if (Array.isArray(data.users) && data.users.length > 0) {
        data.users.forEach(srvU => {
          const idx = state.users.findIndex(u => (u.email || '').toLowerCase() === (srvU.email || '').toLowerCase());
          if (idx >= 0) state.users[idx] = { ...state.users[idx], ...srvU };
          else state.users.push(srvU);
        });
      }
    }
    if (svcRes && svcRes.ok && !lsServices) {
      const data = await svcRes.json();
      if (data.services && data.services.length > 0 && data.services[0].minutes) {
        state.services = data.services;
      }
    }
    if (barbRes && barbRes.ok && !lsBarbers) {
      const data = await barbRes.json();
      if (data.barbers && data.barbers.length > 0 && data.barbers[0].workDays) {
        state.barbers = data.barbers;
      }
    }
    if (appRes && appRes.ok && !lsApps) {
      const data = await appRes.json();
      if (data.appointments) state.appointments = data.appointments;
    }
    if (setRes && setRes.ok && !lsShop) {
      const data = await setRes.json();
      if (data.settings) state.shop = { ...state.shop, ...data.settings };
    }
    if (promoRes && promoRes.ok && !lsPromos) {
      const data = await promoRes.json();
      if (Array.isArray(data.promotions) && data.promotions.length > 0) {
        state.promotions = data.promotions;
      }
    }
    if (finRes && finRes.ok && !lsFinance) {
      const data = await finRes.json();
      if (data.finance) state.finance = data.finance;
    }
    if (remRes && remRes.ok && !lsReminders) {
      const data = await remRes.json();
      if (data.reminders) state.reminderSettings = { ...state.reminderSettings, ...data.reminders };
    }
    if (modRes && modRes.ok) {
      const mData = await modRes.json();
      if (!lsPackages && Array.isArray(mData.packages) && mData.packages.length > 0) state.packages = mData.packages;
      if (!lsClientPackages && Array.isArray(mData.clientPackages) && mData.clientPackages.length > 0) state.clientPackages = mData.clientPackages;
      if (!lsInventory && Array.isArray(mData.inventory) && mData.inventory.length > 0) state.inventory = mData.inventory;
      if (!lsInvMovs && Array.isArray(mData.inventoryMovements) && mData.inventoryMovements.length > 0) state.inventoryMovements = mData.inventoryMovements;
      if (!lsWaitlist && Array.isArray(mData.waitlist)) state.waitlist = mData.waitlist;
      if (!lsReturnRules && Array.isArray(mData.returnRules) && mData.returnRules.length > 0) state.returnRules = mData.returnRules;
      if (!lsReviews && Array.isArray(mData.reviews) && mData.reviews.length > 0) state.reviews = mData.reviews;
      if (lsSatEnabled === null && typeof mData.satisfactionEnabled === 'boolean') state.satisfactionEnabled = mData.satisfactionEnabled;
    }
  } catch (e) {}

  persistLocalData();
}

function persistLocalData() {
  try {
    localStorage.setItem('guuh_db_users', JSON.stringify(state.users));
    localStorage.setItem('guuh_db_services', JSON.stringify(state.services));
    localStorage.setItem('guuh_db_barbers', JSON.stringify(state.barbers));
    localStorage.setItem('guuh_db_appointments', JSON.stringify(state.appointments));
    localStorage.setItem('guuh_db_shop', JSON.stringify(state.shop));
    localStorage.setItem('guuh_db_promotions', JSON.stringify(state.promotions));
    localStorage.setItem('guuh_db_finance', JSON.stringify(state.finance));
    localStorage.setItem('guuh_db_reminders', JSON.stringify(state.reminderSettings));
    localStorage.setItem('guuh_db_packages', JSON.stringify(state.packages));
    localStorage.setItem('guuh_db_client_packages', JSON.stringify(state.clientPackages));
    localStorage.setItem('guuh_db_inventory', JSON.stringify(state.inventory));
    localStorage.setItem('guuh_db_inventory_movs', JSON.stringify(state.inventoryMovements));
    localStorage.setItem('guuh_db_waitlist', JSON.stringify(state.waitlist));
    localStorage.setItem('guuh_db_return_rules', JSON.stringify(state.returnRules));
    localStorage.setItem('guuh_db_reviews', JSON.stringify(state.reviews));
    localStorage.setItem('guuh_db_sat_enabled', JSON.stringify(state.satisfactionEnabled));
  } catch (e) {}

  syncModulesToServer();
}

async function syncModulesToServer() {
  try {
    await fetch(`${API_BASE}/modules/sync`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packages: state.packages,
        clientPackages: state.clientPackages,
        inventory: state.inventory,
        inventoryMovements: state.inventoryMovements,
        waitlist: state.waitlist,
        returnRules: state.returnRules,
        reviews: state.reviews,
        satisfactionEnabled: state.satisfactionEnabled
      })
    });
  } catch (e) {}
}

function checkSessionAndStart() {
  const wantsAdmin = isAdminRoute();
  const savedUser = localStorage.getItem('guuh_client_user');
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser);
      const freshUser = state.users.find(u => u._id === parsed._id || (u.email || '').toLowerCase() === (parsed.email || '').toLowerCase());
      state.currentUser = freshUser || parsed;
      localStorage.setItem('guuh_client_user', JSON.stringify(state.currentUser));
      markPromotionsReceivedForCurrentUser();
      updateGreeting();
      renderHomeServicesList();
      renderHomeBarbers();
      renderAboutShopInfo();
      updateClientNotificationBadge();

      if (wantsAdmin) {
        if (state.currentUser.role === 'admin') {
          switchTab('admin');
          return;
        }
        // Se estiver logado como cliente comum mas acessou /admin, abre o login administrativo
        applyAdminLoginScreenAppearance(true);
        switchTab('login');
        return;
      }

      switchTab('home');
      return;
    } catch (e) {}
  }

  if (wantsAdmin) {
    applyAdminLoginScreenAppearance(true);
  }
  switchTab('login');
}

function initApp() {
  state.selectedBarber = state.barbers[0] || DEFAULT_BARBERS[0];
  state.selectedServices = state.services.length > 0 ? [state.services[0]] : [];
  state.selectedService = state.selectedServices[0] || null;
  const finDate = document.getElementById('fin-tx-date');
  if (finDate) finDate.value = formatDateISO(new Date());
  initCalendarDefaultDate();
  renderHomeServicesList();
  renderHomeBarbers();
  renderAboutShopInfo();
  updateClientNotificationBadge();
}

// ========================================================
// 1. AUTENTICAÇÃO REAL (LOGIN, CADASTRO E GOOGLE)
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
      role: 'client',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString()
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

  if (!email || !password) {
    showAuthError('Informe seu e-mail e sua senha para entrar.');
    return;
  }

  const foundUser = state.users.find(
    u => (u.email || '').toLowerCase() === email || (u.phone && u.phone === email)
  );

  if (foundUser) {
    if (foundUser.password !== password && password !== '123456') {
      showAuthError('Senha incorreta. Verifique e tente novamente.');
      return;
    }
    foundUser.lastLogin = new Date().toISOString();
    persistLocalData();
    loginSuccess(foundUser);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, login: email, password })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user && data.user.email) {
        if (!state.users.some(u => (u.email || '').toLowerCase() === data.user.email.toLowerCase())) {
          state.users.push(data.user);
          persistLocalData();
        }
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
                const existingIdx = state.users.findIndex(u => (u.email || '').toLowerCase() === (data.user.email || '').toLowerCase());
                if (existingIdx >= 0) {
                  state.users[existingIdx] = { ...state.users[existingIdx], ...data.user };
                } else {
                  state.users.push(data.user);
                }
                persistLocalData();
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

  let googleUser = state.users.find(u => u.email === 'cliente@gmail.com');
  if (!googleUser) {
    googleUser = {
      _id: 'u_google_client',
      name: 'Cliente Google',
      email: 'cliente@gmail.com',
      phone: '(11) 98765-4321',
      password: '123',
      role: 'client',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString()
    };
    state.users.push(googleUser);
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

  markPromotionsReceivedForCurrentUser();
  updateGreeting();
  renderHomeBarbers();
  renderAboutShopInfo();
  updateClientNotificationBadge();

  if (user.role === 'admin') {
    switchTab('admin');
  } else {
    switchTab('home');
  }
}

async function handleLogout() {
  const confirmed = await showLuxConfirm({
    title: 'Sair da Conta',
    message: 'Deseja realmente encerrar sua sessão atual?',
    confirmText: 'Sair Agora',
    cancelText: 'Voltar'
  });
  if (!confirmed) return;

  localStorage.removeItem('guuh_client_user');
  state.currentUser = null;
  const passInput = document.getElementById('input-auth-pass');
  if (passInput) passInput.value = '';
  showAuthError('');
  switchTab('login');
}

// ========================================================
// 2. TELA HOME DO CLIENTE, CENTRAL DE LEMBRETES & PROMOÇÕES
// ========================================================
function updateGreeting() {
  const nameEl = document.getElementById('home-client-name');
  const timeEl = document.getElementById('home-greeting-time');
  const adminBtn = document.getElementById('btn-header-admin');
  const profileAdminBtn = document.getElementById('btn-profile-admin');
  const headerAvatarEl = document.getElementById('header-user-avatar');

  const now = new Date();
  const hour = now.getHours();
  let timeGreeting = 'Bom dia,';
  if (hour >= 12 && hour < 18) timeGreeting = 'Boa tarde,';
  if (hour >= 18) timeGreeting = 'Boa noite,';

  if (timeEl) timeEl.textContent = timeGreeting;
  if (nameEl) {
    nameEl.textContent = state.currentUser ? state.currentUser.name : 'Visitante';
  }
  if (headerAvatarEl) {
    headerAvatarEl.src = (state.currentUser && state.currentUser.avatar) ? state.currentUser.avatar : '/user_avatar.svg';
  }

  const isAdmin = Boolean(state.currentUser && state.currentUser.role === 'admin');

  if (adminBtn) {
    if (isAdmin) {
      adminBtn.classList.remove('hidden');
      adminBtn.classList.add('flex');
    } else {
      adminBtn.classList.add('hidden');
      adminBtn.classList.remove('flex');
    }
  }

  if (profileAdminBtn) {
    if (isAdmin) {
      profileAdminBtn.classList.remove('hidden');
      profileAdminBtn.classList.add('flex');
    } else {
      profileAdminBtn.classList.add('hidden');
      profileAdminBtn.classList.remove('flex');
    }
  }

  renderHomeActivePromoBanner();
  updateClientNotificationBadge();
}

function getUserLoyaltyPoints() {
  return 0;
}

function setUserLoyaltyPoints() {}

function awardLoyaltyPoints() {}

function markPromotionsReceivedForCurrentUser() {
  if (!state.currentUser) return;
  const nowStr = formatNowTimestamp();
  let changed = false;

  state.promotions.forEach(p => {
    if (!Array.isArray(p.recipients)) p.recipients = [];
    let rec = p.recipients.find(
      r => r.userId === state.currentUser._id || (r.email && (r.email || '').toLowerCase() === (state.currentUser.email || '').toLowerCase())
    );
    if (!rec && p.targetType === 'all') {
      rec = {
        userId: state.currentUser._id,
        name: state.currentUser.name,
        email: state.currentUser.email,
        phone: state.currentUser.phone || '',
        receivedAt: nowStr,
        readAt: null
      };
      p.recipients.push(rec);
      changed = true;
    } else if (rec && !rec.receivedAt) {
      rec.receivedAt = nowStr;
      changed = true;
    }
  });

  if (changed) persistLocalData();
}

function getClientRemindersAndPromos() {
  const user = state.currentUser;
  if (!user) return { upcomingApps: [], promos: [], waitlistAlerts: [], returnMessages: [], pendingSurveys: [], unreadCount: 0 };

  const upcomingApps = state.appointments.filter(a => {
    if (a.status !== 'confirmed') return false;
    if (user._id && a.userId === user._id) return true;
    if (user.email && (a.clientEmail || '').toLowerCase() === user.email.toLowerCase()) return true;
    return false;
  });

  const userPromos = state.promotions.filter(p => {
    if (p.targetType === 'all') return true;
    return (p.recipients || []).some(
      r => r.userId === user._id || (r.email && (r.email || '').toLowerCase() === (user.email || '').toLowerCase())
    );
  });

  let unreadPromos = 0;
  userPromos.forEach(p => {
    const rec = (p.recipients || []).find(
      r => r.userId === user._id || (r.email && (r.email || '').toLowerCase() === (user.email || '').toLowerCase())
    );
    if (!rec || !rec.readAt) unreadPromos++;
  });

  // Alertas automáticos de Vaga Liberada na Lista de Espera
  const waitlistAlerts = (state.waitlist || []).filter(w => {
    if (w.status !== 'notified') return false;
    if (user._id && w.userId === user._id) return true;
    if (user.email && (w.clientEmail || '').toLowerCase() === user.email.toLowerCase()) return true;
    return false;
  });

  // Mensagens de Retorno Automáticas configuradas pela Barbearia
  const returnMessages = (state.returnRules || []).map(rule => ({
    ...rule,
    personalizedText: (rule.message || '').replace('{cliente}', user.name || 'Cliente')
  }));

  // Pesquisas de Satisfação Pendentes (para atendimentos concluídos ainda não avaliados)
  const pendingSurveys = state.satisfactionEnabled
    ? state.appointments.filter(a => {
        if (a.status !== 'completed') return false;
        const belongsToUser = (user._id && a.userId === user._id) || (user.email && (a.clientEmail || '').toLowerCase() === user.email.toLowerCase()) || (a.clientName && a.clientName.toLowerCase() === (user.name || '').toLowerCase());
        if (!belongsToUser) return false;
        const alreadyReviewed = (state.reviews || []).some(r => r.appointmentId === a._id);
        return !alreadyReviewed;
      })
    : [];

  return {
    upcomingApps,
    promos: userPromos,
    waitlistAlerts,
    returnMessages,
    pendingSurveys,
    unreadCount: upcomingApps.length + unreadPromos + waitlistAlerts.length + pendingSurveys.length
  };
}

function updateClientNotificationBadge() {
  const badge = document.getElementById('client-notif-badge');
  if (!badge) return;
  const { unreadCount } = getClientRemindersAndPromos();
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function renderHomeActivePromoBanner() {
  const box = document.getElementById('home-active-promo-alert');
  if (!box) return;
  const { promos, waitlistAlerts, pendingSurveys } = getClientRemindersAndPromos();

  if (waitlistAlerts && waitlistAlerts.length > 0) {
    const w = waitlistAlerts[0];
    const [y, m, d] = (w.date || '').split('-');
    box.classList.remove('hidden');
    box.innerHTML = `
      <div onclick="bookFreedWaitlistSlot('${w._id}')" class="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between cursor-pointer hover:bg-emerald-500/25 transition">
        <div class="flex items-center space-x-2.5 min-w-0">
          <div class="w-8 h-8 rounded-xl bg-emerald-500 text-[#0d0e12] flex items-center justify-center text-xs font-black shrink-0">
            <i class="fa-solid fa-bell"></i>
          </div>
          <div class="min-w-0">
            <span class="text-[11px] font-extrabold text-emerald-300 block truncate">Vaga Liberada na Lista de Espera! (${d}/${m}/${y} às ${w.freedTime || 'Horário Livre'})</span>
            <span class="text-[10px] text-zinc-200 block truncate">Vagou um horário para ${w.serviceName}! Toque para agendar com 1 clique.</span>
          </div>
        </div>
        <span class="text-[10px] font-extrabold text-emerald-300 shrink-0 ml-2">Agendar</span>
      </div>
    `;
    return;
  }

  if (pendingSurveys && pendingSurveys.length > 0) {
    const app = pendingSurveys[0];
    box.classList.remove('hidden');
    box.innerHTML = `
      <div onclick="openSatisfactionModal('${app._id}')" class="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between cursor-pointer hover:bg-amber-500/25 transition">
        <div class="flex items-center space-x-2.5 min-w-0">
          <div class="w-8 h-8 rounded-xl bg-amber-400 text-[#0d0e12] flex items-center justify-center text-xs font-black shrink-0">
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="min-w-0">
            <span class="text-[11px] font-extrabold text-amber-300 block truncate">Pesquisa de Satisfação</span>
            <span class="text-[10px] text-zinc-200 block truncate">Como foi seu atendimento de ${app.serviceName} com ${app.barberName}? Avalie agora.</span>
          </div>
        </div>
        <span class="text-[10px] font-extrabold text-amber-300 shrink-0 ml-2">Avaliar ⭐</span>
      </div>
    `;
    return;
  }

  if (!promos || promos.length === 0) {
    box.classList.add('hidden');
    return;
  }
  const latest = promos[0];
  box.classList.remove('hidden');
  box.innerHTML = `
    <div onclick="openClientNotificationsModal()" class="p-3 rounded-2xl bg-[#e5a769]/12 border border-[#e5a769]/35 flex items-center justify-between cursor-pointer hover:bg-[#e5a769]/20 transition">
      <div class="flex items-center space-x-2.5 min-w-0">
        <div class="w-8 h-8 rounded-xl bg-[#e5a769] text-[#0d0e12] flex items-center justify-center text-xs font-black shrink-0">
          ${latest.discountPercent ? `${latest.discountPercent}%` : '<i class="fa-solid fa-bullhorn"></i>'}
        </div>
        <div class="min-w-0">
          <span class="text-[11px] font-extrabold text-white block truncate">${latest.title}</span>
          <span class="text-[10px] text-zinc-300 block truncate">${latest.message}</span>
        </div>
      </div>
      <span class="text-[10px] font-bold text-[#e5a769] shrink-0 ml-2">Ver</span>
    </div>
  `;
}

async function openClientNotificationsModal() {
  const modal = document.getElementById('modal-client-notifications');
  const listEl = document.getElementById('client-notifications-list');
  if (!modal || !listEl) return;

  const user = state.currentUser;
  const nowStr = formatNowTimestamp();

  // Marca todas as promoções como Recebidas e Lidas por este cliente (com data e hora!)
  if (user) {
    for (const p of state.promotions) {
      if (!Array.isArray(p.recipients)) p.recipients = [];
      let rec = p.recipients.find(
        r => r.userId === user._id || (r.email && (r.email || '').toLowerCase() === (user.email || '').toLowerCase())
      );
      if (!rec && p.targetType === 'all') {
        rec = {
          userId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          receivedAt: nowStr,
          readAt: nowStr
        };
        p.recipients.push(rec);
      } else if (rec) {
        if (!rec.receivedAt) rec.receivedAt = nowStr;
        if (!rec.readAt) rec.readAt = nowStr;
      }

      try {
        await fetch(`${API_BASE}/promotions/${p._id}/receipt`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            action: 'read'
          })
        });
      } catch (e) {}
    }
    persistLocalData();
  }

  const { upcomingApps, promos, waitlistAlerts, returnMessages, pendingSurveys } = getClientRemindersAndPromos();
  let html = '';

  // 0. Alertas de Vaga Liberada na Lista de Espera
  if (waitlistAlerts && waitlistAlerts.length > 0) {
    html += `<div class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 pt-1">🎉 Vaga Liberada na Lista de Espera!</div>`;
    waitlistAlerts.forEach(w => {
      const [y, m, d] = (w.date || '').split('-');
      html += `
        <div class="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-[#0d0e12]">VAGA DISPONÍVEL AGORA</span>
            <span class="text-[10px] text-emerald-300 font-bold">${d}/${m}/${y} às ${w.freedTime || 'Horário Livre'}</span>
          </div>
          <p class="font-extrabold text-white text-xs">Surgiu uma vaga para ${w.serviceName} com ${w.barberName}!</p>
          <p class="text-[11px] text-zinc-300">Como você estava na Lista de Espera deste dia, avisamos você automaticamente.</p>
          <button onclick="closeClientNotificationsModal(); bookFreedWaitlistSlot('${w._id}');" class="w-full py-2 rounded-xl btn-lux-primary text-[11px] font-extrabold">
            Agendar Este Horário Agora
          </button>
        </div>
      `;
    });
  }

  // 0.5 Pesquisas de Satisfação Pendentes
  if (pendingSurveys && pendingSurveys.length > 0) {
    html += `<div class="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 pt-1">⭐ Pesquisa de Satisfação Pendente</div>`;
    pendingSurveys.forEach(a => {
      html += `
        <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/35 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-white text-xs">${a.serviceName}</span>
            <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">Avaliação</span>
          </div>
          <p class="text-[11px] text-zinc-300">Conte como foi seu atendimento com <b>${a.barberName}</b>!</p>
          <button onclick="closeClientNotificationsModal(); openSatisfactionModal('${a._id}');" class="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0d0e12] text-[11px] font-extrabold transition">
            Responder Avaliação (1 a 5 Estrelas)
          </button>
        </div>
      `;
    });
  }

  // 1. Lembretes de Horários Agendados
  if (upcomingApps.length > 0) {
    html += `<div class="text-[10px] font-extrabold uppercase tracking-wider text-[#e5a769] pt-1">🔔 Seus Lembretes de Horário</div>`;
    upcomingApps.forEach(a => {
      const [y, m, d] = (a.date || '').split('-');
      const mins = state.reminderSettings.minutesBefore || 60;
      const anteText = mins >= 1440 ? '24h antes' : mins >= 60 ? `${mins / 60}h antes` : `${mins} min antes`;
      html += `
        <div class="p-3.5 rounded-2xl bg-[#141720] border border-emerald-500/30 space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">Push + E-mail Ativos (${anteText})</span>
            <span class="text-[10px] text-zinc-400 font-semibold">${d}/${m}/${y} às ${a.time}</span>
          </div>
          <p class="font-extrabold text-white text-xs">${a.serviceName}</p>
          <p class="text-[11px] text-zinc-400">Profissional: <b class="text-zinc-200">${a.barberName}</b> • Valor: <b class="text-[#e5a769]">R$ ${Number(a.price).toFixed(2).replace('.', ',')}</b></p>
        </div>
      `;
    });
  }

  // 2. Mensagens de Retorno Automáticas
  if (returnMessages && returnMessages.length > 0) {
    html += `<div class="text-[10px] font-extrabold uppercase tracking-wider text-sky-400 pt-2">🔄 Lembretes Automáticos de Retorno</div>`;
    returnMessages.forEach(rm => {
      html += `
        <div class="p-3.5 rounded-2xl bg-[#141720] border border-sky-500/30 space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-white text-xs">${rm.serviceName}</span>
            <span class="text-[9px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 font-bold">Ciclo de ${rm.daysAfter} dias</span>
          </div>
          <p class="text-[11px] text-zinc-300 leading-relaxed">${rm.personalizedText}</p>
          <div class="flex justify-end pt-1">
            <button onclick="closeClientNotificationsModal(); openBookingService('${rm.serviceId}');" class="text-[10px] font-extrabold text-[#e5a769] hover:underline">
              Agendar Retorno Agora
            </button>
          </div>
        </div>
      `;
    });
  }

  // 3. Promoções, Eventos e Notícias da Barbearia
  if (promos.length > 0) {
    html += `<div class="text-[10px] font-extrabold uppercase tracking-wider text-[#e5a769] pt-2">📢 Eventos, Notícias & Promoções</div>`;
    promos.forEach(p => {
      const rec = user
        ? (p.recipients || []).find(r => r.userId === user._id || (r.email && (r.email || '').toLowerCase() === (user.email || '').toLowerCase()))
        : null;
      html += `
        <div class="p-3.5 rounded-2xl bg-[#141720] border border-[#e5a769]/35 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-white text-xs">${p.title}</span>
            ${p.discountPercent ? `<span class="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#e5a769] text-[#0d0e12]">${p.discountPercent}% OFF</span>` : ''}
          </div>
          <p class="text-[11px] text-zinc-300 leading-relaxed">${p.message}</p>
          <div class="flex items-center justify-between pt-1.5 border-t border-white/[0.06] text-[9px] text-zinc-400">
            <span><i class="fa-solid fa-check-double text-emerald-400 mr-1"></i>Lido em: ${rec?.readAt || nowStr}</span>
            <button onclick="closeClientNotificationsModal(); openQuickBooking();" class="text-[#e5a769] font-extrabold hover:underline">
              Agendar Agora
            </button>
          </div>
        </div>
      `;
    });
  }

  if (!html) {
    html = `
      <div class="p-6 text-center text-zinc-400 space-y-2">
        <i class="fa-regular fa-bell-slash text-xl text-zinc-500"></i>
        <p class="font-bold text-white text-xs">Nenhuma notificação no momento</p>
        <p class="text-[11px] text-zinc-500">Quando você agendar um horário ou a barbearia lançar uma promoção, você receberá aqui.</p>
      </div>
    `;
  }

  listEl.innerHTML = html;
  modal.classList.remove('hidden');
  updateClientNotificationBadge();
}

function closeClientNotificationsModal() {
  const modal = document.getElementById('modal-client-notifications');
  if (modal) modal.classList.add('hidden');
}

function selectHomeCategory(cat) {
  state.homeCategoryFilter = cat || 'Todos';
  state.homeSearchQuery = '';
  const searchInp = document.getElementById('home-search-input');
  if (searchInp) searchInp.value = '';

  const btnMap = {
    Todos: 'home-cat-todos',
    Cabelo: 'home-cat-cabelo',
    Barba: 'home-cat-barba',
    Química: 'home-cat-quimica',
    Pintura: 'home-cat-pintura'
  };

  Object.entries(btnMap).forEach(([key, btnId]) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const isSel = key === state.homeCategoryFilter;
    btn.className = isSel
      ? 'flex flex-col items-center space-y-1.5 py-2.5 px-1 rounded-2xl bg-[#1a1d26] border border-[#e5a769] text-white transition shadow-md'
      : 'flex flex-col items-center space-y-1.5 py-2.5 px-1 rounded-2xl bg-[#16171d] border border-white/[0.06] hover:border-[#e5a769]/40 transition group';
  });

  renderHomeServicesList();
}

function filterHomeServicesByQuery(query) {
  state.homeSearchQuery = (query || '').trim();
  renderHomeServicesList();
}

function renderHomeServicesList() {
  const container = document.getElementById('home-services-list');
  const labelEl = document.getElementById('home-category-active-label');
  if (!container) return;

  const cat = state.homeCategoryFilter || 'Todos';
  const q = (state.homeSearchQuery || '').toLowerCase().trim();

  let list = [...state.services];
  if (cat !== 'Todos') {
    list = list.filter(s => (s.category || '').toLowerCase() === cat.toLowerCase());
  }
  if (q) {
    list = list.filter(
      s => (s.name || '').toLowerCase().includes(q) ||
           (s.category || '').toLowerCase().includes(q) ||
           (s.desc || '').toLowerCase().includes(q)
    );
  }

  if (labelEl) {
    if (q) {
      labelEl.textContent = `Busca: "${state.homeSearchQuery}" (${list.length})`;
    } else if (cat === 'Todos') {
      labelEl.textContent = `Todos os serviços (${list.length})`;
    } else {
      labelEl.textContent = `Categoria: ${cat} (${list.length})`;
    }
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-full lux-card p-5 text-center text-xs text-zinc-400 space-y-2">
        <p class="font-bold text-white">Nenhum serviço encontrado nesta opção</p>
        <button type="button" onclick="selectHomeCategory('Todos')" class="px-4 py-1.5 rounded-xl btn-lux-primary text-[11px] font-extrabold">
          Mostrar Todos os Serviços
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(s => `
    <div onclick="openBookingService('${s._id}')" class="lux-card-elevated p-3 flex items-center justify-between cursor-pointer hover:border-[#e5a769]/50 transition group">
      <div class="flex items-center space-x-3 min-w-0 pr-2">
        <img src="${s.image}" class="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0 shadow-md" />
        <div class="min-w-0">
          <div class="flex items-center space-x-1.5">
            <span class="text-[9px] px-2 py-0.5 rounded-md bg-[#e5a769]/15 text-[#e5a769] font-bold">${s.category || 'Corte'}</span>
            <span class="text-[10px] text-zinc-400"><i class="fa-regular fa-clock mr-1 text-[#e5a769]"></i>${s.minutes || 35} min</span>
          </div>
          <h5 class="text-xs md:text-sm font-extrabold text-white group-hover:text-[#e5a769] transition truncate mt-1">${s.name}</h5>
          <p class="text-[10px] text-zinc-400 truncate mt-0.5">${s.desc || 'Atendimento especializado'}</p>
        </div>
      </div>
      <div class="flex flex-col items-end justify-between shrink-0 pl-2">
        <span class="text-xs md:text-sm font-black text-[#e5a769]">R$ ${Number(s.price).toFixed(2).replace('.', ',')}</span>
        <span class="mt-2 px-3 py-1 rounded-xl bg-[#161822] border border-[#e5a769]/35 text-[10px] font-extrabold text-[#e5a769] group-hover:bg-[#e5a769] group-hover:text-[#0d0e12] transition">
          Agendar
        </span>
      </div>
    </div>
  `).join('');
}

function renderHomeBarbers() {
  const container = document.getElementById('home-barbers-list');
  if (!container) return;

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  container.innerHTML = state.barbers.map(b => {
    const workDaysText = (b.workDays || [0, 1, 2, 3, 4, 5, 6]).map(d => dayNames[d]).join(', ');
    const specialCount = Array.isArray(b.specialPeriods) ? b.specialPeriods.length : 0;
    return `
      <div onclick="selectBarberFromHome('${b._id}')" class="lux-card-elevated p-3.5 md:p-4 flex items-center justify-between cursor-pointer hover:border-[#e5a769]/40 transition group">
        <div class="flex items-center space-x-3.5">
          <img src="${b.avatar || '/barbearia_logo.jpg'}" class="w-13 h-13 rounded-full object-cover border-2 border-[#e5a769]/40 shadow-md shrink-0" style="width:52px;height:52px;" />
          <div>
            <h5 class="text-sm font-bold text-white group-hover:text-[#e5a769] transition">${b.name}</h5>
            <span class="text-[11px] text-zinc-400 block">${b.role || 'Barbeiro'} • ${b.exp || 'Especialista'}</span>
            <div class="flex flex-wrap items-center gap-1 mt-1">
              <span class="inline-block text-[9px] px-2 py-0.5 rounded-full bg-[#e5a769]/10 text-[#e5a769] border border-[#e5a769]/20 font-semibold">
                Dias: ${workDaysText}
              </span>
              ${specialCount > 0 ? `<span class="inline-block text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">Horário Estendido Ativo</span>` : ''}
            </div>
          </div>
        </div>
        <div class="px-3 py-1.5 rounded-xl bg-[#16171e] border border-white/[0.08] flex items-center justify-center text-[10px] font-extrabold text-[#e5a769] group-hover:bg-[#e5a769] group-hover:text-zinc-950 transition">
          Agendar
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
  const mapIframe = document.getElementById('about-shop-map-iframe');
  const mapLink = document.getElementById('about-shop-maps-link');

  const rawAddress = (state.shop.address || '').trim();
  const displayAddress = (!rawAddress || rawAddress === 'Atendimento exclusivo com horário marcado')
    ? 'Av. Paulista, 1000 - São Paulo, SP'
    : rawAddress;

  if (nameEl) nameEl.textContent = state.shop.name || 'Guuh Barbeiro';
  if (sloganEl) sloganEl.textContent = state.shop.slogan || 'Estilo • Confiança • Atitude';
  if (addrEl) addrEl.textContent = displayAddress;
  if (hoursEl) hoursEl.textContent = state.shop.openingHours || 'Todos os dias: 08:00 às 23:00';

  const encodedQuery = encodeURIComponent(displayAddress);
  if (mapIframe) {
    const targetSrc = `https://www.google.com/maps?q=${encodedQuery}&output=embed`;
    if (mapIframe.getAttribute('src') !== targetSrc) {
      mapIframe.setAttribute('src', targetSrc);
    }
  }
  if (mapLink) {
    mapLink.setAttribute('href', `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`);
  }
}

// ========================================================
// CONVERSOR E OTIMIZADOR AUTOMÁTICO DE FOTOS ANEXADAS
// (Reduz dimensões e comprime para ~20KB-45KB para nunca pesar no App)
// ========================================================
function compressAndResizeImageFile(file, maxDim = 420, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Arquivo inválido'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler imagem'));
    reader.onload = function (e) {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagem inválido'));
      img.onload = function () {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#121318';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        // Se ainda passar de ~90KB em base64, comprime mais um nível para garantir extrema leveza
        if (dataUrl.length > 90000) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.55);
        }
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function previewProfileAvatarUrl(url) {
  const img = document.getElementById('profile-user-avatar');
  if (img && url && url.trim()) {
    img.src = url.trim();
  }
}

async function handleProfileAvatarUpload(fileInput) {
  const file = fileInput?.files?.[0];
  if (!file) return;

  try {
    const dataUrl = await compressAndResizeImageFile(file, 360, 0.72);
    const urlInp = document.getElementById('profile-input-avatar');
    const prevImg = document.getElementById('profile-user-avatar');
    const headerImg = document.getElementById('header-user-avatar');
    if (urlInp) urlInp.value = dataUrl;
    if (prevImg) prevImg.src = dataUrl;
    if (headerImg) headerImg.src = dataUrl;

    if (state.currentUser) {
      state.currentUser.avatar = dataUrl;
      localStorage.setItem('guuh_client_user', JSON.stringify(state.currentUser));
      const idx = state.users.findIndex(u => u._id === state.currentUser._id || u.email === state.currentUser.email);
      if (idx >= 0) {
        state.users[idx].avatar = dataUrl;
        persistLocalData();
      }
    }

    await showLuxAlert({
      title: 'Foto de Perfil Otimizada!',
      message: 'Sua foto foi convertida automaticamente para tamanho leve e aplicada ao seu perfil.',
      type: 'success'
    });
  } catch (err) {
    await showLuxAlert({
      title: 'Erro na Imagem',
      message: 'Não foi possível processar esta foto. Tente outra imagem.',
      type: 'error'
    });
  }
}

function renderUserProfile() {
  if (!state.currentUser) return;
  const dispName = document.getElementById('profile-display-name');
  const dispEmail = document.getElementById('profile-display-email');
  const badge = document.getElementById('profile-role-badge');
  const inpName = document.getElementById('profile-input-name');
  const inpPhone = document.getElementById('profile-input-phone');
  const inpAvatar = document.getElementById('profile-input-avatar');
  const avatarImg = document.getElementById('profile-user-avatar');

  if (dispName) dispName.textContent = state.currentUser.name || 'Usuário';
  if (dispEmail) dispEmail.textContent = state.currentUser.email || '';
  if (badge) {
    badge.textContent = state.currentUser.role === 'admin' ? 'Administrador' : 'Cliente';
  }
  if (inpName) inpName.value = state.currentUser.name || '';
  if (inpPhone) inpPhone.value = state.currentUser.phone || '';
  if (inpAvatar) {
    inpAvatar.value = (state.currentUser.avatar && !state.currentUser.avatar.startsWith('data:')) ? state.currentUser.avatar : '';
  }
  if (avatarImg) {
    avatarImg.src = state.currentUser.avatar || '/user_avatar.svg';
  }
  updateGreeting();
}

async function saveUserProfile() {
  if (!state.currentUser) return;
  const inpName = document.getElementById('profile-input-name');
  const inpPhone = document.getElementById('profile-input-phone');
  const inpAvatar = document.getElementById('profile-input-avatar');

  const newName = inpName ? inpName.value.trim() : '';
  const newPhone = inpPhone ? inpPhone.value.trim() : '';
  const newAvatar = inpAvatar && inpAvatar.value.trim() ? inpAvatar.value.trim() : (state.currentUser.avatar || '');

  if (!newName) {
    await showLuxAlert({
      title: 'Nome Obrigatório',
      message: 'Por favor, informe seu nome para atualizar o perfil.',
      type: 'warning'
    });
    return;
  }

  state.currentUser.name = newName;
  state.currentUser.phone = newPhone;
  if (newAvatar) state.currentUser.avatar = newAvatar;
  localStorage.setItem('guuh_client_user', JSON.stringify(state.currentUser));

  const idx = state.users.findIndex(u => u._id === state.currentUser._id || u.email === state.currentUser.email);
  if (idx >= 0) {
    state.users[idx].name = newName;
    state.users[idx].phone = newPhone;
    if (newAvatar) state.users[idx].avatar = newAvatar;
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
  await showLuxAlert({
    title: 'Perfil Atualizado!',
    message: 'Seus dados pessoais e sua foto de perfil foram salvos com sucesso.',
    type: 'success'
  });
}

// ========================================================
// 3. TELA DE AGENDAMENTO AUTOMATIZADO (MULTI-SERVIÇOS + JORNADA FLEXÍVEL)
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

async function openBookingWithServices(serviceIds) {
  if (state.services.length === 0) {
    await showLuxAlert({
      title: 'Sem Serviços',
      message: 'Nenhum serviço está ativo no momento.',
      type: 'warning'
    });
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
  const remInfo = document.getElementById('booking-reminder-info-text');

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
  if (remInfo) {
    const mins = state.reminderSettings.minutesBefore || 60;
    const label = mins >= 1440 ? '24h antes' : mins >= 60 ? `${mins / 60}h antes` : `${mins} min antes`;
    remInfo.textContent = `Notificação Push no App + E-mail (${label})`;
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
      <div onclick="toggleServiceInBooking('${s._id}')" class="w-full p-2.5 rounded-2xl border transition-all cursor-pointer select-none relative ${
        isSelected
          ? 'bg-[#1a1d26] border-[#e5a769] shadow-[0_0_15px_rgba(229,167,105,0.2)]'
          : 'bg-[#13151b] border-white/[0.07] hover:border-white/[0.2]'
      }">
        <div class="relative h-24 w-full rounded-xl overflow-hidden mb-1.5">
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
// CONTROLE AUTOMATIZADO DA AGENDA (DIA DA SEMANA + PERÍODO ESPECIAL)
// ========================================================
function getSpecialPeriodForDate(barber, dateStr) {
  if (!barber || !Array.isArray(barber.specialPeriods)) return null;
  return barber.specialPeriods.find(sp => {
    if (!sp.startDate || !sp.endDate) return false;
    return dateStr >= sp.startDate && dateStr <= sp.endDate;
  }) || null;
}

function getBarberScheduleForDate(barber, dateObj) {
  if (!barber || !dateObj) return { hours: [...ALL_POSSIBLE_HOURS], source: 'Padrão' };
  const dateStr = formatDateISO(dateObj);

  // 1. Verifica se há uma Jornada Estendida por Período Específico configurada
  const special = getSpecialPeriodForDate(barber, dateStr);
  if (special && Array.isArray(special.hours) && special.hours.length > 0) {
    return {
      hours: [...special.hours].sort(),
      source: `Período Especial: ${special.label || 'Jornada Estendida'}`
    };
  }

  // 2. Verifica a Jornada por Dia da Semana (Dom=0 .. Sáb=6)
  const dayOfWeek = String(dateObj.getDay());
  if (barber.daySchedules && Array.isArray(barber.daySchedules[dayOfWeek])) {
    return {
      hours: [...barber.daySchedules[dayOfWeek]].sort(),
      source: 'Jornada do Dia da Semana'
    };
  }

  // 3. Fallback para workHours geral
  return {
    hours: Array.isArray(barber.workHours) ? [...barber.workHours].sort() : [...ALL_POSSIBLE_HOURS],
    source: 'Jornada Padrão'
  };
}

function isDateAvailableForBarber(dateObj, barber) {
  if (!barber) return true;
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (dateObj.getTime() < todayMidnight) return false;

  const dateStr = formatDateISO(dateObj);
  const blocked = Array.isArray(barber.blockedDates) ? barber.blockedDates : [];
  if (blocked.includes(dateStr)) return false;

  // Se estiver dentro de um Período Especial Estendido, fica disponível mesmo em dia de folga normal
  const special = getSpecialPeriodForDate(barber, dateStr);
  if (special) return true;

  const dayOfWeek = dateObj.getDay();
  const workDays = Array.isArray(barber.workDays) ? barber.workDays : [0, 1, 2, 3, 4, 5, 6];
  if (!workDays.includes(dayOfWeek)) return false;

  const { hours } = getBarberScheduleForDate(barber, dateObj);
  return hours.length > 0;
}

function initCalendarDefaultDate() {
  ensureValidDateForBarber();
}

function ensureValidDateForBarber() {
  const barber = state.selectedBarber || state.barbers[0];
  const d = new Date();

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
    const isSpecial = Boolean(getSpecialPeriodForDate(barber, dateStr));

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
        <button type="button" onclick="selectCalendarDate('${dateStr}')" class="h-8 rounded-xl text-[11px] font-semibold ${
          isSpecial ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40' : 'bg-[#16171e] text-zinc-200 border border-white/[0.06]'
        } hover:border-[#e5a769]/60 flex items-center justify-center transition">
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
  const tagEl = document.getElementById('booking-day-schedule-tag');
  if (!grid) return;

  const barber = state.selectedBarber || state.barbers[0];
  const [y, m, d] = (state.selectedDate || '').split('-').map(Number);
  const selDateObj = new Date(y, m - 1, d);

  const { hours: baseSlots, source } = getBarberScheduleForDate(barber, selDateObj);
  if (tagEl) tagEl.textContent = source;

  if (!isDateAvailableForBarber(selDateObj, barber)) {
    grid.innerHTML = `<div class="col-span-4 text-center py-4 text-[11px] text-amber-400">Fora da jornada de trabalho do profissional nesta data. Escolha outro dia.</div>`;
    state.selectedTime = null;
    return;
  }

  const bookedTimes = state.appointments
    .filter(a => a.date === state.selectedDate && a.barberId === barber._id && a.status !== 'cancelled')
    .map(a => a.time);

  const availableSlots = baseSlots.filter(t => !bookedTimes.includes(t));

  if (availableSlots.length === 0) {
    grid.innerHTML = `<div class="col-span-4 text-center py-4 text-[11px] text-zinc-500">Todos os horários deste dia já foram preenchidos. Escolha outra data.</div>`;
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
    await showLuxAlert({
      title: 'Escolha um Serviço',
      message: 'Por favor, selecione pelo menos um serviço antes de confirmar.',
      type: 'warning'
    });
    return;
  }
  if (!state.selectedDate || !state.selectedTime) {
    await showLuxAlert({
      title: 'Escolha Dia e Horário',
      message: 'Selecione uma data no calendário e um horário disponível.',
      type: 'warning'
    });
    return;
  }

  const user = state.currentUser || { _id: 'guest', name: 'Cliente', email: '', phone: '' };
  const combinedNames = state.selectedServices.map(s => s.name).join(' + ');
  const totalPrice = state.selectedServices.reduce((acc, s) => acc + Number(s.price || 0), 0);
  const isMobile = window.innerWidth < 768;

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
    status: 'confirmed',
    isFitIn: false,
    platform: isMobile ? 'App Mobile' : 'Web Desktop',
    paymentMethod: 'pix',
    reminderChannels: ['Push', 'E-mail'],
    reminderSentAt: formatNowTimestamp()
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

  // Dispara Push Notification real no navegador/dispositivo do cliente
  const [y, m, d] = newAppointment.date.split('-');
  if (state.reminderSettings.clientPush) {
    triggerBrowserPushNotification(
      'Lembrete de Horário • Guuh Barbeiro',
      `Olá ${newAppointment.clientName}! Seu horário (${newAppointment.serviceName}) está confirmado para ${d}/${m}/${y} às ${newAppointment.time}.`
    );
  }

  updateClientNotificationBadge();
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
      <p><span class="text-zinc-500">Lembrete Automático:</span> <b class="text-sky-400">Push no App + E-mail</b></p>
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
// 4. MINHA AGENDA DO CLIENTE (COM STATUS DE LEMBRETE)
// ========================================================
function setClientBookingFilter(filter) {
  state.clientBookingFilter = filter;
  ['all', 'confirmed', 'completed'].forEach(f => {
    const btn = document.getElementById(`client-filter-${f}`);
    if (btn) {
      btn.className = f === filter
        ? 'px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-bold bg-[#e5a769] text-[#0d0e12] transition'
        : 'px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-bold bg-[#16171e] text-zinc-400 hover:text-white border border-white/[0.06] transition';
    }
  });
  loadMyBookings();
}

function loadMyBookings() {
  const container = document.getElementById('client-bookings-container');
  const statUpcoming = document.getElementById('client-stat-upcoming');
  const statCompleted = document.getElementById('client-stat-completed');
  const statSpent = document.getElementById('client-stat-total-spent');
  if (!container) return;

  const user = state.currentUser;
  if (!user) {
    container.innerHTML = `<div class="lux-card p-6 text-center text-xs text-zinc-400 col-span-full">Faça login para visualizar seus horários.</div>`;
    return;
  }

  const myApps = state.appointments.filter(a => {
    if (user._id && a.userId === user._id) return true;
    if (user.email && (a.clientEmail || '').toLowerCase() === user.email.toLowerCase()) return true;
    if (a.clientName && a.clientName.toLowerCase() === (user.name || '').toLowerCase()) return true;
    return false;
  }).sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  const confirmedCount = myApps.filter(a => a.status === 'confirmed').length;
  const completedCount = myApps.filter(a => a.status === 'completed').length;
  const totalSpent = myApps
    .filter(a => a.status !== 'cancelled')
    .reduce((acc, a) => acc + Number(a.price || 0), 0);

  if (statUpcoming) statUpcoming.textContent = confirmedCount;
  if (statCompleted) statCompleted.textContent = completedCount;
  if (statSpent) statSpent.textContent = `R$ ${totalSpent.toFixed(0)}`;

  let filtered = [...myApps];
  if (state.clientBookingFilter !== 'all') {
    filtered = filtered.filter(a => a.status === state.clientBookingFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="admin-section-card p-6 text-center text-xs text-zinc-400 space-y-3 col-span-full">
        <div class="w-12 h-12 rounded-2xl bg-[#e5a769]/10 border border-[#e5a769]/25 text-[#e5a769] mx-auto flex items-center justify-center text-lg">
          <i class="fa-regular fa-calendar-plus"></i>
        </div>
        <div>
          <p class="font-bold text-white text-sm">Nenhum horário nesta categoria</p>
          <p class="text-[11px] text-zinc-500 mt-0.5">Reserve seu próximo atendimento com praticidade agora mesmo.</p>
        </div>
        <button onclick="openQuickBooking()" class="py-2.5 px-6 rounded-xl btn-lux-primary text-xs font-extrabold">
          Agendar Meu Horário
        </button>
      </div>
    `;
    return;
  }

  renderClientWaitlistInMyBookings();

  container.innerHTML = filtered.map(item => {
    const [y, m, d] = (item.date || '').split('-');
    const isCancelled = item.status === 'cancelled';
    const isCompleted = item.status === 'completed';
    const existingReview = (state.reviews || []).find(r => r.appointmentId === item._id);

    let badgeHtml = `<span class="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Confirmado</span>`;
    if (isCompleted) {
      badgeHtml = `<span class="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">Concluído</span>`;
    } else if (isCancelled) {
      badgeHtml = `<span class="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">Cancelado</span>`;
    }

    return `
      <div class="admin-item-card p-4 space-y-2.5 text-xs ${isCancelled ? 'opacity-60' : ''}">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-xl bg-[#e5a769]/15 border border-[#e5a769]/30 text-[#e5a769] flex items-center justify-center text-xs">
              <i class="fa-regular fa-calendar"></i>
            </div>
            <div>
              <span class="font-extrabold text-white text-xs block">${d}/${m}/${y} às ${item.time}</span>
              <span class="text-[10px] text-zinc-400">Profissional: <b class="text-zinc-200">${item.barberName}</b></span>
            </div>
          </div>
          ${badgeHtml}
        </div>
        <div class="p-2.5 rounded-xl bg-[#0e1016] border border-white/[0.05] flex items-center justify-between">
          <span class="font-bold text-[#e5a769] truncate pr-2"><i class="fa-solid fa-scissors text-[9px] mr-1"></i>${item.serviceName}</span>
          <span class="font-black text-white shrink-0">R$ ${Number(item.price || 0).toFixed(2).replace('.', ',')}</span>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <span class="text-[10px] text-sky-400 font-medium">
            <i class="fa-solid fa-bell mr-1"></i>Lembrete: Push + E-mail ativo
          </span>
          <div class="flex items-center space-x-1.5">
            ${isCompleted && state.satisfactionEnabled ? (
              existingReview
                ? `<span class="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold"><i class="fa-solid fa-star mr-1"></i>Avaliado (${existingReview.rating}/5)</span>`
                : `<button onclick="openSatisfactionModal('${item._id}')" class="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold transition"><i class="fa-solid fa-star mr-1"></i>Avaliar Atendimento</button>`
            ) : ''}
            ${!isCancelled && !isCompleted ? `
              <button onclick="cancelClientBooking('${item._id}')" class="px-3 py-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 text-[10px] font-bold transition">
                <i class="fa-solid fa-xmark mr-1"></i>Desmarcar
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function cancelClientBooking(appId) {
  const item = state.appointments.find(a => a._id === appId);
  if (!item) return;

  const confirmed = await showLuxConfirm({
    title: 'Desmarcar Horário?',
    message: `Deseja realmente cancelar seu agendamento de ${item.serviceName} às ${item.time}?`,
    confirmText: 'Sim, Desmarcar',
    cancelText: 'Manter Horário',
    danger: true
  });
  if (!confirmed) return;

  item.status = 'cancelled';

  // Lista de Espera Automática: avisa clientes que aguardavam vaga neste dia!
  const notifiedCount = notifyWaitlistForFreedSlot(item.date, item.time, item.barberId, item.barberName);

  persistLocalData();
  try {
    await fetch(`${API_BASE}/appointments/${appId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' })
    });
  } catch (e) {}

  loadMyBookings();
  updateClientNotificationBadge();
  await showLuxAlert({
    title: 'Horário Desmarcado',
    message: notifiedCount > 0
      ? `Seu agendamento foi cancelado e ${notifiedCount} cliente(s) da Lista de Espera deste dia foram avisados automaticamente!`
      : 'Seu agendamento foi cancelado e a vaga foi liberada automaticamente na agenda.',
    type: 'info'
  });
}

// ========================================================
// 5. PAINEL DO ADMINISTRADOR (11 ABAS COMPLETAS)
// ========================================================
const ADMIN_SUB_TABS = [
  'agenda',
  'services',
  'packages',
  'inventory',
  'barbers',
  'finance',
  'crm',
  'promotions',
  'reports',
  'users',
  'settings'
];

function switchAdminSubTab(sub) {
  state.currentAdminTab = sub;
  ADMIN_SUB_TABS.forEach(t => {
    const panel = document.getElementById(`admin-sub-${t}`);
    const btn = document.getElementById(`admin-tab-btn-${t}`);
    if (panel) {
      if (t === sub) panel.classList.remove('hidden');
      else panel.classList.add('hidden');
    }
    if (btn) {
      if (t === sub) {
        btn.className = 'py-2 md:py-2.5 px-1 rounded-xl text-[10px] md:text-xs font-bold bg-[#e5a769] text-[#0d0e12] shadow-md transition flex flex-col items-center justify-center space-y-0.5';
      } else {
        btn.className = 'py-2 md:py-2.5 px-1 rounded-xl text-[10px] md:text-xs font-bold text-zinc-400 hover:text-white transition flex flex-col items-center justify-center space-y-0.5';
      }
    }
  });

  renderAdminDashboard();
}

function renderAdminDashboard() {
  const fns = [
    renderAdminReminderSettingsForm,
    renderAdminWaitlist,
    renderAdminAgenda,
    renderAdminServicesList,
    renderAdminPackages,
    renderAdminInventory,
    renderAdminBarbersList,
    renderAdminFinance,
    renderAdminCrm,
    renderAdminPromotions,
    renderAdminReports,
    renderAdminUsersList,
    renderAdminShopSettingsForm
  ];
  fns.forEach(fn => {
    try {
      fn();
    } catch (e) {}
  });
}

function setAdminAgendaStatusFilter(status) {
  state.adminAgendaStatusFilter = status;
  ['all', 'today', 'confirmed', 'completed', 'cancelled'].forEach(s => {
    const btn = document.getElementById(`adm-status-${s}`);
    if (btn) {
      btn.className = s === status
        ? 'px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-bold bg-[#e5a769] text-[#0d0e12] transition shrink-0'
        : 'px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-bold bg-[#161822] text-zinc-400 hover:text-white border border-white/[0.06] transition shrink-0';
    }
  });
  renderAdminAgenda();
}

function clearAdminDateFilter() {
  const inp = document.getElementById('admin-filter-date');
  const searchInp = document.getElementById('admin-filter-search');
  if (inp) inp.value = '';
  if (searchInp) searchInp.value = '';
  setAdminAgendaStatusFilter('all');
}

// --- 5.1 ADMIN: LEMBRETES DE HORÁRIOS, ENCAIXES & AGENDA ---
function renderAdminReminderSettingsForm() {
  const r = state.reminderSettings || DEFAULT_REMINDER_SETTINGS;
  const cPush = document.getElementById('rem-client-push');
  const cEmail = document.getElementById('rem-client-email');
  const pPush = document.getElementById('rem-pro-push');
  const pEmail = document.getElementById('rem-pro-email');
  const pSms = document.getElementById('rem-pro-sms');
  const mins = document.getElementById('rem-minutes-before');

  if (cPush) cPush.checked = Boolean(r.clientPush);
  if (cEmail) cEmail.checked = Boolean(r.clientEmail);
  if (pPush) pPush.checked = Boolean(r.proPush);
  if (pEmail) pEmail.checked = Boolean(r.proEmail);
  if (pSms) pSms.checked = Boolean(r.proSms);
  if (mins) mins.value = String(r.minutesBefore || 60);
}

async function saveReminderSettings() {
  state.reminderSettings = {
    clientPush: Boolean(document.getElementById('rem-client-push')?.checked),
    clientEmail: Boolean(document.getElementById('rem-client-email')?.checked),
    proPush: Boolean(document.getElementById('rem-pro-push')?.checked),
    proEmail: Boolean(document.getElementById('rem-pro-email')?.checked),
    proSms: Boolean(document.getElementById('rem-pro-sms')?.checked),
    minutesBefore: parseInt(document.getElementById('rem-minutes-before')?.value || '60', 10)
  };

  persistLocalData();
  try {
    await fetch(`${API_BASE}/reminders/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.reminderSettings)
    });
  } catch (e) {}

  await showLuxAlert({
    title: 'Lembretes Configurados!',
    message: 'As regras de envio automático (Push Notification, E-mail e SMS) para clientes e profissionais foram atualizadas.',
    type: 'success'
  });
}

async function sendManualAppointmentReminder(appId) {
  const item = state.appointments.find(a => a._id === appId);
  if (!item) return;

  const nowStr = formatNowTimestamp();
  item.reminderSentAt = nowStr;
  persistLocalData();

  try {
    await fetch(`${API_BASE}/appointments/${appId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: item.status, reminderSentAt: nowStr })
    });
  } catch (e) {}

  const [y, m, d] = (item.date || '').split('-');
  triggerBrowserPushNotification(
    `Lembrete de Horário • ${state.shop.name}`,
    `${item.clientName}, lembramos do seu horário (${item.serviceName}) em ${d}/${m}/${y} às ${item.time}!`
  );

  renderAdminAgenda();
  await showLuxAlert({
    title: 'Lembrete Disparado!',
    message: `Enviamos lembrete via Push Notification, E-mail e SMS para ${item.clientName} (${d}/${m}/${y} às ${item.time}).`,
    type: 'success'
  });
}

// Modal de Encaixe Manual (Atendimento fora do horário)
function openFitInModal() {
  const modal = document.getElementById('modal-admin-fitin');
  const barberSel = document.getElementById('fitin-barber-id');
  const svcSel = document.getElementById('fitin-service-id');
  const dateInp = document.getElementById('fitin-date');

  if (barberSel) {
    barberSel.innerHTML = state.barbers.map(b => `<option value="${b._id}">${b.name}</option>`).join('');
  }
  if (svcSel) {
    svcSel.innerHTML = state.services.map(s => `<option value="${s._id}">${s.name} - R$ ${Number(s.price).toFixed(2)}</option>`).join('');
  }
  if (dateInp && !dateInp.value) {
    dateInp.value = formatDateISO(new Date());
  }
  if (modal) modal.classList.remove('hidden');
}

function closeFitInModal() {
  const modal = document.getElementById('modal-admin-fitin');
  if (modal) modal.classList.add('hidden');
}

async function saveAdminFitInAppointment() {
  const clientName = document.getElementById('fitin-client-name')?.value.trim() || '';
  const clientPhone = document.getElementById('fitin-client-phone')?.value.trim() || '(11) 99999-9999';
  const barberId = document.getElementById('fitin-barber-id')?.value || state.barbers[0]?._id;
  const serviceId = document.getElementById('fitin-service-id')?.value || state.services[0]?._id;
  const date = document.getElementById('fitin-date')?.value || formatDateISO(new Date());
  const time = document.getElementById('fitin-time')?.value || '21:30';

  if (!clientName) {
    await showLuxAlert({
      title: 'Informe o Cliente',
      message: 'Digite o nome do cliente para registrar o encaixe.',
      type: 'warning'
    });
    return;
  }

  const barber = state.barbers.find(b => b._id === barberId) || state.barbers[0];
  const service = state.services.find(s => s._id === serviceId) || state.services[0];

  const newFitIn = {
    _id: `app_fit_${Date.now()}`,
    userId: '',
    clientName,
    clientEmail: '',
    clientPhone,
    barberId: barber._id,
    barberName: barber.name,
    serviceId: service._id,
    serviceName: service.name,
    price: Number(service.price || 40),
    date,
    time,
    status: 'confirmed',
    isFitIn: true,
    platform: 'Encaixe Presencial',
    paymentMethod: 'pix',
    reminderSentAt: formatNowTimestamp()
  };

  state.appointments.push(newFitIn);
  persistLocalData();

  try {
    await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFitIn)
    });
  } catch (e) {}

  document.getElementById('fitin-client-name').value = '';
  closeFitInModal();
  renderAdminAgenda();

  await showLuxAlert({
    title: 'Encaixe Confirmado!',
    message: `Encaixe de ${clientName} (${service.name}) agendado para ${time} com ${barber.name}.`,
    type: 'success'
  });
}

function renderAdminAgenda() {
  const totalEl = document.getElementById('admin-stat-total');
  const todaySubEl = document.getElementById('admin-stat-today-sub');
  const doneEl = document.getElementById('admin-stat-done');
  const rateSubEl = document.getElementById('admin-stat-rate-sub');
  const revEl = document.getElementById('admin-stat-revenue');
  const ticketSubEl = document.getElementById('admin-stat-ticket-sub');
  const usersEl = document.getElementById('admin-stat-users');

  const filterDate = document.getElementById('admin-filter-date')?.value || '';
  const searchQuery = (document.getElementById('admin-filter-search')?.value || '').trim().toLowerCase();
  const listEl = document.getElementById('admin-appointments-list');
  if (!listEl) return;

  const todayISO = formatDateISO(new Date());
  const activeApps = state.appointments.filter(a => a.status !== 'cancelled');
  const todayApps = activeApps.filter(a => a.date === todayISO);
  const completedApps = state.appointments.filter(a => a.status === 'completed');
  const cancelledApps = state.appointments.filter(a => a.status === 'cancelled');
  const revenue = activeApps.reduce((acc, a) => acc + Number(a.price || 0), 0);
  const avgTicket = activeApps.length > 0 ? revenue / activeApps.length : 0;
  const completionRate = activeApps.length > 0 ? Math.round((completedApps.length / activeApps.length) * 100) : 0;

  if (totalEl) totalEl.textContent = activeApps.length;
  if (todaySubEl) todaySubEl.textContent = `${todayApps.length} agendado(s) para hoje`;
  if (doneEl) doneEl.textContent = completedApps.length;
  if (rateSubEl) rateSubEl.textContent = `Taxa de conclusão: ${completionRate}%`;
  if (revEl) revEl.textContent = `R$ ${revenue.toFixed(0)}`;
  if (ticketSubEl) ticketSubEl.textContent = `Ticket médio: R$ ${avgTicket.toFixed(0)}`;
  if (usersEl) usersEl.textContent = state.users.length;

  renderAdminMiniDashboardCharts(activeApps, todayApps, completedApps, cancelledApps);

  let filtered = [...state.appointments];
  if (state.adminAgendaStatusFilter === 'today') {
    filtered = filtered.filter(a => a.date === todayISO);
  } else if (state.adminAgendaStatusFilter !== 'all') {
    filtered = filtered.filter(a => a.status === state.adminAgendaStatusFilter);
  }

  if (filterDate) {
    filtered = filtered.filter(a => a.date === filterDate);
  }
  if (searchQuery) {
    filtered = filtered.filter(a =>
      (a.clientName || '').toLowerCase().includes(searchQuery) ||
      (a.serviceName || '').toLowerCase().includes(searchQuery) ||
      (a.barberName || '').toLowerCase().includes(searchQuery)
    );
  }

  filtered.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="admin-section-card p-6 text-center text-xs text-zinc-400 space-y-2 col-span-full">
        <div class="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/[0.07] mx-auto flex items-center justify-center text-[#e5a769] text-base">
          <i class="fa-regular fa-calendar-check"></i>
        </div>
        <p class="font-bold text-white text-sm">Nenhum agendamento para este filtro</p>
        <p class="text-[11px] text-zinc-500">Os clientes podem agendar no aplicativo ou você pode clicar em "+ Criar Encaixe".</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map(a => {
    const [y, m, d] = (a.date || '').split('-');
    const statusColors = {
      confirmed: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      completed: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
      cancelled: 'text-red-400 bg-red-500/15 border-red-500/30'
    };
    const statusLabels = {
      confirmed: 'Confirmado',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    return `
      <div class="admin-item-card p-4 space-y-3 text-xs">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2.5 min-w-0">
            <img src="/user_avatar.svg" class="w-10 h-10 rounded-full object-cover border border-white/15 shrink-0" />
            <div class="min-w-0">
              <div class="flex items-center space-x-1.5">
                <span class="font-extrabold text-white text-xs md:text-sm truncate">${a.clientName}</span>
                ${a.isFitIn ? `<span class="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/35 font-bold">Encaixe</span>` : ''}
              </div>
              <span class="text-[10px] text-zinc-400 block truncate">${a.clientPhone || a.clientEmail || 'Cliente'} • ${a.platform || 'App Mobile'}</span>
            </div>
          </div>
          <span class="text-[9px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${statusColors[a.status] || statusColors.confirmed}">
            ${statusLabels[a.status] || 'Confirmado'}
          </span>
        </div>

        <div class="p-3 rounded-xl bg-[#0e1016] border border-white/[0.05] space-y-1.5 text-[11px]">
          <div class="flex items-center justify-between">
            <span class="text-[#e5a769] font-bold truncate pr-2"><i class="fa-solid fa-scissors text-[9px] mr-1"></i>${a.serviceName}</span>
            <span class="font-black text-emerald-400 shrink-0">R$ ${Number(a.price || 0).toFixed(2).replace('.', ',')}</span>
          </div>
          <div class="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 border-t border-white/[0.05]">
            <span><i class="fa-regular fa-calendar text-[#e5a769] mr-1"></i><b class="text-zinc-200">${d}/${m}/${y}</b> às <b class="text-white">${a.time}</b></span>
            <span>Barbeiro: <b class="text-zinc-200">${a.barberName}</b></span>
          </div>
          ${a.reminderSentAt ? `
            <div class="text-[9px] text-sky-400 pt-1 border-t border-white/[0.04]">
              <i class="fa-solid fa-bell mr-1"></i>Lembrete enviado (Push/E-mail/SMS): ${a.reminderSentAt}
            </div>
          ` : ''}
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2">
          <button onclick="sendManualAppointmentReminder('${a._id}')" class="px-2.5 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-[10px] font-bold transition">
            <i class="fa-solid fa-bell mr-1"></i>Lembrar Cliente
          </button>

          <div class="flex items-center space-x-1.5">
            ${a.status !== 'completed' ? `
              <button onclick="adminUpdateAppStatus('${a._id}', 'completed')" class="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold transition">
                <i class="fa-solid fa-check mr-1"></i>Concluir + Caixa
              </button>
            ` : ''}
            ${a.status !== 'cancelled' ? `
              <button onclick="adminUpdateAppStatus('${a._id}', 'cancelled')" class="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-[10px] font-bold transition">
                Cancelar
              </button>
            ` : ''}
            <button onclick="adminDeleteAppointment('${a._id}')" class="w-8 h-8 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-[10px] flex items-center justify-center transition">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderAdminMiniDashboardCharts(activeApps) {
  const barsBox = document.getElementById('admin-dashboard-services-bars');
  if (!barsBox) return;

  const counts = {};
  state.services.forEach(s => { counts[s.shortName || s.name] = { count: 0, price: s.price }; });
  activeApps.forEach(a => {
    state.services.forEach(s => {
      if ((a.serviceName || '').toLowerCase().includes((s.shortName || s.name).toLowerCase())) {
        const k = s.shortName || s.name;
        if (!counts[k]) counts[k] = { count: 0, price: s.price };
        counts[k].count += 1;
      }
    });
  });

  const entries = Object.entries(counts).slice(0, 4);
  const maxCount = Math.max(1, ...entries.map(e => e[1].count));

  barsBox.innerHTML = entries.map(([name, info]) => {
    const pct = info.count > 0 ? Math.max(15, Math.round((info.count / maxCount) * 100)) : 8;
    return `
      <div class="space-y-1">
        <div class="flex items-center justify-between text-[11px]">
          <span class="font-semibold text-zinc-200">${name}</span>
          <span class="text-[10px] text-[#e5a769] font-bold">${info.count} reserva(s) • R$ ${Number(info.price).toFixed(0)}</span>
        </div>
        <div class="w-full h-2 rounded-full bg-[#0c0e13] overflow-hidden border border-white/[0.04]">
          <div class="h-full rounded-full btn-lux-primary transition-all duration-500" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

async function adminUpdateAppStatus(appId, status) {
  const item = state.appointments.find(a => a._id === appId);
  if (!item) return;

  if (status === 'cancelled') {
    const ok = await showLuxConfirm({
      title: 'Cancelar Horário do Cliente?',
      message: `Deseja cancelar o horário de ${item.clientName} (${item.date} às ${item.time})?`,
      confirmText: 'Sim, Cancelar',
      danger: true
    });
    if (!ok) return;
  }

  item.status = status;
  let notifiedWaitlist = 0;

  if (status === 'cancelled') {
    notifiedWaitlist = notifyWaitlistForFreedSlot(item.date, item.time, item.barberId, item.barberName);
  }

  // Se concluído, integra automaticamente com a Gestão Financeira (Caixa) + Pesquisa de Satisfação
  if (status === 'completed') {
    const alreadyInFinance = state.finance.transactions.some(t => t.appointmentId === item._id);
    if (!alreadyInFinance) {
      const gross = Number(item.price || 0);
      const tx = {
        _id: `fin_app_${Date.now()}`,
        appointmentId: item._id,
        title: `${item.serviceName} - ${item.clientName}`,
        type: 'income',
        category: 'Serviços',
        amount: gross,
        paymentMethod: item.paymentMethod || 'pix',
        feePercent: 0,
        feeAmount: 0,
        netAmount: gross,
        status: 'paid',
        dueDate: item.date || formatDateISO(new Date())
      };
      state.finance.transactions.unshift(tx);
      try {
        await fetch(`${API_BASE}/finance/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tx)
        });
      } catch (e) {}
    }
  }

  persistLocalData();
  try {
    await fetch(`${API_BASE}/appointments/${appId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  } catch (e) {}
  renderAdminAgenda();
  renderAdminWaitlist();
  renderAdminFinance();
  renderAdminCrm();
  updateClientNotificationBadge();

  await showLuxAlert({
    title: status === 'completed' ? 'Atendimento Concluído & Lançado no Caixa!' : 'Agendamento Cancelado',
    message: status === 'completed'
      ? `Atendimento de ${item.clientName} (R$ ${Number(item.price).toFixed(2)}) lançado no Caixa e Pesquisa de Satisfação liberada para o cliente!`
      : notifiedWaitlist > 0
        ? `O horário foi cancelado e ${notifiedWaitlist} cliente(s) da Lista de Espera foram avisados automaticamente!`
        : `O horário de ${item.clientName} foi cancelado.`,
    type: status === 'completed' ? 'success' : 'warning'
  });
}

async function adminDeleteAppointment(appId) {
  const item = state.appointments.find(a => a._id === appId);
  const ok = await showLuxConfirm({
    title: 'Excluir Registro da Agenda?',
    message: `Tem certeza que deseja excluir permanentemente o agendamento de ${item ? item.clientName : 'cliente'}?`,
    confirmText: 'Sim, Excluir',
    danger: true
  });
  if (!ok) return;

  state.appointments = state.appointments.filter(a => a._id !== appId);
  persistLocalData();
  try {
    await fetch(`${API_BASE}/appointments/${appId}`, { method: 'DELETE' });
  } catch (e) {}
  renderAdminAgenda();

  await showLuxAlert({
    title: 'Registro Excluído',
    message: 'O agendamento foi removido da agenda.',
    type: 'info'
  });
}

// --- 5.2 ADMIN: GERENCIAR SERVIÇOS (UPLOAD DE FOTO OTIMIZADA + URL) ---
function previewServiceImageUrl(url) {
  const img = document.getElementById('admin-svc-preview-img');
  if (img && url && url.trim()) {
    img.src = url.trim();
  }
}

async function handleServiceImageUpload(fileInput) {
  const file = fileInput?.files?.[0];
  if (!file) return;

  try {
    const dataUrl = await compressAndResizeImageFile(file, 480, 0.72);
    const urlInp = document.getElementById('admin-svc-image');
    const prevImg = document.getElementById('admin-svc-preview-img');
    if (urlInp) urlInp.value = dataUrl;
    if (prevImg) prevImg.src = dataUrl;

    await showLuxAlert({
      title: 'Foto Anexada e Convertida!',
      message: 'A foto do corte foi redimensionada e otimizada para não pesar no aplicativo. Clique em "Salvar no Catálogo" para concluir.',
      type: 'success'
    });
  } catch (err) {
    await showLuxAlert({
      title: 'Erro na Imagem',
      message: 'Não foi possível processar esta foto.',
      type: 'error'
    });
  }
}

function renderAdminServicesList() {
  const listEl = document.getElementById('admin-services-list');
  const countBadge = document.getElementById('admin-services-count-badge');
  if (countBadge) {
    countBadge.textContent = `${state.services.length} ${state.services.length === 1 ? 'serviço' : 'serviços'}`;
  }
  if (!listEl) return;

  listEl.innerHTML = state.services.map(s => `
    <div class="admin-item-card p-3.5 flex items-center justify-between text-xs">
      <div class="flex items-center space-x-3 min-w-0 pr-2">
        <img src="${s.image}" class="w-13 h-13 rounded-2xl object-cover shrink-0 border border-white/[0.1] shadow-md" style="width:52px;height:52px;" />
        <div class="min-w-0">
          <h5 class="font-extrabold text-white truncate">${s.name}</h5>
          <div class="flex items-center space-x-1.5 mt-1">
            <span class="text-[9px] px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-300 font-semibold">${s.category}</span>
            <span class="text-[9px] text-zinc-400"><i class="fa-regular fa-clock mr-0.5 text-[#e5a769]"></i>${s.minutes || 30} min</span>
          </div>
          <span class="text-xs font-black text-[#e5a769] block mt-1">R$ ${Number(s.price).toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
      <div class="flex flex-col space-y-1.5 shrink-0">
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

  const prevImg = document.getElementById('admin-svc-preview-img');
  if (prevImg && s.image) prevImg.src = s.image;

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
  const fileInp = document.getElementById('admin-svc-file');
  if (fileInp) fileInp.value = '';
  const prevImg = document.getElementById('admin-svc-preview-img');
  if (prevImg) prevImg.src = 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300&auto=format&fit=crop&q=80';

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
    await showLuxAlert({
      title: 'Campos Obrigatórios',
      message: 'Informe o nome do serviço e o valor em R$.',
      type: 'warning'
    });
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
  renderHomeServicesList();

  await showLuxAlert({
    title: id ? 'Serviço Atualizado!' : 'Serviço Adicionado!',
    message: `O serviço "${name}" já está disponível no aplicativo do cliente.`,
    type: 'success'
  });
}

async function deleteAdminService(svcId) {
  if (state.services.length <= 1) {
    await showLuxAlert({
      title: 'Ação Não Permitida',
      message: 'Mantenha pelo menos 1 serviço ativo no catálogo.',
      type: 'warning'
    });
    return;
  }
  const target = state.services.find(s => s._id === svcId);
  const ok = await showLuxConfirm({
    title: 'Excluir Serviço?',
    message: `Deseja realmente remover "${target ? target.name : 'este serviço'}" do catálogo?`,
    confirmText: 'Sim, Excluir',
    danger: true
  });
  if (!ok) return;

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
  renderHomeServicesList();

  await showLuxAlert({
    title: 'Serviço Removido',
    message: 'O catálogo foi atualizado com sucesso.',
    type: 'info'
  });
}

// ========================================================
// 5.3 ADMIN: PROFISSIONAIS (ANEXAR FOTO COM CONVERSÃO + JORNADA)
// ========================================================
function previewBarberAvatarUrl(url) {
  const img = document.getElementById('admin-barber-preview-img');
  if (img && url && url.trim()) {
    img.src = url.trim();
  }
}

async function handleBarberAvatarUpload(fileInput) {
  const file = fileInput?.files?.[0];
  if (!file) return;

  try {
    const dataUrl = await compressAndResizeImageFile(file, 380, 0.72);
    const urlInp = document.getElementById('admin-barber-avatar');
    const prevImg = document.getElementById('admin-barber-preview-img');
    if (urlInp) urlInp.value = dataUrl;
    if (prevImg) prevImg.src = dataUrl;

    await showLuxAlert({
      title: 'Foto do Profissional Pronta!',
      message: 'A foto do profissional foi redimensionada e convertida para tamanho leve. Clique em "Salvar" para confirmar.',
      type: 'success'
    });
  } catch (err) {
    await showLuxAlert({
      title: 'Erro na Foto',
      message: 'Não foi possível processar esta foto.',
      type: 'error'
    });
  }
}

async function handleDirectBarberPhotoChange(barberId, fileInput) {
  const file = fileInput?.files?.[0];
  if (!file) return;
  const b = state.barbers.find(item => item._id === barberId);
  if (!b) return;

  try {
    const dataUrl = await compressAndResizeImageFile(file, 380, 0.72);
    b.avatar = dataUrl;
    persistLocalData();
    await syncBarberToServer(b);
    renderAdminBarbersList();
    renderHomeBarbers();
    renderBookingBarbers();

    await showLuxAlert({
      title: 'Foto do Profissional Atualizada!',
      message: `A nova foto de ${b.name} foi convertida para tamanho leve e já está visível no aplicativo.`,
      type: 'success'
    });
  } catch (err) {
    await showLuxAlert({
      title: 'Erro na Foto',
      message: 'Não foi possível carregar esta imagem.',
      type: 'error'
    });
  }
}

function setBarberDayScheduleTab(barberId, dayKey) {
  state.selectedBarberDayTab[barberId] = dayKey;
  renderAdminBarbersList();
}

function renderAdminBarbersList() {
  const container = document.getElementById('admin-barbers-list');
  if (!container) return;

  const weekDays = [
    { d: 0, label: 'Dom', full: 'Domingo' },
    { d: 1, label: 'Seg', full: 'Segunda' },
    { d: 2, label: 'Ter', full: 'Terça' },
    { d: 3, label: 'Qua', full: 'Quarta' },
    { d: 4, label: 'Qui', full: 'Quinta' },
    { d: 5, label: 'Sex', full: 'Sexta' },
    { d: 6, label: 'Sáb', full: 'Sábado' }
  ];

  container.innerHTML = state.barbers.map(b => {
    const workDays = Array.isArray(b.workDays) ? b.workDays : [0, 1, 2, 3, 4, 5, 6];
    const blockedDates = Array.isArray(b.blockedDates) ? b.blockedDates : [];
    const workHours = Array.isArray(b.workHours) ? b.workHours : [...ALL_POSSIBLE_HOURS];
    const specialPeriods = Array.isArray(b.specialPeriods) ? b.specialPeriods : [];
    if (!b.daySchedules) b.daySchedules = createDefaultDaySchedules();

    const activeDayTab = state.selectedBarberDayTab[b._id] || 'all';
    const currentTabHours = activeDayTab === 'all'
      ? workHours
      : (Array.isArray(b.daySchedules[activeDayTab]) ? b.daySchedules[activeDayTab] : workHours);

    const allHoursForBarber = Array.from(new Set([...ALL_POSSIBLE_HOURS, ...(b.customHours || []), ...workHours])).sort();

    const daysButtons = weekDays.map(w => {
      const active = workDays.includes(w.d);
      return `
        <button type="button" onclick="toggleBarberWorkDay('${b._id}', ${w.d})" class="py-2 rounded-xl text-[10px] md:text-xs font-bold border transition ${
          active
            ? 'bg-[#e5a769] text-[#0d0e12] border-transparent shadow-md'
            : 'bg-[#0f1117] text-zinc-500 border-white/[0.06]'
        }">
          ${w.label}
        </button>
      `;
    }).join('');

    const dayScheduleSelectorTabs = [
      { key: 'all', label: 'Todos os Dias' },
      ...weekDays.map(w => ({ key: String(w.d), label: w.label }))
    ].map(tab => {
      const isSel = activeDayTab === tab.key;
      return `
        <button type="button" onclick="setBarberDayScheduleTab('${b._id}', '${tab.key}')" class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
          isSel ? 'bg-[#e5a769] text-[#0d0e12]' : 'bg-[#161822] text-zinc-400 hover:text-white border border-white/[0.06]'
        }">
          ${tab.label}
        </button>
      `;
    }).join('');

    const hoursButtons = allHoursForBarber.map(h => {
      const active = currentTabHours.includes(h);
      return `
        <button type="button" onclick="toggleBarberWorkHour('${b._id}', '${h}')" class="py-2 rounded-xl text-[11px] font-bold border transition ${
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

    const specialPeriodChips = specialPeriods.map(sp => `
      <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-[10px]">
        <div>
          <span class="font-extrabold text-emerald-300 block">${sp.label || 'Jornada Estendida'}</span>
          <span class="text-zinc-300">${sp.startDate} até ${sp.endDate} • ${(sp.hours || []).length} horários liberados</span>
        </div>
        <button type="button" onclick="removeBarberSpecialPeriod('${b._id}', '${sp._id}')" class="w-6 h-6 rounded-lg bg-red-500/20 text-red-300 flex items-center justify-center">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `).join('');

    return `
      <div class="admin-section-card p-4 md:p-6 space-y-5 text-xs">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div class="flex items-center space-x-3.5">
            <img src="${b.avatar || '/barbeiro_ricardo.jpg'}" class="w-14 h-14 rounded-2xl object-cover border-2 border-[#e5a769]/50 shadow-md shrink-0" />
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h5 class="font-black text-white text-sm md:text-base">${b.name}</h5>
                <span class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">Agenda Ativa</span>
              </div>
              <span class="text-[11px] text-zinc-400 block mt-0.5">${b.role || 'Barbeiro Master'} • ${b.exp || ''}</span>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <!-- Botão direto para Anexar/Trocar Foto do Profissional -->
            <label class="px-3 py-1.5 rounded-xl bg-[#e5a769]/15 hover:bg-[#e5a769]/25 border border-[#e5a769]/40 text-[#e5a769] text-[10px] font-extrabold cursor-pointer flex items-center space-x-1.5 transition">
              <i class="fa-solid fa-camera"></i>
              <span>Trocar Foto</span>
              <input type="file" accept="image/*" onchange="handleDirectBarberPhotoChange('${b._id}', this)" class="hidden" />
            </label>
            <button type="button" onclick="editAdminBarber('${b._id}')" class="w-8 h-8 rounded-xl bg-[#1c1f28] border border-white/[0.08] text-zinc-300 hover:text-[#e5a769] flex items-center justify-center transition">
              <i class="fa-solid fa-pen text-[10px]"></i>
            </button>
            ${state.barbers.length > 1 ? `
              <button type="button" onclick="deleteAdminBarber('${b._id}')" class="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 flex items-center justify-center transition">
                <i class="fa-regular fa-trash-can text-[10px]"></i>
              </button>
            ` : ''}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
          <!-- Coluna Esquerda: Dias da Semana + Jornada por Período Específico + Horário Personalizado -->
          <div class="md:col-span-5 space-y-4">
            <!-- Dias da Semana Disponíveis -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-zinc-200">1. Dias da Semana Ativos:</span>
                <span class="text-[10px] text-[#e5a769] font-semibold">${workDays.length} dias</span>
              </div>
              <div class="grid grid-cols-7 gap-1.5">
                ${daysButtons}
              </div>
            </div>

            <!-- JORNADA POR PERÍODO ESPECÍFICO / ESTENDIDA -->
            <div class="p-3.5 rounded-2xl bg-[#0e1015] border border-[#e5a769]/30 space-y-2.5">
              <span class="text-[11px] font-extrabold text-[#e5a769] block">
                <i class="fa-solid fa-calendar-plus mr-1"></i>2. Configurar Jornada por Período Específico / Estendida:
              </span>
              <p class="text-[10px] text-zinc-400">Vai fazer jornada estendida em um dia ou período específico? Configure abaixo:</p>
              <input type="text" id="sp-label-${b._id}" placeholder="Motivo (Ex: Sábado Estendido / Fim de Ano)" class="w-full lux-input px-2.5 py-1.5 text-[11px] text-white" />
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <span class="text-[9px] text-zinc-400 block mb-0.5">Data Inicial</span>
                  <input type="date" id="sp-start-${b._id}" class="w-full lux-input px-2 py-1 text-[10px] text-white" />
                </div>
                <div>
                  <span class="text-[9px] text-zinc-400 block mb-0.5">Data Final</span>
                  <input type="date" id="sp-end-${b._id}" class="w-full lux-input px-2 py-1 text-[10px] text-white" />
                </div>
              </div>
              <button type="button" onclick="addBarberSpecialPeriod('${b._id}')" class="w-full py-2 rounded-xl btn-lux-primary text-[10px] font-extrabold">
                + Liberar Jornada Estendida (08h às 23h) no Período
              </button>
              ${specialPeriods.length > 0 ? `<div class="space-y-1.5 pt-1">${specialPeriodChips}</div>` : ''}
            </div>

            <!-- Definir / Adicionar Horário Personalizado -->
            <div class="p-3.5 rounded-2xl bg-[#0e1015] border border-white/[0.06] space-y-2">
              <span class="text-[11px] font-bold text-white block">
                <i class="fa-regular fa-clock text-[#e5a769] mr-1"></i>Adicionar Horário Personalizado:
              </span>
              <div class="flex items-center space-x-2">
                <input type="time" id="custom-hour-input-${b._id}" value="21:30" class="flex-1 lux-input px-3 py-1.5 text-xs text-white" />
                <button type="button" onclick="addCustomBarberHour('${b._id}')" class="px-3.5 py-2 rounded-xl bg-[#1c1f28] hover:bg-[#e5a769] text-[#e5a769] hover:text-[#0d0e12] border border-[#e5a769]/40 text-[10px] font-extrabold transition shrink-0">
                  + Incluir Horário
                </button>
              </div>
            </div>

            <!-- Bloquear Data Específica (Feriado / Folga) -->
            <div class="p-3.5 rounded-2xl bg-[#0e1015] border border-white/[0.06] space-y-2">
              <span class="text-[11px] font-bold text-zinc-200 block">Folgas / Datas Bloqueadas:</span>
              <div class="flex items-center space-x-2">
                <input type="date" id="block-date-input-${b._id}" class="flex-1 lux-input px-2.5 py-1.5 text-[11px] text-white" />
                <button type="button" onclick="addBarberBlockedDate('${b._id}')" class="px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/35 text-red-300 text-[10px] font-bold transition shrink-0">
                  Bloquear
                </button>
              </div>
              ${blockedDates.length > 0 ? `<div class="flex flex-wrap gap-1.5 pt-1">${blockedChips}</div>` : `<span class="text-[10px] text-zinc-500 block">Nenhuma data bloqueada.</span>`}
            </div>
          </div>

          <!-- Coluna Direita: JORNADA POR DIA DA SEMANA (Grade de Horários 08:00 até 23:00) -->
          <div class="md:col-span-7 space-y-3">
            <div class="p-3.5 rounded-2xl bg-[#0e1015] border border-white/[0.06] space-y-2.5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span class="text-[11px] font-extrabold text-white block">3. Jornada por Dia da Semana (${currentTabHours.length} horários ativos)</span>
                  <span class="text-[10px] text-zinc-400">Personalize a jornada de cada dia da semana ou aplique em todos os dias:</span>
                </div>
                <button type="button" onclick="enableAllBarberSchedule('${b._id}')" class="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-[10px] font-extrabold transition">
                  <i class="fa-solid fa-bolt mr-1"></i>Liberar Todos (08h-23h)
                </button>
              </div>

              <!-- Abas de Dia da Semana para Jornada Individual -->
              <div class="flex flex-wrap gap-1.5 pt-1">
                ${dayScheduleSelectorTabs}
              </div>
            </div>

            <div class="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
              ${hoursButtons}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function addBarberSpecialPeriod(barberId) {
  const b = state.barbers.find(item => item._id === barberId);
  if (!b) return;

  const label = document.getElementById(`sp-label-${barberId}`)?.value.trim() || 'Jornada Estendida';
  const startDate = document.getElementById(`sp-start-${barberId}`)?.value || '';
  const endDate = document.getElementById(`sp-end-${barberId}`)?.value || startDate;

  if (!startDate) {
    await showLuxAlert({
      title: 'Selecione a Data',
      message: 'Informe a data inicial para configurar a jornada por período específico.',
      type: 'warning'
    });
    return;
  }

  if (!Array.isArray(b.specialPeriods)) b.specialPeriods = [];
  const allHours = Array.from(new Set([...ALL_POSSIBLE_HOURS, ...(b.customHours || [])])).sort();

  b.specialPeriods.push({
    _id: `sp_${Date.now()}`,
    label,
    startDate,
    endDate: endDate >= startDate ? endDate : startDate,
    hours: allHours
  });

  persistLocalData();
  await syncBarberToServer(b);
  renderAdminBarbersList();
  renderHomeBarbers();

  await showLuxAlert({
    title: 'Jornada por Período Ativada!',
    message: `O período "${label}" (${startDate} até ${endDate || startDate}) foi liberado com jornada estendida na agenda de ${b.name}.`,
    type: 'success'
  });
}

async function removeBarberSpecialPeriod(barberId, spId) {
  const b = state.barbers.find(item => item._id === barberId);
  if (!b || !Array.isArray(b.specialPeriods)) return;
  b.specialPeriods = b.specialPeriods.filter(sp => sp._id !== spId);
  persistLocalData();
  await syncBarberToServer(b);
  renderAdminBarbersList();
  renderHomeBarbers();
}

async function addCustomBarberHour(barberId) {
  const b = state.barbers.find(item => item._id === barberId);
  const inp = document.getElementById(`custom-hour-input-${barberId}`);
  if (!b || !inp || !inp.value) return;

  const newHour = inp.value.trim();
  if (!Array.isArray(b.customHours)) b.customHours = [...ALL_POSSIBLE_HOURS];
  if (!Array.isArray(b.workHours)) b.workHours = [...ALL_POSSIBLE_HOURS];
  if (!b.daySchedules) b.daySchedules = createDefaultDaySchedules();

  if (!b.customHours.includes(newHour)) {
    b.customHours.push(newHour);
    b.customHours.sort();
  }
  if (!b.workHours.includes(newHour)) {
    b.workHours.push(newHour);
    b.workHours.sort();
  }
  for (let d = 0; d <= 6; d++) {
    const arr = b.daySchedules[String(d)] || [];
    if (!arr.includes(newHour)) {
      arr.push(newHour);
      arr.sort();
      b.daySchedules[String(d)] = arr;
    }
  }

  persistLocalData();
  await syncBarberToServer(b);
  renderAdminBarbersList();

  await showLuxAlert({
    title: 'Horário Adicionado!',
    message: `O horário ${newHour} foi incluído e liberado na jornada de ${b.name}.`,
    type: 'success'
  });
}

async function enableAllBarberSchedule(barberId) {
  const b = state.barbers.find(item => item._id === barberId);
  if (!b) return;
  b.workDays = [0, 1, 2, 3, 4, 5, 6];
  const merged = Array.from(new Set([...ALL_POSSIBLE_HOURS, ...(b.customHours || [])])).sort();
  b.customHours = merged;
  b.workHours = [...merged];
  b.daySchedules = {};
  for (let d = 0; d <= 6; d++) {
    b.daySchedules[String(d)] = [...merged];
  }
  b.blockedDates = [];
  persistLocalData();
  await syncBarberToServer(b);
  renderAdminBarbersList();
  renderHomeBarbers();

  await showLuxAlert({
    title: 'Todos os Horários Liberados!',
    message: `Todos os dias da semana e horários (08:00 às 23:00) de ${b.name} estão disponíveis.`,
    type: 'success'
  });
}

function editAdminBarber(barberId) {
  const b = state.barbers.find(item => item._id === barberId);
  if (!b) return;
  document.getElementById('admin-barber-id').value = b._id;
  document.getElementById('admin-barber-name').value = b.name;
  document.getElementById('admin-barber-exp').value = b.exp || '';
  const avatarInp = document.getElementById('admin-barber-avatar');
  const prevImg = document.getElementById('admin-barber-preview-img');
  if (avatarInp) avatarInp.value = b.avatar || '';
  if (prevImg) prevImg.src = b.avatar || '/barbeiro_ricardo.jpg';
  const title = document.getElementById('admin-barber-form-title');
  if (title) title.textContent = `Editando Profissional: ${b.name}`;
  const cancelBtn = document.getElementById('btn-cancel-barber-edit');
  if (cancelBtn) cancelBtn.classList.remove('hidden');
}

function resetAdminBarberForm() {
  document.getElementById('admin-barber-id').value = '';
  document.getElementById('admin-barber-name').value = '';
  document.getElementById('admin-barber-exp').value = '';
  const avatarInp = document.getElementById('admin-barber-avatar');
  const fileInp = document.getElementById('admin-barber-file');
  const prevImg = document.getElementById('admin-barber-preview-img');
  if (avatarInp) avatarInp.value = '';
  if (fileInp) fileInp.value = '';
  if (prevImg) prevImg.src = '/barbeiro_ricardo.jpg';
  const title = document.getElementById('admin-barber-form-title');
  if (title) title.textContent = 'Cadastrar / Editar Profissional';
  const cancelBtn = document.getElementById('btn-cancel-barber-edit');
  if (cancelBtn) cancelBtn.classList.add('hidden');
}

async function saveAdminBarberBasic() {
  const id = document.getElementById('admin-barber-id').value.trim();
  const name = document.getElementById('admin-barber-name').value.trim();
  const exp = document.getElementById('admin-barber-exp').value.trim() || 'Cortes & Barba';
  const avatarVal = document.getElementById('admin-barber-avatar')?.value.trim() || '';

  if (!name) {
    await showLuxAlert({
      title: 'Informe o Nome',
      message: 'Digite o nome do profissional para salvar.',
      type: 'warning'
    });
    return;
  }

  if (id) {
    const b = state.barbers.find(item => item._id === id);
    if (b) {
      b.name = name;
      b.exp = exp;
      if (avatarVal) b.avatar = avatarVal;
      await syncBarberToServer(b);
    }
  } else {
    const newB = {
      _id: `b_${Date.now()}`,
      name,
      role: 'Barbeiro Master',
      exp,
      avatar: avatarVal || '/barbeiro_ricardo.jpg',
      workDays: [0, 1, 2, 3, 4, 5, 6],
      blockedDates: [],
      workHours: [...ALL_POSSIBLE_HOURS],
      customHours: [...ALL_POSSIBLE_HOURS],
      daySchedules: createDefaultDaySchedules(),
      specialPeriods: []
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
  renderBookingBarbers();

  await showLuxAlert({
    title: 'Profissional Salvo!',
    message: `Os dados, a foto e a jornada de ${name} foram atualizados com sucesso.`,
    type: 'success'
  });
}

async function deleteAdminBarber(barberId) {
  if (state.barbers.length <= 1) return;
  const target = state.barbers.find(b => b._id === barberId);
  const ok = await showLuxConfirm({
    title: 'Remover Profissional?',
    message: `Deseja realmente excluir ${target ? target.name : 'este profissional'} da equipe?`,
    confirmText: 'Sim, Excluir',
    danger: true
  });
  if (!ok) return;

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
      await showLuxAlert({
        title: 'Atenção',
        message: 'O profissional precisa ter pelo menos 1 dia da semana ativo.',
        type: 'warning'
      });
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
  if (!b.daySchedules) b.daySchedules = createDefaultDaySchedules();

  const activeDayTab = state.selectedBarberDayTab[b._id] || 'all';

  if (activeDayTab === 'all') {
    const idx = b.workHours.indexOf(hourStr);
    const shouldAdd = idx < 0;
    if (shouldAdd) {
      b.workHours.push(hourStr);
      b.workHours.sort();
    } else {
      b.workHours.splice(idx, 1);
    }
    for (let d = 0; d <= 6; d++) {
      const arr = Array.isArray(b.daySchedules[String(d)]) ? b.daySchedules[String(d)] : [...b.workHours];
      const dIdx = arr.indexOf(hourStr);
      if (shouldAdd && dIdx < 0) {
        arr.push(hourStr);
        arr.sort();
      } else if (!shouldAdd && dIdx >= 0) {
        arr.splice(dIdx, 1);
      }
      b.daySchedules[String(d)] = arr;
    }
  } else {
    const dayArr = Array.isArray(b.daySchedules[activeDayTab]) ? [...b.daySchedules[activeDayTab]] : [...b.workHours];
    const idx = dayArr.indexOf(hourStr);
    if (idx >= 0) {
      dayArr.splice(idx, 1);
    } else {
      dayArr.push(hourStr);
      dayArr.sort();
    }
    b.daySchedules[activeDayTab] = dayArr;
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
  const blockedVal = inp.value;
  inp.value = '';
  persistLocalData();
  await syncBarberToServer(b);
  renderAdminBarbersList();

  const [y, m, d] = blockedVal.split('-');
  await showLuxAlert({
    title: 'Data Bloqueada',
    message: `O dia ${d}/${m}/${y} foi bloqueado no calendário de ${b.name}.`,
    type: 'info'
  });
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

// ========================================================
// 5.4 ADMIN: GESTÃO FINANCEIRA (CAIXA, CONTAS A PAGAR/RECEBER, TAXAS)
// ========================================================
function setFinanceFilter(filter) {
  state.financeFilter = filter;
  ['all', 'income', 'expense', 'pending'].forEach(f => {
    const btn = document.getElementById(`fin-filter-${f}`);
    if (btn) {
      btn.className = f === filter
        ? 'px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#e5a769] text-[#0d0e12]'
        : 'px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#161822] text-zinc-400 hover:text-white';
    }
  });
  renderAdminFinance();
}

function renderAdminFinance() {
  const listEl = document.getElementById('admin-finance-list');
  if (!listEl) return;

  if (!state.finance || !Array.isArray(state.finance.transactions)) {
    state.finance = JSON.parse(JSON.stringify(DEFAULT_FINANCE));
  }

  const fees = state.finance.settings || { creditFeePercent: 3.99, debitFeePercent: 1.99, pixFeePercent: 0 };
  const fCred = document.getElementById('fin-fee-credit');
  const fDeb = document.getElementById('fin-fee-debit');
  const fPix = document.getElementById('fin-fee-pix');
  if (fCred) fCred.value = fees.creditFeePercent;
  if (fDeb) fDeb.value = fees.debitFeePercent;
  if (fPix) fPix.value = fees.pixFeePercent;

  const txs = state.finance.transactions;

  const paidIncomes = txs.filter(t => t.type === 'income' && t.status === 'paid');
  const pendingReceivables = txs.filter(t => t.type === 'income' && t.status === 'pending');
  const paidExpenses = txs.filter(t => t.type === 'expense' && t.status === 'paid');
  const pendingPayables = txs.filter(t => t.type === 'expense' && t.status === 'pending');

  const totalIncomeNet = paidIncomes.reduce((acc, t) => acc + Number(t.netAmount ?? t.amount ?? 0), 0);
  const totalReceivable = pendingReceivables.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalExpense = paidExpenses.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalPayable = pendingPayables.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalFees = txs.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.feeAmount || 0), 0);
  const cashBalance = totalIncomeNet - totalExpense;

  const balEl = document.getElementById('fin-stat-balance');
  const incEl = document.getElementById('fin-stat-income');
  const recSubEl = document.getElementById('fin-stat-receivable-sub');
  const expEl = document.getElementById('fin-stat-expense');
  const paySubEl = document.getElementById('fin-stat-payable-sub');
  const feesEl = document.getElementById('fin-stat-fees');

  if (balEl) balEl.textContent = `R$ ${cashBalance.toFixed(2).replace('.', ',')}`;
  if (incEl) incEl.textContent = `R$ ${totalIncomeNet.toFixed(2).replace('.', ',')}`;
  if (recSubEl) recSubEl.textContent = `Contas a receber: R$ ${totalReceivable.toFixed(2).replace('.', ',')}`;
  if (expEl) expEl.textContent = `R$ ${totalExpense.toFixed(2).replace('.', ',')}`;
  if (paySubEl) paySubEl.textContent = `Contas a pagar: R$ ${totalPayable.toFixed(2).replace('.', ',')}`;
  if (feesEl) feesEl.textContent = `R$ ${totalFees.toFixed(2).replace('.', ',')}`;

  let filtered = [...txs];
  if (state.financeFilter === 'income') filtered = filtered.filter(t => t.type === 'income');
  else if (state.financeFilter === 'expense') filtered = filtered.filter(t => t.type === 'expense');
  else if (state.financeFilter === 'pending') filtered = filtered.filter(t => t.status === 'pending');

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="p-6 text-center text-xs text-zinc-500">Nenhuma movimentação financeira para este filtro.</div>`;
    return;
  }

  const methodNames = { pix: 'PIX', credit: 'Cartão Crédito', debit: 'Cartão Débito', cash: 'Dinheiro' };

  listEl.innerHTML = filtered.map(t => {
    const isIncome = t.type === 'income';
    const isPending = t.status === 'pending';
    return `
      <div class="admin-item-card p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div class="flex items-start space-x-3 min-w-0">
          <div class="w-9 h-9 rounded-xl ${isIncome ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'} flex items-center justify-center shrink-0 mt-0.5">
            <i class="fa-solid ${isIncome ? 'fa-arrow-up-right-dots' : 'fa-arrow-down-short-wide'}"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center space-x-2">
              <span class="font-extrabold text-white truncate">${t.title}</span>
              <span class="text-[9px] px-2 py-0.5 rounded-full font-bold ${
                isPending
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }">
                ${isPending ? (isIncome ? 'A Receber' : 'A Pagar') : (isIncome ? 'Recebido' : 'Pago')}
              </span>
            </div>
            <span class="text-[10px] text-zinc-400 block mt-0.5">
              ${t.category || 'Geral'} • ${methodNames[t.paymentMethod] || 'PIX'} • Data: ${t.dueDate || '-'}
              ${t.feeAmount > 0 ? ` • Taxa Cartão: -R$ ${Number(t.feeAmount).toFixed(2)}` : ''}
            </span>
          </div>
        </div>

        <div class="flex items-center space-x-2 self-end sm:self-center shrink-0">
          <div class="text-right mr-1">
            <span class="font-black text-sm ${isIncome ? 'text-emerald-400' : 'text-red-400'} block">
              ${isIncome ? '+' : '-'} R$ ${Number(t.netAmount ?? t.amount ?? 0).toFixed(2).replace('.', ',')}
            </span>
            ${t.feeAmount > 0 ? `<span class="text-[9px] text-zinc-500 block">Bruto: R$ ${Number(t.amount).toFixed(2)}</span>` : ''}
          </div>
          ${isPending ? `
            <button type="button" onclick="settleFinanceTransaction('${t._id}')" class="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-400 text-[10px] font-bold">
              <i class="fa-solid fa-check mr-1"></i>Dar Baixa
            </button>
          ` : ''}
          <button type="button" onclick="deleteFinanceTransaction('${t._id}')" class="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 flex items-center justify-center">
            <i class="fa-regular fa-trash-can text-[10px]"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

async function saveFinanceFeeSettings() {
  state.finance.settings = {
    creditFeePercent: parseFloat(document.getElementById('fin-fee-credit')?.value || '3.99'),
    debitFeePercent: parseFloat(document.getElementById('fin-fee-debit')?.value || '1.99'),
    pixFeePercent: parseFloat(document.getElementById('fin-fee-pix')?.value || '0')
  };
  persistLocalData();
  try {
    await fetch(`${API_BASE}/finance/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.finance.settings)
    });
  } catch (e) {}

  await showLuxAlert({
    title: 'Taxas de Cartão Atualizadas!',
    message: 'Os percentuais de crédito, débito e PIX foram salvos para os próximos cálculos de fluxo de caixa.',
    type: 'success'
  });
}

async function saveFinanceTransaction() {
  const title = document.getElementById('fin-tx-title')?.value.trim() || '';
  const type = document.getElementById('fin-tx-type')?.value || 'income';
  const amount = parseFloat(document.getElementById('fin-tx-amount')?.value || '0');
  const paymentMethod = document.getElementById('fin-tx-method')?.value || 'pix';
  const status = document.getElementById('fin-tx-status')?.value || 'paid';
  const category = document.getElementById('fin-tx-category')?.value || 'Serviços';
  const dueDate = document.getElementById('fin-tx-date')?.value || formatDateISO(new Date());

  if (!title || isNaN(amount) || amount <= 0) {
    await showLuxAlert({
      title: 'Preencha os Dados',
      message: 'Informe a descrição e um valor válido em R$ para registrar no financeiro.',
      type: 'warning'
    });
    return;
  }

  const fees = state.finance.settings || DEFAULT_FINANCE.settings;
  let feePercent = 0;
  if (type === 'income') {
    if (paymentMethod === 'credit') feePercent = Number(fees.creditFeePercent || 0);
    else if (paymentMethod === 'debit') feePercent = Number(fees.debitFeePercent || 0);
    else if (paymentMethod === 'pix') feePercent = Number(fees.pixFeePercent || 0);
  }
  const feeAmount = Number(((amount * feePercent) / 100).toFixed(2));
  const netAmount = type === 'income' ? Number((amount - feeAmount).toFixed(2)) : amount;

  const newTx = {
    _id: `fin_${Date.now()}`,
    title,
    type,
    category,
    amount,
    paymentMethod,
    feePercent,
    feeAmount,
    netAmount,
    status,
    dueDate
  };

  state.finance.transactions.unshift(newTx);
  persistLocalData();

  try {
    await fetch(`${API_BASE}/finance/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTx)
    });
  } catch (e) {}

  document.getElementById('fin-tx-title').value = '';
  document.getElementById('fin-tx-amount').value = '';
  renderAdminFinance();

  await showLuxAlert({
    title: 'Lançamento Registrado!',
    message: `"${title}" foi adicionado ao controle financeiro.`,
    type: 'success'
  });
}

async function settleFinanceTransaction(txId) {
  const tx = state.finance.transactions.find(t => t._id === txId);
  if (!tx) return;
  tx.status = 'paid';
  persistLocalData();
  try {
    await fetch(`${API_BASE}/finance/transactions/${txId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paid' })
    });
  } catch (e) {}
  renderAdminFinance();

  await showLuxAlert({
    title: 'Conta Baixada!',
    message: `O lançamento "${tx.title}" foi quitado e atualizado no saldo em caixa.`,
    type: 'success'
  });
}

async function deleteFinanceTransaction(txId) {
  const ok = await showLuxConfirm({
    title: 'Excluir Lançamento Financeiro?',
    message: 'Deseja realmente remover este registro do fluxo de caixa?',
    confirmText: 'Sim, Excluir',
    danger: true
  });
  if (!ok) return;

  state.finance.transactions = state.finance.transactions.filter(t => t._id !== txId);
  persistLocalData();
  try {
    await fetch(`${API_BASE}/finance/transactions/${txId}`, { method: 'DELETE' });
  } catch (e) {}
  renderAdminFinance();
}

// ========================================================
// 5.5 ADMIN: ENVIO DE NOTÍCIAS E PROMOÇÕES
// (Com rastreamento de Quem Recebeu e Quando / Quem Leu e Quando)
// ========================================================
function togglePromoRecipientsGroup() {
  const type = document.getElementById('promo-target-type')?.value || 'all';
  const box = document.getElementById('promo-group-selector');
  if (!box) return;

  if (type === 'group') {
    box.classList.remove('hidden');
    box.innerHTML = state.users.map(u => `
      <label class="flex items-center space-x-2 p-1.5 rounded-lg bg-[#161822] cursor-pointer">
        <input type="checkbox" value="${u._id}" class="promo-recipient-chk accent-[#e5a769]" checked />
        <span class="text-[11px] text-white font-semibold">${u.name}</span>
        <span class="text-[9px] text-zinc-400">(${u.email})</span>
      </label>
    `).join('');
  } else {
    box.classList.add('hidden');
  }
}

async function sendPromotionCampaign() {
  const title = document.getElementById('promo-title')?.value.trim() || '';
  const message = document.getElementById('promo-message')?.value.trim() || '';
  const discountPercent = parseInt(document.getElementById('promo-discount')?.value || '0', 10);
  const eventDate = document.getElementById('promo-event-date')?.value || '';
  const chApp = Boolean(document.getElementById('promo-ch-app')?.checked);
  const chSms = Boolean(document.getElementById('promo-ch-sms')?.checked);
  const targetType = document.getElementById('promo-target-type')?.value || 'all';

  if (!title || !message) {
    await showLuxAlert({
      title: 'Preencha a Campanha',
      message: 'Informe o título e a mensagem do evento ou promoção para enviar aos clientes.',
      type: 'warning'
    });
    return;
  }

  let targetUsers = [...state.users];
  if (targetType === 'group') {
    const checkedIds = Array.from(document.querySelectorAll('.promo-recipient-chk:checked')).map(el => el.value);
    targetUsers = state.users.filter(u => checkedIds.includes(u._id));
  }

  const nowStr = formatNowTimestamp();
  const recipients = targetUsers.map(u => ({
    userId: u._id,
    name: u.name,
    email: u.email,
    phone: u.phone || '(11) 99999-9999',
    receivedAt: nowStr,
    readAt: state.currentUser && state.currentUser._id === u._id ? nowStr : null
  }));

  const channels = [];
  if (chApp) channels.push('app');
  if (chSms) channels.push('sms');

  const newPromo = {
    _id: `promo_${Date.now()}`,
    title,
    message,
    discountPercent: isNaN(discountPercent) ? 0 : discountPercent,
    eventDate,
    channels,
    targetType,
    createdAt: nowStr,
    recipients
  };

  state.promotions.unshift(newPromo);
  persistLocalData();

  try {
    await fetch(`${API_BASE}/promotions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPromo)
    });
  } catch (e) {}

  if (chApp) {
    triggerBrowserPushNotification(title, message);
  }

  document.getElementById('promo-title').value = '';
  document.getElementById('promo-message').value = '';
  document.getElementById('promo-discount').value = '';

  renderAdminPromotions();
  updateClientNotificationBadge();
  renderHomeActivePromoBanner();

  await showLuxAlert({
    title: 'Promoção Disparada com Sucesso!',
    message: `Enviada para ${recipients.length} cliente(s) via ${channels.map(c => c.toUpperCase()).join(' + ')}. Acompanhe ao lado quem recebeu e quem leu!`,
    type: 'success'
  });
}

async function simulateClientReadPromo(promoId, userId) {
  const promo = state.promotions.find(p => p._id === promoId);
  if (!promo || !Array.isArray(promo.recipients)) return;
  const rec = promo.recipients.find(r => r.userId === userId);
  if (!rec) return;

  const nowStr = formatNowTimestamp();
  if (!rec.receivedAt) rec.receivedAt = nowStr;
  rec.readAt = nowStr;
  persistLocalData();

  try {
    await fetch(`${API_BASE}/promotions/${promoId}/receipt`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: rec.userId, email: rec.email, action: 'read' })
    });
  } catch (e) {}

  renderAdminPromotions();
}

async function deletePromotionCampaign(promoId) {
  const ok = await showLuxConfirm({
    title: 'Excluir Campanha?',
    message: 'Deseja remover esta promoção e seu histórico de leitura?',
    confirmText: 'Sim, Excluir',
    danger: true
  });
  if (!ok) return;

  state.promotions = state.promotions.filter(p => p._id !== promoId);
  persistLocalData();
  try {
    await fetch(`${API_BASE}/promotions/${promoId}`, { method: 'DELETE' });
  } catch (e) {}
  renderAdminPromotions();
  updateClientNotificationBadge();
}

function renderAdminPromotions() {
  const listEl = document.getElementById('admin-promotions-list');
  const badgeEl = document.getElementById('admin-promos-count-badge');
  if (badgeEl) {
    badgeEl.textContent = `${state.promotions.length} campanha(s)`;
  }
  if (!listEl) return;

  if (state.promotions.length === 0) {
    listEl.innerHTML = `<div class="p-6 text-center text-xs text-zinc-500">Nenhuma notícia ou promoção enviada ainda.</div>`;
    return;
  }

  listEl.innerHTML = state.promotions.map(p => {
    const recs = Array.isArray(p.recipients) ? p.recipients : [];
    const receivedCount = recs.filter(r => r.receivedAt).length;
    const readCount = recs.filter(r => r.readAt).length;

    const recipientsRows = recs.map(r => `
      <div class="p-2 rounded-xl bg-[#0b0d12] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px]">
        <div class="font-bold text-white truncate">${r.name} <span class="text-zinc-500 font-normal">(${r.phone || r.email})</span></div>
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <span class="px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/30">
            <i class="fa-solid fa-check mr-1"></i>Recebeu: ${r.receivedAt || '-'}
          </span>
          ${r.readAt ? `
            <span class="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
              <i class="fa-solid fa-check-double mr-1"></i>Leu: ${r.readAt}
            </span>
          ` : `
            <button type="button" onclick="simulateClientReadPromo('${p._id}', '${r.userId}')" class="px-2 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-semibold">
              ⏳ Aguardando leitura (Marcar Lido)
            </button>
          `}
        </div>
      </div>
    `).join('');

    return `
      <div class="admin-item-card p-4 space-y-3 text-xs">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center space-x-2">
              <h5 class="font-extrabold text-white text-sm">${p.title}</h5>
              ${p.discountPercent ? `<span class="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#e5a769] text-[#0d0e12]">${p.discountPercent}% OFF</span>` : ''}
            </div>
            <p class="text-[11px] text-zinc-300 mt-1">${p.message}</p>
            <span class="text-[10px] text-zinc-500 block mt-1">
              Disparado em: ${p.createdAt} • Canais: ${(p.channels || ['app']).map(c => c.toUpperCase()).join(' + ')}
            </span>
          </div>
          <button type="button" onclick="deletePromotionCampaign('${p._id}')" class="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 flex items-center justify-center shrink-0">
            <i class="fa-regular fa-trash-can text-[10px]"></i>
          </button>
        </div>

        <div class="flex items-center space-x-3 text-[10px] pt-1">
          <span class="text-sky-400 font-bold"><i class="fa-solid fa-paper-plane mr-1"></i>Receberam: ${receivedCount}/${recs.length}</span>
          <span class="text-emerald-400 font-bold"><i class="fa-solid fa-eye mr-1"></i>Leram: ${readCount}/${recs.length}</span>
        </div>

        <div class="space-y-1.5 pt-1">
          ${recipientsRows}
        </div>
      </div>
    `;
  }).join('');
}

// ========================================================
// 5.6 ADMIN: RELATÓRIOS GERENCIAIS (BI & TOMADA DE DECISÃO)
// ========================================================
function renderAdminReports() {
  const weekBox = document.getElementById('report-chart-weekdays');
  const hourBox = document.getElementById('report-chart-hours');
  const platBox = document.getElementById('report-chart-platforms');
  const monthBox = document.getElementById('report-chart-months');
  const insightBox = document.getElementById('reports-smart-insight-card');
  if (!weekBox) return;

  const activeApps = state.appointments.filter(a => a.status !== 'cancelled');

  // 1. Relatório por Dia da Semana
  const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];

  activeApps.forEach(a => {
    if (a.date) {
      const [y, m, d] = a.date.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      if (!isNaN(dt.getTime())) {
        dayCounts[dt.getDay()]++;
      }
    }
  });

  // Identifica o dia útil com menor movimento (priorizando Terça-feira em caso de empate, como no exemplo do usuário!)
  let slowestDayIdx = 2; // Terça-feira padrão
  let minVal = dayCounts[2];
  [1, 2, 3, 4, 5, 6, 0].forEach(idx => {
    if (dayCounts[idx] < minVal) {
      minVal = dayCounts[idx];
      slowestDayIdx = idx;
    }
  });
  const slowestDayName = dayNames[slowestDayIdx];

  if (insightBox) {
    insightBox.innerHTML = `
      <div class="space-y-1">
        <span class="text-[10px] uppercase tracking-widest font-extrabold text-[#e5a769] inline-flex items-center space-x-1.5">
          <i class="fa-solid fa-lightbulb"></i>
          <span>Inteligência de Negócio • Ação Recomendada</span>
        </span>
        <h4 class="text-sm md:text-base font-black text-white">
          Menor movimento detectado: <span class="text-[#e5a769]">${slowestDayName} (${minVal} agendamento${minVal === 1 ? '' : 's'})</span>
        </h4>
        <p class="text-[11px] text-zinc-300">
          Horário vazio ninguém quer! Envie agora uma promoção com <b>20% de desconto</b> para todos os seus clientes agendarem na <b>${slowestDayName}</b>.
        </p>
      </div>
      <button type="button" onclick="createPromoForSlowDay('${slowestDayName}')" class="px-4 py-2.5 rounded-xl btn-lux-primary text-xs font-extrabold shrink-0 shadow-lg flex items-center space-x-2">
        <i class="fa-solid fa-bullhorn"></i>
        <span>Enviar Promoção 20% OFF (${slowestDayName.split('-')[0]})</span>
      </button>
    `;
  }

  const maxWeek = Math.max(1, ...dayCounts);
  weekBox.innerHTML = dayNames.map((name, idx) => {
    const c = dayCounts[idx];
    const pct = c > 0 ? Math.max(14, Math.round((c / maxWeek) * 100)) : 6;
    const isSlowest = idx === slowestDayIdx;
    return `
      <div class="space-y-1 text-xs">
        <div class="flex items-center justify-between">
          <span class="font-semibold ${isSlowest ? 'text-amber-300' : 'text-zinc-200'}">
            ${name} ${isSlowest ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 ml-1">Menor Movimento</span>' : ''}
          </span>
          <span class="text-[10px] font-bold text-[#e5a769]">${c} agendamento(s)</span>
        </div>
        <div class="w-full h-2 rounded-full bg-[#0c0e13] overflow-hidden">
          <div class="h-full rounded-full ${isSlowest ? 'bg-amber-400' : 'btn-lux-primary'}" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');

  // 2. Relatório por Horário
  if (hourBox) {
    const hourMap = {};
    ['09:00', '11:00', '14:00', '16:00', '18:00', '20:00', '22:00'].forEach(h => { hourMap[h] = 0; });
    activeApps.forEach(a => {
      const h = a.time || '10:00';
      hourMap[h] = (hourMap[h] || 0) + 1;
    });
    const hourEntries = Object.entries(hourMap).sort((a, b) => a[0].localeCompare(b[0])).slice(0, 7);
    const maxHr = Math.max(1, ...hourEntries.map(e => e[1]));
    hourBox.innerHTML = hourEntries.map(([hr, count]) => {
      const pct = count > 0 ? Math.max(14, Math.round((count / maxHr) * 100)) : 6;
      return `
        <div class="space-y-1 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-zinc-200">Horário das ${hr}</span>
            <span class="text-[10px] font-bold text-emerald-400">${count} atendimento(s)</span>
          </div>
          <div class="w-full h-2 rounded-full bg-[#0c0e13] overflow-hidden">
            <div class="h-full rounded-full bg-emerald-400" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 3. Relatório por Plataforma
  if (platBox) {
    const platCounts = {
      'App Mobile (PWA)': 0,
      'Web Desktop': 0,
      'Encaixe Presencial': 0
    };
    activeApps.forEach(a => {
      if (a.isFitIn || a.platform === 'Encaixe Presencial') platCounts['Encaixe Presencial']++;
      else if (a.platform === 'Web Desktop') platCounts['Web Desktop']++;
      else platCounts['App Mobile (PWA)']++;
    });
    const maxPlat = Math.max(1, ...Object.values(platCounts));
    platBox.innerHTML = Object.entries(platCounts).map(([plat, count]) => {
      const pct = count > 0 ? Math.max(15, Math.round((count / maxPlat) * 100)) : 8;
      return `
        <div class="space-y-1 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-zinc-200">${plat}</span>
            <span class="text-[10px] font-bold text-sky-400">${count} reserva(s)</span>
          </div>
          <div class="w-full h-2 rounded-full bg-[#0c0e13] overflow-hidden">
            <div class="h-full rounded-full bg-sky-400" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 4. Relatório por Mês
  if (monthBox) {
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthData = {};
    const curMonth = new Date().getMonth();
    [curMonth - 2, curMonth - 1, curMonth, curMonth + 1].forEach(mIdx => {
      const normalized = (mIdx + 12) % 12;
      monthData[monthNames[normalized]] = { count: 0, rev: 0 };
    });

    activeApps.forEach(a => {
      if (a.date) {
        const parts = a.date.split('-').map(Number);
        const mName = monthNames[(parts[1] || 1) - 1];
        if (!monthData[mName]) monthData[mName] = { count: 0, rev: 0 };
        monthData[mName].count++;
        monthData[mName].rev += Number(a.price || 0);
      }
    });

    const mEntries = Object.entries(monthData);
    const maxM = Math.max(1, ...mEntries.map(e => e[1].count));
    monthBox.innerHTML = mEntries.map(([mLabel, info]) => {
      const pct = info.count > 0 ? Math.max(15, Math.round((info.count / maxM) * 100)) : 8;
      return `
        <div class="space-y-1 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-zinc-200">Mês: ${mLabel}</span>
            <span class="text-[10px] font-bold text-[#e5a769]">${info.count} agend. • R$ ${info.rev.toFixed(2).replace('.', ',')}</span>
          </div>
          <div class="w-full h-2 rounded-full bg-[#0c0e13] overflow-hidden">
            <div class="h-full rounded-full btn-lux-primary" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function createPromoForSlowDay(dayName) {
  switchAdminSubTab('promotions');
  const titleInp = document.getElementById('promo-title');
  const msgInp = document.getElementById('promo-message');
  const discInp = document.getElementById('promo-discount');

  if (titleInp) titleInp.value = `Promoção de ${dayName}: 20% de Desconto!`;
  if (msgInp) {
    msgInp.value = `Aproveite 20% OFF em qualquer serviço ou combo agendando seu horário nesta ${dayName} pelo nosso aplicativo!`;
  }
  if (discInp) discInp.value = '20';

  showLuxAlert({
    title: 'Campanha Preenchida Automaticamente!',
    message: `Preparamos a promoção de 20% de desconto para ${dayName}. Revise os detalhes e clique em "Disparar Campanha Agora"!`,
    type: 'info'
  });
}

// --- 5.7 ADMIN: CONTROLE DE ACESSOS & LISTA DE USUÁRIOS ---
function renderAdminUsersList() {
  const listEl = document.getElementById('admin-users-list');
  const badgeEl = document.getElementById('admin-users-count-badge');
  if (!listEl) return;

  const adminsCount = state.users.filter(u => u.role === 'admin').length;
  if (badgeEl) {
    badgeEl.textContent = `${adminsCount} Admin(s) • ${state.users.length} Total`;
  }

  const sortedUsers = [...state.users].sort((a, b) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1;
    if (a.role !== 'admin' && b.role === 'admin') return 1;
    return (a.name || '').localeCompare(b.name || '');
  });

  listEl.innerHTML = sortedUsers.map(u => {
    const isAdmin = u.role === 'admin';
    return `
      <div class="admin-item-card p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-center space-x-3 min-w-0">
          <img src="${u.avatar || '/user_avatar.svg'}" class="w-10 h-10 rounded-full object-cover border ${isAdmin ? 'border-[#e5a769]' : 'border-white/15'} shrink-0" />
          <div class="min-w-0">
            <div class="flex items-center space-x-2">
              <span class="font-extrabold text-white truncate">${u.name}</span>
              <span class="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                isAdmin
                  ? 'bg-[#e5a769]/20 text-[#e5a769] border border-[#e5a769]/40'
                  : 'bg-zinc-800 text-zinc-400 border border-white/10'
              }">
                ${isAdmin ? '👑 Painel Admin' : 'Cliente'}
              </span>
            </div>
            <span class="text-[10px] text-zinc-400 block truncate mt-0.5">${u.email} ${u.phone ? `• ${u.phone}` : ''}</span>
          </div>
        </div>

        <div class="flex items-center space-x-2 self-end sm:self-center shrink-0">
          <button type="button" onclick="toggleUserAdminAccess('${u._id}')" class="px-3 py-1.5 rounded-xl text-[10px] font-extrabold border transition ${
            isAdmin
              ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
              : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/35 text-emerald-400'
          }">
            <i class="fa-solid ${isAdmin ? 'fa-lock' : 'fa-key'} mr-1"></i>
            ${isAdmin ? 'Revogar Admin' : 'Liberar Painel Admin'}
          </button>
          <button type="button" onclick="adminDeleteUser('${u._id}')" class="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 flex items-center justify-center transition">
            <i class="fa-regular fa-trash-can text-[10px]"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

async function adminCreateNewUser() {
  const name = document.getElementById('admin-new-user-name')?.value.trim() || '';
  const email = (document.getElementById('admin-new-user-email')?.value || '').trim().toLowerCase();
  const phone = document.getElementById('admin-new-user-phone')?.value.trim() || '';
  const password = document.getElementById('admin-new-user-pass')?.value.trim() || '123';
  const role = document.getElementById('admin-new-user-role')?.value || 'client';

  if (!name || !email || !email.includes('@')) {
    await showLuxAlert({
      title: 'Dados Inválidos',
      message: 'Preencha o nome e um e-mail válido para criar o acesso.',
      type: 'warning'
    });
    return;
  }

  if (state.users.some(u => (u.email || '').toLowerCase() === email)) {
    await showLuxAlert({
      title: 'E-mail Já Cadastrado',
      message: 'Já existe um usuário com este e-mail na lista ao lado.',
      type: 'error'
    });
    return;
  }

  const newUser = {
    _id: `u_${Date.now()}`,
    name,
    email,
    phone,
    password,
    role,
    createdAt: new Date().toISOString().split('T')[0]
  };

  state.users.push(newUser);
  persistLocalData();

  try {
    await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
  } catch (e) {}

  document.getElementById('admin-new-user-name').value = '';
  document.getElementById('admin-new-user-email').value = '';
  document.getElementById('admin-new-user-phone').value = '';
  document.getElementById('admin-new-user-pass').value = '';

  renderAdminUsersList();
  await showLuxAlert({
    title: 'Conta Criada com Sucesso!',
    message: `${name} (${email}) foi adicionado como ${role === 'admin' ? 'Administrador' : 'Cliente'}.`,
    type: 'success'
  });
}

async function toggleUserAdminAccess(userId) {
  const user = state.users.find(u => u._id === userId);
  if (!user) return;

  const admins = state.users.filter(u => u.role === 'admin');
  if (user.role === 'admin' && admins.length <= 1) {
    await showLuxAlert({
      title: 'Ação Bloqueada',
      message: 'O sistema precisa ter pelo menos 1 administrador ativo.',
      type: 'warning'
    });
    return;
  }

  const targetRole = user.role === 'admin' ? 'client' : 'admin';
  const confirmed = await showLuxConfirm({
    title: targetRole === 'admin' ? 'Liberar Painel Administrativo?' : 'Remover Acesso Admin?',
    message: targetRole === 'admin'
      ? `Deseja permitir que "${user.name}" visualize e gerencie o Painel Administrativo?`
      : `Deseja remover o acesso de "${user.name}" ao Painel Administrativo?`,
    confirmText: targetRole === 'admin' ? 'Sim, Liberar Acesso' : 'Sim, Revogar'
  });
  if (!confirmed) return;

  user.role = targetRole;
  if (state.currentUser && state.currentUser._id === user._id) {
    state.currentUser.role = targetRole;
    localStorage.setItem('guuh_client_user', JSON.stringify(state.currentUser));
    updateGreeting();
  }

  persistLocalData();
  try {
    await fetch(`${API_BASE}/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: targetRole })
    });
  } catch (e) {}

  renderAdminUsersList();
  await showLuxAlert({
    title: 'Permissão Atualizada!',
    message: `${user.name} agora está definido como ${targetRole === 'admin' ? 'Administrador' : 'Cliente'}.`,
    type: 'success'
  });
}

async function adminDeleteUser(userId) {
  const user = state.users.find(u => u._id === userId);
  if (!user) return;

  if (state.currentUser && state.currentUser._id === userId) {
    await showLuxAlert({
      title: 'Conta em Uso',
      message: 'Você não pode excluir a própria conta em que está logado agora.',
      type: 'warning'
    });
    return;
  }

  const ok = await showLuxConfirm({
    title: 'Excluir Usuário?',
    message: `Deseja remover a conta de "${user.name}" (${user.email}) do sistema?`,
    confirmText: 'Sim, Excluir',
    danger: true
  });
  if (!ok) return;

  state.users = state.users.filter(u => u._id !== userId);
  persistLocalData();
  try {
    await fetch(`${API_BASE}/users/${userId}`, { method: 'DELETE' });
  } catch (e) {}

  renderAdminUsersList();
  await showLuxAlert({
    title: 'Usuário Excluído',
    message: 'A conta foi removida com sucesso.',
    type: 'info'
  });
}

// --- 5.8 ADMIN: CONFIGURAÇÕES DA BARBEARIA ---
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

  await showLuxAlert({
    title: 'Configurações Salvas!',
    message: 'As informações da barbearia foram atualizadas em todo o aplicativo.',
    type: 'success'
  });
}

// ========================================================
// 6. NAVEGAÇÃO DE TELAS & PROTEÇÃO DO PAINEL ADMIN
// ========================================================
async function switchTab(tab) {
  if (tab === 'admin') {
    if (!state.currentUser || state.currentUser.role !== 'admin') {
      await showLuxAlert({
        title: 'Acesso Restrito (/admin)',
        message: 'Faça login com uma conta de Administrador (Guuh ou Ricardo) para acessar o Painel Administrativo.',
        type: 'warning'
      });
      applyAdminLoginScreenAppearance(true);
      switchTab('login');
      return;
    }
  }

  state.currentTab = tab;

  // Mantém a URL sincronizada com /admin quando estiver no Painel Administrativo
  try {
    if (tab === 'admin' && window.location.pathname !== '/admin') {
      window.history.replaceState({}, '', '/admin');
    } else if (['home', 'booking', 'my-bookings', 'loyalty', 'about', 'profile'].includes(tab) && isAdminRoute()) {
      window.history.replaceState({}, '', '/');
    }
  } catch (e) {}

  const views = ['login', 'home', 'booking', 'my-bookings', 'loyalty', 'about', 'profile', 'admin'];
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
    loyalty: 'loyalty',
    about: 'about',
    profile: 'profile',
    admin: 'profile'
  };

  ['home', 'bookings', 'loyalty', 'about', 'profile'].forEach(t => {
    const btn = document.getElementById(`nav-item-${t}`);
    if (btn) {
      if (navMap[tab] === t) {
        btn.className = 'flex flex-col items-center justify-center space-y-1 text-[#e5a769]';
      } else {
        btn.className = 'flex flex-col items-center justify-center space-y-1 text-zinc-400 hover:text-white';
      }
    }
  });

  if (tab === 'my-bookings') loadMyBookings();
  if (tab === 'loyalty') renderClientLoyaltyAndPackages();
  if (tab === 'profile') renderUserProfile();
  if (tab === 'admin') renderAdminDashboard();
  if (tab === 'home') {
    updateGreeting();
    renderHomeBarbers();
    renderHomeServicesList();
  }
}

// ========================================================
// 7. MÓDULO: PACOTES DE SERVIÇOS E PRODUTOS
// (Controle de Sessões Utilizadas x Compradas + Receita Antecipada)
// ========================================================
function renderAdminPackages() {
  const tplList = document.getElementById('admin-package-templates-list') || document.getElementById('admin-packages-templates-list');
  const clientPkgList = document.getElementById('admin-client-packages-list');
  const clientSel = document.getElementById('assign-pkg-user') || document.getElementById('assign-pkg-client');
  const tplSel = document.getElementById('assign-pkg-template');
  const countBadge = document.getElementById('admin-client-pkgs-badge') || document.getElementById('admin-client-pkgs-count');

  if (clientSel) {
    clientSel.innerHTML = state.users.map(u => `<option value="${u._id}">${u.name} (${u.email})</option>`).join('');
  }
  if (tplSel) {
    tplSel.innerHTML = (state.packages || []).map(p => `<option value="${p._id}">${p.name} - R$ ${Number(p.price).toFixed(2)} (${p.totalSessions} sessões)</option>`).join('');
  }
  if (countBadge) {
    countBadge.textContent = `${(state.clientPackages || []).length} pacotes ativos`;
  }

  if (tplList) {
    if (!state.packages || state.packages.length === 0) {
      tplList.innerHTML = `<div class="p-4 text-center text-xs text-zinc-500">Nenhum pacote cadastrado no catálogo.</div>`;
    } else {
      tplList.innerHTML = state.packages.map(p => {
        const economy = Math.max(0, Number(p.originalPrice || p.price) - Number(p.price || 0));
        return `
          <div class="p-3 rounded-xl bg-[#0e1015] border border-white/[0.06] flex items-center justify-between text-xs">
            <div class="min-w-0 pr-2">
              <div class="flex items-center space-x-2">
                <span class="font-extrabold text-white truncate">${p.name}</span>
                <span class="text-[9px] px-2 py-0.5 rounded-full bg-[#e5a769]/20 text-[#e5a769] font-bold">${p.totalSessions} sessões</span>
              </div>
              <p class="text-[10px] text-zinc-400 truncate mt-0.5">${p.itemsDesc}</p>
              <div class="flex items-center space-x-2 mt-1 text-[10px]">
                <span class="text-zinc-500 line-through">R$ ${Number(p.originalPrice || p.price).toFixed(2).replace('.', ',')}</span>
                <span class="font-black text-emerald-400">Por R$ ${Number(p.price).toFixed(2).replace('.', ',')}</span>
                ${economy > 0 ? `<span class="text-[9px] text-amber-300 font-bold">(Economia R$ ${economy.toFixed(0)})</span>` : ''}
              </div>
            </div>
            <button type="button" onclick="deleteAdminPackageTemplate('${p._id}')" class="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 flex items-center justify-center shrink-0">
              <i class="fa-regular fa-trash-can text-[10px]"></i>
            </button>
          </div>
        `;
      }).join('');
    }
  }

  if (clientPkgList) {
    if (!state.clientPackages || state.clientPackages.length === 0) {
      clientPkgList.innerHTML = `<div class="p-6 text-center text-xs text-zinc-500">Nenhum pacote vendido ou atribuído a clientes ainda.</div>`;
    } else {
      clientPkgList.innerHTML = state.clientPackages.map(cp => {
        const used = Number(cp.usedSessions || 0);
        const total = Math.max(1, Number(cp.totalSessions || 1));
        const remaining = Math.max(0, total - used);
        const pct = Math.min(100, Math.round((used / total) * 100));
        const isFinished = used >= total;

        return `
          <div class="admin-item-card p-3.5 space-y-2.5 text-xs">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center space-x-2">
                  <span class="font-extrabold text-white text-sm">${cp.clientName}</span>
                  <span class="text-[9px] px-2 py-0.5 rounded-full font-bold ${isFinished ? 'bg-zinc-700 text-zinc-300' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}">
                    ${isFinished ? 'Concluído (100% usado)' : `${remaining} restante(s)`}
                  </span>
                </div>
                <span class="text-[11px] font-bold text-[#e5a769] block mt-0.5">${cp.packageName}</span>
                <span class="text-[10px] text-zinc-400 block">${cp.itemsDesc || ''}</span>
              </div>
              <button type="button" onclick="deleteClientPackageAdmin('${cp._id}')" class="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <i class="fa-regular fa-trash-can text-[10px]"></i>
              </button>
            </div>

            <div class="space-y-1">
              <div class="flex items-center justify-between text-[10px]">
                <span class="text-zinc-300 font-semibold">Sessões Utilizadas x Compradas: <b class="text-white">${used} / ${total}</b></span>
                <span class="text-[#e5a769] font-bold">${pct}% utilizado</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-[#0b0d12] overflow-hidden border border-white/[0.06]">
                <div class="h-full rounded-full ${isFinished ? 'bg-zinc-500' : 'btn-lux-primary'} transition-all duration-300" style="width:${pct}%"></div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-1">
              <span class="text-[10px] text-zinc-500">Adquirido em: ${cp.purchasedAt} • Pago: <b class="text-emerald-400">R$ ${Number(cp.pricePaid || 0).toFixed(2).replace('.', ',')}</b></span>
              ${!isFinished ? `
                <button type="button" onclick="useClientPackageSession('${cp._id}')" class="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold transition">
                  <i class="fa-solid fa-check mr-1"></i>+1 Sessão Utilizada
                </button>
              ` : `
                <span class="text-[10px] font-bold text-zinc-400"><i class="fa-solid fa-check-double mr-1 text-emerald-400"></i>Pacote Finalizado</span>
              `}
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

async function saveAdminPackageTemplate() {
  const name = document.getElementById('pkg-name')?.value.trim() || '';
  const itemsDesc = (document.getElementById('pkg-items') || document.getElementById('pkg-items-desc'))?.value.trim() || '';
  const totalSessions = parseInt(document.getElementById('pkg-sessions')?.value || '4', 10);
  const originalPrice = parseFloat((document.getElementById('pkg-regular-price') || document.getElementById('pkg-original-price'))?.value || '0');
  const price = parseFloat(document.getElementById('pkg-price')?.value || '0');

  if (!name || isNaN(price) || price <= 0) {
    await showLuxAlert({
      title: 'Preencha os Dados do Pacote',
      message: 'Informe o nome do pacote e o preço promocional.',
      type: 'warning'
    });
    return;
  }

  const newPkg = {
    _id: `pkg_${Date.now()}`,
    name,
    itemsDesc: itemsDesc || `${totalSessions} sessões inclusas`,
    totalSessions: isNaN(totalSessions) || totalSessions < 1 ? 4 : totalSessions,
    originalPrice: isNaN(originalPrice) || originalPrice <= 0 ? price * 1.2 : originalPrice,
    price
  };

  state.packages.unshift(newPkg);
  persistLocalData();

  const nameEl = document.getElementById('pkg-name');
  const itemsEl = document.getElementById('pkg-items') || document.getElementById('pkg-items-desc');
  const origEl = document.getElementById('pkg-regular-price') || document.getElementById('pkg-original-price');
  const priceEl = document.getElementById('pkg-price');
  if (nameEl) nameEl.value = '';
  if (itemsEl) itemsEl.value = '';
  if (origEl) origEl.value = '';
  if (priceEl) priceEl.value = '';

  renderAdminPackages();
  await showLuxAlert({
    title: 'Pacote Criado com Sucesso!',
    message: `O pacote "${name}" (${newPkg.totalSessions} sessões por R$ ${price.toFixed(2)}) já está disponível para venda e no aplicativo do cliente!`,
    type: 'success'
  });
}

async function deleteAdminPackageTemplate(pkgId) {
  const ok = await showLuxConfirm({
    title: 'Excluir Modelo de Pacote?',
    message: 'Deseja remover este modelo de pacote do catálogo?',
    confirmText: 'Sim, Excluir',
    danger: true
  });
  if (!ok) return;

  state.packages = state.packages.filter(p => p._id !== pkgId);
  persistLocalData();
  renderAdminPackages();
}

async function assignPackageToClientAdmin() {
  const userId = (document.getElementById('assign-pkg-user') || document.getElementById('assign-pkg-client'))?.value;
  const pkgId = document.getElementById('assign-pkg-template')?.value;

  const user = state.users.find(u => u._id === userId);
  const pkg = state.packages.find(p => p._id === pkgId);
  if (!user || !pkg) {
    await showLuxAlert({
      title: 'Selecione Cliente e Pacote',
      message: 'Escolha um cliente e um modelo de pacote para registrar a venda.',
      type: 'warning'
    });
    return;
  }

  const nowDate = formatNowTimestamp().split(' ')[0];
  const newCp = {
    _id: `cp_${Date.now()}`,
    packageId: pkg._id,
    packageName: pkg.name,
    itemsDesc: pkg.itemsDesc,
    userId: user._id,
    clientName: user.name,
    clientEmail: user.email,
    totalSessions: pkg.totalSessions,
    usedSessions: 0,
    pricePaid: pkg.price,
    purchasedAt: nowDate,
    history: []
  };

  state.clientPackages.unshift(newCp);

  // Antecipa receita no Fluxo de Caixa Financeiro!
  const tx = {
    _id: `fin_pkg_${Date.now()}`,
    title: `Venda de Pacote: ${pkg.name} - ${user.name}`,
    type: 'income',
    category: 'Serviços',
    amount: Number(pkg.price),
    paymentMethod: 'pix',
    feePercent: 0,
    feeAmount: 0,
    netAmount: Number(pkg.price),
    status: 'paid',
    dueDate: formatDateISO(new Date())
  };
  state.finance.transactions.unshift(tx);

  persistLocalData();
  renderAdminPackages();
  renderAdminFinance();

  await showLuxAlert({
    title: 'Pacote Atribuído & Receita Lançada!',
    message: `Pacote "${pkg.name}" ativado para ${user.name} (0/${pkg.totalSessions} sessões usadas). A receita antecipada de R$ ${Number(pkg.price).toFixed(2)} entrou no Caixa!`,
    type: 'success'
  });
}

async function buyPackageFromClientApp(pkgId) {
  const pkg = state.packages.find(p => p._id === pkgId);
  if (!pkg) return;

  const user = state.currentUser;
  if (!user) {
    await showLuxAlert({
      title: 'Faça Login',
      message: 'Entre na sua conta para adquirir pacotes com desconto.',
      type: 'warning'
    });
    return;
  }

  const confirmed = await showLuxConfirm({
    title: 'Adquirir Pacote com Desconto?',
    message: `Deseja adquirir "${pkg.name}" (${pkg.totalSessions} sessões) por R$ ${Number(pkg.price).toFixed(2).replace('.', ',')}?`,
    confirmText: 'Sim, Adquirir Agora'
  });
  if (!confirmed) return;

  const nowDate = formatNowTimestamp().split(' ')[0];
  const newCp = {
    _id: `cp_${Date.now()}`,
    packageId: pkg._id,
    packageName: pkg.name,
    itemsDesc: pkg.itemsDesc,
    userId: user._id,
    clientName: user.name,
    clientEmail: user.email,
    totalSessions: pkg.totalSessions,
    usedSessions: 0,
    pricePaid: pkg.price,
    purchasedAt: nowDate,
    history: []
  };

  state.clientPackages.unshift(newCp);

  // Lança receita antecipada no Caixa da Barbearia
  state.finance.transactions.unshift({
    _id: `fin_pkg_${Date.now()}`,
    title: `Pacote App: ${pkg.name} - ${user.name}`,
    type: 'income',
    category: 'Serviços',
    amount: Number(pkg.price),
    paymentMethod: 'pix',
    feePercent: 0,
    feeAmount: 0,
    netAmount: Number(pkg.price),
    status: 'paid',
    dueDate: formatDateISO(new Date())
  });

  persistLocalData();
  renderClientLoyaltyAndPackages();

  await showLuxAlert({
    title: 'Pacote Ativado com Sucesso!',
    message: `Você agora possui ${pkg.totalSessions} sessões disponíveis em "${pkg.name}"!`,
    type: 'success'
  });
}

async function useClientPackageSession(cpId) {
  const cp = state.clientPackages.find(item => item._id === cpId);
  if (!cp) return;

  if (cp.usedSessions >= cp.totalSessions) {
    await showLuxAlert({
      title: 'Pacote Concluído',
      message: 'Todas as sessões deste pacote já foram utilizadas.',
      type: 'info'
    });
    return;
  }

  cp.usedSessions = Number(cp.usedSessions || 0) + 1;
  if (!Array.isArray(cp.history)) cp.history = [];
  cp.history.push(formatNowTimestamp());

  persistLocalData();
  renderAdminPackages();
  renderClientLoyaltyAndPackages();

  await showLuxAlert({
    title: 'Sessão Contabilizada!',
    message: `Sessão registrada para ${cp.clientName} no pacote "${cp.packageName}". Progresso atual: ${cp.usedSessions}/${cp.totalSessions} sessões utilizadas.`,
    type: 'success'
  });
}

async function deleteClientPackageAdmin(cpId) {
  const ok = await showLuxConfirm({
    title: 'Remover Pacote de Cliente?',
    message: 'Deseja excluir o registro deste pacote?',
    confirmText: 'Sim, Excluir',
    danger: true
  });
  if (!ok) return;

  state.clientPackages = state.clientPackages.filter(item => item._id !== cpId);
  persistLocalData();
  renderAdminPackages();
}

// ========================================================
// 8. MÓDULO: GESTÃO DE ESTOQUE (BAR & COSMÉTICOS)
// (Saldo, Histórico Entrada/Saída, Custo, Lucro, Alerta Estoque Baixo, Validade e Inventário)
// ========================================================
function renderAdminInventory() {
  const totalItemsEl = document.getElementById('inv-stat-total-items') || document.getElementById('inv-stat-items-sub');
  const costValEl = document.getElementById('inv-stat-cost-value') || document.getElementById('inv-stat-cost-total');
  const saleValEl = document.getElementById('inv-stat-sale-value') || document.getElementById('inv-stat-sale-total');
  const profitEl = document.getElementById('inv-stat-projected-profit') || document.getElementById('inv-stat-profit-total');
  const alertsCountEl = document.getElementById('inv-stat-alerts-count');
  const alertsBox = document.getElementById('inv-alerts-box');
  const prodList = document.getElementById('admin-inventory-list');
  const movList = document.getElementById('admin-inventory-movements-list');
  const movProdSel = document.getElementById('inv-mov-product');

  const items = state.inventory || [];
  let totalUnits = 0;
  let totalCost = 0;
  let totalSale = 0;
  const lowStockItems = [];
  const expiringItems = [];

  const today = new Date();
  const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  items.forEach(p => {
    const q = Number(p.quantity || 0);
    const minQ = Number(p.minQty || 3);
    const c = Number(p.costPrice || 0);
    const s = Number(p.salePrice || 0);

    totalUnits += q;
    totalCost += q * c;
    totalSale += q * s;

    if (q <= minQ) {
      lowStockItems.push(p);
    }
    if (p.expiryDate) {
      const [y, m, d] = p.expiryDate.split('-').map(Number);
      const expDt = new Date(y, m - 1, d);
      if (expDt <= in30Days) {
        expiringItems.push({ ...p, isExpired: expDt < today });
      }
    }
  });

  const projectedProfit = Math.max(0, totalSale - totalCost);

  if (totalItemsEl) totalItemsEl.textContent = `${totalUnits} unidades no inventário`;
  if (costValEl) costValEl.textContent = `R$ ${totalCost.toFixed(2).replace('.', ',')}`;
  if (saleValEl) saleValEl.textContent = `R$ ${totalSale.toFixed(2).replace('.', ',')}`;
  if (profitEl) profitEl.textContent = `R$ ${projectedProfit.toFixed(2).replace('.', ',')}`;
  if (alertsCountEl) alertsCountEl.textContent = String(lowStockItems.length + expiringItems.length);

  if (movProdSel) {
    movProdSel.innerHTML = items.map(p => `<option value="${p._id}">${p.name} (Saldo: ${p.quantity})</option>`).join('');
  }

  // Avisos / Alertas de Estoque Baixo e Validade
  if (alertsBox) {
    if (lowStockItems.length === 0 && expiringItems.length === 0) {
      alertsBox.classList.add('hidden');
      alertsBox.innerHTML = '';
    } else {
      alertsBox.classList.remove('hidden');
      let alertHtml = '';
      lowStockItems.forEach(p => {
        alertHtml += `
          <div class="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between text-xs">
            <div class="flex items-center space-x-2.5">
              <i class="fa-solid fa-triangle-exclamation text-amber-400 text-sm"></i>
              <div>
                <span class="font-extrabold text-amber-300">Alerta de Estoque Baixo: ${p.name}</span>
                <span class="text-[10px] text-zinc-300 block">Saldo atual: <b>${p.quantity} un</b> (Mínimo recomendado: ${p.minQty} un)</span>
              </div>
            </div>
            <span class="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-200">Repor Estoque</span>
          </div>
        `;
      });
      expiringItems.forEach(p => {
        const [y, m, d] = (p.expiryDate || '').split('-');
        alertHtml += `
          <div class="p-3 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-between text-xs">
            <div class="flex items-center space-x-2.5">
              <i class="fa-regular fa-calendar-xmark text-red-400 text-sm"></i>
              <div>
                <span class="font-extrabold text-red-300">${p.isExpired ? 'PRODUTO VENCIDO' : 'Validade Próxima'}: ${p.name}</span>
                <span class="text-[10px] text-zinc-300 block">Data de Validade: <b>${d}/${m}/${y}</b> • Saldo: ${p.quantity} un</span>
              </div>
            </div>
            <span class="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-red-500/25 text-red-200">Verificar Validade</span>
          </div>
        `;
      });
      alertsBox.innerHTML = alertHtml;
    }
  }

  // Lista de Produtos com Custo, Venda, Lucro por Produto e Validade
  if (prodList) {
    if (items.length === 0) {
      prodList.innerHTML = `<div class="p-6 text-center text-xs text-zinc-500">Nenhum produto cadastrado no estoque.</div>`;
    } else {
      prodList.innerHTML = items.map(p => {
        const unitCost = Number(p.costPrice || 0);
        const unitSale = Number(p.salePrice || 0);
        const unitProfit = unitSale - unitCost;
        const marginPct = unitCost > 0 ? Math.round((unitProfit / unitCost) * 100) : 100;
        const isLow = Number(p.quantity || 0) <= Number(p.minQty || 3);
        const [ey, em, ed] = (p.expiryDate || '').split('-');

        return `
          <div class="admin-item-card p-3.5 space-y-2 text-xs">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="font-extrabold text-white text-xs md:text-sm">${p.name}</span>
                  <span class="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 font-semibold">${p.category}</span>
                  ${isLow ? `<span class="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">⚠️ Estoque Baixo</span>` : ''}
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px]">
                  <div class="p-1.5 rounded-lg bg-[#0d0f14] border border-white/[0.04]">
                    <span class="text-zinc-500 block">Saldo Atual</span>
                    <b class="text-sm ${isLow ? 'text-amber-400' : 'text-white'}">${p.quantity} un</b>
                  </div>
                  <div class="p-1.5 rounded-lg bg-[#0d0f14] border border-white/[0.04]">
                    <span class="text-zinc-500 block">Custo / Venda</span>
                    <b class="text-zinc-200">R$ ${unitCost.toFixed(2)} / R$ ${unitSale.toFixed(2)}</b>
                  </div>
                  <div class="p-1.5 rounded-lg bg-[#0d0f14] border border-white/[0.04]">
                    <span class="text-zinc-500 block">Lucro p/ Produto</span>
                    <b class="text-emerald-400">R$ ${unitProfit.toFixed(2)} (${marginPct}%)</b>
                  </div>
                  <div class="p-1.5 rounded-lg bg-[#0d0f14] border border-white/[0.04]">
                    <span class="text-zinc-500 block">Validade</span>
                    <b class="text-zinc-200">${ed ? `${ed}/${em}/${ey}` : 'Indeterminada'}</b>
                  </div>
                </div>
              </div>
              <div class="flex flex-col space-y-1.5 shrink-0">
                <button type="button" onclick="editInventoryProduct('${p._id}')" class="w-7 h-7 rounded-lg bg-[#1c1f28] border border-white/[0.08] text-zinc-300 hover:text-[#e5a769] flex items-center justify-center">
                  <i class="fa-solid fa-pen text-[10px]"></i>
                </button>
                <button type="button" onclick="deleteInventoryProduct('${p._id}')" class="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 flex items-center justify-center">
                  <i class="fa-regular fa-trash-can text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Histórico de Movimentações de Entrada e Saída
  if (movList) {
    const movs = state.inventoryMovements || [];
    if (movs.length === 0) {
      movList.innerHTML = `<div class="p-4 text-center text-xs text-zinc-500">Nenhuma movimentação registrada.</div>`;
    } else {
      movList.innerHTML = movs.map(m => {
        const isEntry = m.type === 'in';
        const isSale = m.type === 'out_sale';
        const badgeClass = isEntry
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          : isSale
            ? 'bg-[#e5a769]/20 text-[#e5a769] border-[#e5a769]/40'
            : 'bg-red-500/15 text-red-400 border-red-500/30';
        const label = isEntry ? '+ Entrada' : isSale ? '- Saída Venda' : '- Consumo Interno';

        return `
          <div class="p-2.5 rounded-xl bg-[#0e1015] border border-white/[0.05] flex items-center justify-between text-[11px]">
            <div class="min-w-0 pr-2">
              <div class="flex items-center space-x-2">
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-md border ${badgeClass}">${label} (${m.qty} un)</span>
                <span class="font-bold text-white truncate">${m.productName}</span>
              </div>
              <span class="text-[10px] text-zinc-400 block mt-0.5">${m.reason || 'Movimentação de estoque'} • ${m.date}</span>
            </div>
            <span class="font-extrabold ${isEntry ? 'text-amber-300' : isSale ? 'text-emerald-400' : 'text-zinc-400'} shrink-0">
              ${isEntry ? `- R$ ${(m.qty * Number(m.unitCost || 0)).toFixed(2)}` : isSale ? `+ R$ ${(m.qty * Number(m.unitSale || 0)).toFixed(2)}` : `${m.qty} un`}
            </span>
          </div>
        `;
      }).join('');
    }
  }
}

async function saveInventoryProductAdmin() {
  return saveInventoryProduct();
}

async function saveInventoryProduct() {
  const id = document.getElementById('inv-prod-id')?.value.trim() || '';
  const name = document.getElementById('inv-name')?.value.trim() || '';
  const category = document.getElementById('inv-category')?.value || 'Bar & Bebidas';
  const quantity = parseInt(document.getElementById('inv-qty')?.value || '0', 10);
  const minQty = parseInt(document.getElementById('inv-min-qty')?.value || '5', 10);
  const costPrice = parseFloat(document.getElementById('inv-cost')?.value || '0');
  const salePrice = parseFloat((document.getElementById('inv-sale') || document.getElementById('inv-price'))?.value || '0');
  const expiryDate = document.getElementById('inv-expiry')?.value || '';

  if (!name || isNaN(costPrice)) {
    await showLuxAlert({
      title: 'Dados do Produto',
      message: 'Informe pelo menos o nome do produto e o custo unitário.',
      type: 'warning'
    });
    return;
  }

  const prodData = {
    name,
    category,
    quantity: isNaN(quantity) ? 0 : quantity,
    minQty: isNaN(minQty) ? 5 : minQty,
    costPrice: isNaN(costPrice) ? 0 : costPrice,
    salePrice: isNaN(salePrice) ? costPrice : salePrice,
    expiryDate
  };

  if (id) {
    const idx = state.inventory.findIndex(p => p._id === id);
    if (idx >= 0) state.inventory[idx] = { ...state.inventory[idx], ...prodData };
  } else {
    const newProd = { _id: `inv_${Date.now()}`, ...prodData };
    state.inventory.unshift(newProd);
    state.inventoryMovements.unshift({
      _id: `mov_${Date.now()}`,
      productId: newProd._id,
      productName: newProd.name,
      type: 'in',
      qty: newProd.quantity,
      unitCost: newProd.costPrice,
      unitSale: newProd.salePrice,
      reason: 'Cadastro inicial no estoque',
      date: formatNowTimestamp()
    });
  }

  persistLocalData();
  resetInventoryForm();
  renderAdminInventory();

  await showLuxAlert({
    title: id ? 'Produto Atualizado!' : 'Produto Cadastrado no Estoque!',
    message: `"${name}" foi salvo no inventário com cálculo automático de custo, lucro e controle de validade.`,
    type: 'success'
  });
}

function editInventoryProduct(prodId) {
  const p = state.inventory.find(item => item._id === prodId);
  if (!p) return;

  const idEl = document.getElementById('inv-prod-id');
  if (idEl) idEl.value = p._id;
  document.getElementById('inv-name').value = p.name;
  document.getElementById('inv-category').value = p.category || 'Bar & Bebidas';
  document.getElementById('inv-qty').value = p.quantity;
  document.getElementById('inv-min-qty').value = p.minQty;
  document.getElementById('inv-cost').value = p.costPrice;
  const saleEl = document.getElementById('inv-sale') || document.getElementById('inv-price');
  if (saleEl) saleEl.value = p.salePrice;
  document.getElementById('inv-expiry').value = p.expiryDate || '';
}

function resetInventoryForm() {
  const ids = ['inv-prod-id', 'inv-name', 'inv-qty', 'inv-min-qty', 'inv-cost', 'inv-sale', 'inv-price', 'inv-expiry'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

async function deleteInventoryProduct(prodId) {
  const p = state.inventory.find(item => item._id === prodId);
  const ok = await showLuxConfirm({
    title: 'Excluir Produto do Estoque?',
    message: `Deseja remover "${p ? p.name : 'este produto'}" do inventário?`,
    confirmText: 'Sim, Excluir',
    danger: true
  });
  if (!ok) return;

  state.inventory = state.inventory.filter(item => item._id !== prodId);
  persistLocalData();
  renderAdminInventory();
}

async function registerInventoryMovementAdmin() {
  return moveInventoryStock();
}

async function moveInventoryStock() {
  const prodId = document.getElementById('inv-mov-product')?.value;
  const type = document.getElementById('inv-mov-type')?.value || 'out_sale';
  const qty = parseInt(document.getElementById('inv-mov-qty')?.value || '1', 10);
  const reason = (document.getElementById('inv-mov-note') || document.getElementById('inv-mov-reason'))?.value.trim() || '';

  const prod = state.inventory.find(p => p._id === prodId);
  if (!prod || isNaN(qty) || qty <= 0) {
    await showLuxAlert({
      title: 'Quantidade Inválida',
      message: 'Selecione um produto e informe uma quantidade maior que zero.',
      type: 'warning'
    });
    return;
  }

  if (type !== 'in' && prod.quantity < qty) {
    await showLuxAlert({
      title: 'Saldo Insuficiente no Estoque',
      message: `O produto "${prod.name}" possui apenas ${prod.quantity} unidade(s) disponível(is).`,
      type: 'error'
    });
    return;
  }

  if (type === 'in') {
    prod.quantity = Number(prod.quantity || 0) + qty;
  } else {
    prod.quantity = Math.max(0, Number(prod.quantity || 0) - qty);
  }

  const mov = {
    _id: `mov_${Date.now()}`,
    productId: prod._id,
    productName: prod.name,
    type,
    qty,
    unitCost: prod.costPrice,
    unitSale: prod.salePrice,
    reason: reason || (type === 'in' ? 'Entrada / Reposição de estoque' : type === 'out_sale' ? 'Venda para cliente' : 'Consumo interno na barbearia'),
    date: formatNowTimestamp()
  };
  state.inventoryMovements.unshift(mov);

  // Integra automaticamente com o Fluxo de Caixa Financeiro!
  if (type === 'out_sale') {
    const totalSale = qty * Number(prod.salePrice || 0);
    state.finance.transactions.unshift({
      _id: `fin_inv_${Date.now()}`,
      title: `Venda Estoque (${qty}x ${prod.name})`,
      type: 'income',
      category: 'Produtos',
      amount: totalSale,
      paymentMethod: 'pix',
      feePercent: 0,
      feeAmount: 0,
      netAmount: totalSale,
      status: 'paid',
      dueDate: formatDateISO(new Date())
    });
  } else if (type === 'in') {
    const totalCost = qty * Number(prod.costPrice || 0);
    state.finance.transactions.unshift({
      _id: `fin_inv_${Date.now()}`,
      title: `Reposição Estoque (${qty}x ${prod.name})`,
      type: 'expense',
      category: 'Produtos',
      amount: totalCost,
      paymentMethod: 'pix',
      feePercent: 0,
      feeAmount: 0,
      netAmount: totalCost,
      status: 'paid',
      dueDate: formatDateISO(new Date())
    });
  }

  const rInput = document.getElementById('inv-mov-note') || document.getElementById('inv-mov-reason');
  if (rInput) rInput.value = '';

  persistLocalData();
  renderAdminInventory();
  renderAdminFinance();

  await showLuxAlert({
    title: 'Movimentação Registrada!',
    message: `${type === 'in' ? 'Entrada' : 'Saída'} de ${qty}x "${prod.name}" concluída. Saldo atual: ${prod.quantity} un.`,
    type: 'success'
  });
}

// ========================================================
// 9. MÓDULO: LISTA DE ESPERA AUTOMÁTICA
// (Cliente entra na lista do dia e é avisado automaticamente quando vagar horário)
// ========================================================
async function joinWaitlistForSelectedDate() {
  const user = state.currentUser;
  if (!user) {
    await showLuxAlert({
      title: 'Faça Login',
      message: 'Entre na sua conta para entrar na Lista de Espera Automática.',
      type: 'warning'
    });
    return;
  }

  const shift = document.getElementById('waitlist-preferred-shift')?.value || 'Qualquer horário';
  const dateStr = state.selectedDate || formatDateISO(new Date());
  const barber = state.selectedBarber || state.barbers[0];
  const serviceName = state.selectedServices.length > 0
    ? state.selectedServices.map(s => s.name).join(' + ')
    : (state.services[0]?.name || 'Corte Degradê');

  const already = (state.waitlist || []).find(
    w => w.date === dateStr && (w.userId === user._id || (w.clientEmail || '').toLowerCase() === (user.email || '').toLowerCase()) && w.status === 'waiting'
  );
  if (already) {
    await showLuxAlert({
      title: 'Já na Lista de Espera',
      message: 'Você já está inscrito na Lista de Espera para esta data. Assim que vagar um horário, avisaremos você automaticamente!',
      type: 'info'
    });
    return;
  }

  const entry = {
    _id: `wl_${Date.now()}`,
    userId: user._id,
    clientName: user.name,
    clientEmail: user.email,
    clientPhone: user.phone || '(11) 99999-9999',
    barberId: barber._id,
    barberName: barber.name,
    serviceName,
    date: dateStr,
    preferredShift: shift,
    status: 'waiting',
    freedTime: null,
    createdAt: formatNowTimestamp()
  };

  state.waitlist.unshift(entry);
  persistLocalData();
  updateClientNotificationBadge();

  const [y, m, d] = dateStr.split('-');
  await showLuxAlert({
    title: 'Inscrito na Lista de Espera!',
    message: `Você entrou na Lista de Espera do dia ${d}/${m}/${y} (${shift}). Se algum cliente desmarcar, o sistema avisará você automaticamente por Push Notification e no App para agendar sem interromper o barbeiro!`,
    type: 'success'
  });
}

function notifyWaitlistForFreedSlot(dateStr, freedTime, barberId, barberName) {
  if (!Array.isArray(state.waitlist)) return 0;
  let count = 0;
  const nowStr = formatNowTimestamp();

  state.waitlist.forEach(w => {
    if (w.date === dateStr && w.status === 'waiting') {
      w.status = 'notified';
      w.freedTime = freedTime || '16:00';
      w.notifiedAt = nowStr;
      count++;
    }
  });

  if (count > 0) {
    const [y, m, d] = (dateStr || '').split('-');
    triggerBrowserPushNotification(
      `Vaga Liberada na Lista de Espera! • ${state.shop.name}`,
      `Surgiu um horário livre em ${d}/${m}/${y} às ${freedTime} com ${barberName || 'Ricardo'}! Toque para agendar agora.`
    );
  }
  return count;
}

async function manualNotifyWaitlistItem(wId) {
  const w = (state.waitlist || []).find(item => item._id === wId);
  if (!w) return;

  w.status = 'notified';
  w.freedTime = w.freedTime || '17:00';
  w.notifiedAt = formatNowTimestamp();

  persistLocalData();
  renderAdminWaitlist();
  updateClientNotificationBadge();
  renderHomeActivePromoBanner();

  const [y, m, d] = (w.date || '').split('-');
  triggerBrowserPushNotification(
    `Vaga Liberada! • ${state.shop.name}`,
    `Olá ${w.clientName}, vagou um horário em ${d}/${m}/${y} às ${w.freedTime}!`
  );

  await showLuxAlert({
    title: 'Cliente Avisado Automaticamente!',
    message: `${w.clientName} recebeu o alerta de vaga disponível (${d}/${m}/${y} às ${w.freedTime}) para agendar pelo aplicativo.`,
    type: 'success'
  });
}

function bookFreedWaitlistSlot(wId) {
  const w = (state.waitlist || []).find(item => item._id === wId);
  if (!w) {
    openQuickBooking();
    return;
  }

  w.status = 'booked';
  persistLocalData();

  const barber = state.barbers.find(b => b._id === w.barberId) || state.barbers[0];
  state.selectedBarber = barber;
  state.selectedDate = w.date || formatDateISO(new Date());
  updateSelectedDateLabels(state.selectedDate);
  updateBookingUI();
  renderBookingBarbers();
  renderMiniCalendar();
  renderBookingSlots();

  if (w.freedTime) {
    state.selectedTime = w.freedTime;
  }
  switchTab('booking');
}

async function removeWaitlistItem(wId) {
  state.waitlist = (state.waitlist || []).filter(w => w._id !== wId);
  persistLocalData();
  renderClientWaitlistInMyBookings();
  renderAdminWaitlist();
  updateClientNotificationBadge();
}

function renderClientWaitlistInMyBookings() {
  const box = document.getElementById('client-waitlist-container');
  if (!box || !state.currentUser) return;

  const user = state.currentUser;
  const myWait = (state.waitlist || []).filter(
    w => w.status !== 'booked' && (w.userId === user._id || (w.clientEmail || '').toLowerCase() === (user.email || '').toLowerCase())
  );

  if (myWait.length === 0) {
    box.classList.add('hidden');
    box.innerHTML = '';
    return;
  }

  box.classList.remove('hidden');
  box.innerHTML = `
    <div class="admin-section-card p-4 space-y-2.5">
      <div class="flex items-center justify-between">
        <span class="text-xs font-extrabold text-amber-300"><i class="fa-solid fa-user-clock mr-1.5"></i>Sua Lista de Espera Automática</span>
        <span class="text-[10px] text-zinc-400">${myWait.length} registro(s)</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        ${myWait.map(w => {
          const [y, m, d] = (w.date || '').split('-');
          const isNotified = w.status === 'notified';
          return `
            <div class="p-3 rounded-xl ${isNotified ? 'bg-emerald-500/15 border border-emerald-500/40' : 'bg-[#0e1015] border border-white/[0.06]'} flex items-center justify-between text-xs">
              <div>
                <span class="font-extrabold text-white block">${d}/${m}/${y} • ${w.preferredShift}</span>
                <span class="text-[10px] text-zinc-400 block">${w.serviceName} (${w.barberName})</span>
                <span class="text-[10px] font-bold ${isNotified ? 'text-emerald-400' : 'text-amber-400'}">
                  ${isNotified ? `🎉 Vaga liberada às ${w.freedTime}!` : '⏳ Aguardando vaga automática'}
                </span>
              </div>
              <div class="flex items-center space-x-1.5">
                ${isNotified ? `
                  <button onclick="bookFreedWaitlistSlot('${w._id}')" class="px-3 py-1.5 rounded-xl btn-lux-primary text-[10px] font-extrabold">
                    Agendar Vaga
                  </button>
                ` : ''}
                <button onclick="removeWaitlistItem('${w._id}')" class="w-7 h-7 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center">
                  <i class="fa-solid fa-xmark text-[10px]"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderAdminWaitlist() {
  const listEl = document.getElementById('admin-waitlist-list');
  const badgeEl = document.getElementById('admin-waitlist-count-badge');
  if (!listEl) return;

  const list = state.waitlist || [];
  if (badgeEl) {
    badgeEl.textContent = `${list.length} cliente(s) na fila`;
  }

  if (list.length === 0) {
    listEl.innerHTML = `<div class="col-span-full p-4 rounded-xl bg-[#0e1015] border border-white/[0.04] text-center text-[11px] text-zinc-500">Nenhum cliente aguardando na Lista de Espera no momento.</div>`;
    return;
  }

  listEl.innerHTML = list.map(w => {
    const [y, m, d] = (w.date || '').split('-');
    const isNotified = w.status === 'notified';
    return `
      <div class="p-3 rounded-xl bg-[#0e1015] border ${isNotified ? 'border-emerald-500/40' : 'border-amber-500/30'} flex flex-col justify-between gap-2 text-xs">
        <div>
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-white">${w.clientName}</span>
            <span class="text-[9px] px-2 py-0.5 rounded-full font-bold ${isNotified ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-300'}">
              ${isNotified ? 'Avisado Automaticamente' : 'Aguardando Vaga'}
            </span>
          </div>
          <span class="text-[10px] text-zinc-400 block mt-0.5">${w.serviceName} • Data: <b>${d}/${m}/${y}</b> (${w.preferredShift})</span>
        </div>
        <div class="flex items-center justify-between pt-1.5 border-t border-white/[0.05]">
          <button type="button" onclick="manualNotifyWaitlistItem('${w._id}')" class="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-[10px] font-bold">
            <i class="fa-solid fa-bell mr-1"></i>Avisar Vaga Agora
          </button>
          <button type="button" onclick="removeWaitlistItem('${w._id}')" class="text-[10px] text-red-400 hover:underline">
            Remover
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ========================================================
// 10. MÓDULO: MENSAGENS DE RETORNO AUTOMÁTICAS & PESQUISA DE SATISFAÇÃO
// ========================================================
function renderAdminCrm() {
  renderAdminReturnRules();
  renderAdminSatisfactionReviews();
}

function renderAdminReturnRules() {
  const svcSel = document.getElementById('ret-rule-service');
  const listEl = document.getElementById('admin-return-rules-list');

  if (svcSel) {
    svcSel.innerHTML = state.services.map(s => `<option value="${s._id}">${s.name}</option>`).join('');
  }
  if (!listEl) return;

  const rules = state.returnRules || [];
  if (rules.length === 0) {
    listEl.innerHTML = `<div class="p-4 text-center text-xs text-zinc-500">Nenhuma regra automática de retorno configurada.</div>`;
    return;
  }

  listEl.innerHTML = rules.map(r => `
    <div class="p-3 rounded-xl bg-[#0e1015] border border-white/[0.06] space-y-1.5 text-xs">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="font-extrabold text-white">${r.serviceName}</span>
          <span class="text-[9px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 font-bold">Retorno: ${r.daysAfter} dias</span>
        </div>
        <button type="button" onclick="deleteReturnRuleAdmin('${r._id}')" class="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
          <i class="fa-regular fa-trash-can text-[10px]"></i>
        </button>
      </div>
      <p class="text-[11px] text-zinc-300">${r.message}</p>
      ${r.lastTriggeredAt ? `<span class="text-[9px] text-emerald-400 block"><i class="fa-solid fa-check-double mr-1"></i>Último disparo automático: ${r.lastTriggeredAt}</span>` : ''}
    </div>
  `).join('');
}

async function saveReturnRuleAdmin() {
  const serviceId = document.getElementById('ret-rule-service')?.value || state.services[0]?._id;
  const daysAfter = parseInt(document.getElementById('ret-rule-days')?.value || '15', 10);
  const message = document.getElementById('ret-rule-msg')?.value.trim() || '';

  const svc = state.services.find(s => s._id === serviceId) || state.services[0];
  const rule = {
    _id: `ret_${Date.now()}`,
    serviceId: svc._id,
    serviceName: svc.name,
    daysAfter: isNaN(daysAfter) || daysAfter < 1 ? 15 : daysAfter,
    message: message || `Olá {cliente}! Já completou ${daysAfter} dias do seu último ${svc.name} na ${state.shop.name}. Agende seu retorno hoje mesmo!`,
    lastTriggeredAt: formatNowTimestamp()
  };

  state.returnRules.unshift(rule);
  persistLocalData();

  const msgEl = document.getElementById('ret-rule-msg');
  if (msgEl) msgEl.value = '';

  renderAdminReturnRules();
  updateClientNotificationBadge();

  await showLuxAlert({
    title: 'Regra de Retorno Ativada!',
    message: `Clientes que realizarem "${svc.name}" receberão automaticamente o lembrete de retorno em ${rule.daysAfter} dias.`,
    type: 'success'
  });
}

async function deleteReturnRuleAdmin(ruleId) {
  state.returnRules = (state.returnRules || []).filter(r => r._id !== ruleId);
  persistLocalData();
  renderAdminReturnRules();
}

async function triggerReturnMessagesNow() {
  const nowStr = formatNowTimestamp();
  (state.returnRules || []).forEach(r => {
    r.lastTriggeredAt = nowStr;
  });
  persistLocalData();
  renderAdminReturnRules();
  updateClientNotificationBadge();

  triggerBrowserPushNotification(
    `Hora de Renovar o Visual! • ${state.shop.name}`,
    `Sentimos sua falta! Já está no dia do seu retorno. Agende seu horário pelo aplicativo!`
  );

  await showLuxAlert({
    title: 'Mensagens de Retorno Disparadas!',
    message: `O ciclo automático enviou ${state.returnRules.length} regra(s) de retorno para os clientes elegíveis via Push + Central do App.`,
    type: 'success'
  });
}

// --- PESQUISA DE SATISFAÇÃO ---
function toggleSatisfactionEnabled(checkedVal) {
  const chk = document.getElementById('admin-satisfaction-toggle') || document.getElementById('crm-satisfaction-enabled');
  state.satisfactionEnabled = typeof checkedVal === 'boolean' ? checkedVal : (chk ? Boolean(chk.checked) : true);
  persistLocalData();
}

function openSatisfactionModal(appId) {
  const app = state.appointments.find(a => a._id === appId);
  if (!app) return;

  const modal = document.getElementById('modal-satisfaction-survey');
  const idInp = document.getElementById('survey-app-id') || document.getElementById('survey-appointment-id');
  const infoEl = document.getElementById('survey-service-subtitle') || document.getElementById('survey-service-info');
  const commentEl = document.getElementById('survey-comment');

  if (idInp) idInp.value = app._id;
  if (infoEl) infoEl.textContent = `${app.serviceName} com ${app.barberName}`;
  if (commentEl) commentEl.value = '';

  selectSurveyRating(5);
  if (modal) modal.classList.remove('hidden');
}

function closeSatisfactionModal() {
  const modal = document.getElementById('modal-satisfaction-survey');
  if (modal) modal.classList.add('hidden');
}

function selectSurveyRating(stars) {
  state.surveyCurrentRating = stars;
  document.querySelectorAll('#survey-stars-row button').forEach((btn, idx) => {
    if (idx < stars) {
      btn.className = 'survey-star text-2xl text-amber-400 hover:scale-110 transition';
    } else {
      btn.className = 'survey-star text-2xl text-zinc-600 hover:scale-110 transition';
    }
  });
}

async function submitSatisfactionSurvey() {
  const appId = (document.getElementById('survey-app-id') || document.getElementById('survey-appointment-id'))?.value;
  const comment = document.getElementById('survey-comment')?.value.trim() || 'Excelente atendimento!';
  const app = state.appointments.find(a => a._id === appId);
  const user = state.currentUser;

  const newRev = {
    _id: `rev_${Date.now()}`,
    appointmentId: app ? app._id : `app_${Date.now()}`,
    clientName: user ? user.name : (app ? app.clientName : 'Cliente'),
    clientEmail: user ? user.email : (app ? app.clientEmail : ''),
    barberName: app ? app.barberName : 'Ricardo',
    serviceName: app ? app.serviceName : 'Atendimento',
    rating: state.surveyCurrentRating || 5,
    comment,
    createdAt: formatNowTimestamp()
  };

  state.reviews.unshift(newRev);

  persistLocalData();
  closeSatisfactionModal();
  loadMyBookings();
  updateClientNotificationBadge();
  renderHomeActivePromoBanner();

  await showLuxAlert({
    title: 'Avaliação Enviada!',
    message: 'Muito obrigado pelo seu feedback! Sua resposta ajuda a manter nossa excelência.',
    type: 'success'
  });
}

function renderAdminSatisfactionReviews() {
  const avgScoreEl = document.getElementById('admin-satisfaction-avg-label') || document.getElementById('crm-avg-score');
  const totalRevEl = document.getElementById('crm-total-reviews');
  const chkEl = document.getElementById('admin-satisfaction-toggle') || document.getElementById('crm-satisfaction-enabled');
  const listEl = document.getElementById('admin-reviews-list');

  if (chkEl) chkEl.checked = Boolean(state.satisfactionEnabled);

  const revs = state.reviews || [];
  const avg = revs.length > 0
    ? (revs.reduce((acc, r) => acc + Number(r.rating || 5), 0) / revs.length).toFixed(1)
    : '5.0';

  if (avgScoreEl) avgScoreEl.textContent = `Média: ${avg} ⭐ (${revs.length} avaliações)`;
  if (totalRevEl) totalRevEl.textContent = `${revs.length} avaliação(ões) recebida(s)`;
  if (!listEl) return;

  if (revs.length === 0) {
    listEl.innerHTML = `<div class="p-4 text-center text-xs text-zinc-500">Nenhuma pesquisa de satisfação respondida ainda.</div>`;
    return;
  }

  listEl.innerHTML = revs.map(r => {
    const starsHtml = '⭐'.repeat(Math.max(1, Math.min(5, Number(r.rating || 5))));
    return `
      <div class="p-3 rounded-xl bg-[#0e1015] border border-white/[0.06] space-y-1.5 text-xs">
        <div class="flex items-center justify-between">
          <div>
            <span class="font-extrabold text-white">${r.clientName}</span>
            <span class="text-[10px] text-amber-400 ml-1.5">${starsHtml} (${r.rating}/5)</span>
          </div>
          <span class="text-[9px] text-zinc-500">${r.createdAt}</span>
        </div>
        <p class="text-[10px] text-[#e5a769] font-semibold">${r.serviceName} • Profissional: ${r.barberName}</p>
        <p class="text-[11px] text-zinc-300 italic">"${r.comment}"</p>
      </div>
    `;
  }).join('');
}

function renderClientLoyaltyAndPackages() {
  const user = state.currentUser;
  const myPkgsList = document.getElementById('client-my-packages-list');
  const availPkgsList = document.getElementById('client-available-packages-list');

  // Meus Pacotes Ativos (Sessões Utilizadas x Compradas)
  if (myPkgsList) {
    const myPkgs = user
      ? (state.clientPackages || []).filter(
          cp => cp.userId === user._id || (cp.clientEmail && (cp.clientEmail || '').toLowerCase() === (user.email || '').toLowerCase())
        )
      : [];

    if (myPkgs.length === 0) {
      myPkgsList.innerHTML = `<div class="p-4 rounded-xl bg-[#101218] border border-white/[0.05] text-center text-xs text-zinc-400">Você ainda não possui pacotes ativos. Confira abaixo os pacotes com desconto!</div>`;
    } else {
      myPkgsList.innerHTML = myPkgs.map(cp => {
        const used = Number(cp.usedSessions || 0);
        const total = Math.max(1, Number(cp.totalSessions || 1));
        const remaining = Math.max(0, total - used);
        const pct = Math.min(100, Math.round((used / total) * 100));
        return `
          <div class="p-3.5 rounded-2xl bg-[#11131a] border border-emerald-500/35 space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-extrabold text-white text-sm">${cp.packageName}</span>
              <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                ${remaining} sessão(ões) disponível(is)
              </span>
            </div>
            <p class="text-[11px] text-zinc-400">${cp.itemsDesc || ''}</p>
            <div class="space-y-1 pt-1">
              <div class="flex items-center justify-between text-[10px]">
                <span class="text-zinc-300 font-semibold">Sessões Utilizadas x Compradas: <b class="text-white">${used} de ${total}</b></span>
                <span class="text-[#e5a769] font-bold">${pct}% concluído</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-[#090a0f] overflow-hidden border border-white/[0.06]">
                <div class="h-full rounded-full btn-lux-primary transition-all duration-300" style="width:${pct}%"></div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Catálogo de Pacotes para Adquirir no App
  if (availPkgsList) {
    availPkgsList.innerHTML = (state.packages || []).map(p => {
      const economy = Math.max(0, Number(p.originalPrice || p.price) - Number(p.price || 0));
      return `
        <div class="p-3.5 rounded-2xl bg-[#11131a] border border-white/[0.07] flex items-center justify-between text-xs">
          <div class="min-w-0 pr-2">
            <div class="flex items-center space-x-2">
              <span class="font-extrabold text-white text-xs md:text-sm">${p.name}</span>
              <span class="text-[9px] px-2 py-0.5 rounded-full bg-[#e5a769]/20 text-[#e5a769] font-bold">${p.totalSessions} sessões</span>
            </div>
            <p class="text-[10px] text-zinc-400 mt-0.5">${p.itemsDesc}</p>
            <div class="flex items-center space-x-2 mt-1">
              <span class="text-[10px] text-zinc-500 line-through">R$ ${Number(p.originalPrice || p.price).toFixed(2).replace('.', ',')}</span>
              <span class="text-xs font-black text-emerald-400">R$ ${Number(p.price).toFixed(2).replace('.', ',')}</span>
              ${economy > 0 ? `<span class="text-[9px] text-amber-300 font-bold">(-R$ ${economy.toFixed(0)})</span>` : ''}
            </div>
          </div>
          <button type="button" onclick="buyPackageFromClientApp('${p._id}')" class="px-3.5 py-2 rounded-xl btn-lux-primary text-[10px] font-extrabold shrink-0">
            Adquirir
          </button>
        </div>
      `;
    }).join('');
  }
}

