const authApi = typeof NextAuth !== "undefined" ? NextAuth : null;
const dbApi = typeof NextDB !== "undefined" ? NextDB : null;
const currentUser = authApi?.currentUser();

// ── Toast ──────────────────────────────────────────
function toast(msg, type = 'info', duration = 3200) {
  const container = document.getElementById('toastContainer');
  if (!container) { console.log('[toast]', msg); return; }

  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  container.appendChild(el);

  const remove = () => {
    el.classList.add('removing');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  };

  const timer = setTimeout(remove, duration);
  el.addEventListener('click', () => { clearTimeout(timer); remove(); });
}


// ── Modal de confirmação (substitui window.confirm) ──
function showConfirm(message, onConfirm, onCancel) {
  const overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed','inset:0','z-index:99990',
    'background:rgba(8,12,24,0.72)','backdrop-filter:blur(4px)',
    'display:grid','place-items:center','padding:20px',
    'animation:overlayIn 220ms ease forwards'
  ].join(';');

  const box = document.createElement('div');
  box.style.cssText = [
    'background:var(--surface)','border-radius:16px','padding:24px 22px',
    'width:min(360px,100%)','display:grid','gap:16px',
    'box-shadow:0 40px 100px rgba(0,0,0,0.35)',
    'animation:modalUp 300ms cubic-bezier(0.16,1,0.3,1) forwards'
  ].join(';');

  const msg = document.createElement('p');
  msg.style.cssText = 'margin:0;font-size:0.96rem;font-weight:600;color:var(--ink);line-height:1.5;';
  msg.textContent = message;

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:10px;justify-content:flex-end;';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancelar';
  cancelBtn.style.cssText = [
    'min-height:42px','padding:0 18px','border-radius:10px',
    'border:1.5px solid var(--line)','background:transparent',
    'color:var(--muted)','font-family:inherit','font-weight:700',
    'cursor:pointer','font-size:0.88rem'
  ].join(';');

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Confirmar';
  confirmBtn.style.cssText = [
    'min-height:42px','padding:0 20px','border-radius:10px',
    'border:0','background:#dc2626','color:#fff',
    'font-family:inherit','font-weight:800','cursor:pointer','font-size:0.88rem'
  ].join(';');

  const close = () => {
    overlay.style.animation = 'toastOut 220ms ease forwards';
    overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
  };

  cancelBtn.addEventListener('click', () => { close(); onCancel?.(); });
  confirmBtn.addEventListener('click', () => { close(); onConfirm(); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) { close(); onCancel?.(); } });

  row.append(cancelBtn, confirmBtn);
  box.append(msg, row);
  overlay.append(box);
  document.body.appendChild(overlay);
  confirmBtn.focus();
}

// ── Detector offline ──
function initOfflineDetector() {
  const banner = document.getElementById('offlineBanner');
  if (!banner) return;

  function update() {
    banner.classList.toggle('visible', !navigator.onLine);
    if (!navigator.onLine) {
      toast('Conexão perdida. Operando em modo offline.', 'warn', 5000);
    } else {
      toast('Conexão restaurada! ✓', 'success', 2500);
    }
  }

  window.addEventListener('offline', update);
  window.addEventListener('online',  update);

  // Checa no boot silenciosamente (sem toast)
  if (!navigator.onLine) banner.classList.add('visible');
}

if (!currentUser) {
  window.location.href = "index.html";
  throw new Error("Sessao nao encontrada");
}

const roleLabels = {
  jovem: "Jovem",
  responsavel: "Responsável",
  lider: "Líder",
  sublider: "Sublíder",
  pastor: "Pastor",
  missionaria: "Missionária",
  admin: "Administrador",
};

const leaderNames = ["Davi", "Dhara", "Matheus", "Julya", "Pastor Roberval", "Missionária Luciana"];
const leaderPhotos = {
  Matheus: "assets/leaders/matheus.png",
  Julya: "assets/leaders/julya.png",
  Davi: "assets/leaders/davi.png",
  Dhara: "assets/leaders/dhara.png",
  "Pastor Roberval": "assets/leaders/pastor-roberval.png",
  "Missionária Luciana": "assets/leaders/missionaria-luciana.png",
};
const cultStages = ["inativo", "Louvor", "Pregação", "Apelo", "Finalizado"];

const permissionsByRole = {
  jovem:      ["home", "agenda", "conteudo", "loja", "oracao", "conversa", "biblerats", "perfil", "configuracoes"],
  responsavel:["home", "agenda", "culto", "biblerats", "perfil", "configuracoes"],
  lider:      ["home", "agenda", "culto", "conteudo", "loja", "conversa", "mensagens", "gestao", "biblerats", "perfil", "configuracoes"],
  sublider:   ["home", "agenda", "culto", "conteudo", "loja", "conversa", "mensagens", "escalas", "gestao", "biblerats", "perfil", "configuracoes"],
  pastor:     ["home", "agenda", "culto", "conteudo", "loja", "conversa", "mensagens", "gestao", "biblerats", "perfil", "configuracoes"],
  missionaria:["home", "agenda", "culto", "conteudo", "loja", "conversa", "mensagens", "gestao", "biblerats", "perfil", "configuracoes"],
  admin:      ["home", "agenda", "culto", "conteudo", "loja", "gestao", "biblerats", "perfil", "configuracoes", "servos"],
};

const functionsMap = {
  Servo: ["Porta", "Recepção", "Integração", "Manutenção", "Suporte", "Ofertório", "Sub Coordenação", "Coordenação"],
  Midia: ["Fotografia", "Story"],
  Intercessao: ["Intercessor(a) 1", "Intercessor(a) 2", "Intercessor(a) 3", "Intercessor(a) 4", "Intercessor(a) 5", "Intercessor(a) 6", "Intercessor(a) 7", "Intercessor(a) 8", "Intercessor(a) 9", "Intercessor(a) 10", "Coordenação"],
};

const defaultPosts = [
  { id: "p1", tag: "Hoje", title: "Culto Next as 19h30", text: "Chegue um pouco antes para sentar com a galera.", time: "2h" },
  { id: "p2", tag: "Aviso", title: "Traga sua Biblia", text: "A palavra de hoje vai ter leitura em grupo.", time: "5h" },
  { id: "p3", tag: "Evento", title: "Noite do amigo", text: "Convide alguem para o proximo sabado.", time: "1d" },
  { id: "p4", tag: "Servir", title: "Inscricoes para apoio", text: "Fale com um lider se quiser ajudar na recepcao.", time: "2d" },
];

function buildDefaultEvents() {
  const now = new Date();
  const yr = now.getFullYear();
  const mo = now.getMonth();

  function nextWeekday(targetDay) {
    const today = new Date(yr, mo, now.getDate());
    let diff = (targetDay - today.getDay() + 7) % 7 || 7;
    const d = new Date(yr, mo, now.getDate() + diff);
    if (d.getMonth() !== mo) return null;
    return d;
  }

  function fmt(d) { return { date: String(d.getDate()), month: d.toLocaleDateString('pt-BR', { month: 'long' }), weekDay: d.toLocaleDateString('pt-BR', { weekday: 'long' }) }; }

  const sab = nextWeekday(6);
  const seg = nextWeekday(1);
  const sex = nextWeekday(5);
  const dom = nextWeekday(0);

  return [
    sab && { id: 'e1', ...fmt(sab), time: '19h30', title: 'Culto Next', text: 'Louvor, palavra e comunhão.', detail: 'Encontro principal da juventude.', location: 'AD Fonte de Vida', audience: 'geral' },
    seg && { id: 'e2', ...fmt(seg), time: '20h00', title: 'Plano de leitura em grupo', text: 'Início do plano de 7 dias.', detail: 'Plano devocional da semana.', location: 'Online', audience: 'jovens' },
    sex && { id: 'e3', ...fmt(sex), time: '20h00', title: 'Reunião com responsáveis', text: 'Alinhamento com líderes e pais.', detail: 'Novidades e próximos encontros.', location: 'AD Fonte de Vida', audience: 'responsaveis' },
    dom && { id: 'e4', ...fmt(dom), time: '18h30', title: 'Noite do Amigo', text: 'Evento geral da juventude.', detail: 'Traga um amigo!', location: 'AD Fonte de Vida', audience: 'geral' },
  ].filter(Boolean);
}
const defaultEvents = buildDefaultEvents();

const playlists = [
  {
    id: 'pl1',
    title: "Louvor Next 🔥",
    text: "Setlist para chegar no culto cantando junto.",
    description: "A nossa playlist oficial do culto Next! Músicas selecionadas pela equipe de louvor para você adorar em casa, no trajeto e antes do culto. Chegue aquecido e conectado com Deus.",
    tracks: 18,
    duration: "1h 12min",
    emoji: "🎵",
    color: "#2f73f8",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX8FwnYE6PRoc",
    progress: 76
  },
  {
    id: 'pl2',
    title: "Semana com Deus",
    text: "Músicas para devocional e tempo de oração.",
    description: "Uma curadoria especial para acompanhar seus momentos devocionais. Faixas que preparam o coração para ouvir a voz de Deus durante a semana.",
    tracks: 24,
    duration: "1h 38min",
    emoji: "🙏",
    color: "#8b5cf6",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DWTl4y3vgJOXW",
    progress: 52
  },
  {
    id: 'pl3',
    title: "Pré-culto",
    text: "Uma seleção rápida para preparar o coração.",
    description: "30 minutos antes do culto, coloca essa playlist. Músicas de adoração e foco para entrar no culto de coração aberto e pronto para receber.",
    tracks: 9,
    duration: "34min",
    emoji: "⚡",
    color: "#c6ff45",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX1s9knjP51Oa",
    progress: 34
  },
  {
    id: 'pl4',
    title: "Fire — Gospel Rap BR",
    text: "Rap gospel nacional que representa a fé sem vergonha.",
    description: "Para quem representa Jesus no estilo. Os melhores do gospel rap brasileiro reunidos em uma playlist que não deixa o fogo apagar.",
    tracks: 31,
    duration: "2h 04min",
    emoji: "🎤",
    color: "#f59e0b",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX186v583rmzp",
    progress: 88
  },
];

const planos = [
  {
    id: 'plan1',
    title: "7 dias em Provérbios",
    text: "Sabedoria para escola, família e amizades.",
    description: "Um plano de leitura para quem quer desenvolver sabedoria prática para o dia a dia. Cada dia traz um capítulo de Provérbios com uma reflexão curta sobre como aplicar na sua vida.",
    days: 7,
    emoji: "📖",
    color: "#f59e0b",
    tag: "Sabedoria",
    verses: [
      { day: 1, ref: "Provérbios 1:1-7", theme: "O início da sabedoria" },
      { day: 2, ref: "Provérbios 3:5-6", theme: "Confiar no Senhor" },
      { day: 3, ref: "Provérbios 4:20-27", theme: "Guardar o coração" },
      { day: 4, ref: "Provérbios 6:6-11", theme: "Diligência e trabalho" },
      { day: 5, ref: "Provérbios 12:1-11", theme: "Disciplina e amor" },
      { day: 6, ref: "Provérbios 17:17-28", theme: "Amizade verdadeira" },
      { day: 7, ref: "Provérbios 31:10-31", theme: "Caráter e fidelidade" },
    ],
    progress: 43
  },
  {
    id: 'plan2',
    title: "Identidade em Cristo",
    text: "Leituras curtas para lembrar quem você é em Deus.",
    description: "Quem você é não depende do que o mundo diz. Este plano vai te reconectar com sua identidade como filho(a) de Deus através de versículos poderosos e reflexões práticas.",
    days: 5,
    emoji: "✨",
    color: "#8b5cf6",
    tag: "Identidade",
    verses: [
      { day: 1, ref: "Efésios 1:3-6", theme: "Escolhidos antes da criação" },
      { day: 2, ref: "João 1:12-13", theme: "Filhos de Deus" },
      { day: 3, ref: "2 Coríntios 5:17", theme: "Nova criação" },
      { day: 4, ref: "Romanos 8:14-17", theme: "Herdeiros de Deus" },
      { day: 5, ref: "Colossenses 3:1-4", theme: "Escondidos em Cristo" },
    ],
    progress: 18
  },
  {
    id: 'plan3',
    title: "Evangelho de Marcos",
    text: "Um passo por dia acompanhando Jesus.",
    description: "O Evangelho de Marcos é o mais dinâmico dos quatro. Acompanhe Jesus em ação — milagres, ensinamentos e o caminho até a cruz — em 16 dias de leitura intensa e transformadora.",
    days: 16,
    emoji: "🦁",
    color: "#10b981",
    tag: "Evangelhos",
    verses: [
      { day: 1, ref: "Marcos 1:1-20", theme: "O começo do evangelho" },
      { day: 2, ref: "Marcos 1:21-45", theme: "Autoridade de Jesus" },
      { day: 3, ref: "Marcos 2:1-17", theme: "Cura e perdão" },
      { day: 4, ref: "Marcos 3:1-19", theme: "Os doze discípulos" },
      { day: 5, ref: "Marcos 4:1-34", theme: "Parábola do semeador" },
      { day: 6, ref: "Marcos 4:35-5:20", theme: "Jesus acalma a tempestade" },
      { day: 7, ref: "Marcos 6:1-29", theme: "Rejeição e missão" },
      { day: 8, ref: "Marcos 6:30-56", theme: "Cinco mil alimentados" },
    ],
    progress: 61
  },
  {
    id: 'plan4',
    title: "Ansiedade & Fé",
    text: "O que a Bíblia diz sobre ansiedade e como vencer.",
    description: "Para quem enfrenta ansiedade no cotidiano, este plano traz versículos terapêuticos e reflexões sobre como a fé transforma nosso estado emocional. 7 dias de paz.",
    days: 7,
    emoji: "🕊️",
    color: "#2f73f8",
    tag: "Saúde Mental",
    verses: [
      { day: 1, ref: "Filipenses 4:6-7", theme: "A paz que excede o entendimento" },
      { day: 2, ref: "Mateus 6:25-34", theme: "Não se preocupe" },
      { day: 3, ref: "Salmo 46:1-11", theme: "Deus é o nosso refugio" },
      { day: 4, ref: "1 Pedro 5:6-7", theme: "Lançar toda ansiedade sobre Ele" },
      { day: 5, ref: "Isaías 41:10", theme: "Não temas" },
      { day: 6, ref: "João 14:27", theme: "Paz eu vos deixo" },
      { day: 7, ref: "Romanos 8:28", theme: "Todas as coisas cooperam" },
    ],
    progress: 0
  },
];

const defaultProducts = [
  { id: "prod1", title: "Camiseta Next", text: "Azul oficial com logo frontal.", price: "R$ 49,90", available: true },
  { id: "prod2", title: "Moletom Next", text: "Pre-venda para os jovens.", price: "R$ 119,90", available: true },
  { id: "prod3", title: "Pulseira Next", text: "Modelo simples para usar no culto.", price: "R$ 9,90", available: true },
];

const pageTitle = document.querySelector("#pageTitle");
const navButtons = [...document.querySelectorAll("[data-target]")];
const views = [...document.querySelectorAll(".view")];
const profileStorageKey = `nextYouthProfile:${currentUser.id}`;

let profilePhotoData = "";
let chatTargetName = "";
let chatTargetId = "";
let chatSearchTerm = "";
let shopProductImageData = "";
let currentAgendaFilter = 'todos';
let selectedThreadId = "";

function canManage() {
  return ["pastor", "missionaria", "lider", "sublider", "admin"].includes(currentUser.role);
}

function canSeeServantStatus() {
  return ["pastor", "missionaria", "lider", "sublider", "admin"].includes(currentUser.role);
}

function canManageAll() {
  return ["pastor", "missionaria", "admin"].includes(currentUser.role);
}

function hasCompletedRequiredJourney(userId) {
  const data = getJourneyData(userId);
  return ["descubra", "avance", "fundamentos"].every((stepId) => Boolean(data[stepId]));
}

function hasServingAccess(user = currentUser) {
  if (!user) return false;
  if (user.hasServo) return true;
  return user.role === "jovem" && hasCompletedRequiredJourney(user.id);
}

function allowedViews() {
  const base = [...(permissionsByRole[currentUser.role] || permissionsByRole.jovem)];
  if (hasServingAccess(currentUser) && !base.includes("servir")) base.push("servir");
  if (currentUser.hasServo && !base.includes("servos")) base.push("servos");
  if (currentUser.hasServo && !base.includes("grupos")) base.push("grupos"); 
  if (canManage() && !base.includes("grupos")) base.push("grupos");
  return base;
}

function canView(target) {
  return allowedViews().includes(target);
}

function getAll(collection, fallback = []) {
  const items = dbApi?.getAll(collection) || [];
  return items.length ? items : fallback;
}

function saveItem(collection, item) {
  return dbApi?.save(collection, item);
}

function setValue(key, value) {
  return dbApi?.setValue(key, value);
}

function getValue(key, fallback) {
  return dbApi?.getValue(key, fallback) ?? fallback;
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function getUsers() {
  return uniqueById(authApi?.getMockUsers?.() || []);
}

function getPosts() {
  return getAll("next_posts", defaultPosts).slice(0, 4);
}

function getEvents() {
  return getAll("next_events", defaultEvents).filter((event) => audienceAllowed(event.audience));
}

function getProducts() {
  return getAll("next_products", defaultProducts).filter((product) => product.available !== false);
}

const CONTENT_COLLECTIONS = {
  playlists: "next_playlists",
  planos: "next_planos",
};

function canManageContent() {
  return canManage();
}

function getContentItems(collection, defaults = []) {
  const saved = dbApi?.getAll(collection) || [];
  return uniqueById([...saved, ...defaults]).filter((item) => !item.deleted);
}

function getPlaylists() {
  return getContentItems(CONTENT_COLLECTIONS.playlists, playlists);
}

function getPlanos() {
  return getContentItems(CONTENT_COLLECTIONS.planos, planos);
}

function cleanContentText(value, maxLength = 500) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, maxLength);
}

function normalizeContentColor(value, fallback = "#2f73f8") {
  const color = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function getPlaylistUrl(item) {
  return item.url || item.spotifyUrl || item.youtubeUrl || "";
}

function getPlaylistProvider(item) {
  const url = getPlaylistUrl(item).toLowerCase();
  if (url.includes("spotify.com")) return "Spotify";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  return "playlist";
}

function isAcceptedPlaylistUrl(url) {
  try {
    const parsed = new URL(String(url || "").trim());
    const host = parsed.hostname.replace(/^www\./, "");
    return parsed.protocol === "https:" &&
      (host.includes("spotify.com") || host.includes("youtube.com") || host === "youtu.be");
  } catch {
    return false;
  }
}

function formatPlaylistMeta(item) {
  const parts = [];
  if (item.tracks) parts.push(`${item.tracks} músicas`);
  if (item.duration) parts.push(item.duration);
  return parts.join(" · ") || `Disponível no ${getPlaylistProvider(item)}`;
}

function parsePlanVerses(raw) {
  return String(raw || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [refPart, ...themeParts] = line.split("|");
      const ref = cleanContentText(refPart, 120);
      const theme = cleanContentText(themeParts.join("|"), 180) || ref;
      return { day: index + 1, ref, theme };
    })
    .filter((verse) => verse.ref);
}

function formatPlanVersesInput(plan) {
  return (plan.verses || []).map((verse) => `${verse.ref} | ${verse.theme}`).join("\n");
}

function getMessages() {
  return getAll("next_messages", []);
}

function getPrayers() {
  return getAll("next_prayers", []);
}

function initials(name) {
  return String(name || "JV")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function slug(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatAudience(audience) {
  const labels = {
    geral: "Geral",
    jovens: "Jovens",
    responsaveis: "Responsaveis",
    lideres: "Lideres",
  };
  return labels[audience] || audience || "Geral";
}

function formatServoType(types) {
  if (!types || !types.length) return "Servo";
  const hasServo = types.includes("Servo");
  const hasMidia = types.includes("Midia");
  const hasInt = types.includes("Intercessao");

  if (hasServo && hasMidia && hasInt) return "Geral";
  if (hasServo && hasMidia) return "Servo e Mídia";
  if (hasServo && hasInt) return "Servo e Intercessão";
  if (hasMidia && hasInt) return "Mídia e Intercessão"; 
  return types.join(", ");
}

function audienceAllowed(audience) {
  const value = audience || "geral";
  if (canManageAll() || currentUser.role === "lider") return true;
  if (value === "servos") return Boolean(currentUser.hasServo);
  if (currentUser.role === "responsavel") return ["geral", "responsaveis", "jovens"].includes(value);
  return ["geral", "jovens"].includes(value);
}

function currentMonthName() {
  return new Date().toLocaleDateString("pt-BR", { month: "long" });
}

function weekDayForDate(day) {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), Number(day)).toLocaleDateString("pt-BR", {
    weekday: "long",
  });
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return "agora";
  const diff = Date.now() - timestamp;
  const hours = Math.max(1, Math.round(diff / 3600000));
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

const LAST_SEEN_KEY = `next_last_seen_msgs:${currentUser?.id}`;

function getLastSeenTimestamp() {
  return Number(localStorage.getItem(LAST_SEEN_KEY)) || 0;
}

function markMessagesAsSeen() {
  localStorage.setItem(LAST_SEEN_KEY, String(Date.now()));
  updateUnreadBadge();
}

function updateUnreadBadge() {
  const lastSeen = getLastSeenTimestamp();
  const navConversa = document.querySelector('[data-target="conversa"]');
  if (!navConversa) return;

  // Conta mensagens para mim que chegaram depois do último acesso
  const unread = getMessages().filter(m => {
    if (m.senderId === currentUser.id) return false; // próprias não contam
    const threadMine = m.threadId && m.threadId.includes(currentUser.id);
    const isLeader = ["lider", "pastor", "missionaria", "admin"].includes(currentUser.role);
    const relevant = isLeader
      ? leaderNames.some(n => currentUser.name?.toLowerCase().includes(n.toLowerCase()) && m.leaderName === n || m.leaderName === currentUser.name)
      : threadMine;
    return relevant && m.createdAt > lastSeen;
  }).length;

  // Remove badge anterior
  navConversa.querySelector('.nav-badge')?.remove();

  if (unread > 0) {
    const badge = document.createElement('span');
    badge.className = 'nav-badge';
    badge.textContent = unread > 9 ? '9+' : String(unread);
    navConversa.appendChild(badge);
  }
}

// ADICIONAR após updateUnreadBadge()
const LAST_SEEN_PRAYER_KEY = `next_last_seen_prayer:${currentUser?.id}`;

function updatePrayerBadge() {
  const navOracao = document.querySelector('[data-target="oracao"]');
  if (!navOracao) return;

  const lastSeen = Number(localStorage.getItem(LAST_SEEN_PRAYER_KEY)) || 0;
  const hasUnread = getPrayers().some(p =>
    p.senderId === currentUser.id && p.reply && (p.repliedAt || 0) > lastSeen
  );

  navOracao.querySelector('.nav-badge')?.remove();

  if (hasUnread) {
    const badge = document.createElement('span');
    badge.className = 'nav-badge';
    badge.textContent = '!';
    navOracao.appendChild(badge);
  }
}

function markPrayerAsSeen() {
  localStorage.setItem(LAST_SEEN_PRAYER_KEY, String(Date.now()));
  updatePrayerBadge();
}

function setupPermissions() {
  navButtons.forEach((button) => {
    button.classList.toggle("hidden", !canView(button.dataset.target));
  });

  document.querySelectorAll(".quick-card[data-target]").forEach((button) => {
    button.classList.toggle("hidden", !canView(button.dataset.target));
  });

  views.forEach((view) => view.classList.toggle("blocked-view", !canView(view.id)));

  if (!canView("home")) {
    setView(allowedViews()[0]);
  }
}

function setView(target) {
  const nextView = document.getElementById(target);
  if (!nextView || !canView(target)) return;

  views.forEach((view) => view.classList.toggle("active", view.id === target));
  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.target === target);
  });

  pageTitle.textContent = nextView.dataset.title || "Next";
  document.body.classList.remove("menu-open");

  if (target === "conversa") markMessagesAsSeen();
  if (target === "oracao") markPrayerAsSeen();
  if (target === "grupos") { renderGroupList(); renderGroupChat(); renderChecklist(); }
  if (target === "mensagens") { renderLeaderInbox(); markMessagesAsSeen(); }
  if (target === "gestao") renderAdminLists();
  if (target === "conteudo") renderContent();
  if (target === "culto") renderCultStatus();
  if (target === "perfil") renderPerfil();
  if (target === "escalas") {
    populateScaleEvents();
    renderDynamicScaleFields();
  }
  if (target === "servos") {
    renderMyScales();
  }
  if (target === "biblerats") renderBibleRats();
}

