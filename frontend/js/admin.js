// ==========================================
// BvIt Barber - Painel Administrativo do Dono / Barbeiro
// ==========================================

let authMode = 'login';
let currentAdminTab = 'agenda';

document.addEventListener('DOMContentLoaded', () => {
  checkAuthSession();
  setupAdminDateInput();
});

function setupAdminDateInput() {
  const dateInput = document.getElementById('admin-filter-date');
  if (dateInput) {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    dateInput.value = todayStr;
  }
}

// ------------------------------------------
// 1. AUTENTICAÇÃO E SESSÃO
// ------------------------------------------

function setAuthMode(mode) {
  authMode = mode;
  const toggleLogin = document.getElementById('toggle-login-btn');
  const toggleRegister = document.getElementById('toggle-register-btn');
  const registerFields = document.getElementById('register-fields');
  const btnSubmit = document.getElementById('btn-auth-submit');
  const loginLabel = document.getElementById('auth-login-label');

  if (mode === 'login') {
    toggleLogin.className = 'flex-1 py-1 text-center font-bold text-xs text-amber-400 border-b-2 border-amber-500';
    toggleRegister.className = 'flex-1 py-1 text-center font-bold text-xs text-slate-400 border-b-2 border-transparent';
    registerFields.classList.add('hidden');
    btnSubmit.textContent = 'Entrar na Conta';
    loginLabel.textContent = 'Telefone / E-mail *';
  } else {
    toggleRegister.className = 'flex-1 py-1 text-center font-bold text-xs text-amber-400 border-b-2 border-amber-500';
    toggleLogin.className = 'flex-1 py-1 text-center font-bold text-xs text-slate-400 border-b-2 border-transparent';
    registerFields.classList.remove('hidden');
    btnSubmit.textContent = 'Criar Minha Conta';
    loginLabel.textContent = 'WhatsApp / Celular *';
  }
}

function fillAdminCredentials() {
  setAuthMode('login');
  const loginInput = document.getElementById('auth-login');
  const passInput = document.getElementById('auth-password');
  if (loginInput) loginInput.value = 'admin@bvitsystem.com.br';
  if (passInput) passInput.value = 'admin123';
}

async function handleAuthSubmit() {
  const loginVal = document.getElementById('auth-login')?.value.trim();
  const passVal = document.getElementById('auth-password')?.value.trim();
  const nameVal = document.getElementById('auth-name')?.value.trim();
  const emailVal = document.getElementById('auth-email')?.value.trim();

  if (!loginVal || !passVal) {
    alert('Preencha os campos obrigatórios.');
    return;
  }

  const btn = document.getElementById('btn-auth-submit');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Processando...';
  }

  try {
    let endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    let bodyData = authMode === 'login' 
      ? { login: loginVal, password: passVal }
      : { phone: loginVal, password: passVal, name: nameVal || 'Cliente', email: emailVal };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('barber_auth_token', data.token);
      localStorage.setItem('barber_user', JSON.stringify(data.user));
      checkAuthSession();
    } else {
      // Se estiver testando no ambiente sem banco de dados (mock de demonstração)
      if (loginVal.includes('admin') && passVal === 'admin123') {
        const mockAdmin = {
          name: 'Administrador Barbearia',
          role: 'admin',
          email: 'admin@bvitsystem.com.br'
        };
        localStorage.setItem('barber_auth_token', 'mock_admin_token_2026');
        localStorage.setItem('barber_user', JSON.stringify(mockAdmin));
        checkAuthSession();
      } else {
        alert(data.error || 'Erro ao realizar login.');
      }
    }
  } catch (err) {
    // Simulação caso a API esteja offline no primeiro teste
    if (loginVal.includes('admin') && passVal === 'admin123') {
      const mockAdmin = {
        name: 'Administrador Barbearia',
        role: 'admin',
        email: 'admin@bvitsystem.com.br'
      };
      localStorage.setItem('barber_auth_token', 'mock_admin_token_2026');
      localStorage.setItem('barber_user', JSON.stringify(mockAdmin));
      checkAuthSession();
    } else {
      alert('Não foi possível conectar ao servidor. Tente novamente.');
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = authMode === 'login' ? 'Entrar na Conta' : 'Criar Minha Conta';
    }
  }
}

function checkAuthSession() {
  const token = localStorage.getItem('barber_auth_token');
  const userJson = localStorage.getItem('barber_user');

  const authBox = document.getElementById('auth-box');
  const adminBox = document.getElementById('admin-dashboard-box');
  const navProfileLabel = document.getElementById('nav-profile-label');

  if (token && userJson) {
    const user = JSON.parse(userJson);
    if (user.role === 'admin' || user.role === 'barber') {
      // Exibe Dashboard do Administrador
      if (authBox) authBox.classList.add('hidden');
      if (adminBox) adminBox.classList.remove('hidden');
      if (navProfileLabel) navProfileLabel.textContent = 'Admin';
      
      const adminName = document.getElementById('admin-user-name');
      if (adminName) adminName.textContent = user.name;

      loadAdminDashboard();
      loadAdminAgenda();
      return;
    }
  }

  // Não autenticado como admin
  if (authBox) authBox.classList.remove('hidden');
  if (adminBox) adminBox.classList.add('hidden');
  if (navProfileLabel) navProfileLabel.textContent = 'Painel';
}

