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
function fetchStats() {
  const membersEl = document.getElementById("members");
  const onlineEl = document.getElementById("online");

  // Hardcoded 100+ for both
  membersEl.innerText = "100+";
  onlineEl.innerText = "100+";
}

// Call it once on page load
fetchStats();

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