function setupSessionUi() {
  document.querySelector("#roleLabel").textContent = roleLabels[currentUser.role] || "Jovem";
  document.querySelector("#topbarDate").textContent = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Ajusta label do quick-card de conversa conforme o role
  const isLeader = ["lider", "pastor", "missionaria", "admin", "sublider"].includes(currentUser.role);
  const conversaCard = document.querySelector('.quick-card[data-target="conversa"]');
  if (conversaCard) {
    const label = conversaCard.querySelector('strong');
    if (label) label.textContent = isLeader ? "Falar com Jovens" : "Falar com Líderes";
  }

  // Ajusta o título da seção de conversa na sidebar também
  const navConversa = document.querySelector('[data-target="conversa"]');
  if (navConversa) {
    const txt = navConversa.childNodes[0];
    if (txt && txt.nodeType === Node.TEXT_NODE) {
      txt.textContent = isLeader ? "Jovens" : "Conversar";
    }
  }
}

const WELCOME_VERSES = [
  '"Porque eu sei os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar." — Jr 29:11',
  '"Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus." — Is 41:10',
  '"Posso todas as coisas naquele que me fortalece." — Fp 4:13',
  '"Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento." — Pv 3:5',
  '"Buscai primeiro o reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas." — Mt 6:33',
];

function maybeShowWelcome() {
  if (!currentUser?.createdAt) return;
  const isNew = Date.now() - Number(currentUser.createdAt) < 3 * 60 * 1000; // 3 min
  if (!isNew) return;

  const modal = document.getElementById('welcomeModal');
  if (!modal) return;

  document.getElementById('welcomeName').textContent =
    `Bem-vindo(a), ${currentUser.name?.split(' ')[0] || 'jovem'}! 🔥`;
  document.getElementById('welcomeVerse').textContent =
    WELCOME_VERSES[Math.floor(Math.random() * WELCOME_VERSES.length)];

  modal.style.display = 'grid';
}

function renderFeed() {
  document.querySelector("#feedList").innerHTML = getPosts()
    .map(
      (item) => `
        <article class="feed-card">
          <span class="feed-tag">${item.tag || "Aviso"}</span>
          <div>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
          </div>
          <span class="feed-time">${item.time || formatTimeAgo(item.createdAt)}</span>
        </article>
      `,
    )
    .join("");
}

