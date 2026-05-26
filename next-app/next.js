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
  jovem: ["home", "agenda", "conteudo", "loja", "oracao", "conversa", "configuracoes"],
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

const defaultEvents = [
  {
    id: "e1",
    date: "23",
    month: "Maio",
    weekDay: "Sabado",
    time: "19h30",
    title: "Culto Next",
    text: "Louvor, palavra e comunhao.",
    detail: "Encontro principal da juventude com louvor, palavra e comunhao.",
    location: "AD Fonte de Vida",
    audience: "geral",
  },
  {
    id: "e2",
    date: "25",
    month: "Maio",
    weekDay: "Segunda",
    time: "20h00",
    title: "Plano de leitura em grupo",
    text: "Inicio do plano de 7 dias no app.",
    detail: "Comeco do plano devocional da semana, para acompanhar em casa.",
    location: "Online",
    audience: "jovens",
  },
  {
    id: "e3",
    date: "29",
    month: "Maio",
    weekDay: "Sexta",
    time: "20h00",
    title: "Reuniao com responsaveis",
    text: "Alinhamento com lideres e pais.",
    detail: "Conversa rapida com os responsaveis sobre novidades e proximos encontros.",
    location: "AD Fonte de Vida",
    audience: "responsaveis",
  },
  {
    id: "e4",
    date: "31",
    month: "Maio",
    weekDay: "Domingo",
    time: "18h30",
    title: "Noite do amigo",
    text: "Evento geral da juventude.",
    detail: "Dia para trazer um amigo e participar com a galera do Next.",
    location: "AD Fonte de Vida",
    audience: "geral",
  },
];

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
  // Libera a aba de Equipes/Grupos para qualquer servo
  if (currentUser.hasServo && !base.includes("grupos")) base.push("grupos"); 
  
  // Garante que liderança também tenha acesso direto
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

  // Regra 1: Jovem sem cargo de servo não tem o botão de filtro
  if (currentUser.role === "jovem" && !currentUser.hasServo) {
    filterEl.style.display = "none";
    return;
  }

  // Prepara as opções baseadas no nível de acesso
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

  renderAgendaDetail(events.length ? 0 : -1);
}