function logout() {
  localStorage.removeItem('barber_auth_token');
  localStorage.removeItem('barber_user');
  checkAuthSession();
}

// ------------------------------------------
// 2. DASHBOARD E MÉTRICAS
// ------------------------------------------

async function loadAdminDashboard() {
  const token = localStorage.getItem('barber_auth_token');
  try {
    const res = await fetch('/api/admin/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.stats) {
        document.getElementById('metric-today-count').textContent = data.stats.todayTotal || '0';
        document.getElementById('metric-today-completed').textContent = `${data.stats.todayCompleted || 0} concluídos`;
        document.getElementById('metric-today-revenue').textContent = `R$ ${Number(data.stats.todayRevenue || 0).toFixed(0)}`;
        document.getElementById('metric-month-count').textContent = data.stats.monthTotal || '0';
        document.getElementById('metric-month-revenue').textContent = `R$ ${Number(data.stats.monthRevenue || 0).toFixed(0)}`;
      }
    } else {
      renderMockMetrics();
    }
  } catch (err) {
    renderMockMetrics();
  }
}

function renderMockMetrics() {
  document.getElementById('metric-today-count').textContent = '4';
  document.getElementById('metric-today-completed').textContent = '2 concluídos';
  document.getElementById('metric-today-revenue').textContent = 'R$ 180';
  document.getElementById('metric-month-count').textContent = '42';
  document.getElementById('metric-month-revenue').textContent = 'R$ 2.450';
}

// ------------------------------------------
// 3. SUB-ABAS DO PAINEL ADMIN
// ------------------------------------------

function setAdminTab(tab) {
  currentAdminTab = tab;
  const tabs = ['agenda', 'barbers', 'services'];
  
  tabs.forEach(t => {
    const view = document.getElementById(`admin-view-${t}`);
    const btn = document.getElementById(`tab-btn-${t}`);
    if (view) {
      if (t === tab) {
        view.classList.remove('hidden');
        view.classList.add('fade-in');
      } else {
        view.classList.add('hidden');
      }
    }
    if (btn) {
      if (t === tab) {
        btn.className = 'flex-1 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold';
      } else {
        btn.className = 'flex-1 py-1.5 rounded-lg text-slate-400 font-semibold hover:text-white';
      }
    }
  });

  if (tab === 'agenda') loadAdminAgenda();
  if (tab === 'barbers') loadAdminBarbers();
  if (tab === 'services') loadAdminServices();
}