function renderBirthdays() {
  const container = document.querySelector('#birthdayCard');
  if (!container) return;

  const now = new Date();
  const todayMonth = now.getMonth() + 1;
  const todayDay   = now.getDate();

  // Janela de 7 dias
  const upcoming = getUsers().filter(u => {
    if (!u.birthday) return false;
    const [, month, day] = u.birthday.split('-').map(Number);
    if (!month || !day) return false;

    const bdThisYear = new Date(now.getFullYear(), month - 1, day);
    const diffMs = bdThisYear - new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round(diffMs / 86400000);
    return diffDays >= 0 && diffDays <= 6;
  }).sort((a, b) => {
    const dayA = Number(a.birthday.split('-')[2]);
    const dayB = Number(b.birthday.split('-')[2]);
    return dayA - dayB;
  });

  if (!upcoming.length) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
      <span style="font-size:1.4rem;">🎂</span>
      <div>
        <p class="eyebrow" style="margin:0;">Aniversariantes da semana</p>
        <p style="margin:4px 0 0; font-weight:700; font-size:0.94rem; color:var(--ink);">
          ${upcoming.map(u => {
            const [, month, day] = u.birthday.split('-').map(Number);
            const isToday = Number(day) === todayDay && Number(month) === todayMonth;
            return `${u.name.split(' ')[0]}${isToday ? ' 🎉' : ` (dia ${day})`}`;
          }).join(' · ')}
        </p>
      </div>
    </div>
  `;
}

const DAILY_VERSES = [
  { text: '“Porque sou eu que conheço os planos que tenho para vocês”, diz o Senhor, “planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.”', ref: 'Jr 29:11' },
  { text: 'Por isso não tema, pois estou com você; não tenha medo, pois sou o seu Deus. Eu o fortalecerei e o ajudarei; eu o segurarei com a minha mão direita vitoriosa.', ref: 'Is 41:10' },
  { text: 'Tudo posso naquele que me fortalece.', ref: 'Fp 4:13' },
  { text: 'Confie no Senhor de todo o seu coração e não se apóie em seu próprio entendimento;', ref: 'Pv 3:5' },
  { text: 'Busquem, pois, em primeiro lugar o Reino de Deus e a sua justiça, e todas essas coisas serão acrescentadas a vocês.', ref: 'Mt 6:33' },
  { text: 'O Senhor é o meu pastor; de nada terei falta.', ref: 'Sl 23:1' },
  { text: 'Sejam fortes e corajosos. Não tenham medo nem fiquem apavorados por causa deles, pois o Senhor, o seu Deus, vai com vocês; nunca os deixará, nunca os abandonará.', ref: 'Dt 31:6' },
  { text: 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.', ref: '1 Co 13:4' },
  { text: 'Finalmente, irmãos, tudo o que for verdadeiro, tudo o que for nobre, tudo o que for correto, tudo o que for puro, tudo o que for amável, tudo o que for de boa fama, se houver algo de excelente ou digno de louvor, pensem nessas coisas.', ref: 'Fp 4:8' },
  { text: 'Alegrem-se sempre no Senhor. Novamente direi: Alegrem-se!', ref: 'Fp 4:4' },
  { text: 'Deleite-se no Senhor, e ele atenderá aos desejos do seu coração.', ref: 'Sl 37:4' },
  { text: 'O Senhor protege os simples; quando eu já estava sem forças, ele me salvou.', ref: 'Sl 116:6' },
  { text: 'Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.', ref: 'Jo 3:16' },
  { text: 'Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção e para a instrução na justiça,', ref: '2 Tm 3:16' },
  { text: 'O Senhor é a minha luz e a minha salvação; de quem terei temor? O Senhor é o baluarte da minha vida; de quem terei medo?', ref: 'Sl 27:1' },
  { text: 'Eles responderam: “Creia no Senhor Jesus e serão salvos, você e os de sua casa”.', ref: 'At 16:31' },
  { text: 'Nada façam por ambição egoísta ou por vaidade, mas por humildade considerem os outros superiores a vocês mesmos.', ref: 'Fp 2:3' },
  { text: '“Venham a mim, todos os que estão cansados e sobrecarregados, e eu darei descanso a vocês.”', ref: 'Mt 11:28' },
  { text: 'Não se amoldem ao padrão deste mundo, mas transformem-se pela renovação da sua mente, para que sejam capazes de experimentar e comprovar a boa, agradável e perfeita vontade de Deus.', ref: 'Rm 12:2' },
  { text: 'Pois Deus não nos deu um espírito de covardia, mas de poder, de amor e de equilíbrio.', ref: '2 Tm 1:7' },
  { text: 'Mas aqueles que esperam no Senhor renovam as suas forças. Voam alto como águias; correm e não ficam exaustos, andam e não se cansam.', ref: 'Is 40:31' },
  { text: 'O Senhor o protegerá de todo o mal, ele protegerá a sua vida.', ref: 'Sl 121:7' },
  { text: 'Finalmente, fortaleçam-se no Senhor e na força do seu poder.', ref: 'Ef 6:10' },
  { text: 'O ladrão vem apenas para roubar, matar e destruir; eu vim para que tenham vida, e a tenham plenamente.', ref: 'Jo 10:10' },
  { text: 'Estou convencido de que aquele que começou boa obra em vocês vai completá-la até o dia de Cristo Jesus.', ref: 'Fp 1:6' },
  { text: 'Graça e paz lhes sejam multiplicadas, pelo pleno conhecimento de Deus e de Jesus, o nosso Senhor.', ref: '2 Pe 1:2' },
  { text: 'Não se amoldem ao padrão deste mundo, mas transformem-se pela renovação da sua mente...', ref: 'Rm 12:2' }, // Nota: No seu array original o Rm 12:2 estava repetido, mantive o mesmo padrão com o texto NVI.
  { text: 'A tua palavra é lâmpada que ilumina os meus passos e luz que clareia o meu caminho.', ref: 'Sl 119:105' },
  { text: 'Dêm graças em todas as circunstâncias, pois esta é a vontade de Deus para vocês em Cristo Jesus.', ref: '1 Ts 5:18' },
  { text: 'Tudo o que fizerem, façam de todo o coração, como para o Senhor, e não para os homens,', ref: 'Cl 3:23' },
];

function renderDailyVerse() {
  const el = document.getElementById('dailyVerseCard');
  if (!el) return;
  const verse = DAILY_VERSES[new Date().getDate() % DAILY_VERSES.length];
  el.innerHTML = `
    <div style="display:flex; gap:12px; align-items:flex-start;">
      <span style="font-size:1.5rem; flex-shrink:0; margin-top:2px;">📖</span>
      <div>
        <p class="eyebrow" style="margin:0 0 5px; color:var(--blue);">Palavra do dia</p>
        <p style="margin:0 0 6px; font-size:0.92rem; font-weight:500; line-height:1.6; color:var(--ink); font-style:italic;">
          "${verse.text}"
        </p>
        <span style="font-size:0.78rem; font-weight:800; color:var(--blue);">— ${verse.ref}</span>
      </div>
    </div>
  `;
}

function renderAgendaFilterOptions() {
  const filterEl = document.querySelector("#agendaFilter");
  if (!filterEl) return;

  if (currentUser.role === "jovem" && !currentUser.hasServo) {
    filterEl.style.display = "none";
    return;
  }

  let options = `<option value="todos">Filtro: Todos</option>`;
  
  if (canManageAll() || currentUser.role === "lider") {
    options += `
      <option value="geral">Geral</option>
      <option value="jovens">Jovens</option>
      <option value="responsaveis">Responsáveis</option>
      <option value="servos">Servos</option>
      <option value="lideres">Líderes</option>
    `;
  } else if (currentUser.role === "responsavel") {
    options += `
      <option value="geral">Geral</option>
      <option value="jovens">Jovens</option>
      <option value="responsaveis">Responsáveis</option>
    `;
  } else if (currentUser.role === "jovem" && currentUser.hasServo) {
    options += `
      <option value="geral">Geral</option>
      <option value="jovens">Jovens</option>
      <option value="servos">Servos</option>
    `;
  }

  filterEl.innerHTML = options;
  filterEl.value = currentAgendaFilter;
}

function renderCalendar() {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  let events = getEvents().sort((a, b) => Number(a.date) - Number(b.date));
  if (currentAgendaFilter !== 'todos') {
    events = events.filter(event => (event.audience || 'geral') === currentAgendaFilter);
  }
  const eventDays = new Set(events.map((event) => String(event.date)));
  const activeDay = events[0]?.date || String(now.getDate());

  document.querySelector("#agendaMonthLabel").textContent = currentMonthName();
  document.querySelector("#calendarStrip").innerHTML = Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1);
    const weekday = new Date(now.getFullYear(), now.getMonth(), index + 1).toLocaleDateString("pt-BR", {
      weekday: "short",
    });
    return `
      <button class="day-chip ${day === activeDay ? "active" : ""}" type="button" data-day="${day}">
        <span>${weekday}</span>
        ${day}
        ${eventDays.has(day) ? '<span class="event-dot"></span>' : ""}
      </button>
    `;
  }).join("");

  document.querySelector("#agendaList").innerHTML = events.length
    ? events
        .map(
          (item, index) => `
            <button class="agenda-card ${index === 0 ? "active" : ""}" type="button" data-agenda-index="${index}" data-day="${item.date}">
              <div class="agenda-date">${item.date}</div>
              <div>
                <h3>${item.title}</h3>
                <p>${item.weekDay || weekDayForDate(item.date)} as ${item.time || "--"} · ${item.text || item.detail || ""}</p>
              </div>
              <span class="agenda-audience">${formatAudience(item.audience)}</span>
            </button>
          `,
        )
        .join("")
    : `<article class="agenda-detail"><h3>Nenhum evento para seu perfil</h3><p>Quando a liderança adicionar algo, aparece aqui.</p></article>`;

  _lastFilteredEvents = events;
  renderAgendaDetail(events.length ? 0 : -1);
}

let _lastFilteredEvents = [];

function renderAgendaDetail(index) {
  const detail = document.querySelector("#agendaDetail");
  const item = _lastFilteredEvents[index];
  
  if (!item) {
    detail.innerHTML = `
      <p class="eyebrow">Detalhes</p>
      <h3>Nenhum evento selecionado</h3>
      <p>Escolha um dia ou evento da agenda para ver mais informações.</p>
    `;
    return;
  }

  // Verifica se é evento de célula para exibir ações específicas
  const isCellEvent = Boolean(item.isCellEvent || item.cellId);
  const userAlreadyJoined = isCellEvent && item.participantId === currentUser.id;
  const cells = window.NEXT_CELLS || [];
  const cellData = isCellEvent ? cells.find(c => c.id === item.cellId) : null;

  // Botão de célula: "Participar" (para quem ainda não está) ou "Entrar em contato"
  let cellActionHtml = '';
  if (isCellEvent && !userAlreadyJoined && ['jovem', 'responsavel'].includes(currentUser.role)) {
    cellActionHtml = `
      <button class="ghost-button" id="joinCellBtn" data-cell-id="${item.cellId}" type="button"
        style="margin-top:14px;background:var(--blue);color:#fff;border-color:var(--blue);box-shadow:0 4px 12px rgba(47,115,248,0.25);">
        Participar 🙌
      </button>
    `;
  } else if (isCellEvent) {
    const leaders = cellData ? cellData.leaders.join(', ') : 'a liderança';
    cellActionHtml = `
      <div style="margin-top:14px;padding:12px 14px;background:rgba(47,115,248,0.07);border:1px solid rgba(47,115,248,0.2);border-radius:10px;">
        <p class="eyebrow" style="color:var(--blue);margin-bottom:4px;">Você está nesta célula</p>
        <p style="font-size:0.88rem;color:var(--muted);">Líderes: ${leaders}</p>
        <button class="ghost-button" id="contactCellLeaderBtn" type="button"
          style="margin-top:10px;font-size:0.85rem;padding:8px 14px;min-height:36px;">
          Entrar em contato com a liderança
        </button>
      </div>
    `;
  }

  detail.innerHTML = `
    <p class="eyebrow">Detalhes do evento</p>
    <h3>${item.title}</h3>
    <p>${item.detail || item.text}</p>
    <div class="agenda-detail-meta">
      <span class="small-badge">${item.weekDay || weekDayForDate(item.date)}, dia ${item.date}</span>
      <span class="small-badge">${item.time || "--"}</span>
      <span class="small-badge">${item.location || "AD Fonte de Vida"}</span>
      <span class="small-badge">${formatAudience(item.audience)}</span>
    </div>
    ${cellActionHtml}
    ${canManage() && !isCellEvent ? `
      <button class="ghost-button" id="deleteEventBtn" data-event-id="${item.id}" type="button" style="margin-top: 14px; color: #dc2626; border-color: #fca5a5; background: #fef2f2;">
        Excluir Evento
      </button>
    ` : ""}
  `;

  // Handler: Participar (jovem clica no detalhe do evento de célula)
  const joinCellBtn = detail.querySelector('#joinCellBtn');
  if (joinCellBtn) {
    joinCellBtn.addEventListener('click', () => {
      const cellId = joinCellBtn.dataset.cellId;
      addCellEventsForUser(cellId, currentUser.id);
    });
  }

  // Handler: Entrar em contato com líder
  const contactBtn = detail.querySelector('#contactCellLeaderBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
    toast('Acesse a aba "Conversar" para falar direto com a liderança da sua célula. 🙌', 'info');
    });
  }
}

// ── Controle semanal de células ─────────────────────────────────────────────

// Retorna a chave ISO da semana (ex: "2026-W22") para uma Date.
// Semana começa na segunda-feira (ISO 8601).
function getIsoWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7; // dom=7
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

// Retorna a chave ISO da semana que contém "date" mais N semanas.
function shiftWeekKey(weekKey, n) {
  const [yr, wk] = weekKey.split('-W').map(Number);
  // Recalcula a partir da segunda-feira da semana dada
  const jan4 = new Date(Date.UTC(yr, 0, 4));
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setUTCDate(jan4.getUTCDate() - (jan4.getUTCDay() || 7) + 1);
  const targetMonday = new Date(startOfWeek1);
  targetMonday.setUTCDate(startOfWeek1.getUTCDate() + (wk - 1 + n) * 7);
  return getIsoWeekKey(targetMonday);
}

// Chave de armazenamento das confirmações por célula
const CELL_CONFIRM_KEY = 'next_cell_week_confirmed';

function getCellConfirmations() {
  try { return JSON.parse(localStorage.getItem(CELL_CONFIRM_KEY)) || {}; }
  catch { return {}; }
}

function setCellConfirmation(cellId, weekKey) {
  const data = getCellConfirmations();
  data[cellId] = weekKey;
  localStorage.setItem(CELL_CONFIRM_KEY, JSON.stringify(data));
}

// Retorna a Date da próxima ocorrência de weekdayNum a partir de fromDate (inclusive).
function nextOccurrenceFrom(weekdayNum, fromDate) {
  const d = new Date(fromDate);
  d.setHours(0, 0, 0, 0);
  let tries = 0;
  while (d.getDay() !== weekdayNum && tries < 8) {
    d.setDate(d.getDate() + 1);
    tries++;
  }
  return tries < 8 ? d : null;
}

// Retorna a Date da ocorrência de célula visível para a semana atual.
// Retorna null se bloqueada (semana anterior não confirmada).
function getUnlockedCellDate(cellId, weekdayNum) {
  const confirmations = getCellConfirmations();
  const confirmedWeek = confirmations[cellId]; // semana já confirmada pelo líder
  const today = new Date();
  const thisWeekKey = getIsoWeekKey(today);

  // Primeira vez: não há confirmação anterior — mostra a ocorrência desta semana
  // para que o líder possa confirmar.
  if (!confirmedWeek) {
    // Encontra a segunda-feira desta semana ISO
    const monday = new Date(today);
    const dow = monday.getDay() || 7;
    monday.setDate(monday.getDate() - dow + 1);
    monday.setHours(0, 0, 0, 0);
    return nextOccurrenceFrom(weekdayNum, monday);
  }

  // A semana cujo evento pode ser exibido = confirmedWeek + 1
  const allowedWeek = shiftWeekKey(confirmedWeek, 1);

  // Só exibe se a semana permitida é a atual ou anterior (nunca adiantada)
  if (allowedWeek > thisWeekKey) return null; // bloqueada: líder não confirmou ainda

  // Encontra a ocorrência na semana permitida
  const [yr, wk] = allowedWeek.split('-W').map(Number);
  const jan4 = new Date(Date.UTC(yr, 0, 4));
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setUTCDate(jan4.getUTCDate() - (jan4.getUTCDay() || 7) + 1);
  const allowedMonday = new Date(startOfWeek1);
  allowedMonday.setUTCDate(startOfWeek1.getUTCDate() + (wk - 1) * 7);
  allowedMonday.setHours(0, 0, 0, 0);

  return nextOccurrenceFrom(weekdayNum, allowedMonday);
}

// Salva um único evento de célula para userId na data indicada.
function saveCellEventForUser(cell, date, userId, userName, role) {
  const eventId = `cell_${cell.id}_${userId}_${date.getTime()}`;
  const weekKey = getIsoWeekKey(date);
  dbApi?.save('next_events', {
    id: eventId,
    date: String(date.getDate()),
    month: date.toLocaleDateString('pt-BR', { month: 'long' }),
    weekDay: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
    time: cell.time,
    title: `Célula — ${cell.name}`,
    text: `Encontro de célula em ${cell.location}.`,
    detail: `Célula ${cell.name} com ${cell.leaders.join(', ')} em ${cell.location}.`,
    location: cell.location,
    audience: role === 'responsavel' ? 'responsaveis' : 'jovens',
    isCellEvent: true,
    cellId: cell.id,
    cellName: cell.name,
    participantId: userId,
    cellWeekKey: weekKey,
    status: 'pending_leader',
  });
}

// Confirmação da célula da semana pelo líder:
// grava a semana como confirmada e cria o evento da PRÓXIMA semana para todos os participantes.
function confirmCellWeek(cellId) {
  const cells = window.NEXT_CELLS || [];
  const cell = cells.find(c => c.id === cellId);
  if (!cell) return;

  const confirmations = getCellConfirmations();
  const confirmedWeek = confirmations[cellId];
  const today = new Date();
  const thisWeekKey = getIsoWeekKey(today);

  // A semana a confirmar é a atual (ou a desbloqueada se ainda não confirmada)
  const weekToConfirm = confirmedWeek ? shiftWeekKey(confirmedWeek, 1) : thisWeekKey;
  setCellConfirmation(cellId, weekToConfirm);

  // Calcula a data da ocorrência da PRÓXIMA semana
  const nextWeekKey = shiftWeekKey(weekToConfirm, 1);
  const [yr, wk] = nextWeekKey.split('-W').map(Number);
  const jan4 = new Date(Date.UTC(yr, 0, 4));
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setUTCDate(jan4.getUTCDate() - (jan4.getUTCDay() || 7) + 1);
  const nextMonday = new Date(startOfWeek1);
  nextMonday.setUTCDate(startOfWeek1.getUTCDate() + (wk - 1) * 7);
  nextMonday.setHours(0, 0, 0, 0);
  const nextDate = nextOccurrenceFrom(cell.weekdayNum, nextMonday);
  if (!nextDate) return;

  // Cria o evento para cada participante da célula
  const allEvents = dbApi?.getAll('next_events') || [];
  const participantIds = [...new Set(
    allEvents
      .filter(e => e.isCellEvent && e.cellId === cellId)
      .map(e => e.participantId)
      .filter(Boolean)
  )];

  const allUsers = authApi?.getMockUsers?.() || [];
  participantIds.forEach(pid => {
    const u = allUsers.find(u => u.id === pid);
    saveCellEventForUser(cell, nextDate, pid, u?.name || '', u?.role || 'jovem');
  });

  renderCalendar();
  renderCellWeekPanel();
}

// Adiciona eventos recorrentes de célula para um usuário (chamado do detalhe da agenda)
function addCellEventsForUser(cellId, userId) {
  const cells = window.NEXT_CELLS || [];
  const cell = cells.find(c => c.id === cellId);
  if (!cell) return;

  // Encontra a ocorrência desbloqueada desta semana
  const unlockedDate = getUnlockedCellDate(cellId, cell.weekdayNum);
  if (unlockedDate) {
    saveCellEventForUser(cell, unlockedDate, userId, currentUser.name, 'jovem');

    // Também cria para o responsável, se houver
    const allUsers = authApi?.getMockUsers?.() || [];
    const responsible = allUsers.find(u => u.role === 'responsavel' && u.childName === currentUser.name);
    if (responsible) {
      const evId = `cell_resp_${cellId}_${responsible.id}_${unlockedDate.getTime()}`;
      dbApi?.save('next_events', {
        id: evId,
        date: String(unlockedDate.getDate()),
        month: unlockedDate.toLocaleDateString('pt-BR', { month: 'long' }),
        weekDay: unlockedDate.toLocaleDateString('pt-BR', { weekday: 'long' }),
        time: cell.time,
        title: `Célula de ${currentUser.name} — ${cell.name}`,
        text: `Encontro de célula do(a) jovem ${currentUser.name} em ${cell.location}.`,
        detail: `${currentUser.name} vai participar da ${cell.name} em ${cell.location}.`,
        location: cell.location,
        audience: 'responsaveis',
        isCellEvent: true,
        cellId: cell.id,
        cellName: cell.name,
        participantId: responsible.id,
        cellWeekKey: getIsoWeekKey(unlockedDate),
        status: 'pending_leader',
      });
    }
  }

  // Registra interesse para liderança
  dbApi?.save('next_cell_interests', {
    id: `ci_${Date.now()}`,
    userId,
    userName: currentUser.name,
    userCity: currentUser.city || '',
    cellId: cell.id,
    cellName: cell.name,
    status: 'pending',
    createdAt: Date.now(),
  });

  authApi?.updateSession({ pendingCellId: cell.id, pendingCellName: cell.name });
  renderCalendar();

  const msg = unlockedDate
    ? `Você foi adicionado à ${cell.name}! O encontro desta semana aparece na sua agenda. 🙌`
    : `Você foi adicionado à ${cell.name}! O encontro aparecerá na agenda assim que a liderança confirmar a célula da semana. 🙌`;
  toast(msg, 'success', 4000);
}

function selectAgendaItem(index) {
  const item = _lastFilteredEvents[index];
  if (!item) return;

  document.querySelectorAll(".agenda-card").forEach((card) => {
    card.classList.toggle("active", Number(card.dataset.agendaIndex) === index);
  });
  document.querySelectorAll(".day-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.day === String(item.date));
  });
  renderAgendaDetail(index);
}

function renderContentCards(target, items) {
  const isPlaylist = target === '#playlists';
  const type = isPlaylist ? 'playlists' : 'planos';
  const isManager = canManageContent();
  const el = document.querySelector(target);
  if (!el) return;

  if (!items.length) {
    el.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px 20px;color:var(--muted);">
        <div style="font-size:2.5rem;margin-bottom:10px;">${isPlaylist ? '🎵' : '📖'}</div>
        <p style="margin:0;font-size:0.9rem;font-weight:600;">Nenhum conteúdo cadastrado ainda.</p>
        ${isManager ? `<p style="margin:6px 0 0;font-size:0.8rem;">Use o botão <strong>＋ Adicionar</strong> acima para criar o primeiro.</p>` : ''}
      </div>`;
    return;
  }

  el.innerHTML = items
    .map((item) => {
      const accentColor = normalizeContentColor(item.color);
      const progressPct = item.progress || 0;
      const title = escapeHtml(item.title);
      const text = escapeHtml(item.text);
      const tag = escapeHtml(item.tag);
      const emoji = escapeHtml(item.emoji || (isPlaylist ? '🎵' : '📖'));
      const meta = isPlaylist ? escapeHtml(formatPlaylistMeta(item)) : `${item.days || 0} dias de leitura`;
      const provider = isPlaylist ? getPlaylistProvider(item) : null;
      const providerIcon = provider === 'Spotify' ? '🎧' : provider === 'YouTube' ? '▶️' : '';
      const providerBadge = provider && provider !== 'playlist' ? `
        <span style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);
          color:#fff;font-size:0.65rem;font-weight:800;padding:3px 7px;border-radius:99px;letter-spacing:0.04em;">
          ${providerIcon} ${provider}
        </span>` : '';

      return `
        <article class="content-card" data-content-id="${item.id}"
          style="cursor:pointer;position:relative;overflow:hidden;border-radius:16px;
            transition:transform 200ms,box-shadow 200ms;border:1.5px solid transparent;">
          <!-- Arte / banner -->
          <div class="content-art" style="background:linear-gradient(135deg,${accentColor}44,${accentColor}18);
            border-bottom:2px solid ${accentColor}33;display:flex;align-items:center;
            justify-content:center;min-height:88px;font-size:2.8rem;position:relative;">
            ${emoji}
            ${providerBadge}
          </div>
          <!-- Corpo -->
          <div style="padding:12px 14px 8px;">
            ${item.tag ? `<span style="font-size:0.65rem;font-weight:800;letter-spacing:0.07em;text-transform:uppercase;
              color:${accentColor};margin-bottom:4px;display:block;">${tag}</span>` : ''}
            <h3 style="margin:0 0 4px;font-size:0.93rem;font-weight:800;line-height:1.3;">${title}</h3>
            <p style="margin:0;font-size:0.79rem;line-height:1.5;color:var(--muted);">${text}</p>
            <p style="margin:4px 0 0;font-size:0.71rem;color:${accentColor};font-weight:700;">${meta}</p>
          </div>
          <!-- Progresso -->
          <div style="padding:0 14px ${isManager ? '8px' : '14px'};">
            <div style="height:4px;border-radius:99px;background:var(--line);overflow:hidden;margin-bottom:4px;">
              <span style="width:${progressPct}%;height:100%;display:block;background:${accentColor};
                border-radius:99px;transition:width 600ms;"></span>
            </div>
            <p style="font-size:0.68rem;color:var(--muted);font-weight:700;margin:0;text-align:right;">
              ${progressPct > 0 ? `${progressPct}% concluído` : 'Não iniciado'}
            </p>
          </div>
          <!-- Botões de gestão -->
          ${isManager ? `
            <div style="display:flex;gap:6px;padding:0 10px 10px;">
              <button type="button" data-edit-content="${item.id}" data-content-type="${type}"
                style="flex:1;min-height:30px;border-radius:8px;border:1.5px solid var(--line);
                  background:var(--surface);color:var(--ink);font-size:0.73rem;font-weight:700;
                  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;
                  transition:border-color 150ms;">
                ✎ Editar
              </button>
              <button type="button" data-delete-content="${item.id}" data-content-type="${type}"
                style="flex:1;min-height:30px;border-radius:8px;border:1.5px solid #fca5a5;
                  background:#fef2f2;color:#dc2626;font-size:0.73rem;font-weight:700;
                  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;
                  transition:background 150ms;">
                🗑 Remover
              </button>
            </div>
          ` : ""}
        </article>
      `;
    })
    .join("");

  // Bind clicks to open modal
  el.querySelectorAll('[data-content-id]').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-3px)';
      card.style.boxShadow = '0 12px 32px rgba(0,0,0,0.14)';
      card.style.borderColor = 'var(--blue)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.borderColor = 'transparent';
    });
    card.addEventListener('click', (event) => {
      if (event.target.closest('[data-edit-content], [data-delete-content]')) return;
      const id = card.dataset.contentId;
      const item = isPlaylist ? getPlaylists().find(p => p.id === id) : getPlanos().find(p => p.id === id);
      if (!item) return;
      isPlaylist ? openPlaylistModal(item) : openPlanModal(item);
    });
  });

  el.querySelectorAll('[data-edit-content]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      editContentItem(btn.dataset.contentType, btn.dataset.editContent);
    });
  });

  el.querySelectorAll('[data-delete-content]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      deleteContentItem(btn.dataset.contentType, btn.dataset.deleteContent);
    });
  });
}

// ── Playlist Modal ──────────────────────────────────────
function openPlaylistModal(item) {
  const existing = document.getElementById('contentModalOverlay');
  if (existing) existing.remove();

  const color = normalizeContentColor(item.color);
  const title = escapeHtml(item.title);
  const description = escapeHtml(item.description);
  const emoji = escapeHtml(item.emoji || '🎵');
  const meta = escapeHtml(formatPlaylistMeta(item));
  const provider = getPlaylistProvider(item);
  const playlistUrl = getPlaylistUrl(item);
  const safeUrl = escapeHtml(playlistUrl);
  const actionLabel = provider === 'YouTube' ? 'Assistir no YouTube' : provider === 'Spotify' ? 'Escutar no Spotify' : 'Abrir playlist';

  const overlay = document.createElement('div');
  overlay.id = 'contentModalOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9992;background:rgba(8,12,24,0.82);backdrop-filter:blur(8px);display:grid;place-items:center;padding:16px;animation:overlayIn 220ms ease forwards;';

  overlay.innerHTML = `
    <div style="background:var(--surface);border-radius:24px;width:min(480px,100%);overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,0.4);animation:modalUp 380ms cubic-bezier(0.16,1,0.3,1) forwards;display:flex;flex-direction:column;max-height:90vh;">
      <!-- Banner colorido -->
      <div style="background:linear-gradient(135deg,${color},${color}88);padding:32px 24px 28px;position:relative;text-align:center;flex-shrink:0;">
        <button id="closeContentModal" type="button" style="position:absolute;top:14px;right:14px;background:rgba(255,255,255,0.2);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;color:#fff;font-size:1.1rem;display:grid;place-items:center;backdrop-filter:blur(4px);">×</button>
        <div style="font-size:3.5rem;margin-bottom:12px;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.3));">${emoji}</div>
        <h2 style="margin:0 0 6px;font-family:'Syne',sans-serif;font-weight:900;font-size:1.4rem;color:#fff;letter-spacing:-0.02em;">${title}</h2>
        <p style="margin:0;color:rgba(255,255,255,0.8);font-size:0.84rem;font-weight:600;">${meta}</p>
      </div>
      <!-- Corpo com scroll -->
      <div style="padding:20px 22px 16px;overflow-y:auto;flex:1;">
        <p style="margin:0 0 16px;font-size:0.93rem;line-height:1.65;color:var(--ink);">${description}</p>
        <div style="background:var(--soft);border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;border:1px solid var(--line);">
          <div style="font-size:1.5rem;">🎧</div>
          <div>
            <p style="margin:0;font-size:0.82rem;font-weight:800;color:var(--ink);">Disponível no ${provider}</p>
            <p style="margin:2px 0 0;font-size:0.75rem;color:var(--muted);">Toque no botão para abrir a playlist</p>
          </div>
        </div>
        ${item.progress > 0 ? `
          <div style="margin-top:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <span style="font-size:0.80rem;font-weight:700;color:var(--muted);">Seu progresso</span>
              <span style="font-size:0.80rem;font-weight:800;color:${color};">${item.progress}%</span>
            </div>
            <div style="height:6px;border-radius:99px;background:var(--line);overflow:hidden;">
              <div style="width:${item.progress}%;height:100%;background:${color};border-radius:99px;transition:width 800ms 200ms;"></div>
            </div>
          </div>` : ''}
      </div>
      <!-- Botão dentro do modal, no fundo, sem position:absolute -->
      <div style="padding:12px 22px 20px;flex-shrink:0;">
        <a href="${safeUrl}" target="_blank" rel="noopener" style="
          display:flex;align-items:center;justify-content:center;gap:8px;
          min-height:50px;border-radius:12px;background:${color};
          color:#fff;font-family:'Syne',sans-serif;font-weight:900;font-size:0.95rem;
          text-decoration:none;letter-spacing:0.02em;
          box-shadow:0 8px 24px ${color}55;
          transition:transform 150ms,box-shadow 150ms;
          " onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 12px 32px ${color}66'" onmouseleave="this.style.transform='';this.style.boxShadow='0 8px 24px ${color}55'">
          🎵 ${actionLabel}
        </a>
      </div>
    </div>
  `;

  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('#closeContentModal')?.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
}

// ── Plan Modal ──────────────────────────────────────────
function openPlanModal(item) {
  const existing = document.getElementById('contentModalOverlay');
  if (existing) existing.remove();

  const color = normalizeContentColor(item.color, "#f59e0b");
  const title = escapeHtml(item.title);
  const description = escapeHtml(item.description);
  const emoji = escapeHtml(item.emoji || "📖");
  const tag = escapeHtml(item.tag || "Plano");
  const versesHTML = (item.verses || []).map(v => `
    <div style="display:flex;gap:12px;padding:12px;border-radius:10px;background:var(--soft);border:1px solid var(--line);margin-bottom:8px;align-items:flex-start;">
      <div style="width:28px;height:28px;border-radius:8px;background:${color};display:grid;place-items:center;flex-shrink:0;font-size:0.72rem;font-weight:900;color:#fff;">${v.day}</div>
      <div>
        <p style="margin:0;font-size:0.88rem;font-weight:800;color:var(--ink);">${escapeHtml(v.theme)}</p>
        <p style="margin:2px 0 0;font-size:0.78rem;color:${color};font-weight:700;">📖 ${escapeHtml(v.ref)}</p>
      </div>
    </div>
  `).join('');

  const overlay = document.createElement('div');
  overlay.id = 'contentModalOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9992;background:rgba(8,12,24,0.82);backdrop-filter:blur(8px);display:grid;place-items:center;padding:16px;animation:overlayIn 220ms ease forwards;';

  overlay.innerHTML = `
    <div style="background:var(--surface);border-radius:24px;width:min(480px,100%);overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,0.4);animation:modalUp 380ms cubic-bezier(0.16,1,0.3,1) forwards;display:flex;flex-direction:column;max-height:90vh;">
      <!-- Banner -->
      <div style="background:linear-gradient(135deg,${color},${color}88);padding:28px 24px 24px;position:relative;flex-shrink:0;">
        <button id="closeContentModal" type="button" style="position:absolute;top:14px;right:14px;background:rgba(255,255,255,0.2);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;color:#fff;font-size:1.1rem;display:grid;place-items:center;">×</button>
        <span style="display:inline-block;font-size:0.68rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;background:rgba(255,255,255,0.2);color:#fff;border-radius:99px;padding:3px 10px;margin-bottom:10px;">${tag}</span>
        <h2 style="margin:0 0 6px;font-family:'Syne',sans-serif;font-weight:900;font-size:1.35rem;color:#fff;letter-spacing:-0.02em;">${emoji} ${title}</h2>
        <p style="margin:0;color:rgba(255,255,255,0.8);font-size:0.83rem;font-weight:600;">${item.days} dias de leitura</p>
      </div>
      <!-- Scroll body -->
      <div style="padding:18px 20px 16px;overflow-y:auto;flex:1;">
        <p style="margin:0 0 16px;font-size:0.92rem;line-height:1.65;color:var(--ink);">${description}</p>
        
        ${item.progress > 0 ? `
          <div style="background:${color}11;border:1px solid ${color}33;border-radius:12px;padding:12px 14px;margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="font-size:0.80rem;font-weight:800;color:var(--ink);">Progresso atual</span>
              <span style="font-size:0.80rem;font-weight:900;color:${color};">${item.progress}%</span>
            </div>
            <div style="height:6px;border-radius:99px;background:var(--line);overflow:hidden;">
              <div style="width:${item.progress}%;height:100%;background:${color};border-radius:99px;"></div>
            </div>
          </div>` : ''}

        <p style="margin:0 0 10px;font-size:0.78rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted);">Versículos do plano</p>
        ${versesHTML || '<p style="color:var(--muted);font-size:0.88rem;">Versículos em breve.</p>'}
      </div>
      <!-- Botão dentro do modal, no fundo, sem position:absolute -->
      <div style="padding:12px 20px 20px;flex-shrink:0;">
        <button type="button" id="planStartBtn" style="
          width:100%;min-height:50px;border-radius:12px;border:none;background:${color};
          color:#fff;font-family:'Syne',sans-serif;font-weight:900;font-size:0.95rem;cursor:pointer;
          box-shadow:0 8px 24px ${color}55;letter-spacing:0.02em;transition:transform 150ms;
          " onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform=''">
          📖 Iniciar Plano
        </button>
      </div>
    </div>
  `;

  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('#closeContentModal')?.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);

  overlay.querySelector('#planStartBtn')?.addEventListener('click', function() {
    this.textContent = '✓ Plano iniciado! Bons estudos 🙏';
    this.style.background = '#10b981';
    this.disabled = true;
  });
}

function contentCollectionForType(type) {
  return CONTENT_COLLECTIONS[type === "planos" ? "planos" : "playlists"];
}

function getContentListByType(type) {
  return type === "planos" ? getPlanos() : getPlaylists();
}

function getContentItemByType(type, id) {
  return getContentListByType(type).find((item) => item.id === id) || null;
}

function renderContentAdminPanel() {
  const panel = document.querySelector("#contentAdminPanel");
  const addBtn = document.querySelector("#contentAddBtn");
  if (!panel) return;
  const canManage = canManageContent();
  // Painel fica fechado por padrão; botão "+ Adicionar" abre ele
  if (addBtn) addBtn.classList.toggle("hidden", !canManage);
  // Se não tem permissão, esconde e fecha
  if (!canManage) {
    panel.classList.add("hidden");
  }
  updateContentFormFields();
}

function renderContent() {
  renderContentAdminPanel();
  renderContentCards("#playlists", getPlaylists());
  renderContentCards("#planos", getPlanos());
  // Bind botão "Adicionar" — clona o elemento para limpar listeners antigos
  const addBtnOrig = document.querySelector("#contentAddBtn");
  if (addBtnOrig) {
    const addBtn = addBtnOrig.cloneNode(true);
    addBtnOrig.parentNode.replaceChild(addBtn, addBtnOrig);
    addBtn.addEventListener("click", () => {
      const panel = document.querySelector("#contentAdminPanel");
      const isHidden = panel.classList.contains("hidden");
      if (isHidden) {
        resetContentForm();
        panel.classList.remove("hidden");
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
        addBtn.textContent = "✕ Fechar";
      } else {
        panel.classList.add("hidden");
        addBtn.innerHTML = '<span style="font-size:1.1rem;line-height:1;">＋</span> Adicionar';
      }
    });
  }
  // Bind cancel
  const cancelBtn = document.querySelector("#contentCancelBtn");
  if (cancelBtn && !cancelBtn._bound) {
    cancelBtn._bound = true;
    cancelBtn.addEventListener("click", () => {
      const panel = document.querySelector("#contentAdminPanel");
      const addBtn = document.querySelector("#contentAddBtn");
      panel.classList.add("hidden");
      if (addBtn) addBtn.innerHTML = '<span style="font-size:1.1rem;line-height:1;">＋</span> Adicionar';
      resetContentForm();
    });
  }
  // Sync color picker <-> text input
  const picker = document.querySelector("#contentColorPicker");
  const colorText = document.querySelector("#contentColor");
  if (picker && colorText && !picker._bound) {
    picker._bound = true;
    picker.addEventListener("input", () => { colorText.value = picker.value; });
    colorText.addEventListener("input", () => {
      if (/^#[0-9a-f]{6}$/i.test(colorText.value)) picker.value = colorText.value;
    });
  }
  // Bind verses counter
  const versesTA = document.querySelector("#contentVerses");
  if (versesTA && !versesTA._bound) {
    versesTA._bound = true;
    versesTA.addEventListener("input", updateVersesCount);
  }
  // Bind playlist URL preview
  const urlInput = document.querySelector("#contentPlaylistUrl");
  if (urlInput && !urlInput._bound) {
    urlInput._bound = true;
    let previewTimeout;
    urlInput.addEventListener("input", () => {
      clearTimeout(previewTimeout);
      previewTimeout = setTimeout(() => updatePlaylistPreview(urlInput.value), 800);
    });
  }
  // Bind type selector
  const typeSelect = document.querySelector("#contentType");
  if (typeSelect && !typeSelect._bound) {
    typeSelect._bound = true;
    typeSelect.addEventListener("change", updateContentFormFields);
  }
  // Bind form submit
  const form = document.querySelector("#contentManageForm");
  if (form && !form._bound) {
    form._bound = true;
    form.addEventListener("submit", saveContentItem);
  }
}

function updateVersesCount() {
  const ta = document.querySelector("#contentVerses");
  const counter = document.querySelector("#versesCount");
  if (!ta || !counter) return;
  const count = parsePlanVerses(ta.value).length;
  counter.textContent = count === 0 ? "0 versículos adicionados" : `${count} versículo${count > 1 ? "s" : ""} adicionado${count > 1 ? "s" : ""}`;
  counter.style.color = count > 0 ? "#10b981" : "var(--muted)";
}

function updatePlaylistPreview(url) {
  const preview = document.querySelector("#contentPlaylistPreview");
  const hint = document.querySelector("#contentUrlHint");
  if (!preview) return;
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");
    // Spotify
    if (host.includes("spotify.com") && (url.includes("/playlist/") || url.includes("/album/"))) {
      const parts = parsed.pathname.split("/").filter(Boolean);
      const id = parts[parts.length - 1];
      preview.style.display = "block";
      preview.innerHTML = `<iframe style="border-radius:12px;width:100%;height:152px;border:none;" src="https://open.spotify.com/embed/${parts[parts.length - 2]}/${id}?utm_source=generator&theme=0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
      if (hint) hint.textContent = "✓ Playlist do Spotify detectada";
      if (hint) hint.style.color = "#10b981";
      return;
    }
    // YouTube playlist
    if ((host.includes("youtube.com") || host === "youtu.be")) {
      const listId = parsed.searchParams.get("list");
      const videoId = parsed.searchParams.get("v") || (host === "youtu.be" ? parsed.pathname.slice(1) : null);
      const embedId = listId ? `videoseries?list=${listId}` : (videoId ? videoId : null);
      if (embedId) {
        preview.style.display = "block";
        preview.innerHTML = `<iframe style="border-radius:12px;width:100%;height:180px;border:none;" src="https://www.youtube.com/embed/${embedId}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
        if (hint) hint.textContent = "✓ Vídeo/playlist do YouTube detectado";
        if (hint) hint.style.color = "#10b981";
        return;
      }
    }
  } catch (e) { /* invalid URL */ }
  preview.style.display = "none";
  preview.innerHTML = "";
  if (hint) hint.textContent = "Cole um link do Spotify ou YouTube para ver a prévia.";
  if (hint) hint.style.color = "var(--muted)";
}

function updateContentFormFields() {
  const type = document.querySelector("#contentType")?.value || "playlists";
  const playlistFields = document.querySelector("#contentPlaylistFields");
  const planFields = document.querySelector("#contentPlanFields");
  if (playlistFields) playlistFields.style.display = type === "playlists" ? "grid" : "none";
  if (planFields) planFields.style.display = type === "planos" ? "grid" : "none";
  // Sync default emoji / color
  const emojiInput = document.querySelector("#contentEmoji");
  const colorInput = document.querySelector("#contentColor");
  const picker = document.querySelector("#contentColorPicker");
  if (emojiInput && !emojiInput.value) emojiInput.placeholder = type === "planos" ? "📖" : "🎵";
  const defaultColor = type === "planos" ? "#f59e0b" : "#2f73f8";
  if (colorInput && !colorInput.value) { colorInput.placeholder = defaultColor; }
  if (colorInput && colorInput.value && picker) picker.value = normalizeContentColor(colorInput.value, defaultColor);
}

function resetContentForm(clearMessage = true) {
  const form = document.querySelector("#contentManageForm");
  if (!form) return;
  form.reset();
  document.querySelector("#contentItemId").value = "";
  document.querySelector("#contentOriginalType").value = "";
  document.querySelector("#contentFormTitle").textContent = "✦ Adicionar conteúdo";
  document.querySelector("#contentCancelBtn").style.display = "none";
  const colorInput = document.querySelector("#contentColor");
  const picker = document.querySelector("#contentColorPicker");
  if (colorInput) colorInput.value = "#2f73f8";
  if (picker) picker.value = "#2f73f8";
  // Clear preview
  const preview = document.querySelector("#contentPlaylistPreview");
  if (preview) { preview.style.display = "none"; preview.innerHTML = ""; }
  const hint = document.querySelector("#contentUrlHint");
  if (hint) { hint.textContent = "Cole um link do Spotify ou YouTube para ver a prévia."; hint.style.color = "var(--muted)"; }
  // Clear verse counter
  const counter = document.querySelector("#versesCount");
  if (counter) { counter.textContent = "0 versículos adicionados"; counter.style.color = "var(--muted)"; }
  if (clearMessage) document.querySelector("#contentAdminMessage").textContent = "";
  updateContentFormFields();
}

function saveContentItem(event) {
  event.preventDefault();

  const type = document.querySelector("#contentType").value;
  const originalType = document.querySelector("#contentOriginalType").value;
  const id = document.querySelector("#contentItemId").value;
  const title = cleanContentText(document.querySelector("#contentTitle").value, 120);
  const text = cleanContentText(document.querySelector("#contentText").value, 180);
  const description = cleanContentText(document.querySelector("#contentDescription").value, 900);
  const emoji = cleanContentText(document.querySelector("#contentEmoji").value, 8) || (type === "planos" ? "📖" : "🎵");
  const color = normalizeContentColor(document.querySelector("#contentColor").value, type === "planos" ? "#f59e0b" : "#2f73f8");
  const message = document.querySelector("#contentAdminMessage");
  const existing = id ? getContentItemByType(originalType || type, id) : null;
  const itemId = id || `content_${Date.now()}`;
  const markOriginalAsDeleted = () => {
    if (id && originalType && originalType !== type) {
      saveItem(contentCollectionForType(originalType), { id, deleted: true, updatedAt: Date.now() });
    }
  };

  if (!title || !text || !description) {
    message.textContent = "Preencha título, chamada e descrição.";
    return;
  }

  if (type === "playlists") {
    const url = document.querySelector("#contentPlaylistUrl").value.trim();
    if (!isAcceptedPlaylistUrl(url)) {
      message.textContent = "Informe um link válido do Spotify ou YouTube.";
      return;
    }

    const tracks = Number(document.querySelector("#contentTracks").value) || 0;
    const duration = cleanContentText(document.querySelector("#contentDuration").value, 40);
    markOriginalAsDeleted();
    saveItem(CONTENT_COLLECTIONS.playlists, {
      ...existing,
      id: itemId,
      title,
      text,
      description,
      emoji,
      color,
      url,
      spotifyUrl: url.includes("spotify.com") ? url : "",
      youtubeUrl: url.includes("youtube.com") || url.includes("youtu.be") ? url : "",
      tracks,
      duration,
      progress: existing?.progress || 0,
      createdAt: existing?.createdAt || Date.now(),
      updatedAt: Date.now(),
      deleted: false,
    });
  } else {
    const verses = parsePlanVerses(document.querySelector("#contentVerses").value);
    const tag = cleanContentText(document.querySelector("#contentPlanTag").value, 60) || "Plano";
    if (!verses.length) {
      message.textContent = "Adicione ao menos um versículo do plano.";
      return;
    }

    markOriginalAsDeleted();
    saveItem(CONTENT_COLLECTIONS.planos, {
      ...existing,
      id: itemId,
      title,
      text,
      description,
      emoji,
      color,
      tag,
      verses,
      days: verses.length,
      progress: existing?.progress || 0,
      createdAt: existing?.createdAt || Date.now(),
      updatedAt: Date.now(),
      deleted: false,
    });
  }

  renderContent();
  resetContentForm(false);
  const verb = id ? "atualizado" : "cadastrado";
  message.textContent = `✓ Conteúdo ${verb} com sucesso!`;
  message.style.color = "#10b981";
  toast(`Conteúdo ${verb}! 🎉`, "success", 3000);
  // Close panel after 1.5s
  setTimeout(() => {
    const panel = document.querySelector("#contentAdminPanel");
    const addBtn = document.querySelector("#contentAddBtn");
    if (panel) panel.classList.add("hidden");
    if (addBtn) addBtn.innerHTML = '<span style="font-size:1.1rem;line-height:1;">＋</span> Adicionar';
  }, 1500);
}

function editContentItem(type, id) {
  const item = getContentItemByType(type, id);
  if (!item || !canManageContent()) return;

  const panel = document.querySelector("#contentAdminPanel");
  const addBtn = document.querySelector("#contentAddBtn");

  // Open panel
  if (panel) panel.classList.remove("hidden");
  if (addBtn) addBtn.innerHTML = '✕ Fechar';

  document.querySelector("#contentFormTitle").textContent = "✎ Editar conteúdo";
  document.querySelector("#contentItemId").value = item.id;
  document.querySelector("#contentOriginalType").value = type;
  document.querySelector("#contentType").value = type;
  document.querySelector("#contentTitle").value = item.title || "";
  document.querySelector("#contentText").value = item.text || "";
  document.querySelector("#contentDescription").value = item.description || "";
  document.querySelector("#contentEmoji").value = item.emoji || "";
  const color = normalizeContentColor(item.color, type === "planos" ? "#f59e0b" : "#2f73f8");
  document.querySelector("#contentColor").value = color;
  const picker = document.querySelector("#contentColorPicker");
  if (picker) picker.value = color;
  document.querySelector("#contentPlaylistUrl").value = getPlaylistUrl(item);
  document.querySelector("#contentTracks").value = item.tracks || "";
  document.querySelector("#contentDuration").value = item.duration || "";
  document.querySelector("#contentPlanTag").value = item.tag || "";
  document.querySelector("#contentVerses").value = formatPlanVersesInput(item);
  document.querySelector("#contentCancelBtn").style.display = "inline-flex";
  document.querySelector("#contentAdminMessage").textContent = "";
  updateContentFormFields();
  updateVersesCount();
  // Show playlist preview if editing playlist
  if (type === "playlists") {
    const url = getPlaylistUrl(item);
    if (url) updatePlaylistPreview(url);
  }
  panel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteContentItem(type, id) {
  const item = getContentItemByType(type, id);
  if (!item || !canManageContent()) return;

  showConfirm(`Remover "${item.title}"?`, () => {
    saveItem(contentCollectionForType(type), {
      ...item,
      id,
      deleted: true,
      updatedAt: Date.now(),
    });
    if (document.querySelector("#contentItemId")?.value === id) resetContentForm();
    renderContent();
    toast("Conteúdo removido.", "info", 3000);
  });
}

function canManageShop() {
  return ["lider", "admin", "pastor", "missionaria"].includes(currentUser.role);
}

function renderShop() {
  const isManager = canManageShop();
  
  const adminPanel = document.querySelector("#shopAdminPanel");
  if (adminPanel) {
    adminPanel.classList.toggle("hidden", !isManager);
  }

  document.querySelector("#shopGrid").innerHTML = getProducts()
    .map(
      (product) => {
        const styleArt = product.image 
          ? `background-image: url('${product.image}'); background-size: cover; background-position: center;` 
          : '';
          
        return `
          <article class="shop-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div class="shop-art" style="${styleArt}"></div>
            <div style="flex-grow: 1; margin-top: 12px;">
              <h3>${product.title}</h3>
              <p style="margin: 4px 0 8px; font-size: 0.88rem;">${product.text}</p>
              <small style="display: block; color: var(--muted); font-weight: 700;">Estoque: ${product.quantity ?? 0} un</small>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; width: 100%;">
              <strong>${product.price}</strong>
              ${isManager ? `
                <div style="display: flex; gap: 6px;">
                  <button class="ghost-button" type="button" data-edit-product="${product.id}" style="padding: 4px 8px; min-height: 28px; font-size: 0.75rem;">Editar</button>
                  <button class="ghost-button" type="button" data-delete-product="${product.id}" style="padding: 4px 8px; min-height: 28px; font-size: 0.75rem; color: #dc2626; border-color: #fca5a5; background: #fef2f2;">Remover</button>
                </div>
              ` : ""}
            </div>
          </article>
        `;
      }
    )
    .join("");
}

function renderCultStatus() {
  const status = getValue("next_cult_status", "inativo");
  const readable = status === "inativo" ? "Culto Inativo" : status;
  
  const statusText = {
    inativo: "Quando a liderança iniciar o culto, acompanhe os estágios por aqui.",
    Louvor: "A juventude está adorando! 🎶",
    "Pregação": "Momento da palavra. Pegue sua bíblia! 📖",
    Apelo: "Momento de oração e resposta à palavra. 🙏",
    Finalizado: "O culto de hoje encerrou. Uma ótima semana! ✨",
  };

  const icons = {
    Louvor: "🎵",
    "Pregação": "📖",
    Apelo: "🙏",
    Finalizado: "✅"
  };

  document.querySelector("#currentStage").textContent = readable;
  document.querySelector(".sidebar-footer span:last-child").textContent = 
    status === "inativo" || status === "Finalizado" ? "Culto Next inativo" : "Culto Next ativo";
  
  document.querySelector("#cultStatusTitle").textContent = readable;
  document.querySelector("#cultStatusText").textContent = statusText[status] || statusText.inativo;
  document.querySelector("#cultRoleHint").textContent = canManage() ? "Controle Liderança" : "Somente leitura";

  const timelineStages = cultStages.filter(s => s !== "inativo");
  const currentIndex = timelineStages.indexOf(status);
  
  document.querySelector("#cultTimelineContainer").innerHTML = timelineStages.map((stage, index) => {
    let stateClass = "";
    if (status === "Finalizado") {
      stateClass = "done";
    } else if (index < currentIndex) {
      stateClass = "done";
    } else if (index === currentIndex) {
      stateClass = "active";
    }
    
    return `
      <div class="timeline-step ${stateClass}">
        <div class="step-icon">${stateClass === "done" ? "✓" : icons[stage]}</div>
        <h4>${stage}</h4>
      </div>
    `;
  }).join("");

  const controlsContainer = document.querySelector("#cultStatusOptions");
  if (canManage()) {
    controlsContainer.style.display = "grid";
    controlsContainer.innerHTML = `<p class="eyebrow" style="text-align: center;">Painel de Controle</p>` + 
      cultStages.map((stage) => `
        <button class="status-option ${stage === status ? "active" : ""}" type="button" data-stage="${stage}">
          Marcar como: ${stage === "inativo" ? "Inativo" : stage}
        </button>
      `).join("");
  } else {
    controlsContainer.style.display = "none";
  }
}

function leaderAvatarHtml(name, className = "leader-avatar") {
  const photo = leaderPhotos[name];
  if (photo) {
    return `<span class="${className} has-photo" aria-hidden="true"><img src="${photo}" alt="" /></span>`;
  }
  return `<span class="${className}">${initials(name)}</span>`;
}

function renderChatContacts() {
  const listEl = document.querySelector("#leaderList");
  if (!listEl) return;

  const isLeader = ["lider", "pastor", "missionaria", "admin"].includes(currentUser.role);
  
  document.querySelector("#chatListEyebrow").textContent = isLeader ? "Nova conversa" : "Escolha alguém";
  document.querySelector("#chatListTitle").textContent = isLeader ? "Jovens do Next" : "Líderes disponíveis";
  
  let contactsHTML = "";

  if (!isLeader) {
     const filteredLeaders = leaderNames.filter(name => name.toLowerCase().includes(chatSearchTerm));
     if (!chatTargetName && filteredLeaders.length > 0) {
         chatTargetName = filteredLeaders[0];
         chatTargetId = currentUser.id;
     }
     contactsHTML = filteredLeaders.map(leader => {
        const active = leader === chatTargetName ? "active" : "";
        return `
          <button class="leader-item ${active}" type="button" data-chat-target="true" data-chat-name="${leader}" data-chat-id="${currentUser.id}">
            ${leaderAvatarHtml(leader)}
            <span class="leader-label"><strong>${leader}</strong></span>
          </button>
        `;
     }).join("");
  } else {
     const jovens = getUsers().filter(u => u.role === "jovem" && u.name.toLowerCase().includes(chatSearchTerm));
     if (!chatTargetId && jovens.length > 0) {
         chatTargetName = jovens[0].name;
         chatTargetId = jovens[0].id;
     }
     contactsHTML = jovens.map(jovem => {
        const active = jovem.id === chatTargetId ? "active" : "";
        const shortName = getProfileInitials(jovem.name);
        return `
          <button class="leader-item ${active}" type="button" data-chat-target="true" data-chat-name="${jovem.name}" data-chat-id="${jovem.id}">
            <span class="leader-avatar">${shortName}</span>
            <span class="leader-label"><strong>${jovem.name}</strong></span>
          </button>
        `;
     }).join("");
  }

  listEl.innerHTML = contactsHTML || `<p class="safety-note">Nenhum contato encontrado.</p>`;
}

function scrollChatToBottom(windowEl, force = false) {
  if (!windowEl) return;
  const isNearBottom = windowEl.scrollHeight - windowEl.scrollTop - windowEl.clientHeight < 80;
  if (force || isNearBottom) {
    windowEl.scrollTop = windowEl.scrollHeight;
  }
}

function renderYoungChat() {
  const chatWindow = document.querySelector("#chatWindow");
  if (!chatWindow) return;

  const isLeader = ["lider", "pastor", "missionaria", "admin"].includes(currentUser.role);
  
  const anonToggle = document.querySelector(".anon-toggle");
  if (anonToggle) anonToggle.style.display = isLeader ? "none" : "flex";

  let targetLeaderName;
  if (isLeader) {
    targetLeaderName = leaderNames.find(n =>
      currentUser.name.toLowerCase().includes(n.toLowerCase())
    ) || currentUser.name;
  } else {
    targetLeaderName = chatTargetName;
  }
  const targetUserId = isLeader ? chatTargetId : currentUser.id;

  const threadId = threadIdFor(targetLeaderName, targetUserId);

  const messages = getMessages()
    .filter((m) => m.threadId === threadId)
    .map(m => ({ ...m, createdAt: Number(m.createdAt) || 0 })) // ← normaliza tipo
    .sort((a, b) => a.createdAt - b.createdAt);

  document.querySelector("#chatLeaderName").textContent = chatTargetName || "Selecione alguém";
  
  const chatAvatar = document.querySelector("#chatLeaderAvatar");
  if (chatAvatar && chatTargetName) {
    if (isLeader) {
       chatAvatar.innerHTML = getProfileInitials(chatTargetName);
       chatAvatar.classList.remove("has-photo");
    } else {
       chatAvatar.innerHTML = leaderPhotos[chatTargetName]
         ? `<img src="${leaderPhotos[chatTargetName]}" alt="" />`
         : initials(chatTargetName);
       chatAvatar.classList.toggle("has-photo", Boolean(leaderPhotos[chatTargetName]));
    }
  }

  chatWindow.innerHTML = messages.length
    ? messages
        .map((message) => {
          const isMine = message.senderId === currentUser.id;
          return `
            <div class="chat-bubble ${isMine ? "young" : "leader"}">
              <strong>${senderLabel(message)}</strong><br>
              ${message.text}
            </div>
          `;
        })
        .join("")
    : `<div class="chat-bubble system">Inicie a conversa enviando uma mensagem.</div>`;

  scrollChatToBottom(chatWindow);
}

let currentGroupId = "Geral";
const groupNames = {
  "Geral": "Geral (Todos os Servos)",
  "Servo": "Equipe de Apoio (Servos)",
  "Midia": "Equipe de Mídia",
  "Intercessao": "Equipe de Intercessão"
};

function renderGroupList() {
  const listEl = document.querySelector("#groupList");
  if (!listEl) return;

  const today = new Date().getDate();
  const cultStatus = getValue("next_cult_status", "inativo");
  const allScales = getAll("next_scales", []);
  const events = getEvents();

  let myGroups = [];
  let isAnyEventValid = false;

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), Number(e.date));
    const diffMs = eventDate - todayDate;
    const diffDays = Math.round(diffMs / 86400000);

    if (diffDays === 0 && cultStatus === "Finalizado") return false;
    return diffDays >= 0 && diffDays <= 7;
  });

  if (upcomingEvents.length > 0) {
    if (canManage()) {
      myGroups = ["Geral", "Servo", "Midia", "Intercessao"];
      isAnyEventValid = true;
    } else {
      const myUpcomingScales = allScales.filter(scale => {
        const isUpcoming = upcomingEvents.some(e => e.id === scale.eventId);
        const isAssigned = scale.assignments.some(a => a.userId === currentUser.id);
        return isUpcoming && isAssigned;
      });

      if (myUpcomingScales.length > 0) {
        myGroups = ["Geral"];
        myUpcomingScales.forEach(scale => {
          if (!myGroups.includes(scale.dept)) myGroups.push(scale.dept);
        });
        isAnyEventValid = true;
      }
    }
  }

  const formInput = document.querySelector("#groupChatInput");
  const submitBtn = document.querySelector("#groupChatForm button");

  if (!isAnyEventValid || myGroups.length === 0) {
     listEl.innerHTML = `<p class="safety-note" style="margin-top: 0;">Nenhum grupo ativo. Os chats abrem 1 semana antes do culto exclusivamente para a equipe escalada e somem após o encerramento.</p>`;
     if (formInput) formInput.disabled = true;
     if (submitBtn) submitBtn.disabled = true;
     currentGroupId = null;
     renderGroupChat(); 
     return;
  }

  if (!myGroups.includes(currentGroupId)) {
     currentGroupId = myGroups[0];
  }

  if (formInput) formInput.disabled = false;
  if (submitBtn) submitBtn.disabled = false;

  listEl.innerHTML = myGroups.map(groupId => {
    const active = groupId === currentGroupId ? "active" : "";
    return `
      <button class="leader-item ${active}" type="button" data-group-target="${groupId}">
        <span class="leader-avatar" style="background: var(--blue);">#</span>
        <span class="leader-label"><strong>${groupNames[groupId]}</strong></span>
      </button>
    `;
  }).join("");
}

function renderGroupChat() {
  const windowEl = document.querySelector("#groupChatWindow");
  const banner = document.querySelector("#pinnedMessageBanner");
  const titleEl = document.querySelector("#groupChatTitle");
  
  if (!windowEl) return;

  if (!currentGroupId) {
     windowEl.innerHTML = `<div class="chat-bubble system">Chat encerrado ou indisponível. Ele abre 1 semana antes do culto para quem está escalado.</div>`;
     if (banner) banner.style.display = "none";
     if (titleEl) titleEl.textContent = "Equipe Offline";
     return;
  }

  if (titleEl) titleEl.textContent = groupNames[currentGroupId];

  const allMsgs = getAll("next_group_messages", []).filter(m => m.groupId === currentGroupId);
  const orderedMsgs = allMsgs
  .map(m => ({ ...m, createdAt: Number(m.createdAt) || 0 })) // ← normaliza tipo
  .sort((a, b) => a.createdAt - b.createdAt);
  
  const pinnedMsgs = orderedMsgs.filter(m => m.isPinned);
  const latestPinned = pinnedMsgs.length > 0 ? pinnedMsgs[pinnedMsgs.length - 1] : null;
  
  const bannerText = document.querySelector("#pinnedMessageText");
  
  if (latestPinned && banner && bannerText) {
    banner.style.display = "block";
    bannerText.textContent = `${latestPinned.senderName}: "${latestPinned.text}"`;
  } else if (banner) {
    banner.style.display = "none";
  }

  const isLeader = canManage();

  windowEl.innerHTML = orderedMsgs.length ? orderedMsgs.map(msg => {
    const isMine = msg.senderId === currentUser.id;
    const pinBtn = isLeader ? `<span data-pin-msg="${msg.id}" style="cursor:pointer; font-size: 0.8rem; margin-left: 8px; opacity: 0.6;" title="Fixar/Desfixar Aviso">📌</span>` : '';
    
    return `
      <div class="chat-bubble ${isMine ? "young" : "leader"}" style="${msg.isPinned ? 'border: 2px solid var(--blue);' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
          <strong>${isMine ? "Você" : msg.senderName} <span style="font-size:0.7rem; opacity:0.7; font-weight:normal;">(${roleLabels[msg.senderRole] || 'Servo'})</span></strong>
          ${pinBtn}
        </div>
        ${msg.text}
      </div>
    `;
  }).join("") : `<div class="chat-bubble system">Nenhuma mensagem neste grupo ainda. Mande um aviso!</div>`;

  scrollChatToBottom(windowEl);
}

function saveGroupMessage(text) {
  if (!text) return;
  saveItem("next_group_messages", {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    groupId: currentGroupId,
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderRole: currentUser.role,
    text: text,
    isPinned: false,
    createdAt: Date.now()
  });
}

function togglePinMessage(msgId) {
  const msgs = getAll("next_group_messages", []);
  const msg = msgs.find(m => m.id === msgId);
  if (!msg) return;
  
  msgs.forEach(m => { if (m.groupId === msg.groupId) m.isPinned = false; });
  msg.isPinned = !msg.isPinned;
  
  saveItem("next_group_messages", msg);
  renderGroupChat();
}

function saveYoungMessage(text) {
  if (!chatTargetName || !chatTargetId) return;

  const isLeader = ["lider", "pastor", "missionaria", "admin"].includes(currentUser.role);
  const anonymous = isLeader ? false : (document.querySelector("#anonymousChat")?.checked || false);

  const leaderCanonicalName = isLeader
    ? (leaderNames.find(n => currentUser.name.toLowerCase().includes(n.toLowerCase())) || currentUser.name)
    : chatTargetName;
  const targetLeaderName = leaderCanonicalName;
  const targetUserId = isLeader ? chatTargetId : currentUser.id;

  saveItem("next_messages", {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    threadId: threadIdFor(targetLeaderName, targetUserId),
    leaderName: targetLeaderName,
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderRole: currentUser.role,
    anonymous,
    text,
    createdAt: Date.now(),
  });
}

function renderRoleAdminOptions() {
  const users = getUsers();
  const selectEl = document.querySelector("#userToChangeRole");
  if (!selectEl) return;
  selectEl.innerHTML = users
    .map((user) => `<option value="${user.id}">${user.name} (${roleLabels[user.role] || "Jovem"})</option>`)
    .join("");
}

function changeUserRole(event) {
  event.preventDefault();
  const userId = document.querySelector("#userToChangeRole").value;
  const newRole = document.querySelector("#newUserRole").value;
  const user = getUsers().find((item) => item.id === userId);
  
  if (!user) return;

  saveItem("next_users", { ...user, role: newRole });
  document.querySelector("#roleChangeMessage").textContent = `Cargo de ${user.name} atualizado com sucesso!`;
  renderRoleAdminOptions();
}

function leaderIdFor(leaderName) {
  const allUsers = authApi?.getMockUsers?.() || [];
  const leader = allUsers.find(u =>
    u.name.toLowerCase() === leaderName.toLowerCase() ||
    leaderName.toLowerCase().includes(u.name.toLowerCase())
  );
  return leader ? leader.id : slug(leaderName); // fallback para nome caso não ache
}

function threadIdFor(leaderName, userId = currentUser.id) {
  return `chat:${userId}:${leaderIdFor(leaderName)}`;
}

function canSeeThread(message) {
  if (["lider", "pastor", "missionaria"].includes(currentUser.role)) {
    const canonical = leaderNames.find(n =>
      currentUser.name.toLowerCase().includes(n.toLowerCase())
    ) || currentUser.name;
    return message.leaderName === canonical || message.leaderName === currentUser.name;
  }
  return message.senderId === currentUser.id;
}

function messagesForYoungLeader(leaderName) {
  const threadId = threadIdFor(leaderName);
  return getMessages()
    .filter((message) => message.threadId === threadId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

function senderLabel(message) {
  if (message.senderId === currentUser.id) return "Você";
  if (message.anonymous && canManageAll()) return `Anônimo (auditoria: ${message.senderName})`;
  if (message.anonymous) return "Anônimo";
  return message.senderName || message.leaderName || "Mensagem";
}

function groupedThreads() {
  const groups = new Map();
  getMessages()
    .filter(canSeeThread)
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((message) => {
      if (!groups.has(message.threadId)) {
        groups.set(message.threadId, {
          threadId: message.threadId,
          leaderName: message.leaderName,
          latest: message,
          messages: [],
        });
      }
      groups.get(message.threadId).messages.push(message);
    });
  return [...groups.values()];
}

function threadParticipantLabel(thread) {
  const youthMessage = getMessages()
    .filter((message) => message.threadId === thread.threadId)
    .find((message) => !["lider", "pastor", "missionaria"].includes(message.senderRole));
  if (!youthMessage) return senderLabel(thread.latest);
  return senderLabel(youthMessage);
}

function renderLeaderInbox() {
  const threads = groupedThreads();
  const threadList = document.querySelector("#threadList");
  if (!selectedThreadId && threads[0]) selectedThreadId = threads[0].threadId;

  threadList.innerHTML = threads.length
    ? threads
        .map((thread) => {
          const participant = threadParticipantLabel(thread);
          return `
            <button class="leader-item ${thread.threadId === selectedThreadId ? "active" : ""}" type="button" data-thread="${thread.threadId}">
              <span class="leader-avatar">${initials(participant)}</span>
              <span>
                <strong>${participant}</strong>
                <span>Para ${thread.leaderName} · ${thread.messages.length} msg</span>
              </span>
            </button>
          `;
        })
        .join("")
    : `<div class="chat-bubble system">Nenhuma mensagem recebida ainda.</div>`;

  renderSelectedThread();
}

function renderSelectedThread() {
  const threads = groupedThreads();
  const thread = threads.find((item) => item.threadId === selectedThreadId);
  const windowEl = document.querySelector("#leaderChatWindow");
  const title = document.querySelector("#threadTitle");
  const meta = document.querySelector("#threadMeta");

  if (!thread) {
    title.textContent = "Selecione uma conversa";
    meta.textContent = "0 mensagens";
    windowEl.innerHTML = `<div class="chat-bubble leader">As conversas dos jovens aparecem aqui.</div>`;
    return;
  }

  const orderedMessages = getMessages()
    .filter((message) => message.threadId === thread.threadId)
    .sort((a, b) => a.createdAt - b.createdAt);

  title.textContent = `Conversa com ${threadParticipantLabel(thread)}`;
  meta.textContent = `${orderedMessages.length} mensagens`;
  windowEl.innerHTML = orderedMessages
    .map((message) => {
      const isMine = message.senderId === currentUser.id;
      return `
        <div class="chat-bubble ${isMine ? "young" : "leader"}">
          <strong>${senderLabel(message)}</strong><br>
          ${message.text}
        </div>
      `;
    })
    .join("");

  scrollChatToBottom(windowEl);
}

function saveLeaderReply(text) {
  const thread = groupedThreads().find((item) => item.threadId === selectedThreadId);
  if (!thread) return;

  saveItem("next_messages", {
    id: `msg_${Date.now()}`,
    threadId: thread.threadId,
    leaderName: thread.leaderName,
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderRole: currentUser.role,
    anonymous: false,
    text,
    createdAt: Date.now(),
  });
}

function getBaseProfile() {
  return {
    name: currentUser.name || "Jovem Next",
    age: currentUser.age || "",
    birthday: currentUser.birthday || "",
    phone: currentUser.phone || "",
    responsible: currentUser.responsible || "",
    role: roleLabels[currentUser.role] || "Membro Next",
    photo: currentUser.photo || "",
    city: currentUser.city || "",
  };
}

function getProfileFromStorage() {
  try {
    const localProfile = JSON.parse(localStorage.getItem(profileStorageKey)) || {};
    // Se tiver foto/nome no currentUser (vindos do Supabase no login), usa também
    const fromSession = {
      name: currentUser.name || "",
      photo: currentUser.photo || "",
      age: currentUser.age || "",
      phone: currentUser.phone || "",
      birthday: currentUser.birthday || "",
      responsible: currentUser.responsible || "",
      city: currentUser.city || "",
    };
    return { ...getBaseProfile(), ...fromSession, ...localProfile };
  } catch {
    return getBaseProfile();
  }
}

function getProfileInitials(name) {
  return initials(name || currentUser.name);
}

function applyProfile(profile) {
  const name = profile.name || currentUser.name || "Jovem Next";
  const age = profile.age ? `${profile.age} anos` : "13 a 17 anos";
  const role = profile.role || roleLabels[currentUser.role] || "Membro Next";
  const shortName = getProfileInitials(name);
  // Se não há foto salva mas o usuário é líder com foto mapeada, usa a foto do mapa
  const mappedPhoto = leaderPhotos[currentUser.name] || 
    leaderPhotos[leaderNames.find(n => currentUser.name?.toLowerCase().includes(n.toLowerCase()))];
  const effectivePhoto = profile.photo || mappedPhoto || "";
  const settingsAvatar = document.querySelector("#settingsAvatar");
  const profilePill = document.querySelector(".profile-pill");

  document.querySelector("#settingsPreviewName").textContent = name;
  document.querySelector("#settingsPreviewMeta").textContent = `${age} | ${role}`;
  settingsAvatar.textContent = shortName;
  profilePill.querySelector("span").textContent = shortName;

  // Troque o bloco if/else de foto por:
  if (effectivePhoto) {
    settingsAvatar.style.backgroundImage = `url("${effectivePhoto}")`;
    profilePill.style.backgroundImage = `url("${effectivePhoto}")`;
    settingsAvatar.classList.add("has-photo");
    profilePill.classList.add("has-photo");
  } else {
    settingsAvatar.style.backgroundImage = "";
    profilePill.style.backgroundImage = "";
    settingsAvatar.classList.remove("has-photo");
    profilePill.classList.remove("has-photo");
  }
}

function fillProfileForm(profile) {
  document.querySelector("#profileName").value = profile.name || currentUser.name || "";
  document.querySelector("#profileAge").value = profile.age || "";
  document.querySelector("#profileBirthday").value = profile.birthday || "";
  document.querySelector("#profilePhone").value = profile.phone || "";
  
  const respGroup = document.querySelector("#responsibleFieldGroup");
  const respInput = document.querySelector("#profileResponsible");
  
  if (respGroup && respInput) {
    const hiddenRoles = ["admin", "lider", "pastor", "missionaria"];
    
    if (hiddenRoles.includes(currentUser.role)) {
      respGroup.style.display = "none";
    } else if (currentUser.role === "responsavel") {
      respGroup.style.display = "grid";
      respGroup.childNodes[0].textContent = "Responsável por";
      respInput.placeholder = "Nome do filho / jovem";
      respInput.value = profile.responsible || "";
    } else {
      respGroup.style.display = "grid";
      respGroup.childNodes[0].textContent = "Responsável";
      respInput.placeholder = "Nome do responsável";
      respInput.value = profile.responsible || "";
    }
  }

  document.querySelector("#profileRole").value = profile.role || roleLabels[currentUser.role] || "Membro Next";
  const citySelect = document.querySelector("#profileCity");
  if (citySelect) citySelect.value = profile.city || "";
  profilePhotoData = profile.photo || "";
  applyProfile(profile);
}

function saveProfile(event) {
  event.preventDefault();
  const profile = {
    name: document.querySelector("#profileName").value.trim(),
    age: document.querySelector("#profileAge").value,
    birthday: document.querySelector("#profileBirthday").value,
    phone: document.querySelector("#profilePhone").value.trim(),
    responsible: document.querySelector("#profileResponsible").value.trim(),
    role: document.querySelector("#profileRole").value.trim() || roleLabels[currentUser.role],
    photo: profilePhotoData,
    city: document.querySelector("#profileCity")?.value || "",
    };

  localStorage.setItem(profileStorageKey, JSON.stringify(profile));
  authApi?.updateSession(profile);
  localStorage.setItem(profileStorageKey, JSON.stringify(profile));
  authApi?.updateSession(profile);

  // Salva no banco (local + nuvem via NextDB.save)
  const existingUser = dbApi?.getOne("next_users", currentUser.id) || currentUser;
  const updatedUser = { ...existingUser, ...profile, id: currentUser.id };
  saveItem("next_users", updatedUser);

  // Se Supabase estiver ativo, persiste foto e nome na nuvem
  if (typeof supabaseClient !== 'undefined' && supabaseClient && !USE_MOCK_DB) {
    supabaseClient
      .from('next_users')
      .upsert({ id: currentUser.id, name: profile.name, photo: profile.photo, phone: profile.phone, age: profile.age, birthday: profile.birthday })
      .then(({ error }) => {
        if (error) console.error('Erro ao salvar perfil na nuvem:', error.message);
      });
  }

  applyProfile(profile);
  document.querySelector("#profileMessage").textContent =
    USE_MOCK_DB ? "Perfil salvo neste navegador." : "Perfil salvo na nuvem! ✓";
  }


function renderEventAudienceOptions() {
  const options = [
    ["geral", "Geral (jovens e responsaveis)"],
    ["jovens", "Somente jovens"],
    ["responsaveis", "Somente responsaveis"],
    ["servos", "Somente servos"],
  ];
  if (canManageAll()) options.push(["lideres", "Somente lideres"]);

  document.querySelector("#eventAudience").innerHTML = options
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");
}

function renderServoOptions() {
  if (!canSeeServantStatus()) return;
  const jovens = getUsers().filter((user) => user.role === "jovem");
  const selectEl = document.querySelector("#servoUser");
  if (!selectEl) return;
  selectEl.innerHTML = jovens
    .map((user) => {
       const typeStr = user.hasServo ? ` - Ativo (${formatServoType(user.servoType)})` : "";
       return `<option value="${user.id}">${user.name}${typeStr}</option>`;
    })
    .join("");
}

function giveServoRole(event) {
  event.preventDefault();
  const userId = document.querySelector("#servoUser").value;
  const user = getUsers().find((item) => item.id === userId);
  if (!user) return;

  const checks = Array.from(document.querySelectorAll(".servo-dept-check"));
  const types = [];
  checks.forEach(c => {
    if (c.checked || c.value === "Servo") types.push(c.value);
  });

  saveItem("next_users", { ...user, hasServo: true, servoType: types });
  document.querySelector("#servoMessage").textContent = `${user.name} atualizado como ${formatServoType(types)}.`;
  renderServoOptions();
}

function renderPrayerAdminList() {
  const prayers = getPrayers().slice(0, 20);
  const list = document.querySelector("#prayerAdminList");
  if (!list) return;

  if (!prayers.length) {
    list.innerHTML = `<p class="safety-note">Nenhum pedido de oração recebido ainda.</p>`;
    return;
  }

  list.innerHTML = prayers.map((prayer) => {
    const displayName = prayer.anonymous && !canManageAll() ? "Anônimo" : prayer.senderName;
    const hasReply = prayer.reply;
    const canReply = canManage() && prayer.wantsReply;

    return `
      <article class="admin-list-item" style="gap: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: start; gap: 8px;">
          <strong>${displayName}</strong>
          <span class="small-badge">${prayer.wantsReply ? "Quer resposta" : "Sem resposta"}</span>
        </div>
        <p>${prayer.text}</p>
        ${hasReply ? `
          <div style="background: rgba(47,115,248,0.07); border-left: 3px solid var(--blue); padding: 8px 12px; border-radius: 0 6px 6px 0; margin-top: 4px;">
            <span class="eyebrow" style="color: var(--blue);">Resposta da liderança</span>
            <p style="margin: 4px 0 0; font-size: 0.9rem;">${prayer.reply}</p>
          </div>
        ` : ""}
        ${canReply ? `
          <div style="display: flex; gap: 8px; margin-top: 6px;">
            <input type="text"
              id="reply-${prayer.id}"
              placeholder="Escreva uma resposta..."
              style="flex: 1; min-height: 40px; font-size: 0.88rem; padding: 8px 10px;"
            />
            <button
              class="primary-button compact"
              type="button"
              data-reply-prayer="${prayer.id}"
              style="min-height: 40px; padding: 0 14px; font-size: 0.85rem;">
              Responder
            </button>
          </div>
        ` : ""}
      </article>
    `;
  }).join("");
}

// Painel de confirmação semanal de células (visível para líderes na aba Gestão)
function renderCellWeekPanel() {
  const container = document.querySelector('#cellWeekPanel');
  if (!container) return;
  if (!canManage()) { container.style.display = 'none'; return; }

  const cells = (window.NEXT_CELLS || []).filter(cell => {
    // Mostra apenas as células cujos líderes incluem o usuário logado (ou todas para admin/pastor)
    if (canManageAll()) return true;
    return cell.leaders.some(l => l.toLowerCase().includes(currentUser.name.toLowerCase()));
  });

  if (!cells.length) {
    container.innerHTML = '<p class="safety-note">Nenhuma célula vinculada ao seu perfil.</p>';
    return;
  }

  const confirmations = getCellConfirmations();
  const today = new Date();
  const thisWeekKey = getIsoWeekKey(today);

  container.style.display = 'block';
  container.innerHTML = cells.map(cell => {
    const confirmedWeek = confirmations[cell.id];
    const nextAllowed   = confirmedWeek ? shiftWeekKey(confirmedWeek, 1) : thisWeekKey;
    const alreadyDone   = confirmedWeek === thisWeekKey;
    const isBlocked     = !alreadyDone && nextAllowed > thisWeekKey;

    // Data da próxima ocorrência desta célula
    const nextDate = getUnlockedCellDate(cell.id, cell.weekdayNum);
    const dateLabel = nextDate
      ? nextDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
      : 'Aguardando confirmação da semana anterior';

    let statusBadge = '';
    let actionHtml  = '';

    if (alreadyDone) {
      statusBadge = `<span class="small-badge" style="background:rgba(16,185,129,0.12);color:#065f46;border:1px solid rgba(16,185,129,0.3);">✓ Confirmada</span>`;
      actionHtml  = `<p style="font-size:0.82rem;color:var(--muted);margin-top:6px;">Próxima: ${dateLabel}</p>`;
    } else if (isBlocked) {
      statusBadge = `<span class="small-badge" style="background:rgba(220,38,38,0.1);color:#b91c1c;border:1px solid rgba(220,38,38,0.2);">Bloqueada</span>`;
      actionHtml  = `<p style="font-size:0.82rem;color:var(--muted);margin-top:6px;">Confirme a semana atual para desbloquear a próxima.</p>`;
    } else {
      statusBadge = `<span class="small-badge" style="background:rgba(251,191,36,0.12);color:#b45309;border:1px solid rgba(251,191,36,0.3);">Pendente</span>`;
      actionHtml  = `
        <p style="font-size:0.82rem;color:var(--muted);margin-top:4px;">Próximo encontro: <strong>${dateLabel}</strong></p>
        <button class="primary-button compact btn-confirm-cell-week" data-cell-id="${cell.id}" type="button"
          style="margin-top:10px;font-size:0.82rem;min-height:36px;width:100%;">
          ✓ Confirmar célula desta semana
        </button>
      `;
    }

    return `
      <article class="admin-list-item" style="gap:8px;">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:8px;">
          <div>
            <strong style="font-size:1.05rem;">${cell.name}</strong>
            <span style="display:block;font-size:0.8rem;color:var(--blue);font-weight:800;text-transform:uppercase;">
              ${cell.day} às ${cell.time} · ${cell.location}
            </span>
          </div>
          ${statusBadge}
        </div>
        ${actionHtml}
      </article>
    `;
  }).join('');
}

function renderApplicationsList() {
  const list = document.querySelector("#applicationsAdminList");
  if (!list) return;
  
  // Puxa as inscrições que ainda não foram resolvidas
  const apps = getAll("next_applications", []).filter(a => a.status === "pending");

  list.innerHTML = apps.length
    ? apps.map(app => `
        <article class="admin-list-item" style="gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <strong style="font-size: 1.05rem;">${app.userName}</strong>
              <span style="display: block; font-size: 0.8rem; color: var(--blue); font-weight: 800; text-transform: uppercase;">Deseja: ${app.dept}</span>
            </div>
            <span class="small-badge">${app.userAge}</span>
          </div>
          <p style="font-size: 0.85rem;"><strong>Motivo:</strong> ${app.reason}</p>
          <p style="font-size: 0.85rem; margin-top: 0;"><strong>Batizado:</strong> ${app.isBaptized} | <strong>Fundamentos:</strong> ${app.hasFundamentals}</p>
          <div style="display: flex; gap: 8px; margin-top: 6px;">
            <button class="primary-button compact btn-approve-app" data-app-id="${app.id}" type="button" style="flex: 1; font-size: 0.8rem; min-height: 36px; padding: 0;">Adicionar à Equipe</button>
            <button class="ghost-button btn-discuss-app" data-app-id="${app.id}" type="button" style="flex: 1; font-size: 0.8rem; min-height: 36px; padding: 0;">Marcar Conversa</button>
          </div>
        </article>
      `).join("")
    : `<p class="safety-note">Nenhuma inscrição pendente no momento.</p>`;
}

function renderAdminLists() {
  if (!canManage()) return;
  renderEventAudienceOptions();
  renderServoOptions();
  renderPrayerAdminList();
  renderApplicationsList();
  renderCellPendingList();
  renderCellWeekPanel();
  renderJourneyApprovalList();
  if (canManageAll()) renderRoleAdminOptions();
}

function renderCellPendingList() {
  const container = document.querySelector("#cellPendingAdminList");
  if (!container) return;

  const interests = dbApi?.getAll("next_cell_interests") || [];
  const pending = interests.filter(i => i.status === "pending");

  if (!pending.length) {
    container.innerHTML = "<p class='safety-note'>Nenhum jovem aguardando confirmação de célula.</p>";
    return;
  }

  const cells = window.NEXT_CELLS || [];

  container.innerHTML = pending.map(item => {
    const cell = cells.find(c => c.id === item.cellId);
    return `
      <article class="admin-list-item" style="gap:8px;">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:8px;">
          <div>
            <strong style="font-size:1.05rem;">${item.userName}</strong>
            <span style="display:block;font-size:0.8rem;color:var(--blue);font-weight:800;text-transform:uppercase;">
              ${item.cellName} · ${item.userCity || "Cidade não informada"}
            </span>
          </div>
          <span class="small-badge" style="background:rgba(251,191,36,0.12);color:#b45309;border:1px solid rgba(251,191,36,0.3);">
            Pendente
          </span>
        </div>
        ${cell ? `<p style="font-size:0.82rem;color:var(--muted);">📅 ${cell.day} às ${cell.time} · 📍 ${cell.location}</p>` : ""}
        <div class="btn-row">
          <button class="primary-button compact btn-confirm-cell" data-interest-id="${item.id}" data-user-name="${item.userName}" type="button">
            Confirmar presença
          </button>
          <button class="ghost-button btn-contact-cell" data-interest-id="${item.id}" data-user-id="${item.userId}" data-user-name="${item.userName}" type="button">
            Entrar em contato
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function savePost(event) {
  event.preventDefault();
  const title = document.querySelector("#postTitle").value.trim();
  const text = document.querySelector("#postText").value.trim();
  if (!title || !text) return;

  saveItem("next_posts", {
    id: `p_${Date.now()}`,
    tag: document.querySelector("#postTag").value.trim() || "Aviso",
    title,
    text,
    time: "agora",
    createdAt: Date.now(),
  });

  event.currentTarget.reset();
  document.querySelector("#postMessage").textContent = "Aviso publicado no feed.";
  renderFeed();
}

function saveEvent(event) {
  event.preventDefault();
  const day = document.querySelector("#eventDate").value;
  const title = document.querySelector("#eventTitle").value.trim();
  if (!day || !title) return;

  saveItem("next_events", {
    id: `e_${Date.now()}`,
    date: String(Number(day)),
    month: currentMonthName(),
    weekDay: weekDayForDate(day),
    time: document.querySelector("#eventTime").value.trim() || "--",
    title,
    text: document.querySelector("#eventDetail").value.trim() || title,
    detail: document.querySelector("#eventDetail").value.trim() || title,
    location: "AD Fonte de Vida",
    audience: document.querySelector("#eventAudience").value,
  });

  event.currentTarget.reset();
  renderEventAudienceOptions();
  document.querySelector("#eventMessage").textContent = "Evento adicionado na agenda.";
  renderCalendar();
}

function saveProduct(event) {
  event.preventDefault();
  const title = document.querySelector("#productTitle").value.trim();
  if (!title) return;

  saveItem("next_products", {
    id: `prod_${Date.now()}`,
    title,
    text: document.querySelector("#productText").value.trim() || "Produto Next.",
    price: document.querySelector("#productPrice").value.trim() || "Consultar",
    available: true,
  });

  event.currentTarget.reset();
  document.querySelector("#productMessage").textContent = "Produto adicionado na loja.";
  renderShop();
}

function savePrayer(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const text = form.elements.pedido.value.trim();
  if (!text) return;

  saveItem("next_prayers", {
    id: `pr_${Date.now()}`,
    senderId: currentUser.id,
    senderName: currentUser.name,
    anonymous: form.elements.identificacao.value === "anonimo",
    wantsReply: form.elements.retorno.checked,
    text,
    createdAt: Date.now(),
  });

  document.querySelector("#prayerMessage").textContent = "Pedido enviado para a liderança! 🙏";
  form.reset();
  renderMyPrayers();
  renderPrayerAdminList();
}

function renderMyPrayers() {
  const container = document.querySelector("#myPrayersList");
  if (!container) return;

  const myPrayers = getPrayers()
    .filter(p => p.senderId === currentUser.id)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  if (!myPrayers.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = myPrayers.map(prayer => {
    const replyHtml = prayer.reply ? `
      <div style="background: rgba(47,115,248,0.07); border-left: 3px solid var(--blue); padding: 8px 12px; border-radius: 0 6px 6px 0; margin-top: 8px;">
        <span class="eyebrow" style="color: var(--blue); font-size: 0.7rem;">Resposta da liderança</span>
        <p style="margin: 4px 0 0; font-size: 0.9rem; font-weight: 700; color: var(--ink);">${prayer.reply}</p>
        <span style="font-size: 0.75rem; color: var(--muted);">— ${prayer.repliedBy || "Liderança"}</span>
      </div>
    ` : (prayer.wantsReply ? `<p style="font-size: 0.82rem; color: var(--muted); margin-top: 6px; font-style: italic;">Aguardando resposta da liderança...</p>` : "");

    return `
      <article style="border: 1px solid var(--line); border-radius: 8px; padding: 14px; background: var(--surface);">
        <p style="margin: 0 0 6px; font-size: 0.9rem;">${prayer.text}</p>
        <span class="small-badge" style="font-size: 0.72rem;">${prayer.anonymous ? "Anônimo" : "Identificado"}</span>
        ${replyHtml}
      </article>
    `;
  }).join("");
}

function populateScaleEvents() {
  const selectEl = document.querySelector("#scaleEventSelect");
  if (!selectEl) return;
  selectEl.innerHTML = getEvents().map(e => `<option value="${e.id}">${e.title} - Dia ${e.date}</option>`).join("");
}

function renderDynamicScaleFields() {
  const dept = document.querySelector("#scaleDeptSelect")?.value;
  const eventId = document.querySelector("#scaleEventSelect")?.value;
  const container = document.querySelector("#dynamicFunctionsContainer");
  
  const msgEl = document.querySelector("#scaleMessage");
  if (msgEl) msgEl.textContent = "";

  if (!container || !dept) return;

  const funcs = functionsMap[dept] || [];
  const eligibleServants = getUsers().filter(u => u.hasServo && u.servoType && u.servoType.includes(dept));
  const alreadyScheduledIds = new Set();
  
  getAll("next_scales", []).filter(s => s.eventId === eventId).forEach(scale => scale.assignments.forEach(a => alreadyScheduledIds.add(a.userId)));

  container.innerHTML = funcs.map(f => `
    <label style="display: flex; flex-direction: column; gap: 4px;">
      Função: <strong>${f}</strong>
      <select class="scale-func-assign" data-func="${f}">
        <option value="">-- Selecione --</option>
        ${eligibleServants.map(s => `<option value="${s.id}" ${alreadyScheduledIds.has(s.id) ? "disabled" : ""}>${s.name}${alreadyScheduledIds.has(s.id) ? " (Já escalado)" : ""}</option>`).join("")}
      </select>
    </label>
  `).join("");
}

function renderMyScales() {
  const container = document.querySelector("#myActiveScales");
  const geralContainer = document.querySelector("#escalaGeralContainer");
  
  if (!container) return;

  const scales = getAll("next_scales", []);
  const events = getEvents();
  const isLeader = ["lider", "sublider", "pastor", "missionaria", "admin"].includes(currentUser.role);
  
  let visibleScales = scales;
  if (!isLeader) {
    const myDepts = currentUser.servoType || ["Servo"];
    visibleScales = scales.filter(scale => myDepts.includes(scale.dept));
  }

  let myCardsHtml = "";
  let geralHtml = "";

  const activeScales = visibleScales.filter(scale => {
    const ev = events.find(e => e.id === scale.eventId);
    if (!ev) return false;
    const userAssignment = scale.assignments.find(a => a.userId === currentUser.id);
    return isLeader || userAssignment;
  });

  if (activeScales.length === 0) {
    container.innerHTML = `<p class="safety-note">Nenhuma designação oficial encontrada para o seu perfil neste mês.</p>`;
    if (geralContainer) geralContainer.innerHTML = "";
    return;
  }

  activeScales.forEach(scale => {
    const ev = events.find(e => e.id === scale.eventId);
    const userAssignment = scale.assignments.find(a => a.userId === currentUser.id);

    myCardsHtml += `
      <article class="feed-card" style="grid-template-columns: 1fr; gap: 10px; background: var(--surface);">
        <span class="feed-tag" style="background: var(--blue); color: #fff; width: fit-content; padding: 2px 8px;">Equipe ${scale.dept}</span>
        <h3 style="margin: 4px 0;">${ev.title} — Dia ${ev.date} às ${ev.time}</h3>
        <p style="margin: 0; font-size: 0.95rem;">Sua Atribuição: <strong style="color: #10b981;">${userAssignment ? userAssignment.functionName : "Coordenador Geral"}</strong></p>
      </article>
    `;

    if (scale.dept === "Servo") {
      const grouped = {};
      scale.assignments.forEach(a => {
        if (!grouped[a.functionName]) grouped[a.functionName] = [];
        grouped[a.functionName].push(a.userName);
      });

      const renderGroup = (roles) => {
        return roles.map(r => {
          if (!r) return `<div class="escala-col empty-col"></div>`; 
          const names = grouped[r] || ["-"];
          return `
            <div class="escala-col">
              <div class="escala-role">${r}</div>
              <div class="escala-names">${names.map(n => `<span>${n}</span>`).join("")}</div>
            </div>
          `;
        }).join("");
      };

      const block1 = ["Porta", "Recepção", "Integração"];
      const block2 = ["Manutenção", "Suporte", "Ofertório"];
      const block3 = ["Sub Coordenação", "Coordenação", ""];

      geralHtml += `
        <div class="escala-table-wrapper">
          <div class="escala-header-main">NEXT - ${ev.date}/${ev.month.substring(0,3)}/2026</div>
          
          <div class="escala-grid-row">
            ${renderGroup(block1)}
          </div>
          <div class="escala-grid-row">
            ${renderGroup(block2)}
          </div>
          <div class="escala-grid-row">
            ${renderGroup(block3)}
          </div>

          <div class="escala-footer-main">
            EM CASO DE ATRASO E/OU DÚVIDA SOBRE O SETOR, AVISAR AO COORDENADOR DO DIA! CHEGAR 30 MIN ANTES PARA ORAÇÃO!
          </div>
        </div>
      `;
    }
  });

  container.innerHTML = myCardsHtml;
  if (geralContainer) {
    geralContainer.innerHTML = geralHtml ? `
      <div class="section-head" style="margin-top: 24px;">
        <div>
          <p class="eyebrow">Visão Geral da Equipe</p>
          <h2>Quadro de Escala</h2>
        </div>
      </div>
      ${geralHtml}
    ` : "";
  }

    const exportBtn = document.getElementById('exportScalaBtn');
    if (exportBtn) {
      exportBtn.style.display = geralContainer?.innerHTML ? 'block' : 'none';
    }
}

// ══════════════════════════════════════════════════
//  BIBLERATS — feed de fotos diárias
// ══════════════════════════════════════════════════

const BR_COLLECTION = 'next_biblerats_posts';
let brPhotoBase64 = '';

function cleanOldBRPosts() {
  const DAYS = 30;
  const cutoff = Date.now() - DAYS * 86400000;
  const posts = getBRPosts();
  const before = posts.length;
  const fresh = posts.filter(p => p.createdAt > cutoff);

  if (fresh.length < before) {
    localStorage.setItem(BR_COLLECTION, JSON.stringify(fresh));
    console.info(`[BibleRats] ${before - fresh.length} posts antigos removidos.`);
  }
}

function getBRPosts() {
  return getAll(BR_COLLECTION, []).sort((a, b) => b.createdAt - a.createdAt);
}

function brTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function brCurrentUserPostedToday() {
  const today = brTodayKey();
  return getBRPosts().some(p => p.userId === currentUser.id && p.dayKey === today);
}

function brRelativeTime(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60)   return 'agora mesmo';
  if (diff < 3600) return `${Math.floor(diff/60)}min`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  return `${Math.floor(diff/86400)}d`;
}

function getBRStreak(userId) {
  const posts = getBRPosts().filter(p => p.userId === userId);
  if (!posts.length) return 0;

  const dayKeys = new Set(posts.map(p => p.dayKey));
  let streak = 0;
  const d = new Date();

  // Começa de hoje e vai voltando
  for (let i = 0; i < 365; i++) {
    const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    if (dayKeys.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function renderBRStories() {
  const el = document.getElementById('brStoriesRow');
  if (!el) return;

  const today = brTodayKey();
  const users = getUsers();
  const posts = getBRPosts();

  // Usuários que postaram hoje
  const postedToday = new Set(
    posts.filter(p => p.dayKey === today).map(p => p.userId)
  );

  const iPosted = postedToday.has(currentUser.id);
  const myStreak = getBRStreak(currentUser.id);

  const stories = users
    .filter(u => postedToday.has(u.id))
    .slice(0, 12);

  // Avatar do usuário atual (primeiro, com anel diferente)
  const myRing = iPosted
    ? 'border:2.5px solid var(--blue);'
    : 'border:2.5px dashed #94a3b8;';

  el.innerHTML = `
    <button type="button" id="brMyStory" style="
      display:flex; flex-direction:column; align-items:center; gap:5px;
      background:none; border:none; cursor:pointer; flex-shrink:0;">
      <div style="position:relative;">
        <div style="
          width:52px; height:52px; border-radius:50%; ${myRing}
          background:var(--ink); color:#fff; display:grid; place-items:center;
          font-family:'Syne',sans-serif; font-weight:900; font-size:0.9rem;
          box-shadow:0 2px 8px rgba(0,0,0,0.15);">
          ${iPosted ? '✓' : '+'}
        </div>
        ${myStreak >= 2 ? `
          <span style="
            position:absolute; bottom:-4px; left:50%; transform:translateX(-50%);
            background:#ff6b35; color:#fff; font-size:0.58rem; font-weight:900;
            padding:1px 5px; border-radius:999px; white-space:nowrap;
            border:1.5px solid var(--surface); line-height:1.6;">
            🔥${myStreak}d
          </span>` : ''}
      </div>
      <span style="font-size:0.68rem; font-weight:700; color:var(--muted);">
        ${iPosted ? 'Você' : 'Postar'}
      </span>
    </button>
    ${stories
      .filter(u => u.id !== currentUser.id)
      .map(u => {
        const post = posts.find(p => p.userId === u.id && p.dayKey === today);
        return `
          <button type="button" data-br-story="${u.id}" style="
            display:flex; flex-direction:column; align-items:center; gap:5px;
            background:none; border:none; cursor:pointer; flex-shrink:0;">
            <div style="
              width:52px; height:52px; border-radius:50%;
              border:2.5px solid var(--blue);
              overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.15);">
              ${post?.photo
                ? `<img src="${post.photo}" style="width:100%;height:100%;object-fit:cover;" alt="" />`
                : `<div style="width:100%;height:100%;background:var(--ink);display:grid;place-items:center;
                             font-family:'Syne',sans-serif;font-weight:900;font-size:0.9rem;color:#fff;">
                     ${initials(u.name)}
                   </div>`
              }
            </div>
            <span style="font-size:0.68rem; font-weight:700; color:var(--muted); max-width:52px;
                         overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
              ${u.name.split(' ')[0]}
            </span>
          </button>
        `;
      }).join('')}
  `;

  document.getElementById('brMyStory')?.addEventListener('click', () => {
    if (!brCurrentUserPostedToday()) {
      document.getElementById('brPostModal').style.display = 'grid';
    } else {
      // Vai para o post do dia do próprio usuário
      const myPost = getBRPosts().find(p => p.userId === currentUser.id && p.dayKey === brTodayKey());
      if (myPost?.photo) openBRLightbox(myPost.photo);
    }
  });

  el.querySelectorAll('[data-br-story]').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.brStory;
      const post = getBRPosts().find(p => p.userId === uid && p.dayKey === brTodayKey());
      if (post?.photo) openBRLightbox(post.photo);
    });
  });
}

function renderBRFeed() {
  const el = document.getElementById('brFeed');
  if (!el) return;

  const posts = getBRPosts(); // already sorted newest first

  if (!posts.length) {
    el.innerHTML = `
      <div style="text-align:center; padding:40px 20px; color:var(--muted);">
        <p style="font-size:2rem; margin:0 0 8px;">📸</p>
        <p style="font-weight:700;">Nenhuma postagem ainda.</p>
        <p style="font-size:0.88rem;">Seja o primeiro a compartilhar seu momento com Deus hoje!</p>
      </div>`;
    return;
  }

  // Group posts by dayKey, sorted newest first
  const grouped = [];
  const seen = new Map();
  for (const post of posts) {
    if (!seen.has(post.dayKey)) {
      seen.set(post.dayKey, []);
      grouped.push({ dayKey: post.dayKey, posts: seen.get(post.dayKey) });
    }
    seen.get(post.dayKey).push(post);
  }

  function dayLabel(dayKey) {
    const today = brTodayKey();
    if (dayKey === today) return '📅 Hoje';
    // compute yesterday
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterday = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    if (dayKey === yesterday) return '⏪ Ontem';
    // parse dayKey
    const parts = dayKey.split('-');
    const dt = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
    return dt.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  el.innerHTML = grouped.map(group => `
    <div class="br-day-group" style="animation:fadeSlideIn 400ms ease forwards;">
      <!-- Day header -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;margin-top:4px;">
        <div style="height:1px;flex:1;background:var(--line);"></div>
        <span style="font-size:0.78rem;font-weight:800;letter-spacing:0.04em;color:var(--muted);white-space:nowrap;padding:4px 10px;background:var(--soft);border-radius:99px;border:1px solid var(--line);">${dayLabel(group.dayKey)}</span>
        <div style="height:1px;flex:1;background:var(--line);"></div>
      </div>
      <!-- Posts of this day -->
      <div style="display:grid;gap:14px;">
        ${group.posts.map(post => `
          <article style="border:1px solid var(--line);border-radius:16px;background:var(--surface);overflow:hidden;box-shadow:0 2px 12px rgba(13,17,23,0.05);transition:transform 200ms,box-shadow 200ms;" onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'" onmouseleave="this.style.transform='';this.style.boxShadow='0 2px 12px rgba(13,17,23,0.05)'">
            <!-- Header do post -->
            <div style="display:flex;align-items:center;gap:10px;padding:12px 14px 10px;">
              <div style="width:40px;height:40px;border-radius:50%;flex-shrink:0;background:var(--ink);color:#fff;display:grid;place-items:center;font-family:'Syne',sans-serif;font-weight:900;font-size:0.82rem;overflow:hidden;border:2px solid var(--line);">
                ${post.userPhoto ? `<img src="${post.userPhoto}" style="width:100%;height:100%;object-fit:cover;" alt="" />` : initials(post.userName)}
              </div>
              <div style="flex:1;min-width:0;">
                <strong style="font-size:0.90rem;display:block;line-height:1.2;">${post.userName}</strong>
                <span style="font-size:0.74rem;color:var(--muted);">${brRelativeTime(post.createdAt)}</span>
              </div>
              ${canManage() ? `<button type="button" data-br-delete="${post.id}" style="background:none;border:1px solid var(--line);cursor:pointer;color:var(--muted);font-size:0.76rem;padding:3px 8px;border-radius:6px;transition:all 150ms;" onmouseenter="this.style.background='#fef2f2';this.style.color='#dc2626'" onmouseleave="this.style.background='none';this.style.color='var(--muted)'">Remover</button>` : ''}
            </div>
            <!-- Foto -->
            ${post.photo ? `<div style="background:#000;cursor:zoom-in;overflow:hidden;" data-br-lightbox="${post.photo}"><img src="${post.photo}" alt="Post de ${post.userName}" style="width:100%;max-height:420px;object-fit:cover;display:block;transition:transform 300ms;" onmouseenter="this.style.transform='scale(1.02)'" onmouseleave="this.style.transform=''" /></div>` : ''}
            <!-- Caption + versículo -->
            <div style="padding:12px 14px 14px;display:grid;gap:6px;">
              ${post.caption ? `<p style="margin:0;font-size:0.92rem;line-height:1.55;color:var(--ink);"><strong>${post.userName.split(' ')[0]}</strong> ${post.caption}</p>` : ''}
              ${post.verse ? `<p style="margin:0;font-size:0.80rem;color:var(--blue);font-weight:700;padding:6px 10px;background:rgba(47,115,248,0.07);border-radius:6px;border-left:3px solid var(--blue);">📖 ${post.verse}</p>` : ''}
              <!-- Curtidas -->
              <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
                <button type="button" data-br-like="${post.id}" style="background:none;border:none;cursor:pointer;padding:4px 8px;font-size:1.1rem;line-height:1;display:flex;align-items:center;gap:4px;border-radius:8px;transition:background 150ms;" onmouseenter="this.style.background='var(--soft)'" onmouseleave="this.style.background='none'">
                  ${(post.likes || []).includes(currentUser.id) ? '🔥' : '🤍'}
                  <span style="font-size:0.80rem;font-weight:700;color:var(--muted);">${(post.likes || []).length || ''}</span>
                </button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Lightbox
  el.querySelectorAll('[data-br-lightbox]').forEach(el => {
    el.addEventListener('click', () => openBRLightbox(el.dataset.brLightbox));
  });

  // Curtir
  el.querySelectorAll('[data-br-like]').forEach(btn => {
    btn.addEventListener('click', () => brToggleLike(btn.dataset.brLike));
  });

  // Remover (líderes)
  el.querySelectorAll('[data-br-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      showConfirm('Remover este post do BibleRats?', () => {
        dbApi?.remove(BR_COLLECTION, btn.dataset.brDelete);
        renderBRFeed();
        renderBRStories();
      });
    });
  });
}

