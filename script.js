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

// ==========================
// AUTO-SCROLL BOT CARDS
// ==========================
const botContainer = document.querySelector('.highlights-bots');
let scrollAmount = 0;
const scrollStep = 1; // pixels per frame
const scrollDelay = 10; // ms between frames

function autoScrollBots() {
  if (!botContainer) return;

  scrollAmount += scrollStep;
  
  if (scrollAmount >= botContainer.scrollWidth - botContainer.clientWidth) {
    scrollAmount = 0; // reset to start
  }

  botContainer.scrollTo({
    left: scrollAmount,
    behavior: 'smooth'
  });

  requestAnimationFrame(autoScrollBots);
}

// Start auto-scroll
autoScrollBots();

// Allow user scroll naturally
botContainer.addEventListener('mouseenter', () => {
  cancelAnimationFrame(autoScrollBots); // pause auto-scroll on hover
});
botContainer.addEventListener('mouseleave', () => {
  requestAnimationFrame(autoScrollBots); // resume auto-scroll
});
