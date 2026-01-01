// =======================
// THEME TOGGLE
// =======================
const toggle = document.getElementById("themeToggle");

// Initialize theme based on system or localStorage
const initTheme = () => {
  if (localStorage.theme === "light") {
    document.body.classList.add("light");
  } else if (!localStorage.theme && window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
};

initTheme();

// Toggle button click
toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.theme = document.body.classList.contains("light") ? "light" : "dark";
});

// =======================
// MEMBERS NUMBER ANIMATION
// =======================
function animateNumberPlus(element, target = 100, duration = 1500) {
  const start = 0;
  const range = target - start;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(start + range * progress);
    element.innerText = current + "+";
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const membersEl = document.getElementById("members");
if (membersEl) animateNumberPlus(membersEl);

// =======================
// SCROLL TRIGGERED FADE-IN
// =======================
const scrollElements = document.querySelectorAll(".card, .rules, #moderators, .features");

const elementInView = (el, offset = 0) => {
  const elementTop = el.getBoundingClientRect().top;
  return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
};

const displayScrollElement = (el) => {
  el.style.opacity = "1";
  el.style.transform = "translateY(0)";
};

const handleScrollAnimation = () => {
  scrollElements.forEach(el => {
    if (elementInView(el, 100)) {
      displayScrollElement(el);
    }
  });
};

window.addEventListener("scroll", handleScrollAnimation);
window.addEventListener("load", handleScrollAnimation);

// =======================
// DISCORD ONLINE COUNT
// =======================
const GUILD_ID = "1433645535583277129";
const WIDGET_URL = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;

async function fetchOnlineCount() {
  try {
    const res = await fetch(WIDGET_URL);
    if (!res.ok) throw new Error("Discord widget fetch failed");

    const data = await res.json();
    const onlineEl = document.getElementById("online");
    if (!onlineEl) return;

    const current = parseInt(onlineEl.textContent) || 0;
    const target = data.presence_count;

    let startTime = null;
    function animate(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const duration = 800;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(current + (target - current) * progress);
      onlineEl.textContent = value;
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

  } catch (err) {
    console.error("Discord API error:", err);
  }
}

// Initial load
fetchOnlineCount();

// Refresh every 60 seconds
setInterval(fetchOnlineCount, 60000);

// =======================
// LIVE MEMBER ROTATION
// =======================
const MEMBER_BATCH_SIZE = 6;
let memberIndex = 0;
let membersCache = [];

const memberListEl = document.getElementById("memberList");

async function fetchMembers() {
  try {
    const res = await fetch(WIDGET_URL);
    if (!res.ok) throw new Error("Widget fetch failed");
    const data = await res.json();

    membersCache = data.members || [];
    renderMemberBatch();
  } catch (err) {
    console.error("Member fetch error:", err);
  }
}

function renderMemberBatch() {
  if (!memberListEl || membersCache.length === 0) return;

  memberListEl.innerHTML = "";

  const batch = membersCache.slice(
    memberIndex,
    memberIndex + MEMBER_BATCH_SIZE
  );

  batch.forEach(member => {
    const card = document.createElement("div");
    card.className = "member-card";

    const avatar = document.createElement("img");
    avatar.className = "member-avatar";
    avatar.src = member.avatar_url;
    avatar.alt = member.username;

    const name = document.createElement("div");
    name.className = "member-name";
    name.textContent = member.username;

    card.appendChild(avatar);
    card.appendChild(name);
    memberListEl.appendChild(card);
  });

  memberIndex += MEMBER_BATCH_SIZE;
  if (memberIndex >= membersCache.length) {
    memberIndex = 0;
  }
}

// rotate every 5 seconds
setInterval(renderMemberBatch, 5000);

// initial load
fetchMembers();

// =======================
// DISCORD WIDGET (SAFE)
// =======================

const GUILD_ID = "1433645535583277129";
const WIDGET_URL = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;

const onlineEl = document.getElementById("online");
const orbitContainer = document.getElementById("memberOrbit");

async function fetchDiscordWidget() {
  try {
    const res = await fetch(WIDGET_URL);
    if (!res.ok) throw new Error("Widget fetch failed");

    const data = await res.json();

    /* ---- ONLINE COUNT ---- */
    if (onlineEl && typeof data.presence_count === "number") {
      onlineEl.textContent = data.presence_count;
    }

    /* ---- ORBIT MEMBERS ---- */
    if (!orbitContainer || !Array.isArray(data.members)) return;

    orbitContainer.innerHTML = "";

    const members = data.members.slice(0, 6);
    if (members.length === 0) return;

    const radius = window.innerWidth < 600 ? 75 : 95;
    const step = (2 * Math.PI) / members.length;

    members.forEach((m, i) => {
      const angle = step * i;

      const el = document.createElement("div");
      el.className = "orbit-member";
      el.style.transform = `
        rotate(${angle}rad)
        translate(${radius}px)
        rotate(-${angle}rad)
      `;

      const avatarWrap = document.createElement("div");
      avatarWrap.className = "orbit-avatar";

      const img = document.createElement("img");
      img.src = m.avatar_url;
      img.alt = m.username;

      const status = document.createElement("span");
      status.className = "orbit-status status-online";

      avatarWrap.appendChild(img);
      avatarWrap.appendChild(status);

      const name = document.createElement("span");
      name.textContent = m.username;

      el.appendChild(avatarWrap);
      el.appendChild(name);
      orbitContainer.appendChild(el);
    });

  } catch (e) {
    console.error("Discord widget error:", e);
  }
}

fetchDiscordWidget();
setInterval(fetchDiscordWidget, 60000);