function brToggleLike(postId) {
  const posts = getBRPosts();
  const post  = posts.find(p => p.id === postId);
  if (!post) return;

  const likes = post.likes || [];
  if (likes.includes(currentUser.id)) {
    post.likes = likes.filter(id => id !== currentUser.id);
  } else {
    post.likes = [...likes, currentUser.id];
  }
  dbApi?.save(BR_COLLECTION, post);
  renderBRFeed();
}

function openBRLightbox(src) {
  const lb = document.getElementById('brLightbox');
  document.getElementById('brLightboxImg').src = src;
  lb.style.display = 'grid';
}

function bindBREvents() {
  // Abrir modal
  document.getElementById('brOpenPostBtn')?.addEventListener('click', () => {
    if (brCurrentUserPostedToday()) {
      document.getElementById('brPostMsg').textContent = 'Você já postou hoje! Volte amanhã. 🔥';
      return;
    }
    document.getElementById('brPostModal').style.display = 'grid';
  });

  // Fechar modal
  document.getElementById('brCloseModal')?.addEventListener('click', () => {
    document.getElementById('brPostModal').style.display = 'none';
  });

  // Preview da foto
  document.getElementById('brPhotoInput')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    // Comprime para max 800px antes de salvar em base64
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 800;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        canvas.width  = img.width  * ratio;
        canvas.height = img.height * ratio;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        brPhotoBase64 = canvas.toDataURL('image/jpeg', 0.75);

        const preview = document.getElementById('brPhotoPreview');
        const label   = document.getElementById('brPhotoLabel');
        preview.src   = brPhotoBase64;
        preview.style.display = 'block';
        label.querySelector('span').style.display  = 'none';
        label.querySelector('span:last-of-type')?.style && (label.querySelector('span').style.display = 'none');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Submeter post
  document.getElementById('brSubmitPost')?.addEventListener('click', () => {
    const caption = document.getElementById('brCaption').value.trim();
    const verse   = document.getElementById('brVerse').value.trim();
    const msg     = document.getElementById('brPostMsg');

    if (!brPhotoBase64 && !caption) {
      msg.style.color = '#b91c1c';
      msg.textContent = 'Adicione uma foto ou escreva algo.';
      return;
    }

    const profile = getProfileFromStorage();

    dbApi?.save(BR_COLLECTION, {
      id:        `br_${Date.now()}`,
      userId:    currentUser.id,
      userName:  currentUser.name,
      userPhoto: profile.photo || '',
      photo:     brPhotoBase64,
      caption,
      verse,
      dayKey:    brTodayKey(),
      likes:     [],
      createdAt: Date.now(),
    });

    // Reset
    brPhotoBase64 = '';
    document.getElementById('brCaption').value = '';
    document.getElementById('brVerse').value   = '';
    document.getElementById('brPhotoPreview').style.display = 'none';
    document.getElementById('brPostModal').style.display = 'none';
    document.getElementById('brPhotoInput').value = '';

    renderBRFeed();
    renderBRStories();
  });

  // Fechar lightbox ao clicar fora
  document.getElementById('brLightbox')?.addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
  });
}