function renderAgendaDetail(index) {
  const detail = document.querySelector("#agendaDetail");
  const sortedEvents = getEvents().sort((a, b) => Number(a.date) - Number(b.date));
  const item = sortedEvents[index];
  
  if (!item) {
    detail.innerHTML = `
      <p class="eyebrow">Detalhes</p>
      <h3>Nenhum evento selecionado</h3>
      <p>Escolha um dia ou evento da agenda para ver mais informações.</p>
    `;
    return;
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
    ${canManage() ? `
      <button class="ghost-button" id="deleteEventBtn" data-event-id="${item.id}" type="button" style="margin-top: 14px; color: #dc2626; border-color: #fca5a5; background: #fef2f2;">
        Excluir Evento
      </button>
    ` : ""}
  `;
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
  
  // Exibe ou esconde o painel de criação do produto
  const adminPanel = document.querySelector("#shopAdminPanel");
  if (adminPanel) {
    adminPanel.classList.toggle("hidden", !isManager);
  }

  document.querySelector("#shopGrid").innerHTML = getProducts()
    .map(
      (product) => {
        // Usa imagem customizada caso cadastrada, senão mantém os gradientes padrão do CSS
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

  // Renderiza a Timeline (sem o inativo)
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

  // Renderiza os botões de controle APENAS se for lider/admin
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
  
  // Muda os títulos dependendo de quem está logado
  document.querySelector("#chatListEyebrow").textContent = isLeader ? "Nova conversa" : "Escolha alguém";
  document.querySelector("#chatListTitle").textContent = isLeader ? "Jovens do Next" : "Líderes disponíveis";
  
  let contactsHTML = "";

  if (!isLeader) {
     // JOVEM VENDO A LISTA: Mostra os líderes, filtrando pela pesquisa
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
     // LIDERANÇA VENDO A LISTA: Mostra os jovens cadastrados, filtrando pela pesquisa
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

function renderYoungChat() {
  const chatWindow = document.querySelector("#chatWindow");
  if (!chatWindow) return;

  const isLeader = ["lider", "pastor", "missionaria", "admin"].includes(currentUser.role);
  
  // Oculta fisicamente a caixinha de anônimo na aba de Conversa para a liderança
  const anonToggle = document.querySelector(".anon-toggle");
  if (anonToggle) anonToggle.style.display = isLeader ? "none" : "flex";

  const targetLeaderName = isLeader ? currentUser.name : chatTargetName;
  const targetUserId = isLeader ? chatTargetId : currentUser.id;

  const threadId = threadIdFor(targetLeaderName, targetUserId);

  const messages = getMessages()
    .filter((m) => m.threadId === threadId)
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
}

// --- LÓGICA DE GRUPOS DE EQUIPE ---
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

  // Filtra os eventos que estão dentro da janela de 7 dias antes e não foram finalizados
  const upcomingEvents = events.filter(e => {
    let diff = Number(e.date) - today;
    if (diff < 0) diff += 30; // Tratamento básico para virada de mês
    
    // Se for hoje e o culto já acabou, a sala fecha
    if (diff === 0 && cultStatus === "Finalizado") return false;
    
    // O evento acontece nos próximos 7 dias (incluindo hoje)?
    return diff >= 0 && diff <= 7;
  });

  if (upcomingEvents.length > 0) {
    if (canManage()) {
      // Liderança vê tudo sempre que tem um evento na janela de 1 semana
      myGroups = ["Geral", "Servo", "Midia", "Intercessao"];
      isAnyEventValid = true;
    } else {
      // Jovens veem se estiverem escalados para algum desses eventos próximos
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

  // Bloqueio visual se não tiver acesso (Longe do culto, finalizado ou não escalado)
  if (!isAnyEventValid || myGroups.length === 0) {
     listEl.innerHTML = `<p class="safety-note" style="margin-top: 0;">Nenhum grupo ativo. Os chats abrem 1 semana antes do culto exclusivamente para a equipe escalada e somem após o encerramento.</p>`;
     if (formInput) formInput.disabled = true;
     if (submitBtn) submitBtn.disabled = true;
     currentGroupId = null;
     renderGroupChat(); 
     return;
  }

  // Mantém no grupo válido
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

  // Se o usuário não tiver acesso a nada no momento
  if (!currentGroupId) {
     windowEl.innerHTML = `<div class="chat-bubble system">Chat encerrado ou indisponível. Ele abre 1 semana antes do culto para quem está escalado.</div>`;
     if (banner) banner.style.display = "none";
     if (titleEl) titleEl.textContent = "Equipe Offline";
     return;
  }

  if (titleEl) titleEl.textContent = groupNames[currentGroupId];

  const allMsgs = getAll("next_group_messages", []).filter(m => m.groupId === currentGroupId);
  const orderedMsgs = allMsgs.sort((a, b) => a.createdAt - b.createdAt);
  
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
}

function saveGroupMessage(text) {
  if (!text) return;
  saveItem("next_group_messages", {
    id: `gmsg_${Date.now()}`,
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
  
  // Desfixa todas as outras do mesmo grupo e inverte o status dessa
  msgs.forEach(m => { if (m.groupId === msg.groupId) m.isPinned = false; });
  msg.isPinned = !msg.isPinned;
  
  saveItem("next_group_messages", msg);
  renderGroupChat();
}

function saveYoungMessage(text) {
  if (!chatTargetName || !chatTargetId) return;

  const isLeader = ["lider", "pastor", "missionaria", "admin"].includes(currentUser.role);
  
  // Trava de segurança no banco de dados: liderança NUNCA manda mensagem anônima
  const anonymous = isLeader ? false : (document.querySelector("#anonymousChat")?.checked || false);

  const targetLeaderName = isLeader ? currentUser.name : chatTargetName;
  const targetUserId = isLeader ? chatTargetId : currentUser.id;

  saveItem("next_messages", {
    id: `msg_${Date.now()}`,
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
  renderRoleAdminOptions(); // Atualiza a lista com o novo cargo
}

function threadIdFor(leaderName, userId = currentUser.id) {
  return `chat:${userId}:${slug(leaderName)}`;
}

function canSeeThread(message) {
  // Se for da liderança (Líder, Pastor ou Missionária), só vê se o nome bater
  if (["lider", "pastor", "missionaria"].includes(currentUser.role)) {
    return message.leaderName === currentUser.name;
  }
  // Se for jovem, só vê as mensagens que ele mesmo enviou
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
  // O Pastor, a Missionária e o Admin enxergam quem enviou
  if (message.anonymous && canManageAll()) return `Anônimo (auditoria: ${message.senderName})`;
  // Os líderes normais veem apenas "Anônimo"
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
    return { ...getBaseProfile(), ...(JSON.parse(localStorage.getItem(profileStorageKey)) || {}) };
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
  const settingsAvatar = document.querySelector("#settingsAvatar");
  const profilePill = document.querySelector(".profile-pill");

  document.querySelector("#settingsPreviewName").textContent = name;
  document.querySelector("#settingsPreviewMeta").textContent = `${age} | ${role}`;
  settingsAvatar.textContent = shortName;
  profilePill.querySelector("span").textContent = shortName;

  if (profile.photo) {
    settingsAvatar.style.backgroundImage = `url("${profile.photo}")`;
    profilePill.style.backgroundImage = `url("${profile.photo}")`;
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
      // Oculta completamente para Admin, Líder, Pastor e Missionária
      respGroup.style.display = "none";
    } else if (currentUser.role === "responsavel") {
      // Modifica o rótulo para os pais
      respGroup.style.display = "grid";
      respGroup.childNodes[0].textContent = "Responsável por";
      respInput.placeholder = "Nome do filho / jovem";
      respInput.value = profile.responsible || "";
    } else {
      // Mantém padrão para o Jovem
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
  saveItem("next_users", { ...(dbApi?.getOne("next_users", currentUser.id) || currentUser), ...profile });
  applyProfile(profile);
  document.querySelector("#profileMessage").textContent = "Perfil salvo neste navegador.";
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

  // Pega os setores marcados (garantindo que "Servo" sempre vá)
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
  const prayers = getPrayers().slice(0, 8);
  const list = document.querySelector("#prayerAdminList");
  if (!list) return;
  list.innerHTML = prayers.length
    ? prayers
        .map((prayer) => {
          const name = prayer.anonymous && !canManageAll() ? "Anonimo" : prayer.senderName;
          return `
            <article class="admin-list-item">
              <strong>${name}</strong>
              <p>${prayer.text}</p>
              <span class="small-badge">${prayer.wantsReply ? "Quer resposta" : "Sem resposta"}</span>
            </article>
          `;
        })
        .join("")
    : `<p class="safety-note">Nenhum pedido de oracao recebido ainda.</p>`;
}

function renderAdminLists() {
  if (!canManage()) return;
  renderEventAudienceOptions();
  renderServoOptions();
  renderPrayerAdminList();
  if (canManageAll()) renderRoleAdminOptions();
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

  document.querySelector("#prayerMessage").textContent = "Pedido enviado para a lideranca.";
  form.reset();
  renderPrayerAdminList();
}

function populateScaleEvents() {
  const selectEl = document.querySelector("#scaleEventSelect");
  if (!selectEl) return;
  selectEl.innerHTML = getEvents().map(e => `<option value="${e.id}">${e.title} - Dia ${e.date}</option>`).join("");
}

function renderDynamicScaleFields() {
  const dept = document.querySelector("#scaleDeptSelect").value;
  const eventId = document.querySelector("#scaleEventSelect").value;
  const container = document.querySelector("#dynamicFunctionsContainer");
  if (!container) return;

  const funcs = functionsMap[dept] || [];
  
  // Encontra quem tem o setor atual incluso no perfil
  const eligibleServants = getUsers().filter(u => u.hasServo && u.servoType && u.servoType.includes(dept));

  // CHECAGEM DE CONFLITO: Quem já foi escalado para ESTE evento em QUALQUER setor?
  const allScales = getAll("next_scales", []);
  const scalesForThisEvent = allScales.filter(s => s.eventId === eventId);
  const alreadyScheduledIds = new Set();
  scalesForThisEvent.forEach(scale => {
     scale.assignments.forEach(a => alreadyScheduledIds.add(a.userId));
  });

  container.innerHTML = funcs.map(f => {
    const selectOptions = `<option value="">-- Selecione o Voluntário --</option>` + 
      eligibleServants.map(s => {
        const isScheduled = alreadyScheduledIds.has(s.id);
        const disabledAttr = isScheduled ? "disabled" : "";
        const labelSuffix = isScheduled ? " (Já escalado no culto)" : "";
        return `<option value="${s.id}" ${disabledAttr}>${s.name}${labelSuffix}</option>`;
      }).join("");

    return `
      <label style="display: flex; flex-direction: column; gap: 4px;">
        Função: <strong>${f}</strong>
        <select class="scale-func-assign" data-func="${f}">
          ${selectOptions}
        </select>
      </label>
    `;
  }).join("");
}

function renderMyScales() {
  const container = document.querySelector("#myActiveScales");
  if (!container) return;

  const scales = getAll("next_scales", []);
  const events = getEvents();
  const isLeader = ["lider", "sublider", "pastor", "missionaria", "admin"].includes(currentUser.role);
  
  let visibleScales = scales;
  if (!isLeader) {
    // Isola a visualização: O jovem só vê as escalas dos setores que ele faz parte
    const myDepts = currentUser.servoType || ["Servo"];
    visibleScales = scales.filter(scale => myDepts.includes(scale.dept));
  }

  const htmlContent = visibleScales.map(scale => {
    const ev = events.find(e => e.id === scale.eventId);
    if (!ev) return "";

    const userAssignment = scale.assignments.find(a => a.userId === currentUser.id);
    if (isLeader || userAssignment) {
      return `
        <article class="feed-card" style="grid-template-columns: 1fr; gap: 10px; background: var(--surface);">
          <span class="feed-tag" style="background: var(--blue); color: #fff; width: fit-content; padding: 2px 8px;">Equipe ${scale.dept}</span>
          <h3 style="margin: 4px 0;">${ev.title} — Dia ${ev.date} às ${ev.time}</h3>
          <p style="margin: 0; font-size: 0.95rem;">Sua Atribuição: <strong style="color: #10b981;">${userAssignment ? userAssignment.functionName : "Coordenador Geral"}</strong></p>
          <div style="font-size: 0.85rem; padding-top: 8px; border-top: 1px dashed var(--line); margin-top: 4px; color: var(--muted);">
            ${scale.assignments.map(a => `· <strong>${a.functionName}:</strong> ${a.userName}`).join("<br>")}
          </div>
        </article>
      `;
    }
    return "";
  }).join("");

  container.innerHTML = htmlContent || `<p class="safety-note">Nenhuma designação oficial encontrada para o seu perfil neste mês.</p>`;
}

function bindEvents() {
  navButtons.forEach((button) => button.addEventListener("click", () => setView(button.dataset.target)));

  document.querySelector("#menuToggle").addEventListener("click", () => document.body.classList.add("menu-open"));
  document.querySelector("#backdrop").addEventListener("click", () => document.body.classList.remove("menu-open"));

  document.querySelectorAll("[data-content-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("[data-content-tab]").forEach((button) => button.classList.toggle("active", button === tab));
      document.querySelectorAll(".content-grid").forEach((grid) => grid.classList.toggle("active", grid.id === tab.dataset.contentTab));
    });
  });

  // Trocar de Grupo
  document.querySelector("#groupList")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-group-target]");
    if (!btn) return;
    currentGroupId = btn.dataset.groupTarget;
    renderGroupList();
    renderGroupChat();
  });

  // Enviar Mensagem no Grupo
  document.querySelector("#groupChatForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.querySelector("#groupChatInput");
    saveGroupMessage(input.value.trim());
    input.value = "";
    renderGroupChat();
  });

  // Fixar Aviso (Apenas Liderança)
  document.querySelector("#groupChatWindow")?.addEventListener("click", (e) => {
    const pinBtn = e.target.closest("[data-pin-msg]");
    if (!pinBtn || !canManage()) return;
    togglePinMessage(pinBtn.dataset.pinMsg);
  });

  // --- OUVIDORES DE EVENTO DE ESCALAS E INSCRIÇÃO DINÂMICA ---
  
  // Troca de campos ao mudar o ministério na criação da escala
  document.querySelector("#scaleDeptSelect")?.addEventListener("change", renderDynamicScaleFields);
  document.querySelector("#scaleEventSelect")?.addEventListener("change", renderDynamicScaleFields);
  // Processo de publicação de escalas
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

  // Fluxo Dinâmico Passo a Passo do Formulário "Quero Servir"
  const appReason = document.querySelector("#appReason");
  const qGroup2 = document.querySelector("#qGroup2");
  const qGroup3 = document.querySelector("#qGroup3");
  const switchBap = document.querySelector("#switchBaptized");
  const switchFund = document.querySelector("#switchFundamentals");
  const submitAppBtn = document.querySelector("#submitApplicationBtn");

  appReason?.addEventListener("input", () => {
    if (appReason.value.trim().length > 8) {
      qGroup2.style.display = "block";
    } else {
      qGroup2.style.display = "none";
      qGroup3.style.display = "none";
      submitAppBtn.style.display = "none";
    }
  });

  switchBap?.addEventListener("click", () => {
    const isChecked = switchBap.getAttribute("aria-checked") === "true";
    switchBap.setAttribute("aria-checked", !isChecked ? "true" : "false");
    qGroup3.style.display = "block";
  });

  switchFund?.addEventListener("click", () => {
    const isChecked = switchFund.getAttribute("aria-checked") === "true";
    switchFund.setAttribute("aria-checked", !isChecked ? "true" : "false");
    submitAppBtn.style.display = "block";
  });

  // Envio seguro injetando Nome e Idade de forma invisível
  document.querySelector("#applicationForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    
    saveItem("next_applications", {
      id: `app_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAge: currentUser.age || "Não especificada",
      dept: document.querySelector("#appDept").value,
      reason: appReason.value.trim(),
      isBaptized: switchBap.getAttribute("aria-checked") === "true" ? "Sim" : "Não",
      hasFundamentals: switchFund.getAttribute("aria-checked") === "true" ? "Sim" : "Não",
      createdAt: Date.now()
    });

    document.querySelector("#appMessage").textContent = "Sua inscrição foi recebida com sucesso pela liderança!";
    e.target.reset();
    switchBap.setAttribute("aria-checked", "false");
    switchFund.setAttribute("aria-checked", "false");
    qGroup2.style.display = "none";
    qGroup3.style.display = "none";
    submitAppBtn.style.display = "none";
  });

  // Ouvinte para Sair da Conta
  const logoutBtn = document.querySelector("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja sair da sua conta?")) {
        NextAuth.logout(); // Apaga a sessão e volta para a tela de login
      }
    });
  }

  // --- LÓGICA DO MODO ESCURO (COM SWITCH) ---
  const themeBtn = document.querySelector("#themeToggleBtn");
  const themeText = document.querySelector("#themeToggleText");
  
  function applyTheme(dark){
    document.body.classList.toggle("dark-mode", dark);
    if (themeBtn)  themeBtn.setAttribute("aria-checked", dark ? "true" : "false");
    if (themeText) themeText.textContent = dark ? "☀️ Claro" : "🌙 Escuro";
    localStorage.setItem("next_theme", dark ? "dark" : "light");
  }

  // Carrega preferência salva
  applyTheme(localStorage.getItem("next_theme") === "dark");
      
  if(themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isDark = themeBtn.getAttribute("aria-checked") !== "true";
      applyTheme(isDark);
    });
  }

  // Leitor de Imagem para a Lojinha
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
      renderCalendar(); // Recarrega a tela com os eventos filtrados
    });
  }

  const roleForm = document.querySelector("#roleChangeForm");
  if (roleForm) roleForm.addEventListener("submit", changeUserRole);

  // Ouvinte para excluir evento (Apenas para liderança)
  document.querySelector("#agendaDetail").addEventListener("click", (event) => {
    const deleteBtn = event.target.closest("#deleteEventBtn");
    if (!deleteBtn) return;

    const eventId = deleteBtn.dataset.eventId;
    if (confirm("Tem certeza que deseja remover este evento do cronograma?")) {
      NextDB.remove("next_events", eventId); // Remove do localStorage usando seu banco mock
      renderCalendar(); // Atualiza a agenda e os detalhes automaticamente
    }
  });

  document.querySelector("#cultStatusOptions").addEventListener("click", (event) => {
    const button = event.target.closest("[data-stage]");
    if (!button || !canManage()) return;
    setValue("next_cult_status", button.dataset.stage);
    renderCultStatus();
  });

  // --- NOVA LÓGICA DE CONVERSAS E PESQUISA ---
  
  // Barra de Pesquisa de Contatos
  document.querySelector("#chatSearchInput")?.addEventListener("input", (event) => {
    chatSearchTerm = event.target.value.toLowerCase();
    renderChatContacts();
  });

  // Clique em um Contato (Jovem ou Líder)
  document.querySelector("#leaderList").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-chat-target]");
    if (!btn) return;
    chatTargetName = btn.dataset.chatName;
    chatTargetId = btn.dataset.chatId;
    renderChatContacts();
    renderYoungChat();
  });

  document.querySelector("#chatForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#chatInput");
    const text = input.value.trim();
    if (!text) return;
    saveYoungMessage(text);
    input.value = "";
    renderYoungChat();
  });

  document.querySelector("#threadList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-thread]");
    if (!button) return;
    selectedThreadId = button.dataset.thread;
    renderLeaderInbox();
  });

  document.querySelector("#leaderReplyForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#leaderReplyInput");
    const text = input.value.trim();
    if (!text) return;
    saveLeaderReply(text);
    input.value = "";
    renderLeaderInbox();
  });

  document.querySelector("#agendaList").addEventListener("click", (event) => {
    const agendaCard = event.target.closest("[data-agenda-index]");
    if (!agendaCard) return;
    selectAgendaItem(Number(agendaCard.dataset.agendaIndex));
  });

  document.querySelector("#calendarStrip").addEventListener("click", (event) => {
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

  document.querySelector("#profilePhoto").addEventListener("change", (event) => {
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
  
  // --- LÓGICA DE GERENCIAMENTO DA LOJINHA (LÍDER, ADMIN, PASTOR, MISSIONÁRIA) ---
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

      // Se estiver editando e não mandou foto nova, mantém a antiga
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

      // Limpar formulário
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

  // Captura cliques dinâmicos nos botões Editar e Remover dentro da Grid da Lojinha
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
          
          // Reseta o campo de arquivo e mostra o aviso se já tiver imagem
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

  // --- OUTROS FORMULÁRIOS DE SISTEMA ---
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
}

async function boot() {
  setupSessionUi();
  setupPermissions();
  bindEvents();
  
  // Logo abaixo dos outros "renders" no topo do boot():
  renderGroupList();
  renderGroupChat();
  // E lá no setInterval (o atualizador de 3 em 3 segundos) adicione:
  if (document.querySelector("#grupos").classList.contains("active")) {
    renderGroupChat();
  }

  // Renderiza tudo na hora com o que já tem salvo no celular (Super Rápido)
  renderFeed();
  renderCalendar();
  renderContentCards("#playlists", playlists);
  renderContentCards("#planos", planos);
  renderShop();
  renderCultStatus();
  renderChatContacts();
  renderYoungChat();
  renderLeaderInbox();
  renderMyScales();
  if (typeof renderAgendaFilterOptions === 'function') renderAgendaFilterOptions();
  if (typeof renderAdminLists === 'function') renderAdminLists();
  fillProfileForm(getProfileFromStorage());
  setView(views.find((view) => view.classList.contains("active") && canView(view.id))?.id || allowedViews()[0]);

  // Vai na nuvem e puxa as mensagens novas silenciosamente
  if (typeof NextDB.syncFromCloud === 'function') {
    await NextDB.syncFromCloud();
    renderYoungChat();
    renderLeaderInbox();
    if (typeof renderPrayerAdminList === 'function') renderPrayerAdminList();

    // Cria o "Efeito WhatsApp": Atualiza o chat a cada 3 segundos se a pessoa estiver na aba
    setInterval(async () => {
      if (typeof NextDB.syncFromCloud === 'function') {
        await NextDB.syncFromCloud();
      }
      
      // 1. Se estiver no Início, atualiza avisos e andamento do culto
      if (document.querySelector("#home").classList.contains("active")) {
        renderFeed();
        renderCultStatus();
      }
      // 2. Se estiver na Agenda, atualiza o calendário e lista de eventos
      if (document.querySelector("#agenda").classList.contains("active")) {
        renderCalendar();
      }
      // 3. Se estiver no Chat Privado com Líder
      if (document.querySelector("#conversa").classList.contains("active")) {
        renderYoungChat();
      }
      // 4. Se for líder na Caixa de Entrada de Mensagens
      if (document.querySelector("#mensagens").classList.contains("active")) {
        renderLeaderInbox();
      }
      // 5. Se estiver nos Grupos de Equipe (Servos, Mídia, Intercessão)
      if (document.querySelector("#grupos") && document.querySelector("#grupos").classList.contains("active")) {
        if (typeof renderGroupChat === 'function') renderGroupChat();
      }
      // 6. Se estiver na aba Servos vendo as próprias escalas
      if (document.querySelector("#servos") && document.querySelector("#servos").classList.contains("active")) {
        if (typeof renderMyScales === 'function') renderMyScales();
      }
      // 7. Se for administrador na aba de Gestão
      if (document.querySelector("#gestao").classList.contains("active") && typeof renderPrayerAdminList === 'function') {
        renderPrayerAdminList();
      }
    }, 3000);
  }
}

boot();