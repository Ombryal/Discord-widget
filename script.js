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
const SERVER_ID = "1433645535583277129";

async function fetchStats() {
  try {
    const res = await fetch(`https://discord.com/api/guilds/${SERVER_ID}/widget.json`);
    if (!res.ok) return;
    const data = await res.json();

    // presence_count sometimes gives online count, fallback to counting members manually
    let totalMembers = data.members?.length || data.presence_count || 0;
    let onlineMembers = data.members?.filter(m => m.status !== "offline").length || data.presence_count || 0;

    // if widget JSON is missing members array, just display total online from presence_count
    if (!data.members) onlineMembers = data.presence_count || 0;

    document.getElementById("members").innerText = totalMembers;
    document.getElementById("online").innerText = onlineMembers;
  } catch(e) { 
    console.warn("Could not fetch stats"); 
    document.getElementById("members").innerText = "N/A";
    document.getElementById("online").innerText = "N/A";
  }
}

// Initial fetch + update every 60s
fetchStats();
setInterval(fetchStats, 60000);