function renderBRStreakBoard() {
  const el = document.getElementById('brStreakBoard');
  if (!el) return;

  const users = getUsers();
  const posts = getBRPosts();
  const now = new Date();

  // Build streaks
  const userStreaks = users
    .map(u => ({ ...u, streak: getBRStreak(u.id) }))
    .filter(u => u.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5);

  // Weekly check-in counts
  const weekAgo = Date.now() - 7 * 86400000;
  const monthAgo = Date.now() - 30 * 86400000;

  function countFor(userId, since) {
    const days = new Set(posts.filter(p => p.userId === userId && p.createdAt > since).map(p => p.dayKey));
    return days.size;
  }

  // Who leads this week
  const weekLeader = users
    .map(u => ({ ...u, count: countFor(u.id, weekAgo) }))
    .sort((a, b) => b.count - a.count)[0];

  const monthLeader = users
    .map(u => ({ ...u, count: countFor(u.id, monthAgo) }))
    .sort((a, b) => b.count - a.count)[0];

  const myStreak = getBRStreak(currentUser.id);
  const myWeek = countFor(currentUser.id, weekAgo);
  const myMonth = countFor(currentUser.id, monthAgo);

  el.innerHTML = `
    <!-- My stats -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">
      <div style="background:var(--soft);border:1px solid var(--line);border-radius:12px;padding:12px;text-align:center;">
        <p style="margin:0;font-size:1.6rem;font-weight:900;font-family:'Syne',sans-serif;color:var(--blue);">${myStreak}</p>
        <p style="margin:2px 0 0;font-size:0.70rem;font-weight:700;color:var(--muted);">🔥 Sequência</p>
      </div>
      <div style="background:var(--soft);border:1px solid var(--line);border-radius:12px;padding:12px;text-align:center;">
        <p style="margin:0;font-size:1.6rem;font-weight:900;font-family:'Syne',sans-serif;color:#8b5cf6;">${myWeek}</p>
        <p style="margin:2px 0 0;font-size:0.70rem;font-weight:700;color:var(--muted);">📅 Esta semana</p>
      </div>
      <div style="background:var(--soft);border:1px solid var(--line);border-radius:12px;padding:12px;text-align:center;">
        <p style="margin:0;font-size:1.6rem;font-weight:900;font-family:'Syne',sans-serif;color:#10b981;">${myMonth}</p>
        <p style="margin:2px 0 0;font-size:0.70rem;font-weight:700;color:var(--muted);">🗓️ Este mês</p>
      </div>
    </div>

    <!-- Leaders -->
    ${weekLeader?.count > 0 || monthLeader?.count > 0 ? `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
        ${weekLeader?.count > 0 ? `
          <div style="background:linear-gradient(135deg,rgba(47,115,248,0.12),transparent);border:1px solid rgba(47,115,248,0.25);border-radius:12px;padding:11px 12px;">
            <p style="margin:0;font-size:0.68rem;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;color:var(--blue);">⭐ Líder da semana</p>
            <p style="margin:3px 0 0;font-size:0.86rem;font-weight:800;color:var(--ink);">${weekLeader.name.split(' ')[0]}</p>
            <p style="margin:1px 0 0;font-size:0.72rem;color:var(--muted);font-weight:600;">${weekLeader.count} check-ins</p>
          </div>` : ''}
        ${monthLeader?.count > 0 ? `
          <div style="background:linear-gradient(135deg,rgba(16,185,129,0.12),transparent);border:1px solid rgba(16,185,129,0.25);border-radius:12px;padding:11px 12px;">
            <p style="margin:0;font-size:0.68rem;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;color:#10b981;">🏆 Líder do mês</p>
            <p style="margin:3px 0 0;font-size:0.86rem;font-weight:800;color:var(--ink);">${monthLeader.name.split(' ')[0]}</p>
            <p style="margin:1px 0 0;font-size:0.72rem;color:var(--muted);font-weight:600;">${monthLeader.count} check-ins</p>
          </div>` : ''}
      </div>` : ''}

    <!-- Top Streaks -->
    ${userStreaks.length > 0 ? `
      <p style="margin:0 0 8px;font-size:0.72rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted);">Top sequências</p>
      <div style="display:grid;gap:6px;">
        ${userStreaks.map((u, i) => `
          <div style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--soft);border-radius:10px;border:1px solid var(--line);">
            <span style="font-size:0.82rem;font-weight:900;color:var(--muted);width:16px;text-align:center;">${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</span>
            <span style="flex:1;font-size:0.86rem;font-weight:700;color:var(--ink);">${u.name.split(' ')[0]}</span>
            <span style="font-size:0.82rem;font-weight:900;color:#ff6b35;">🔥 ${u.streak}d</span>
          </div>
        `).join('')}
      </div>` : ''}
  `;
}

