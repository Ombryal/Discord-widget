// =======================
// THEME TOGGLE
// =======================
const toggle = document.getElementById("themeToggle");

function initTheme() {
  if (localStorage.theme === "light") {
    document.body.classList.add("light");
  } else if (
    !localStorage.theme &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
}

initTheme();

toggle?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.theme = document.body.classList.contains("light")
    ? "light"
    : "dark";
});

// =======================
// MEMBERS NUMBER (STATIC 100+)
// =======================
const membersEl = document.getElementById("members");
if (membersEl) membersEl.textContent = "100+";

// =======================
// SCROLL FADE-IN
// =======================
const scrollElements = document.querySelectorAll(
  ".card, .rules, #moderators, .features"
);

function handleScrollAnimation() {
  scrollElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  });
}

window.addEventListener("scroll", handleScrollAnimation);
window.addEventListener("load", handleScrollAnimation);

// =======================
// DISCORD WIDGET & ORBIT
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

    // ---- ONLINE COUNT ----
    if (onlineEl && typeof data.presence_count === "number") {
      onlineEl.textContent = data.presence_count;
    }

    // ---- ORBIT MEMBERS ----
    if (!orbitContainer || !Array.isArray(data.members)) return;
    orbitContainer.innerHTML = "";

    const members = data.members.slice(0, 6);
    if (members.length === 0) return;

    const center = orbitContainer.offsetWidth / 2;
    const radius = window.innerWidth < 600 ? 70 : 95;
    const step = (2 * Math.PI) / members.length;

    members.forEach((m, i) => {
      const angle = step * i;

      const el = document.createElement("div");
      el.className = "orbit-member";

      // Compute x and y for perfect circle
      const x = center + radius * Math.cos(angle) - 30; // 30 = half width of orbit-member
      const y = center + radius * Math.sin(angle) - 30; // 30 = half height
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      // Avatar + status
      const avatarWrap = document.createElement("div");
      avatarWrap.className = "orbit-avatar";

      const img = document.createElement("img");
      img.src = m.avatar_url;
      img.alt = m.username;

      const status = document.createElement("span");
      status.className = `orbit-status status-${m.status || "online"}`;

      avatarWrap.appendChild(img);
      avatarWrap.appendChild(status);

      // Username
      const name = document.createElement("span");
      name.textContent = m.username;
      name.style.fontSize = "0.65rem";
      name.style.marginTop = "2px";

      el.appendChild(avatarWrap);
      el.appendChild(name);
      orbitContainer.appendChild(el);
    });

  } catch (err) {
    console.error("Discord widget error:", err);
  }
}

fetchDiscordWidget();
setInterval(fetchDiscordWidget, 60000);
