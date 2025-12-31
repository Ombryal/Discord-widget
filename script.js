// THEME TOGGLE
const toggle = document.getElementById("themeToggle");

// Auto theme from system
if (!localStorage.theme) {
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.body.classList.add("light");
  }
} else if (localStorage.theme === "light") {
  document.body.classList.add("light");
}

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.theme = document.body.classList.contains("light") ? "light" : "dark";
});

// STAT ANIMATION
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

function fetchStats() {
  const membersEl = document.getElementById("members");
  const onlineEl = document.getElementById("online");
  animateNumberPlus(membersEl);
  animateNumberPlus(onlineEl);
}

fetchStats();

// SCROLL-TRIGGERED FADE IN
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

const moderatorsContainer = document.querySelector('#moderators .moderator-grid.admins');
const modsContainer = document.querySelector('#moderators .moderator-grid.mods');

// Replace with your guild ID
const GUILD_ID = '1433645535583277129';
const WIDGET_URL = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;

// Fetch the widget JSON
async function fetchDiscordData() {
  try {
    const res = await fetch(WIDGET_URL);
    const data = await res.json();

    // Clear current cards
    moderatorsContainer.innerHTML = '';
    modsContainer.innerHTML = '';

    // Example: admins first
    data.members.forEach(member => {
      const isAdmin = member.roles && member.roles.includes('Admin'); // If you have roles
      const isMod = member.roles && member.roles.includes('Mod');

      const card = document.createElement('div');
      card.classList.add(isAdmin ? 'admin-card' : 'mod-card-secondary');

      // Avatar
      const img = document.createElement('img');
      img.src = member.avatar_url || `https://cdn.discordapp.com/embed/avatars/${member.discriminator % 5}.png`;
      img.alt = member.username;
      img.classList.add('mod-avatar');
      card.appendChild(img);

      // Name
      const name = document.createElement('div');
      name.classList.add('mod-name');
      name.textContent = member.username;
      card.appendChild(name);

      // Handle / tag
      const handle = document.createElement('div');
      handle.classList.add('mod-handle');
      handle.textContent = `#${member.discriminator}`;
      card.appendChild(handle);

      // Append to correct container
      if (isAdmin) moderatorsContainer.appendChild(card);
      else if (isMod) modsContainer.appendChild(card);
    });

  } catch (err) {
    console.error('Failed to fetch Discord widget:', err);
  }
}

// Initial fetch
fetchDiscordData();

// Optional: refresh every 60s to update online/offline
setInterval(fetchDiscordData, 60000);