function renderBibleRats() {
  renderBRStreakBoard();
  renderBRStories();
  renderBRFeed();
}

// ══════════════════════════════════════════════════
//  CHECKLIST DE SERVOS
// ══════════════════════════════════════════════════

const CL_KEY = 'next_checklist';

function getChecklist() {
  return getAll(CL_KEY, []);
}

function getTodayEventId() {
  const today = new Date().getDate();
  return getEvents().find(e => Number(e.date) === today)?.id || 'culto_geral';
}

function renderChecklist() {
  const container = document.getElementById('checklistItems');
  const emptyEl   = document.getElementById('checklistEmpty');
  const adminForm  = document.getElementById('checklistAdminForm');
  if (!container) return;

  if (adminForm) adminForm.style.display = canManage() ? 'block' : 'none';

  const eventId = getTodayEventId();
  const items   = getChecklist().filter(i => i.eventId === eventId);

  if (!items.length) {
    container.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  const total = items.length;
  const done  = items.filter(i => i.completedBy && Object.keys(i.completedBy).length > 0).length;

  container.innerHTML = `
    <!-- Barra de progresso -->
    <div style="margin-bottom:4px;">
      <div style="
        display:flex; justify-content:space-between; align-items:center;
        margin-bottom:6px;">
        <span style="font-size:0.80rem; font-weight:700; color:var(--muted);">
          Progresso do culto
        </span>
        <span style="font-size:0.80rem; font-weight:800; color:var(--blue);">
          ${done}/${total}
        </span>
      </div>
      <div class="progress-bar">
        <span style="width:${Math.round((done/total)*100)}%;
                     background:${done===total ? 'var(--green)' : 'var(--blue)'};
                     transition:width 400ms ease;">
        </span>
      </div>
    </div>

    ${items.map(item => {
      const isDone    = item.completedBy && Object.keys(item.completedBy).length > 0;
      const iDidIt    = item.completedBy?.[currentUser.id];
      const doerNames = Object.values(item.completedBy || {}).join(', ');

      return `
        <div style="
          display:flex; align-items:center; gap:12px;
          padding:12px 14px; border:1.5px solid ${isDone ? 'rgba(16,185,129,0.35)' : 'var(--line)'};
          border-radius:10px; background:${isDone ? 'rgba(16,185,129,0.05)' : 'var(--surface)'};
          transition:all 200ms;">

          <button type="button" data-cl-toggle="${item.id}" style="
            width:26px; height:26px; flex-shrink:0; border-radius:50%;
            border:2px solid ${isDone ? '#10b981' : 'var(--line)'};
            background:${isDone ? '#10b981' : 'transparent'};
            color:#fff; font-size:0.8rem; cursor:pointer;
            display:grid; place-items:center;
            transition:all 200ms;">
            ${isDone ? '✓' : ''}
          </button>

          <div style="flex:1; min-width:0;">
            <p style="
              margin:0; font-size:0.90rem; font-weight:${isDone ? '600' : '700'};
              color:${isDone ? 'var(--muted)' : 'var(--ink)'};
              text-decoration:${isDone ? 'line-through' : 'none'};">
              ${item.task}
            </p>
            ${isDone ? `
              <span style="font-size:0.74rem; color:var(--green); font-weight:700;">
                ✓ ${doerNames}
              </span>` : ''}
          </div>

          ${canManage() ? `
            <button type="button" data-cl-delete="${item.id}" style="
              background:none; border:none; cursor:pointer;
              color:var(--muted); font-size:1rem; padding:2px 4px;">
              ×
            </button>` : ''}
        </div>
      `;
    }).join('')}
  `;

  // Marcar como feito
  container.querySelectorAll('[data-cl-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id    = btn.dataset.clToggle;
      const items = getChecklist();
      const item  = items.find(i => i.id === id);
      if (!item) return;

      if (item.completedBy?.[currentUser.id]) {
        delete item.completedBy[currentUser.id];
      } else {
        item.completedBy = {
          ...(item.completedBy || {}),
          [currentUser.id]: currentUser.name.split(' ')[0],
        };
      }
      dbApi?.save(CL_KEY, item);
      renderChecklist();
    });
  });

  // Remover (líderes)
  container.querySelectorAll('[data-cl-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      dbApi?.remove(CL_KEY, btn.dataset.clDelete);
      renderChecklist();
    });
  });
}

function bindChecklistEvents() {
  document.getElementById('checklistAddBtn')?.addEventListener('click', () => {
    const input = document.getElementById('checklistTaskInput');
    const task  = input?.value.trim();
    if (!task) return;

    dbApi?.save(CL_KEY, {
      id:          `cl_${Date.now()}`,
      eventId:     getTodayEventId(),
      task,
      completedBy: {},
      createdAt:   Date.now(),
    });

    input.value = '';
    renderChecklist();
  });

  document.getElementById('checklistTaskInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('checklistAddBtn')?.click();
    }
  });
}

