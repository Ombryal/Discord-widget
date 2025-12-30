const toggle = document.getElementById("themeToggle");

// Auto theme from system
if (!localStorage.theme) {
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.body.classList.add("light");
  }
} else if (localStorage.theme === "light") {
  document.body.classList.add("light");
}

// Theme toggle
toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.theme = document.body.classList.contains("light") ? "light" : "dark";
});

// Discord stats fetch with animation
const SERVER_ID = "1433645535583277129";

function animateNumber(element, target, duration = 1000) {
  const start = parseInt(element.innerText.replace(/\D/g, "")) || 0;
  const range = target - start;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    element.innerText = Math.floor(start + range * progress);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

async function fetchStats() {
  try {
    const res = await fetch(`https://discord.com/api/guilds/${SERVER_ID}/widget.json`);
    if (!res.ok) return;
    const data = await res.json();

    let totalMembers = data.members?.length || data.presence_count || 0;
    let onlineMembers = data.members?.filter(m => m.status !== "offline").length || data.presence_count || 0;

    if (!data.members) onlineMembers = data.presence_count || 0;

    animateNumber(document.getElementById("members"), totalMembers);
    animateNumber(document.getElementById("online"), onlineMembers);
  } catch(e) {
    console.warn("Could not fetch stats");
    document.getElementById("members").innerText = "N/A";
    document.getElementById("online").innerText = "N/A";
  }
}

fetchStats();
setInterval(fetchStats, 60000);

// Collapsible sections logic
function toggleSection(id) {
  const sections = document.querySelectorAll('.collapsible');
  sections.forEach(section => {
    if (section.id === id) {
      section.classList.toggle('active');
      if(section.classList.contains('active')){
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      section.classList.remove('active');
    }
  });
}
