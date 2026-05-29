const authApi = typeof NextAuth !== "undefined" ? NextAuth : null;
const dbApi = typeof NextDB !== "undefined" ? NextDB : null;
const currentUser = authApi?.currentUser();

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
  jovem: ["home", "agenda", "conteudo", "loja", "oracao", "conversa", "servir", "configuracoes"],
  responsavel: ["home", "agenda", "culto", "configuracoes"],
  lider: ["home", "agenda", "culto", "conteudo", "loja", "conversa", "mensagens", "gestao", "configuracoes"],
  sublider: ["home", "agenda", "culto", "conteudo", "loja", "conversa", "mensagens", "escalas", "gestao", "configuracoes"],
  pastor: ["home", "agenda", "culto", "conteudo", "loja", "conversa", "mensagens", "gestao", "configuracoes"],
  missionaria: ["home", "agenda", "culto", "conteudo", "loja", "conversa", "mensagens", "gestao", "configuracoes"],
  admin: ["home", "agenda", "culto", "conteudo", "loja", "gestao", "configuracoes", "servos"],
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
  { title: "Louvor Next", text: "Setlist para chegar no culto cantando junto.", progress: 76 },
  { title: "Semana com Deus", text: "Musicas para devocional e tempo de oracao.", progress: 52 },
  { title: "Pre-culto", text: "Uma selecao rapida para preparar o coracao.", progress: 34 },
];

const planos = [
  { title: "7 dias em Proverbios", text: "Sabedoria para escola, familia e amizades.", progress: 43 },
  { title: "Identidade em Cristo", text: "Leituras curtas para lembrar quem voce e em Deus.", progress: 18 },
  { title: "Evangelho de Marcos", text: "Um passo por dia acompanhando Jesus.", progress: 61 },
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

function allowedViews() {
  const base = [...(permissionsByRole[currentUser.role] || permissionsByRole.jovem)];
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

  if (target === "mensagens") renderLeaderInbox();
  if (target === "gestao") renderAdminLists();
  if (target === "culto") renderCultStatus();
  if (target === "escalas") {
    populateScaleEvents();
    renderDynamicScaleFields();
  }
  if (target === "servos") {
    renderMyScales();
  }
}

function setupSessionUi() {
  document.querySelector("#roleLabel").textContent = roleLabels[currentUser.role] || "Jovem";
  document.querySelector("#topbarDate").textContent = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
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
      alert('Envie uma mensagem para a liderança da célula pela aba "Conversar". Eles vão adorar te ajudar! 🙌');
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
  alert(msg);
}

function selectAgendaItem(index) {
  const item = getEvents().sort((a, b) => Number(a.date) - Number(b.date))[index];
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
  document.querySelector(target).innerHTML = items
    .map(
      (item) => `
        <article class="content-card">
          <div class="content-art"></div>
          <div>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
          </div>
          <div class="progress-bar" aria-label="Progresso">
            <span style="width: ${item.progress}%"></span>
          </div>
        </article>
      `,
    )
    .join("");
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
      alert(`${appObj.userName} foi adicionado à equipe de ${appObj.dept} com sucesso!`);
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
      alert(`Mensagem automática enviada para ${appObj.userName}! Acesse a aba "Mensagens" para aguardar a resposta.`);
    }
  });

  const logoutBtn = document.querySelector("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja sair da sua conta?")) {
        NextAuth.logout();
      }
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
    if (confirm("Tem certeza que deseja remover este evento do cronograma?")) {
      NextDB.remove("next_events", eventId);
      renderCalendar(); 
    }
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
    const index = getEvents()
      .sort((a, b) => Number(a.date) - Number(b.date))
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
        if (confirm("Tem certeza que deseja remover este produto definitivamente?")) {
          NextDB.remove("next_products", prodId);
          renderShop();
        }
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
    alert(`Célula ${cell.name} confirmada! O encontro da próxima semana já está desbloqueado na agenda. 🙌`);
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
      alert(`${userName} confirmado(a) na ${item.cellName}! ✓`);
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
      alert(`Mensagem enviada para ${userName}! Acompanhe pela aba Mensagens.`);
    }
  });
}

async function boot() {
  setupSessionUi();
  setupPermissions();
  bindEvents();
  
  renderGroupList();
  renderGroupChat();

  renderFeed();
  renderCalendar();
  renderContentCards("#playlists", playlists);
  renderContentCards("#planos", planos);
  renderShop();
  renderMyPrayers();
  renderCultStatus();
  renderChatContacts();
  renderYoungChat();
  renderLeaderInbox();
  renderMyScales();
  if (typeof renderAgendaFilterOptions === 'function') renderAgendaFilterOptions();
  if (typeof renderAdminLists === 'function') renderAdminLists();
  fillProfileForm(getProfileFromStorage());
  setView(views.find((view) => view.classList.contains("active") && canView(view.id))?.id || allowedViews()[0]);

  // Realtime Supabase — escuta mudanças em tempo real
    if (supabaseClient) {
      const realtimeTables = ['next_messages', 'next_group_messages', 'next_prayers',
                              'next_events', 'next_posts', 'next_scales'];

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
        if (active.id === 'grupos') renderGroupChat();
        if (active.id === 'home') { renderFeed(); renderCultStatus(); }
        if (active.id === 'agenda') renderCalendar();
      }, 15000);
    }
}

boot();