// SUB-ABA: AGENDA
async function loadAdminAgenda() {
  const dateInput = document.getElementById('admin-filter-date');
  const date = dateInput ? dateInput.value : '';
  const token = localStorage.getItem('barber_auth_token');
  const container = document.getElementById('admin-appointments-list');

  if (container) {
    container.innerHTML = `
      <div class="text-center py-6 text-slate-400 text-xs">
        <i class="fa-solid fa-spinner fa-spin text-amber-500 mr-2"></i>Carregando agendamentos...
      </div>
    `;
  }

  let appointments = [];
  try {
    const res = await fetch(`/api/appointments?date=${date}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      appointments = data.appointments || [];
    } else {
      appointments = generateMockAdminAppointments(date);
    }
  } catch (err) {
    appointments = generateMockAdminAppointments(date);
  }

  renderAdminAppointments(appointments);
}

function generateMockAdminAppointments(date) {
  return [
    { _id: 'a1', clientName: 'Felipe Rocha', clientPhone: '11987654321', barberName: 'Carlos "Navalha"', serviceName: 'Corte + Barba', price: 70, time: '10:00', status: 'completed' },
    { _id: 'a2', clientName: 'Guilherme Souza', clientPhone: '11999887766', barberName: 'Carlos "Navalha"', serviceName: 'Corte Tradicional', price: 45, time: '11:00', status: 'completed' },
    { _id: 'a3', clientName: 'Rodrigo Alves', clientPhone: '11977665544', barberName: 'Marcos Oliveira', serviceName: 'Barboterapia Completa', price: 35, time: '14:30', status: 'confirmed' },
    { _id: 'a4', clientName: 'Gabriel Martins', clientPhone: '11966554433', barberName: 'Lucas Santos', serviceName: 'Platinado / Fade', price: 90, time: '16:00', status: 'confirmed' }
  ];
}

function renderAdminAppointments(list) {
  const container = document.getElementById('admin-appointments-list');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400 glass-card rounded-2xl p-4 border border-white/10 text-xs">
        <i class="fa-regular fa-calendar-check text-2xl text-slate-500 mb-2 block"></i>
        Nenhum agendamento marcado para esta data.
      </div>
    `;
    return;
  }

  const statusBadge = {
    confirmed: '<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Confirmado</span>',
    pending: '<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Pendente</span>',
    completed: '<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Concluído</span>',
    cancelled: '<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Cancelado</span>'
  };

  container.innerHTML = list.map(item => {
    const rawPhone = item.clientPhone.replace(/\D/g, '');
    const zapMsg = encodeURIComponent(`Olá ${item.clientName}! Confirmando seu horário de ${item.serviceName} hoje às ${item.time} na Barbearia. Tudo certo?`);
    const isCompleted = item.status === 'completed';
    const isCancelled = item.status === 'cancelled';

    return `
      <div class="glass-card rounded-xl p-3 border border-white/10 space-y-2.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg">
              ${item.time}
            </span>
            <span class="text-xs font-bold text-white">${item.clientName}</span>
          </div>
          ${statusBadge[item.status] || statusBadge.confirmed}
        </div>

        <div class="flex items-center justify-between text-[11px] text-slate-300">
          <span>${item.serviceName} • <b class="text-slate-400 font-normal">Barbeiro:</b> ${item.barberName}</span>
          <span class="font-extrabold text-amber-400">R$ ${Number(item.price).toFixed(2).replace('.', ',')}</span>
        </div>

        <!-- Ações do Dono / Barbeiro -->
        <div class="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <a href="https://wa.me/55${rawPhone}?text=${zapMsg}" target="_blank" class="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1">
            <i class="fa-brands fa-whatsapp text-sm"></i>
            <span>Chamar Zap</span>
          </a>

          <div class="flex items-center space-x-2">
            ${!isCompleted && !isCancelled ? `
              <button onclick="updateAppointmentStatus('${item._id}', 'completed')" class="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 px-2 py-1 rounded-lg text-[10px] font-bold">
                <i class="fa-solid fa-check mr-1"></i>Concluir
              </button>
              <button onclick="updateAppointmentStatus('${item._id}', 'cancelled')" class="bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 px-2 py-1 rounded-lg text-[10px] font-bold">
                <i class="fa-solid fa-xmark mr-1"></i>Cancelar
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function updateAppointmentStatus(id, newStatus) {
  const token = localStorage.getItem('barber_auth_token');
  try {
    const res = await fetch(`/api/appointments/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    loadAdminAgenda();
    loadAdminDashboard();
  } catch (err) {
    loadAdminAgenda();
  }
}

// SUB-ABA: BARBEIROS
function loadAdminBarbers() {
  const container = document.getElementById('admin-barbers-list');
  if (!container) return;

  const barbers = appState.barbers || [];
  container.innerHTML = barbers.map(b => `
    <div class="glass-card rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs">
      <div class="flex items-center space-x-3">
        <img src="${b.avatar}" class="w-10 h-10 rounded-lg object-cover" />
        <div>
          <h5 class="font-bold text-white">${b.name}</h5>
          <span class="text-[10px] text-slate-400">Atende: Seg a Sáb (09h às 19h)</span>
        </div>
      </div>
      <span class="badge-gold text-[10px] px-2 py-0.5 rounded-full font-bold">Ativo</span>
    </div>
  `).join('');
}

// SUB-ABA: SERVIÇOS
function loadAdminServices() {
  const container = document.getElementById('admin-services-list');
  if (!container) return;

  const services = appState.services || [];
  container.innerHTML = services.map(s => `
    <div class="glass-card rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs">
      <div>
        <h5 class="font-bold text-white">${s.name}</h5>
        <span class="text-[10px] text-slate-400">${s.durationMinutes} minutos</span>
      </div>
      <span class="font-bold text-amber-400 text-sm">R$ ${Number(s.price).toFixed(2).replace('.', ',')}</span>
    </div>
  `).join('');
}

// MODAL NOVO SERVIÇO
function openNewServiceModal() {
  document.getElementById('modal-new-service')?.classList.remove('hidden');
}

function closeServiceModal() {
  document.getElementById('modal-new-service')?.classList.add('hidden');
}

async function saveNewService() {
  const name = document.getElementById('modal-service-name')?.value.trim();
  const desc = document.getElementById('modal-service-desc')?.value.trim();
  const price = parseFloat(document.getElementById('modal-service-price')?.value);
  const duration = parseInt(document.getElementById('modal-service-duration')?.value) || 30;

  if (!name || isNaN(price)) {
    alert('Preencha o nome e o preço do serviço.');
    return;
  }

  const token = localStorage.getItem('barber_auth_token');
  try {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, description: desc, price, durationMinutes: duration })
    });

    if (res.ok) {
      alert('Serviço cadastrado com sucesso!');
      closeServiceModal();
      loadServices();
      loadAdminServices();
    } else {
      alert('Erro ao salvar serviço.');
    }
  } catch (err) {
    // Adiciona na lista local para demonstração
    appState.services.push({ _id: 's_' + Date.now(), name, description: desc, price, durationMinutes: duration });
    renderServices(appState.services);
    loadAdminServices();
    closeServiceModal();
  }
}