function bindExportScala() {
  document.getElementById('downloadScalaBtn')?.addEventListener('click', async () => {
    const target = document.querySelector('.escala-table-wrapper');
    if (!target || typeof html2canvas === 'undefined') {
      toast('html2canvas não carregado ainda. Tente novamente.', 'warn');
      return;
    }
    toast('Gerando imagem da escala...', 'info', 2000);
    try {
      const canvas = await html2canvas(target, { scale: 2, backgroundColor: '#fff' });
      const link = document.createElement('a');
      link.download = `escala-next-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast('Escala salva com sucesso! ✓', 'success');
    } catch {
      toast('Erro ao gerar imagem. Tente novamente.', 'error');
    }
  });
}

// ══════════════════════════════════════════════════
//  JORNADA DA VIDA — achievements
// ══════════════════════════════════════════════════

const JOURNEY_STEPS = [
  {
    id: 'descubra',
    name: 'Descubra',
    level: 'Nível 1',
    desc: 'Para quem ainda não se batizou e quer dar esse passo de fé.',
    icon: '💧',
    emoji: '🔵',
    color: '#2f73f8',
    badgeLabel: 'Batismo',
  },
  {
    id: 'avance',
    name: 'Avance',
    level: 'Nível 2',
    desc: 'Um panorama bíblico para entender a palavra de forma clara e prática.',
    icon: '📖',
    emoji: '🟢',
    color: '#10b981',
    badgeLabel: 'Palavra',
  },
  {
    id: 'fundamentos',
    name: 'Fundamentos da Fé',
    level: 'Nível 3',
    desc: 'Aprenda os pilares que norteiam a Fonte e fortalecem a caminhada cristã.',
    icon: '🏛️',
    emoji: '🟡',
    color: '#d97706',
    badgeLabel: 'Fundamentos',
  },
  {
    id: 'ide',
    name: 'Escola de Líderes',
    level: 'Opcional',
    desc: 'Preparada para formar líderes de célula e formadores de discípulos. Este passo é opcional.',
    icon: '🐟',
    emoji: '🔴',
    color: '#dc2626',
    badgeLabel: 'Liderança',
    optional: true,
  },
];

const JOURNEY_KEY = `next_journey:${currentUser?.id}`;
const JOURNEY_REQUESTS_KEY = 'next_journey_requests';

function getJourneyData(userId) {
  const uid = userId || currentUser?.id;
  let data = {};
  try { data = JSON.parse(localStorage.getItem(`next_journey:${uid}`)) || {}; }
  catch { data = {}; }

  const user = uid === currentUser?.id ? currentUser : getUsers().find((item) => item.id === uid);
  if (user?.journey && typeof user.journey === "object") {
    data = { ...user.journey, ...data };
  }

  const approvedRequests = (dbApi?.getAll(JOURNEY_REQUESTS_KEY) || [])
    .filter((request) => request.userId === uid && request.status === "approved");

  approvedRequests.forEach((request) => {
    data[request.stepId] = data[request.stepId] || {
      unlockedAt: request.approvedAt || request.createdAt || Date.now(),
      approvedBy: request.approvedBy || "Liderança",
    };
  });

  return data;
}

/** Retorna o pedido de um jovem para um determinado passo */
function getJourneyRequest(userId, stepId) {
  const all = dbApi?.getAll(JOURNEY_REQUESTS_KEY) || [];
  return all.find(r => r.userId === userId && r.stepId === stepId) || null;
}

/** Jovem envia comprovante — cria pedido de aprovação */
function submitJourneyRequest(stepId, photoDataUrl) {
  const step = JOURNEY_STEPS.find(s => s.id === stepId);
  if (!step) return;
  if (!photoDataUrl) {
    toast('Anexe uma foto do comprovante antes de enviar.', 'error');
    return;
  }

  const existing = getJourneyRequest(currentUser.id, stepId);
  if (existing) dbApi?.remove(JOURNEY_REQUESTS_KEY, existing.id);

  const req = {
    id: `jreq_${Date.now()}`,
    userId:    currentUser.id,
    userName:  currentUser.name,
    userRole:  currentUser.role,
    stepId,
    stepName:  step.name,
    photo:     photoDataUrl || null,
    status:    'pending',
    createdAt: Date.now(),
  };

  saveItem(JOURNEY_REQUESTS_KEY, req);
  renderJourney();
  toast('Comprovante enviado! Aguarde a aprovação da liderança. 📨', 'success', 4500);
}

/** Líder aprova um pedido */
function approveJourneyRequest(requestId) {
  const all = dbApi?.getAll(JOURNEY_REQUESTS_KEY) || [];
  const req = all.find(r => r.id === requestId);
  if (!req) return;

  saveItem(JOURNEY_REQUESTS_KEY, { ...req, status: 'approved', approvedAt: Date.now(), approvedBy: currentUser.name });

  const journeyKey = `next_journey:${req.userId}`;
  let data = {};
  try { data = JSON.parse(localStorage.getItem(journeyKey)) || {}; } catch {}
  data[req.stepId] = { unlockedAt: Date.now(), approvedBy: currentUser.name };
  localStorage.setItem(journeyKey, JSON.stringify(data));

  const users = dbApi?.getAll('next_users') || [];
  const youngling = users.find(u => u.id === req.userId);

  if (youngling) {
    saveItem('next_users', {
      ...youngling,
      journey: data,
      hasServo: youngling.hasServo || hasCompletedRequiredJourney(req.userId),
      servoType: youngling.servoType || [],
    });
  }

  // Se os 3 primeiros passos estão completos → libera aba Servir
  const requiredForServo = ['descubra', 'avance', 'fundamentos'];
  const allApproved = requiredForServo.every(id => Boolean(data[id]));
  if (allApproved) {
    if (youngling && !youngling.hasServo) {
      saveItem('next_users', { ...youngling, journey: data, hasServo: true, servoType: youngling.servoType || [] });
    }
  }

  setupPermissions();
  renderJourneyApprovalList();
  toast(`✅ ${req.userName} — "${req.stepName}" aprovado!`, 'success', 4000);
}

/** Líder rejeita um pedido */
function rejectJourneyRequest(requestId) {
  const all = dbApi?.getAll(JOURNEY_REQUESTS_KEY) || [];
  const req = all.find(r => r.id === requestId);
  if (!req) return;
  saveItem(JOURNEY_REQUESTS_KEY, { ...req, status: 'rejected', rejectedAt: Date.now(), rejectedBy: currentUser.name });
  renderJourneyApprovalList();
  toast(`❌ Pedido de ${req.userName} rejeitado.`, 'info', 3500);
}

/** Abre modal para o jovem enviar o comprovante — escolha entre Galeria ou Câmera */
function openJourneyUploadModal(stepId) {
  const step = JOURNEY_STEPS.find(s => s.id === stepId);
  if (!step) return;
  document.getElementById('journeyUploadModal')?.remove();

  // ── Overlay ──
  const overlay = document.createElement('div');
  overlay.id = 'journeyUploadModal';
  // Inline style individual para garantir que nenhum ancestral quebre o fixed
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.zIndex = '999999';
  overlay.style.background = 'rgba(8,12,24,0.82)';
  overlay.style.backdropFilter = 'blur(6px)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = '20px';
  overlay.style.boxSizing = 'border-box';

  // ── Box ──
  const box = document.createElement('div');
  box.style.position = 'relative';
  box.style.background = 'var(--surface, #fff)';
  box.style.borderRadius = '20px';
  box.style.padding = '24px 22px';
  box.style.width = 'min(400px, 100%)';
  box.style.display = 'grid';
  box.style.gap = '12px';
  box.style.boxShadow = '0 40px 100px rgba(0,0,0,0.4)';
  box.style.boxSizing = 'border-box';

  // ── Close btn ──
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Fechar');
  closeBtn.style.cssText = 'position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.1rem;color:var(--muted);cursor:pointer;line-height:1;padding:4px;';
  box.appendChild(closeBtn);

  // ── Icon + title ──
  const iconEl = document.createElement('div');
  iconEl.style.cssText = `font-size:2.4rem;text-align:center;color:${step.color};margin-top:8px;`;
  iconEl.textContent = step.icon;

  const title = document.createElement('h3');
  title.style.cssText = 'margin:0;font-size:1.15rem;font-weight:800;text-align:center;color:var(--ink);';
  title.textContent = step.name;

  const desc = document.createElement('p');
  desc.style.cssText = 'margin:0;font-size:0.85rem;color:var(--muted);text-align:center;line-height:1.5;';
  desc.textContent = 'Selecione como quer enviar o comprovante de conclusão:';

  // ── Inputs ocultos ──
  const galleryInput = document.createElement('input');
  galleryInput.type = 'file';
  galleryInput.accept = 'image/*';
  galleryInput.style.display = 'none';

  const cameraInput = document.createElement('input');
  cameraInput.type = 'file';
  cameraInput.accept = 'image/*';
  cameraInput.setAttribute('capture', 'environment');
  cameraInput.style.display = 'none';

  // ── Botões de escolha ──
  const choiceRow = document.createElement('div');
  choiceRow.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:10px;';

  const btnGallery = document.createElement('button');
  btnGallery.type = 'button';
  btnGallery.style.cssText = [
    'display:flex','flex-direction:column','align-items:center','gap:6px',
    'padding:18px 10px','border:2px dashed var(--line)','border-radius:14px',
    'cursor:pointer','background:var(--soft)','transition:border-color 160ms,background 160ms',
    'font-family:inherit','color:var(--ink)','font-size:0.82rem','font-weight:700'
  ].join(';');
  btnGallery.innerHTML = '<span style="font-size:1.8rem;">🖼️</span>Galeria';
  btnGallery.addEventListener('mouseenter', () => { btnGallery.style.borderColor = step.color; btnGallery.style.background = `color-mix(in srgb,${step.color} 8%,var(--soft))`; });
  btnGallery.addEventListener('mouseleave', () => { btnGallery.style.borderColor = 'var(--line)'; btnGallery.style.background = 'var(--soft)'; });

  const btnCamera = document.createElement('button');
  btnCamera.type = 'button';
  btnCamera.style.cssText = [
    'display:flex','flex-direction:column','align-items:center','gap:6px',
    'padding:18px 10px','border:2px dashed var(--line)','border-radius:14px',
    'cursor:pointer','background:var(--soft)','transition:border-color 160ms,background 160ms',
    'font-family:inherit','color:var(--ink)','font-size:0.82rem','font-weight:700'
  ].join(';');
  btnCamera.innerHTML = '<span style="font-size:1.8rem;">📷</span>Câmera';
  btnCamera.addEventListener('mouseenter', () => { btnCamera.style.borderColor = step.color; btnCamera.style.background = `color-mix(in srgb,${step.color} 8%,var(--soft))`; });
  btnCamera.addEventListener('mouseleave', () => { btnCamera.style.borderColor = 'var(--line)'; btnCamera.style.background = 'var(--soft)'; });

  btnGallery.addEventListener('click', () => galleryInput.click());
  btnCamera.addEventListener('click', () => cameraInput.click());

  choiceRow.append(btnGallery, btnCamera, galleryInput, cameraInput);

  // ── Preview ──
  const previewWrap = document.createElement('div');
  previewWrap.style.display = 'none';

  const previewImg = document.createElement('img');
  previewImg.style.cssText = 'width:100%;max-height:220px;object-fit:cover;border-radius:10px;border:2px solid var(--line);display:block;';

  const fileNameLabel = document.createElement('p');
  fileNameLabel.style.cssText = 'margin:6px 0 0;font-size:0.78rem;color:var(--muted);font-weight:600;text-align:center;';

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remover foto';
  removeBtn.type = 'button';
  removeBtn.style.cssText = [
    'margin-top:8px','width:100%','min-height:38px','border-radius:10px',
    'border:1.5px solid var(--line)','background:transparent',
    'color:var(--muted)','font-family:inherit','font-weight:700',
    'cursor:pointer','font-size:0.82rem'
  ].join(';');

  previewWrap.append(previewImg, fileNameLabel, removeBtn);

  // ── Submit ──
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Enviar para a liderança 📨';
  submitBtn.type = 'button';
  submitBtn.disabled = true;
  submitBtn.style.cssText = [
    'min-height:50px','border:0','border-radius:12px',
    `background:${step.color}`,'color:#fff','font-family:inherit',
    'font-weight:900','font-size:0.95rem','cursor:pointer',
    'opacity:0.4','transition:opacity 160ms'
  ].join(';');

  box.append(iconEl, title, desc, choiceRow, previewWrap, submitBtn);
  overlay.appendChild(box);
  // Append ao <html> para escapar qualquer transform/stacking context do layout
  document.documentElement.appendChild(overlay);

  // ── Lógica de leitura de arquivo ──
  let photoData = null;

  function handleFileChange(input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast('Apenas imagens são aceitas.', 'error'); return; }
    if (file.size > 8 * 1024 * 1024) { toast('A imagem deve ter menos de 8 MB.', 'error'); return; }

    // Comprime para max 900px antes de salvar em base64
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        photoData = canvas.toDataURL('image/jpeg', 0.82);
        previewImg.src = photoData;
        fileNameLabel.textContent = file.name.slice(0, 40);
        previewWrap.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        // Destaca o botão escolhido
        [btnGallery, btnCamera].forEach(b => { b.style.borderColor = 'var(--line)'; b.style.background = 'var(--soft)'; });
        const chosen = input === galleryInput ? btnGallery : btnCamera;
        chosen.style.borderColor = step.color;
        chosen.style.background = `color-mix(in srgb,${step.color} 10%,var(--soft))`;
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  galleryInput.addEventListener('change', () => handleFileChange(galleryInput));
  cameraInput.addEventListener('change',  () => handleFileChange(cameraInput));

  removeBtn.addEventListener('click', () => {
    photoData = null;
    galleryInput.value = '';
    cameraInput.value  = '';
    previewWrap.style.display = 'none';
    fileNameLabel.textContent = '';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.4';
    [btnGallery, btnCamera].forEach(b => { b.style.borderColor = 'var(--line)'; b.style.background = 'var(--soft)'; });
  });

  const close = () => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 200ms ease';
    setTimeout(() => overlay.remove(), 210);
  };

  submitBtn.addEventListener('click', () => {
    if (!photoData) return;
    submitJourneyRequest(stepId, photoData);
    close();
  });
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
}

/** Abre modal de visualização do comprovante (líderes) */
function openJourneyPhotoModal(req) {
  document.getElementById('journeyPhotoViewModal')?.remove();
  const sec = typeof NextSecurity !== 'undefined' ? NextSecurity : { sanitize: s => s };

  const overlay = document.createElement('div');
  overlay.id = 'journeyPhotoViewModal';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.zIndex = '999999';
  overlay.style.background = 'rgba(8,12,24,0.82)';
  overlay.style.backdropFilter = 'blur(6px)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = '20px';
  overlay.style.boxSizing = 'border-box';

  const box = document.createElement('div');
  box.style.position = 'relative';
  box.style.background = 'var(--surface, #fff)';
  box.style.borderRadius = '20px';
  box.style.padding = '24px 22px';
  box.style.width = 'min(420px, 100%)';
  box.style.display = 'grid';
  box.style.gap = '12px';
  box.style.boxShadow = '0 40px 100px rgba(0,0,0,0.4)';
  box.style.maxHeight = '90vh';
  box.style.overflowY = 'auto';
  box.style.boxSizing = 'border-box';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = 'position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.1rem;color:var(--muted);cursor:pointer;';
  
  const meta = document.createElement('p');
  meta.style.cssText = 'margin:0;font-size:0.8rem;color:var(--muted);';
  meta.innerHTML = `Comprovante de <strong>${sec.sanitize(req.userName)}</strong>`;

  const stepTitle = document.createElement('h3');
  stepTitle.style.cssText = 'margin:0;font-size:1.05rem;font-weight:800;color:var(--ink);';
  stepTitle.textContent = sec.sanitize(req.stepName);

  let mediaEl;
  if (req.photo) {
    mediaEl = document.createElement('img');
    mediaEl.src = req.photo;
    mediaEl.style.cssText = 'width:100%;max-height:340px;object-fit:contain;border-radius:10px;border:1px solid var(--line);display:block;';
  } else {
    mediaEl = document.createElement('p');
    mediaEl.style.cssText = 'color:var(--muted);text-align:center;padding:32px 0;margin:0;';
    mediaEl.textContent = 'Sem foto anexada';
  }

  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:10px;margin-top:4px;';

  const approveBtn = document.createElement('button');
  approveBtn.textContent = '✓ Aprovar';
  approveBtn.style.cssText = [
    'flex:1','min-height:46px','border:0','border-radius:12px',
    'background:#10b981','color:#fff','font-family:inherit',
    'font-weight:900','cursor:pointer','font-size:0.92rem'
  ].join(';');

  const rejectBtn = document.createElement('button');
  rejectBtn.textContent = '✕ Rejeitar';
  rejectBtn.style.cssText = [
    'flex:1','min-height:46px','border-radius:12px',
    'border:1.5px solid #dc2626','background:transparent',
    'color:#dc2626','font-family:inherit','font-weight:800',
    'cursor:pointer','font-size:0.92rem'
  ].join(';');

  btnRow.append(approveBtn, rejectBtn);
  box.append(closeBtn, meta, stepTitle, mediaEl, btnRow);
  overlay.appendChild(box);
  document.documentElement.appendChild(overlay);

  const close = () => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 200ms ease';
    setTimeout(() => overlay.remove(), 210);
  };

  approveBtn.addEventListener('click', () => { approveJourneyRequest(req.id); close(); });
  rejectBtn.addEventListener('click', () => {
    showConfirm(`Rejeitar comprovante de "${sec.sanitize(req.userName)}"?`, () => {
      rejectJourneyRequest(req.id); close();
    });
  });
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
}

/** Renderiza a fila de aprovações de jornada na Gestão */
function renderJourneyApprovalList() {
  const container = document.getElementById('journeyApprovalAdminList');
  if (!container) return;
  const sec = typeof NextSecurity !== 'undefined' ? NextSecurity : { sanitize: s => s };

  const all = dbApi?.getAll(JOURNEY_REQUESTS_KEY) || [];
  const pending = all.filter(r => r.status === 'pending').sort((a, b) => b.createdAt - a.createdAt);

  if (!pending.length) {
    container.innerHTML = `<p class='safety-note'>Nenhum comprovante aguardando aprovação.</p>`;
    return;
  }

  container.innerHTML = pending.map(req => {
    const step = JOURNEY_STEPS.find(s => s.id === req.stepId);
    const stepColor = step?.color || 'var(--blue)';
    const date = new Date(req.createdAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    return `
      <article class="admin-list-item" style="gap:8px;">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:8px;">
          <div>
            <strong style="font-size:1rem;">${sec.sanitize(req.userName)}</strong>
            <span style="display:block;font-size:0.8rem;color:${stepColor};font-weight:800;text-transform:uppercase;margin-top:2px;">
              ${step?.icon || ''} ${sec.sanitize(req.stepName)}
            </span>
            <span style="display:block;font-size:0.75rem;color:var(--muted);margin-top:2px;">📅 ${date}</span>
          </div>
          <span class="small-badge" style="background:rgba(251,191,36,0.12);color:#b45309;border:1px solid rgba(251,191,36,0.3);">
            Aguardando
          </span>
        </div>
        <div class="btn-row" style="margin-top:6px;">
          <button class="primary-button compact btn-view-journey-proof" data-req-id="${req.id}" type="button">
            👁 Ver comprovante
          </button>
        </div>
      </article>
    `;
  }).join('');

  container.querySelectorAll('.btn-view-journey-proof').forEach(btn => {
    btn.addEventListener('click', () => {
      const all2 = dbApi?.getAll(JOURNEY_REQUESTS_KEY) || [];
      const req2 = all2.find(r => r.id === btn.dataset.reqId);
      if (req2) openJourneyPhotoModal(req2);
    });
  });
}

function saveJourneyStep(stepId) {
  // Líderes podem aprovar diretamente do perfil do jovem
  const data = getJourneyData();
  data[stepId] = { unlockedAt: Date.now(), approvedBy: currentUser.name };
  localStorage.setItem(JOURNEY_KEY, JSON.stringify(data));
  const user = authApi?.currentUser?.();
  if (user) authApi?.updateSession?.({ journey: data });
  renderJourney();
  toast(`Conquista desbloqueada: ${JOURNEY_STEPS.find(s => s.id === stepId)?.name}! 🎉`, 'success', 4000);
}

function renderJourney() {
  const track = document.getElementById('journeyTrack');
  const progressEl = document.getElementById('journeyProgress');
  if (!track) return;

  const data = getJourneyData();
  const unlocked = Object.keys(data).length;
  const servirUnlocked = ['descubra','avance','fundamentos'].every(id => Boolean(data[id]));

  if (progressEl) progressEl.textContent = `${unlocked} / ${JOURNEY_STEPS.length}`;

  // Mostra/esconde banner de desbloqueio da aba Servir
  const bannerEl = document.getElementById('journeyServingBanner');
  if (bannerEl) bannerEl.style.display = servirUnlocked ? 'flex' : 'none';

  track.innerHTML = JOURNEY_STEPS.map((step, idx) => {
    const isDone     = Boolean(data[step.id]);
    const myRequest  = getJourneyRequest(currentUser.id, step.id);
    const isPending  = myRequest && myRequest.status === 'pending';
    const isRejected = myRequest && myRequest.status === 'rejected';
    const date = isDone
      ? new Date(data[step.id].unlockedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
      : null;

    const medalHtml = isDone
      ? `<div class="journey-medal unlocked" style="--journey-color:${step.color};">
           <span class="journey-medal-icon">${step.icon}</span>
           <span class="journey-medal-check">✓</span>
         </div>`
      : `<div class="journey-medal ${isPending ? 'pending' : isRejected ? 'rejected' : ''} locked" style="--journey-color:${step.color};">
           <span class="journey-medal-num">${isPending ? '⏳' : isRejected ? '✕' : (idx + 1)}</span>
         </div>`;

    const levelTag = `<span class="journey-level-tag" style="background:${isDone ? step.color : step.optional ? 'rgba(220,38,38,0.1)' : 'var(--line)'}; color:${isDone ? '#fff' : step.optional ? '#dc2626' : 'var(--muted)'};">${step.level}</span>`;

    const optionalNote = step.optional && !isDone
      ? `<span style="display:block;font-size:0.75rem;color:var(--muted);margin-top:4px;font-style:italic;">Este passo é opcional — a aba Servir não depende dele.</span>`
      : '';

    let actionHtml;
    if (isDone) {
      actionHtml = `<div class="journey-trophy" style="color:${step.color};">🏆</div>`;
    } else if (canManage()) {
      actionHtml = `<button class="journey-unlock-btn" type="button"
          data-journey-unlock="${step.id}" style="--journey-color:${step.color};">
          Confirmar
        </button>`;
    } else if (isPending) {
      actionHtml = `<div class="journey-pending-badge">⏳ Aguardando</div>`;
    } else if (isRejected) {
      actionHtml = `<button class="journey-unlock-btn" type="button"
          data-journey-submit="${step.id}"
          style="--journey-color:#dc2626;border-color:#dc2626;color:#dc2626;">
          Reenviar
        </button>`;
    } else {
      actionHtml = `<button class="journey-unlock-btn" type="button"
          data-journey-submit="${step.id}" style="--journey-color:${step.color};">
          Já conclui
        </button>`;
    }

    const rejectedNote = isRejected
      ? `<span style="display:block;font-size:0.75rem;color:#dc2626;margin-top:4px;font-weight:700;">❌ Comprovante rejeitado — envie novamente</span>`
      : '';

    return `
      <div class="journey-step ${isDone ? 'unlocked' : ''} ${isPending ? 'step-pending' : ''} ${isRejected ? 'step-rejected' : ''}"
           style="--journey-color:${step.color};">
        ${medalHtml}
        <div class="journey-info">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:2px;">
            <strong>${step.name}</strong>
            ${levelTag}
            ${step.id === 'ide' ? `<span style="font-size:0.70rem;font-weight:800;background:rgba(107,114,128,0.12);color:var(--muted);border:1px solid var(--line);border-radius:20px;padding:2px 8px;">Opcional</span>` : ''}
          </div>
          <p>${isDone
            ? `<span style="color:${step.color};font-weight:700;">✓ Conquista desbloqueada</span> · ${date}`
            : step.desc}</p>
          ${step.id === 'ide' && !isDone ? `<span style="display:block;font-size:0.75rem;color:var(--muted);margin-top:2px;">⭐ Complementar — não obrigatório para servir</span>` : ''}
          ${isDone ? `<span class="journey-badge-label" style="background:color-mix(in srgb,${step.color} 12%,transparent);color:${step.color};">${step.emoji} ${step.badgeLabel}</span>` : ''}
          ${rejectedNote}
        </div>
        ${actionHtml}
      </div>
    `;
  }).join('');

  const steps = track.querySelectorAll('.journey-step');
  steps.forEach((el, i) => { if (i < steps.length - 1) el.style.marginBottom = '0'; });

  // Banner de desbloqueio da aba Servir
  let servirBanner = document.getElementById('journeyServirBanner');
  if (!servirBanner) {
    servirBanner = document.createElement('div');
    servirBanner.id = 'journeyServirBanner';
    track.insertAdjacentElement('afterend', servirBanner);
  }
  if (servirUnlocked && currentUser.role === 'jovem') {
    servirBanner.innerHTML = `
      <div style="margin-top:16px;padding:14px 16px;border-radius:12px;
          background:linear-gradient(135deg,rgba(16,185,129,0.12),transparent);
          border:1.5px solid rgba(16,185,129,0.35);display:flex;align-items:center;gap:12px;">
        <span style="font-size:1.6rem;">🎉</span>
        <div>
          <p style="margin:0;font-size:0.88rem;font-weight:800;color:#065f46;">Aba <strong>Quero Servir</strong> desbloqueada!</p>
          <p style="margin:2px 0 0;font-size:0.78rem;color:#047857;">Você completou os 3 passos obrigatórios. Explore a aba no menu!</p>
        </div>
      </div>
    `;
  } else {
    servirBanner.innerHTML = '';
  }

  track.querySelectorAll('[data-journey-submit]').forEach(btn => {
    btn.addEventListener('click', () => openJourneyUploadModal(btn.dataset.journeySubmit));
  });

  track.querySelectorAll('[data-journey-unlock]').forEach(btn => {
    btn.addEventListener('click', () => {
      showConfirm(
        `Confirmar conquista "${JOURNEY_STEPS.find(s => s.id === btn.dataset.journeyUnlock)?.name}" para ${currentUser.name}?`,
        () => saveJourneyStep(btn.dataset.journeyUnlock)
      );
    });
  });
}
function renderPerfil() {
  const card = document.getElementById('perfilCard');
  if (!card) return;

  const profile = getProfileFromStorage();
  const avatar  = card.querySelector('.avatar-large');
  const nameEl  = document.getElementById('perfilName');
  const metaEl  = document.getElementById('perfilMeta');

  if (avatar) {
    if (profile.photo) {
      avatar.style.backgroundImage = `url(${profile.photo})`;
      avatar.style.backgroundSize  = 'cover';
      avatar.style.backgroundPosition = 'center';
      avatar.textContent = '';
      avatar.classList.add('has-photo');
    } else {
      avatar.textContent = initials(profile.name || currentUser.name);
      avatar.classList.remove('has-photo');
    }
  }

  if (nameEl) nameEl.textContent = profile.name || currentUser.name;
  if (metaEl) metaEl.textContent = `${profile.city || 'AD Fonte de Vida'} · ${roleLabels[currentUser.role] || 'Jovem'}`;

  renderJourney();
}

function bindEvents() {
  navButtons.forEach((button) => button.addEventListener("click", () => setView(button.dataset.target)));

  document.querySelector("#menuToggle")?.addEventListener("click", () => document.body.classList.add("menu-open"));
  document.querySelector("#backdrop")?.addEventListener("click", () => document.body.classList.remove("menu-open"));

  document.querySelectorAll("[data-content-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("[data-content-tab]").forEach((button) => button.classList.toggle("active", button === tab));
      document.querySelectorAll(".content-grid").forEach((grid) => grid.classList.toggle("active", grid.id === tab.dataset.contentTab));
    });
  });

  document.querySelector("#contentType")?.addEventListener("change", updateContentFormFields);
  document.querySelector("#contentManageForm")?.addEventListener("submit", saveContentItem);
  document.querySelector("#contentCancelBtn")?.addEventListener("click", () => resetContentForm());

  document.querySelector("#groupList")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-group-target]");
    if (!btn) return;
    currentGroupId = btn.dataset.groupTarget;
    renderGroupList();
    renderGroupChat();
  });

  document.querySelector("#groupChatForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.querySelector("#groupChatInput");
    saveGroupMessage(input.value.trim());
    input.value = "";
    renderGroupChat();
    scrollChatToBottom(document.querySelector("#groupChatWindow"), true);
  });

  document.querySelector("#groupChatWindow")?.addEventListener("click", (e) => {
    const pinBtn = e.target.closest("[data-pin-msg]");
    if (!pinBtn || !canManage()) return;
    togglePinMessage(pinBtn.dataset.pinMsg);
  });

  document.querySelector("#scaleDeptSelect")?.addEventListener("change", renderDynamicScaleFields);
  document.querySelector("#scaleEventSelect")?.addEventListener("change", renderDynamicScaleFields);
  
  document.querySelector("#saveScaleBtn")?.addEventListener("click", () => {
    const eventId = document.querySelector("#scaleEventSelect").value;
    const dept = document.querySelector("#scaleDeptSelect").value;
    const selects = document.querySelectorAll(".scale-func-assign");
    
    const assignments = [];
    selects.forEach(sel => {
      if (sel.value) {
        const servantUser = getUsers().find(u => u.id === sel.value);
        assignments.push({
          functionName: sel.dataset.func,
          userId: sel.value,
          userName: servantUser ? servantUser.name : "Servo"
        });
      }
    });

    if (!eventId) {
      document.querySelector("#scaleMessage").textContent = "Erro: Selecione um evento ativo.";
      return;
    }

    saveItem("next_scales", {
      id: `scale_${Date.now()}`,
      eventId,
      dept,
      assignments,
      createdAt: Date.now()
    });

    document.querySelector("#scaleMessage").textContent = "A escala oficial foi publicada com sucesso!";
    renderMyScales();
  });

  const appReason = document.querySelector("#appReason");
  const qGroup2 = document.querySelector("#qGroup2");
  const qGroup3 = document.querySelector("#qGroup3");
  const switchBap = document.querySelector("#switchBaptized");
  const switchFund = document.querySelector("#switchFundamentals");
  const submitAppBtn = document.querySelector("#submitApplicationBtn");

  appReason?.addEventListener("input", () => {
    const filled = appReason.value.trim().length > 2;

    // Passo 1 → resposta preenchida: mostra pergunta do batismo
    if (filled) { qGroup2.style.display = "grid"; qGroup2.classList.add("qgroup-visible"); }
    else { qGroup2.style.display = "none"; qGroup2.classList.remove("qgroup-visible"); }


    // Passo 2 → batismo respondido: mostra pergunta dos fundamentos
    const batismoRespondido = filled && switchBap.getAttribute("aria-checked") !== "false";
    if (batismoRespondido) { qGroup3.style.display = "grid"; qGroup3.classList.add("qgroup-visible"); }
    else { qGroup3.style.display = "none"; qGroup3.classList.remove("qgroup-visible"); }

    // Passo 3 → botão só aparece depois do batismo (fundamentos é opcional)
    submitAppBtn.style.display = filled ? "block" : "none";
  });

  switchBap?.addEventListener("click", () => {
    const isChecked = switchBap.getAttribute("aria-checked") === "true";
    switchBap.setAttribute("aria-checked", isChecked ? "false" : "true");

    // Ao responder o batismo, revela os fundamentos da fé
    const filled = appReason.value.trim().length > 2;
    if (filled) { qGroup3.style.display = "grid"; qGroup3.classList.add("qgroup-visible"); }
    else { qGroup3.style.display = "none"; qGroup3.classList.remove("qgroup-visible"); }
    submitAppBtn.style.display = filled ? "block" : "none";
  });

  switchFund?.addEventListener("click", () => {
    const isChecked = switchFund.getAttribute("aria-checked") === "true";
    switchFund.setAttribute("aria-checked", isChecked ? "false" : "true");
  });

  // 1. Envio da Inscrição pelo Jovem
  document.querySelector("#applicationForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    
    saveItem("next_applications", {
      id: `app_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAge: currentUser.age ? `${currentUser.age} anos` : "Idade não informada",
      dept: document.querySelector("#appDept").value,
      reason: appReason.value.trim(),
      isBaptized: switchBap.getAttribute("aria-checked") === "true" ? "Sim" : "Não",
      hasFundamentals: switchFund.getAttribute("aria-checked") === "true" ? "Sim" : "Não",
      status: "pending", // Status inicial para cair na caixa da liderança
      createdAt: Date.now()
    });

    document.querySelector("#appMessage").textContent = "Sua inscrição foi enviada com sucesso para a liderança!";
    e.target.reset();
    switchBap.setAttribute("aria-checked", "false");
    switchFund.setAttribute("aria-checked", "false");
    qGroup2.style.display = "none";
    qGroup3.style.display = "none";
    submitAppBtn.style.display = "none";
  });

  // 2. Painel da Liderança: Decidir o que fazer com a Inscrição
  document.querySelector("#applicationsAdminList")?.addEventListener("click", (e) => {
    const approveBtn = e.target.closest(".btn-approve-app");
    const discussBtn = e.target.closest(".btn-discuss-app");

    if (approveBtn) {
      const appId = approveBtn.dataset.appId;
      const apps = getAll("next_applications", []);
      const appObj = apps.find(a => a.id === appId);
      if (!appObj) return;

      const user = getUsers().find(u => u.id === appObj.userId);
      if (user) {
        // Atualiza o jovem adicionando o novo setor e a permissão de servo
        const types = user.servoType || [];
        if (!types.includes(appObj.dept)) types.push(appObj.dept);
        saveItem("next_users", { ...user, hasServo: true, servoType: types });
      }
      
      // Marca a inscrição como resolvida para sumir da tela
      appObj.status = "resolved";
      saveItem("next_applications", appObj);
      renderApplicationsList();
      renderServoOptions(); // Atualiza as outras caixinhas de gestão
      toast(`${appObj.userName} adicionado à equipe de ${appObj.dept}! ✓`, 'success');
    }

    if (discussBtn) {
      const appId = discussBtn.dataset.appId;
      const apps = getAll("next_applications", []);
      const appObj = apps.find(a => a.id === appId);
      if (!appObj) return;

      // Cria a mensagem automática em nome do líder logado para o jovem
      const targetLeaderName = currentUser.name;
      const threadId = threadIdFor(targetLeaderName, appObj.userId);
      
      saveItem("next_messages", {
        id: `msg_${Date.now()}`,
        threadId: threadId,
        leaderName: targetLeaderName,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        anonymous: false,
        text: `Olá, ${appObj.userName}! Vi a sua inscrição para servir na equipe de ${appObj.dept}. Gostaria de marcar uma conversa rápida com você para alinharmos os próximos passos. Quando você tem disponibilidade?`,
        createdAt: Date.now(),
      });

      // Marca como resolvida para sumir da tela de pendências
      appObj.status = "resolved";
      saveItem("next_applications", appObj);
      renderApplicationsList();
      toast(`Mensagem enviada para ${appObj.userName}! Veja na aba Mensagens.`, 'info');
    }
  });

  const logoutBtn = document.querySelector("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
    showConfirm(
      'Tem certeza que deseja sair da sua conta?',
      () => NextAuth.logout()
    );
    });
  }

  const themeBtn  = document.querySelector("#themeToggleBtn");
  const themeText = document.querySelector("#themeToggleText");

  function applyTheme(dark) {
    document.body.classList.toggle("dark-mode", dark);
    if (themeBtn) {
      themeBtn.setAttribute("aria-checked", dark ? "true" : "false");
    }
    if (themeText) {
      themeText.textContent = dark ? "☀️ Claro" : "🌙 Escuro";
    }
    localStorage.setItem("next_theme", dark ? "dark" : "light");
  }

  applyTheme(localStorage.getItem("next_theme") === "dark");

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isDark = themeBtn.getAttribute("aria-checked") !== "true";
      applyTheme(isDark);
    });
  }

  const shopImageInput = document.querySelector("#shopProductImage");
  if (shopImageInput) {
    shopImageInput.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        shopProductImageData = "";
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        shopProductImageData = String(reader.result);
      });
      reader.readAsDataURL(file);
    });
  }

  const agendaFilter = document.querySelector("#agendaFilter");
  if (agendaFilter) {
    agendaFilter.addEventListener("change", (event) => {
      currentAgendaFilter = event.target.value;
      renderCalendar();
    });
  }

  const roleForm = document.querySelector("#roleChangeForm");
  if (roleForm) roleForm.addEventListener("submit", changeUserRole);

  document.querySelector("#agendaDetail")?.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest("#deleteEventBtn");
    if (!deleteBtn) return;

    const eventId = deleteBtn.dataset.eventId;
    showConfirm(
      'Remover este evento do cronograma?',
      () => { NextDB.remove("next_events", eventId); renderCalendar(); }
    );
  });

  document.querySelector("#cultStatusOptions")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-stage]");
    if (!button || !canManage()) return;
    setValue("next_cult_status", button.dataset.stage);
    renderCultStatus();
  });
  
  document.querySelector("#chatSearchInput")?.addEventListener("input", (event) => {
    chatSearchTerm = event.target.value.toLowerCase();
    renderChatContacts();
  });

  document.querySelector("#leaderList")?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-chat-target]");
    if (!btn) return;
    chatTargetName = btn.dataset.chatName;
    chatTargetId = btn.dataset.chatId;
    renderChatContacts();
    renderYoungChat();
  });

  document.querySelector("#chatForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#chatInput");
    const text = input.value.trim();
    if (!text) return;
    saveYoungMessage(text);
    input.value = "";
    renderYoungChat();
    scrollChatToBottom(document.querySelector("#chatWindow"), true);
  });

  document.querySelector("#threadList")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-thread]");
    if (!button) return;
    selectedThreadId = button.dataset.thread;
    renderLeaderInbox();
  });

  document.querySelector("#leaderReplyForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#leaderReplyInput");
    const text = input.value.trim();
    if (!text) return;
    saveLeaderReply(text);
    input.value = "";
    renderLeaderInbox();
    scrollChatToBottom(document.querySelector("#leaderChatWindow"), true);
  });

  document.querySelector("#agendaList")?.addEventListener("click", (event) => {
    const agendaCard = event.target.closest("[data-agenda-index]");
    if (!agendaCard) return;
    selectAgendaItem(Number(agendaCard.dataset.agendaIndex));
  });

  document.querySelector("#calendarStrip")?.addEventListener("click", (event) => {
    const dayChip = event.target.closest("[data-day]");
    if (!dayChip) return;
    const index = _lastFilteredEvents
      .findIndex((item) => String(item.date) === dayChip.dataset.day);
    if (index >= 0) {
      selectAgendaItem(index);
      return;
    }
    document.querySelectorAll(".day-chip").forEach((chip) => chip.classList.toggle("active", chip === dayChip));
    document.querySelectorAll(".agenda-card").forEach((card) => card.classList.remove("active"));
    document.querySelector("#agendaDetail").innerHTML = `
      <p class="eyebrow">Dia ${dayChip.dataset.day}</p>
      <h3>Nenhum evento marcado</h3>
      <p>Quando a liderança adicionar algo para esse dia, os detalhes aparecem aqui.</p>
    `;
  });

  document.querySelector("#profilePhoto")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      profilePhotoData = String(reader.result);
      applyProfile({
        ...getProfileFromStorage(),
        photo: profilePhotoData,
        name: document.querySelector("#profileName").value.trim() || currentUser.name,
        age: document.querySelector("#profileAge").value,
        role: document.querySelector("#profileRole").value.trim() || roleLabels[currentUser.role],
      });
    });
    reader.readAsDataURL(file);
  });
  
  const shopForm = document.querySelector("#shopManageForm");
  const shopImageHint = document.querySelector("#shopProductImageHint");

  if (shopForm) {
    shopForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = document.querySelector("#shopProductId").value;
      const title = document.querySelector("#shopProductTitle").value.trim();
      const price = document.querySelector("#shopProductPrice").value.trim();
      const quantity = parseInt(document.querySelector("#shopProductQuantity").value) || 0;
      const text = document.querySelector("#shopProductText").value.trim();

      let finalImage = shopProductImageData;
      if (id && !finalImage) {
        const existingProduct = getProducts().find(p => p.id === id);
        if (existingProduct && existingProduct.image) {
          finalImage = existingProduct.image;
        }
      }

      saveItem("next_products", {
        id: id || `prod_${Date.now()}`,
        title,
        price,
        quantity,
        image: finalImage,
        text,
        available: true
      });
      
      document.querySelector("#shopAdminMessage").textContent = id ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!";

      shopForm.reset();
      shopProductImageData = "";
      if (shopImageHint) shopImageHint.style.display = "none";
      document.querySelector("#shopProductId").value = "";
      document.querySelector("#shopFormTitle").textContent = "Adicionar Produto";
      document.querySelector("#shopCancelBtn").style.display = "none";
      renderShop();
    });

    document.querySelector("#shopCancelBtn").addEventListener("click", () => {
      shopForm.reset();
      shopProductImageData = "";
      if (shopImageHint) shopImageHint.style.display = "none";
      document.querySelector("#shopProductId").value = "";
      document.querySelector("#shopFormTitle").textContent = "Adicionar Produto";
      document.querySelector("#shopCancelBtn").style.display = "none";
      document.querySelector("#shopAdminMessage").textContent = "";
    });
  }

  const shopGridEl = document.querySelector("#shopGrid");
  if (shopGridEl) {
    shopGridEl.addEventListener("click", (event) => {
      const editBtn = event.target.closest("[data-edit-product]");
      const deleteBtn = event.target.closest("[data-delete-product]");

      if (editBtn) {
        const prodId = editBtn.dataset.editProduct;
        const product = getProducts().find(p => p.id === prodId);
        if (product) {
          document.querySelector("#shopProductId").value = product.id;
          document.querySelector("#shopProductTitle").value = product.title || "";
          document.querySelector("#shopProductPrice").value = product.price || "";
          document.querySelector("#shopProductQuantity").value = product.quantity ?? 0;
          document.querySelector("#shopProductText").value = product.text || "";
          
          document.querySelector("#shopProductImage").value = "";
          shopProductImageData = "";
          if (shopImageHint) shopImageHint.style.display = product.image ? "block" : "none";
          
          document.querySelector("#shopFormTitle").textContent = "Editar Produto";
          document.querySelector("#shopCancelBtn").style.display = "inline-block";
          document.querySelector("#shopAdminPanel").scrollIntoView({ behavior: 'smooth' });
        }
      }

      if (deleteBtn) {
        const prodId = deleteBtn.dataset.deleteProduct;
        showConfirm(
          'Remover este produto definitivamente?',
          () => { NextDB.remove("next_products", prodId); renderShop(); }
        );
      }
    });
  }

  // ---- File input: mostra nome do arquivo escolhido ----
  document.querySelectorAll('input[type="file"].file-input-hidden').forEach(input => {
    input.addEventListener('change', () => {
      const display = document.getElementById(input.id + 'Name');
      if (display) {
        display.textContent = input.files[0]?.name || 'Nenhum arquivo selecionado';
      }
    });
  });

  const profileForm = document.querySelector("#profileForm");
  if (profileForm) profileForm.addEventListener("submit", saveProfile);

  const prayerForm = document.querySelector("#prayerForm");
  if (prayerForm) prayerForm.addEventListener("submit", savePrayer);

  const postForm = document.querySelector("#postForm");
  if (postForm) postForm.addEventListener("submit", savePost);

  const eventForm = document.querySelector("#eventForm");
  if (eventForm) eventForm.addEventListener("submit", saveEvent);

  const servoForm = document.querySelector("#servoForm");
  if (servoForm) servoForm.addEventListener("submit", giveServoRole);

  // Resposta ao pedido de oração
  const prayerAdminList = document.querySelector("#prayerAdminList");
  if (prayerAdminList) {
    prayerAdminList.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-reply-prayer]");
      if (!btn) return;
      const prayerId = btn.dataset.replyPrayer;
      const input = document.querySelector(`#reply-${prayerId}`);
      const replyText = input?.value?.trim();
      if (!replyText) return;

      const prayers = getAll("next_prayers", []);
      const prayer = prayers.find(p => p.id === prayerId);
      if (!prayer) return;

      saveItem("next_prayers", { ...prayer, reply: replyText, repliedBy: currentUser.name, repliedAt: Date.now() });

      input.value = "";
      renderPrayerAdminList();
    });
  }

  // Confirmação semanal de célula pelo líder
  document.querySelector("#cellWeekPanel")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-confirm-cell-week");
    if (!btn) return;
    const cellId = btn.dataset.cellId;
    const cells = window.NEXT_CELLS || [];
    const cell = cells.find(c => c.id === cellId);
    if (!cell) return;
    confirmCellWeek(cellId);
    renderCellWeekPanel();
    toast(`Célula ${cell.name} confirmada! Próximo encontro desbloqueado. 🙌`, 'success');
  });

  // Célula: confirmar presença / entrar em contato
  document.querySelector("#cellPendingAdminList")?.addEventListener("click", (e) => {
    const confirmBtn = e.target.closest(".btn-confirm-cell");
    const contactBtn = e.target.closest(".btn-contact-cell");

    if (confirmBtn) {
      const interestId = confirmBtn.dataset.interestId;
      const userName   = confirmBtn.dataset.userName;
      const interests  = dbApi?.getAll("next_cell_interests") || [];
      const item       = interests.find(i => i.id === interestId);
      if (!item) return;
      item.status = "confirmed";
      dbApi?.save("next_cell_interests", item);

      // Marca o jovem como membro de célula
      const user = getUsers().find(u => u.id === item.userId);
      if (user) {
        saveItem("next_users", { ...user, hasCell: true, cellId: item.cellId, cellName: item.cellName });
      }

      renderCellPendingList();
      toast(`${userName} confirmado(a) na ${item.cellName}! ✓`, 'success');
    }

    if (contactBtn) {
      const userId   = contactBtn.dataset.userId;
      const userName = contactBtn.dataset.userName;
      const interestId = contactBtn.dataset.interestId;
      const interests  = dbApi?.getAll("next_cell_interests") || [];
      const item       = interests.find(i => i.id === interestId);

      // Envia mensagem automática para o jovem
      const threadId = threadIdFor(currentUser.name, userId);
      saveItem("next_messages", {
        id: `msg_${Date.now()}`,
        threadId,
        leaderName: currentUser.name,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        anonymous: false,
        text: `Oi, ${userName}! Vi que você demonstrou interesse na ${item?.cellName || "célula"}. Que ótimo! Quer que eu te passe mais detalhes sobre como funciona? Estou aqui para te ajudar. 🙌`,
        createdAt: Date.now(),
      });

      if (item) {
        item.status = "contacted";
        dbApi?.save("next_cell_interests", item);
      }

      renderCellPendingList();
      toast(`Mensagem enviada para ${userName}! Acompanhe pela aba Mensagens.`, 'info');
    }
  });
  bindBREvents();
  bindChecklistEvents();
  bindExportScala();
}

