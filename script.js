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
