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

/* =========================
   DISCORD LIVE WIDGET FETCH
   ========================= */

const GUILD_WIDGET_URL =
  "https://discord.com/api/guilds/1433645535583277129/widget.json";

const membersEl = document.getElementById("members");
const onlineEl = document.getElementById("online");

const liveCountEl = document.getElementById("liveOnline");
const liveMembersEl = document.getElementById("liveMembers");

/* Number animation */
function animateNumber(el, target, duration = 1200) {
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* Fetch Discord widget */
async function fetchDiscordWidget() {
  try {
    const res = await fetch(GUILD_WIDGET_URL);
    const data = await res.json();

    /* Update top stats */
    if (membersEl) animateNumber(membersEl, data.presence_count + 50);
    if (onlineEl) animateNumber(onlineEl, data.presence_count);

    /* Live activity section */
    if (!liveMembersEl || !liveCountEl) return;

    liveCountEl.textContent = data.presence_count;
    liveMembersEl.innerHTML = "";

    data.members.forEach(member => {
      const pill = document.createElement("div");
      pill.className = "live-member";
      pill.textContent = member.username;
      liveMembersEl.appendChild(pill);
    });

  } catch (err) {
    console.error("Discord widget fetch failed:", err);
  }
}

/* Auto-scroll live members */
function autoScrollMembers() {
  if (!liveMembersEl) return;

  let scrollPos = 0;

  setInterval(() => {
    if (
      liveMembersEl.scrollWidth <=
      liveMembersEl.clientWidth
    ) return;

    scrollPos += 1;
    if (
      scrollPos >=
      liveMembersEl.scrollWidth - liveMembersEl.clientWidth
    ) {
      scrollPos = 0;
    }

    liveMembersEl.scrollLeft = scrollPos;
  }, 30);
}

/* Init */
fetchDiscordWidget();
autoScrollMembers();

/* Refresh every 30s */
setInterval(fetchDiscordWidget, 30000);
