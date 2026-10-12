const User = require('../models/User');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const Setting = require('../models/Setting');

const seedDatabase = async () => {
  try {
    // 1. Criar Usuário Admin Padrão se não existir
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('[Seed] Criando usuário administrador inicial...');
      await User.create({
        name: 'Administrador Barbearia',
        phone: '11999999999',
        email: 'admin@bvitsystem.com.br',
        password: 'admin123',
        role: 'admin',
      });
      console.log('[Seed] Admin criado com sucesso: admin@bvitsystem.com.br / admin123');
    }

    // 2. Criar Barbeiros Iniciais se não existirem
    const barberCount = await Barber.countDocuments();
    let createdBarbers = [];
    if (barberCount === 0) {
      console.log('[Seed] Inserindo barbeiros padrão...');
      createdBarbers = await Barber.create([
        {
          name: 'Carlos "Navalha" Silva',
          avatar: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=80',
          phone: '(11) 98888-1111',
          bio: '10 anos de experiência em cortes clássicos e degradê de alta precisão.',
          specialties: ['Degradê Navalhado', 'Corte Social', 'Barboterapia'],
          workingHours: {
            daysOfWeek: [1, 2, 3, 4, 5, 6],
            startTime: '09:00',
            endTime: '19:00',
            lunchStart: '12:00',
            lunchEnd: '13:00',
            slotDurationMinutes: 30,
          },
        },
        {
          name: 'Marcos Oliveira',
          avatar: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&auto=format&fit=crop&q=80',
          phone: '(11) 98888-2222',
          bio: 'Especialista em visagismo facial, barboterapia com toalha quente e alinhamento.',
          specialties: ['Barba Terapia', 'Corte e Barba', 'Pigmentação'],
          workingHours: {
            daysOfWeek: [1, 2, 3, 4, 5, 6],
            startTime: '09:00',
            endTime: '19:00',
            lunchStart: '13:00',
            lunchEnd: '14:00',
            slotDurationMinutes: 30,
          },
        },
        {
          name: 'Lucas Santos',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          phone: '(11) 98888-3333',
          bio: 'Focado em tendências modernas, cortes freestyle, platinado e hidratação.',
          specialties: ['Cortes Modernos', 'Platinado / Selagem', 'Sobrancelha'],
          workingHours: {
            daysOfWeek: [2, 3, 4, 5, 6],
            startTime: '10:00',
            endTime: '20:00',
            lunchStart: '14:00',
            lunchEnd: '15:00',
            slotDurationMinutes: 30,
          },
        },
      ]);
      console.log('[Seed] 3 barbeiros cadastrados com sucesso.');
    }

    // 3. Criar Serviços Iniciais se não existirem
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('[Seed] Inserindo serviços padrão...');
      await Service.create([
        {
          name: 'Corte Tradicional / Fade',
          description: 'Corte completo com lavagem, finalização com pomada e penteado.',
          price: 45.0,
          durationMinutes: 30,
          category: 'Cabelo',
          icon: 'scissors',
        },
        {
          name: 'Barboterapia Completa',
          description: 'Modelagem da barba, toalha quente aromática, óleo essencial e pós-barba.',
          price: 35.0,
          durationMinutes: 30,
          category: 'Barba',
          icon: 'razor',
        },
        {
          name: 'Combo Master (Corte + Barba)',
          description: 'O combo mais pedido! Corte completo + Barboterapia relaxante.',
          price: 70.0,
          durationMinutes: 50,
          category: 'Combo',
          icon: 'award',
        },
        {
          name: 'Pezinho & Sobrancelha',
          description: 'Alinhamento dos contornos com navalha e desenho de sobrancelha.',
          price: 25.0,
          durationMinutes: 15,
          category: 'Acabamento',
          icon: 'sparkles',
        },
        {
          name: 'Platinado / Pigmentação',
          description: 'Tratamento de cor ou disfarce de fios brancos com pigmento especial.',
          price: 90.0,
          durationMinutes: 60,
          category: 'Química',
          icon: 'brush',
        },
      ]);
      console.log('[Seed] 5 serviços cadastrados com sucesso.');
    }

    // 4. Configurações gerais da Barbearia
    const shopConfig = await Setting.findOne({ key: 'shop_info' });
    if (!shopConfig) {
      await Setting.create({
        key: 'shop_info',
        value: {
          name: 'BvIt Barber Club',
          slogan: 'Estilo, tradição e cuidado com a sua imagem',
          phone: '(11) 99999-9999',
          whatsapp: '5511999999999',
          address: 'Av. Principal, 1000 - Centro',
          city: 'São Paulo - SP',
          openingHours: 'Segunda a Sábado: 09:00 às 19:00',
          instagram: '@bvitbarber',
        },
      });
      console.log('[Seed] Configurações da barbearia inicializadas.');
    }
  } catch (error) {
    console.error('[Seed] Erro ao popular banco inicial:', error.message);
  }
};

module.exports = seedDatabase;
