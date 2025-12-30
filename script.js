const toggle = document.getElementById("themeToggle");

// Auto apply system theme
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

// DISCORD LIVE STATS FETCH
const SERVER_ID = "1433645535583277129"; // replace if needed
const API_URL = `https://discord.com/api/guilds/${SERVER_ID}/widget.json`;

async function fetchStats() {
  try {
    const res = await fetch(`https://discord.com/api/guilds/${SERVER_ID}/widget.json`);
    if (!res.ok) return;
    const data = await res.json();
    document.getElementById("members").innerText = data.presence_count || "N/A";
    document.getElementById("online").innerText = data.members.filter(m=>m.status!=="offline").length || "N/A";
  } catch(e) { console.warn("Could not fetch stats"); }
}

// Initial fetch + update every 60 seconds
fetchStats();
setInterval(fetchStats, 60000);