async function boot() {
  // Sanitiza chaves do localStorage que possam estar corrompidas
  const guardedKeys = ['next_posts','next_playlists','next_planos','next_events',
    'next_products','next_prayers','next_messages','next_group_messages','next_scales'];
  guardedKeys.forEach(key => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) JSON.parse(raw); // lança se corrompido
    } catch {
      console.warn('[boot] Dado corrompido removido:', key);
      localStorage.removeItem(key);
    }
  });

  try {
    await dbApi?.syncFromCloud?.();
  } catch (error) {
    console.warn("Falha ao sincronizar dados da nuvem:", error);
  }

  setupSessionUi();
  initOfflineDetector();
  maybeShowWelcome();
  setupPermissions();
  bindEvents();

  const renders = [
    renderGroupList, renderGroupChat, renderChecklist,
    renderFeed, renderDailyVerse, renderBirthdays,
    renderCalendar, renderContent, renderShop,
    renderMyPrayers, cleanOldBRPosts, renderBibleRats,
    renderCultStatus, renderChatContacts, renderYoungChat,
    renderLeaderInbox, updateUnreadBadge, updatePrayerBadge,
    renderMyScales,
    () => { if (typeof renderAgendaFilterOptions === 'function') renderAgendaFilterOptions(); },
    () => { if (typeof renderAdminLists === 'function') renderAdminLists(); },
    () => fillProfileForm(getProfileFromStorage()),
    renderPerfil,
  ];
  for (const fn of renders) {
    try { fn(); } catch (e) { console.error('[boot render]', fn.name || fn.toString().slice(0,40), e); }
  }
  setView(views.find((view) => view.classList.contains("active") && canView(view.id))?.id || allowedViews()[0]);

  // Realtime Supabase — escuta mudanças em tempo real
    if (supabaseClient) {
      const realtimeTables = ['next_messages', 'next_group_messages', 'next_prayers',
                              'next_events', 'next_posts', 'next_scales', 'next_journey_requests'];

      realtimeTables.forEach(table => {
        supabaseClient
          .channel(`realtime:${table}`)
          .on('postgres_changes', { event: '*', schema: 'public', table }, async () => {
            // Sincroniza só a tabela que mudou
            const { data, error } = await supabaseClient
              .from(table)
              .select('*')
              .order('createdAt', { ascending: true });

            if (data && !error) {
              localStorage.setItem(table, JSON.stringify(data));
            }

            // Re-renderiza a view correspondente
            const active = document.querySelector('.view.active');
            if (!active) return;

            if (table === 'next_messages' && active.id === 'conversa') renderYoungChat();
            if (table === 'next_messages' && active.id === 'mensagens') renderLeaderInbox();
            if (table === 'next_group_messages' && active.id === 'grupos') renderGroupChat();
            if (table === 'next_prayers' && active.id === 'gestao') renderPrayerAdminList();
            if (table === 'next_journey_requests' && active.id === 'gestao') renderJourneyApprovalList();
            if (table === 'next_events' && active.id === 'agenda') renderCalendar();
            if (table === 'next_posts' && active.id === 'home') renderFeed();
            if (table === 'next_scales' && active.id === 'servos') renderMyScales();
          })
          .subscribe();
      });
    } else {
      // Fallback: polling leve (15s) quando Supabase não está conectado (modo mock)
      setInterval(() => {
        const active = document.querySelector('.view.active');
        if (!active) return;
        if (active.id === 'conversa') renderYoungChat();
        if (active.id === 'mensagens') renderLeaderInbox();
        updateUnreadBadge();
        updatePrayerBadge();
        if (active.id === 'grupos') renderGroupChat();
        if (active.id === 'home') { renderFeed(); renderCultStatus(); renderDailyVerse(); renderBirthdays(); }
        if (active.id === 'agenda') renderCalendar();
      }, 15000);
    }
}

boot();