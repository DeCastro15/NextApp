/**
 * Next Youth App — Supabase Configuration
 *
 * COMO CONFIGURAR O SUPABASE:
 * 1. Acesse https://supabase.com e crie um novo projeto
 * 2. Em Settings > API, copie a Project URL e a anon key
 * 3. Cole os valores abaixo
 * 4. Mude USE_MOCK_DB para false
 * 5. Execute o SQL em supabase-schema.sql no editor do Supabase
 * 6. Configure as RLS policies conforme necessário
 *
 * ENQUANTO USE_MOCK_DB = true: tudo fica no localStorage do navegador.
 */

const SUPABASE_CONFIG = {
  url: 'https://hsqdsfrxxygiydnoeojo.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzcWRzZnJ4eHlnaXlkbm9lb2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzQ1MTcsImV4cCI6MjA5NTE1MDUxN30.vsXLMKQpI0lD-hkN-ohXVHAdxOzvFmkd_yjVsH7n4p4',
};

const USE_MOCK_DB = true; // Mude para false só quando o banco estiver pronto

// ---------------------------------------------------------------------------
// NextAuth — autenticação (mock ou Supabase)
// ---------------------------------------------------------------------------
const NextAuth = (() => {
  const SESSION_KEY = 'next_session';

  async function register(name, email, password) {
    if (USE_MOCK_DB) {
      const storedUsers = NextDB.getAll('next_users');
      // Verifica se o email já existe
      if (storedUsers.some(u => u.email === email.toLowerCase())) return null;

      const newUser = {
        id: `usr_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password,
        role: 'jovem', // Todo mundo começa como jovem
        hasServo: false
      };
      NextDB.save('next_users', newUser);
      const session = { ...newUser };
      delete session.password;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    } else {
      // Lógica do Supabase Real (para quando mudar USE_MOCK_DB para false)
      // const { data, error } = await supabase.auth.signUp({ email, password });
      // if (error) return null;
      // await supabase.from('next_users').insert([{ id: data.user.id, name, email, role: 'jovem' }]);
      // return { ...data.user, name, role: 'jovem' };
    }
  }

  // Usuários de demonstração — em produção vêm do Supabase Auth + tabela users
  const MOCK_USERS = [
    {
      id: 'usr_0', 
      name: 'Secretaria Next', 
      email: 'admin@next.com', 
      password: 'next2025', 
      role: 'admin', 
      initials: 'AD'
    },
    {
      id: 'usr_1', 
      name: 'Pastor Roberval', 
      email: 'pastor.roberval@next.com', 
      password: 'next2025', 
      role: 'pastor', 
      initials: 'PR'
    },
    {
      id: 'usr_2', 
      name: 'Missionária Luciana', 
      email: 'missionaria.luciana@next.com', 
      password: 'next2025', 
      role: 'missionaria', 
      initials: 'ML'
    },
    {
      id: 'usr_3', 
      name: 'Davi', 
      email: 'davi@next.com', 
      password: 'next2025', 
      role: 'lider', 
      initials: 'DA'
    },
    {
      id: 'usr_4', 
      name: 'Dhara', 
      email: 'dhara@next.com', 
      password: 'next2025', 
      role: 'lider', 
      initials: 'DH'
    },
    {
      id: 'usr_5', 
      name: 'Matheus', 
      email: 'matheus@next.com', 
      password: 'next2025', 
      role: 'lider', 
      initials: 'MA'
    },
    {
      id: 'usr_6', 
      name: 'Julya', 
      email: 'julya@next.com', 
      password: 'next2025', 
      role: 'lider', 
      initials: 'JU'
    },
    {
      id: 'usr_7', 
      name: 'João Victor', 
      email: 'jovem@next.com', 
      password: 'next2025', 
      role: 'jovem', 
      initials: 'JV', 
      hasServo: false, 
      age: 16, 
      phone: '', 
      responsible: 'Ana Costa'
    },
    {
      id: 'usr_8', 
      name: 'Maria Santos', 
      email: 'maria@next.com', 
      password: 'next2025', 
      role: 'jovem', 
      initials: 'MS', 
      hasServo: true, 
      servoType: ["Servo"], 
      age: 15
    },
    {
      id: 'usr_9', 
      name: 'Pedro Lima', 
      email: 'pedro@next.com', 
      password: 'next2025', 
      role: 'jovem', 
      initials: 'PL', 
      hasServo: false, 
      age: 17
    },
    {
      id: 'usr_10', 
      name: 'Beatriz Rocha', 
      email: 'bia@next.com', 
      password: 'next2025', 
      role: 'jovem', 
      initials: 'BR', 
      hasServo: false, 
      age: 14
    },
    {
      id: 'usr_11', 
      name: 'Ana Costa', 
      email: 'responsavel@next.com', 
      password: 'next2025', 
      role: 'responsavel', 
      initials: 'AC', 
      childName: 'João Victor'
    },
    {
      id: 'usr_12', 
      name: 'Ana Ruth', 
      email: 'ana.ruth@next.com', 
      password: 'next2025', 
      role: 'sublider', 
      initials: 'AR'
    },
    {
      id: 'usr_13', 
      name: 'Lucas Almeida', 
      email: 'lucas@next.com', 
      password: 'next2025', 
      role: 'jovem', 
      initials: 'LA', 
      hasServo: true, 
      servoType: ["Servo"], 
      age: 16
    },
    {
      id: 'usr_14', 
      name: 'Camila Oliveira', 
      email: 'camila@next.com', 
      password: 'next2025', 
      role: 'jovem', 
      initials: 'CO', 
      hasServo: true, 
      servoType: ["Midia"], 
      age: 17
    },
    {
      id: 'usr_15', 
      name: 'Samuel Ribeiro', 
      email: 'samuel@next.com', 
      password: 'next2025', 
      role: 'jovem',
      initials: 'SR'
    },
    { 
      id: 'usr_18', 
      name: 'Gabriel Mendes', 
      email: 'gabriel@next.com', 
      password: 'next2025', 
      role: 'jovem', 
      initials: 'GM', 
      hasServo: true, 
      servoType: ["Servo", "Midia", "Intercessao"], 
      age: 21
    },
    { 
      id: 'usr_19', 
      name: 'Letícia Souza', 
      email: 'leticia@next.com', 
      password: 'next2025', 
      role: 'jovem', 
      initials: 'LS', 
      hasServo: true, 
      servoType: ["Midia", "Intercessao"], 
      age: 16 
    }
  ];

  async function login(email, password) {
    if (USE_MOCK_DB) {
      // Carrega usuários do localStorage (para refletir alterações de role feitas no app)
      const storedUsers = NextDB.getAll('next_users');
      const allUsers = storedUsers.length > 0 ? [...storedUsers, ...MOCK_USERS] : MOCK_USERS;

      const user = allUsers.find(
        (u) => u.email === email.toLowerCase() && u.password === password
      );
      if (!user) return null;
      const session = { ...user };
      delete session.password;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    } else {
      // Supabase (descomente após configurar):
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      // if (error) return null;
      // const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single();
      // const session = { ...data.user, ...profile };
      // localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      // return session;
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
  }

  async function resetPassword(email) {
    // Força a utilização do cliente Supabase real apenas para disparar o e-mail
    const client = window.originalSupabaseClient || supabaseClient;

    if (!client) {
      console.error("Supabase não está ligado.");
      return false;
    }

    // Chama o servidor real do Supabase para enviar o e-mail
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password.html',
    });

    if (error) {
      console.error("Erro ao enviar e-mail:", error.message);
      return false;
    }

    return true;
  }

  function currentUser() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  }

  function updateSession(updates) {
    const user = currentUser();
    if (!user) return;
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ...user, ...updates }));
  }

  function getMockUsers() {
    const stored = NextDB.getAll('next_users');
    const source = stored.length > 0 ? [...stored, ...MOCK_USERS] : MOCK_USERS;
    return source.map(({ password, ...u }) => u);
  }

  return { login, logout, currentUser, updateSession, getMockUsers, MOCK_USERS, register, resetPassword };
})();

// ---------------------------------------------------------------------------
// NextDB — operações CRUD (mock localStorage, interface idêntica para Supabase)
// ---------------------------------------------------------------------------
// Ativa o cliente Supabase usando as chaves que você já colocou no topo do arquivo
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey) : null;
// Permite que a tela de reset use o cliente diretamente
window.originalSupabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey) : null;

// ---------------------------------------------------------------------------
// NextDB — Banco de Dados Híbrido (Rápido no Local + Salva na Nuvem)
// ---------------------------------------------------------------------------
const NextDB = (() => {
  function getAll(collection) {
    try {
      return JSON.parse(localStorage.getItem(collection)) || [];
    } catch {
      return [];
    }
  }

  function getOne(collection, id) {
    return getAll(collection).find((item) => item.id === id) || null;
  }

  async function save(collection, item) {
    // 1. Salva imediato localmente para o utilizador não sentir atrasos
    const items = getAll(collection);
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...item };
    } else {
      items.unshift({ ...item, id: item.id || `${Date.now()}` });
    }
    localStorage.setItem(collection, JSON.stringify(items));

    // 2. Envia para o Supabase (Incluindo Grupos, Eventos e Escalas)
    const cloudTables = ['next_messages', 'next_prayers', 'next_group_messages', 'next_events', 'next_scales', 'next_applications', 'next_products', 'next_posts'];

    if (supabaseClient && cloudTables.includes(collection)) {
      const { error } = await supabaseClient.from(collection).upsert(item);
      if (error) console.error(`🚨 Erro ao enviar para ${collection}:`, error.message);
    }
    return item;
  }

  async function remove(collection, id) {
    const items = getAll(collection).filter((i) => i.id !== id);
    localStorage.setItem(collection, JSON.stringify(items));
    if (supabaseClient) {
      await supabaseClient.from(collection).delete().eq('id', id);
    }
  }

  function getValue(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function setValue(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // 3. Puxa TODOS os dados atualizados com garantia de reescrita
  async function syncFromCloud() {
    if (!supabaseClient) return;
    const cloudTables = ['next_messages', 'next_prayers', 'next_group_messages', 'next_events', 'next_scales', 'next_posts'];

    for (const table of cloudTables) {
      const { data, error } = await supabaseClient.from(table).select('*');
      if (data && !error) {
        localStorage.setItem(table, JSON.stringify(data));
      }
    }
  }

  return { getAll, getOne, save, remove, getValue, setValue, syncFromCloud };
})();

// ---------------------------------------------------------------------------
// Seed — popula o localStorage na primeira vez
// ---------------------------------------------------------------------------
(function seedData() {
  // Usuários
  if (!NextDB.getAll('next_users').length) {
    NextAuth.MOCK_USERS.forEach((u) => NextDB.save('next_users', u));
  }

  // Posts/avisos
  if (!NextDB.getAll('next_posts').length) {
    const posts = [
      {
        id: 'p1',
        tag: 'Hoje',
        title: 'Culto Next às 19h30',
        text: 'Chegue um pouco antes para sentar com a galera.',
        time: '2h',
        createdAt: Date.now() - 7200000,
      },
      {
        id: 'p2',
        tag: 'Aviso',
        title: 'Traga sua Bíblia',
        text: 'A palavra de hoje vai ter leitura em grupo.',
        time: '5h',
        createdAt: Date.now() - 18000000,
      },
      {
        id: 'p3',
        tag: 'Evento',
        title: 'Noite do Amigo',
        text: 'Convide alguém para o próximo sábado.',
        time: '1d',
        createdAt: Date.now() - 86400000,
      },
      {
        id: 'p4',
        tag: 'Servir',
        title: 'Inscrições para apoio',
        text: 'Fale com um líder se quiser ajudar na recepção.',
        time: '2d',
        createdAt: Date.now() - 172800000,
      },
    ];
    posts.forEach((p) => NextDB.save('next_posts', p));
  }

  // Eventos / Agenda
  if (!NextDB.getAll('next_events').length) {
    const events = [
      {
        id: 'e1',
        date: '23',
        month: 'Maio',
        weekDay: 'Sábado',
        time: '19h30',
        title: 'Culto Next',
        text: 'Louvor, palavra e comunhão.',
        detail: 'Encontro principal da juventude com louvor, palavra e comunhão.',
        location: 'AD Fonte de Vida',
        audience: 'geral',
      },
      {
        id: 'e2',
        date: '25',
        month: 'Maio',
        weekDay: 'Segunda',
        time: '20h00',
        title: 'Plano de leitura em grupo',
        text: 'Início do plano de 7 dias no app.',
        detail: 'Começo do plano devocional da semana, para acompanhar em casa.',
        location: 'Online',
        audience: 'jovens',
      },
      {
        id: 'e3',
        date: '29',
        month: 'Maio',
        weekDay: 'Sexta',
        time: '20h00',
        title: 'Reunião com responsáveis',
        text: 'Alinhamento com líderes e pais.',
        detail: 'Conversa rápida com os responsáveis sobre novidades e próximos encontros.',
        location: 'AD Fonte de Vida',
        audience: 'responsaveis',
      },
      {
        id: 'e4',
        date: '31',
        month: 'Maio',
        weekDay: 'Domingo',
        time: '18h30',
        title: 'Noite do Amigo',
        text: 'Evento geral da juventude.',
        detail: 'Dia para trazer um amigo e participar com a galera do Next.',
        location: 'AD Fonte de Vida',
        audience: 'geral',
      },
      {
        id: 'e5',
        date: '27',
        month: 'Maio',
        weekDay: 'Quarta',
        time: '19h00',
        title: 'Reunião de Líderes',
        text: 'Planejamento do mês de junho.',
        detail: 'Alinhamento interno da equipe de liderança.',
        location: 'AD Fonte de Vida',
        audience: 'lideres',
      },
    ];
    events.forEach((e) => NextDB.save('next_events', e));
  }

  // Produtos
  if (!NextDB.getAll('next_products').length) {
    const products = [
      { id: 'prod1', title: 'Camiseta Next', text: 'Azul oficial com logo frontal.', price: 'R$ 49,90', available: true },
      { id: 'prod2', title: 'Moletom Next', text: 'Pré-venda para os jovens.', price: 'R$ 119,90', available: true },
      { id: 'prod3', title: 'Pulseira Next', text: 'Modelo simples para usar no culto.', price: 'R$ 9,90', available: true },
    ];
    products.forEach((p) => NextDB.save('next_products', p));
  }

  // Status do culto
  if (!NextDB.getValue('next_cult_status')) {
    NextDB.setValue('next_cult_status', 'inativo');
  }

  // Pedidos de oração
  if (!NextDB.getAll('next_prayers').length) {
    NextDB.setValue('next_prayers', []);
  }
})();
