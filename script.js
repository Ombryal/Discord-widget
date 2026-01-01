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
// DISCORD WIDGET & ORBIT + ONLINE LIST FIXED
// =======================
async function fetchDiscordWidget() {
  try {
    const res = await fetch(WIDGET_URL);
    if (!res.ok) throw new Error("Widget fetch failed");

    const data = await res.json();

    // ---- ONLINE COUNT ----
    if (onlineEl && typeof data.presence_count === "number") {
      onlineEl.textContent = data.presence_count;
    }

    if (!Array.isArray(data.members) || data.members.length === 0) return;

    // ---- ONLINE RIGHT NOW LIST ----
    const memberList = document.getElementById("memberList");
    if (memberList) {
      memberList.innerHTML = "";
      data.members.slice(0, 10).forEach(m => { // show up to 10 in list
        const div = document.createElement("div");
        div.className = "member-card";

        const img = document.createElement("img");
        img.className = "member-avatar";
        img.src = m.avatar_url;
        img.alt = m.username;

        const name = document.createElement("span");
        name.className = "member-name";
        name.textContent = m.username;

        div.appendChild(img);
        div.appendChild(name);
        memberList.appendChild(div);
      });
    }

    // ---- ORBIT MEMBERS ----
    if (!orbitContainer) return;
    orbitContainer.innerHTML = ""; // clear old members

    const members = data.members.slice(0, 6); // limit orbit to 6
    const radius = window.innerWidth < 600 ? 70 : 95;
    const step = (2 * Math.PI) / members.length;

    members.forEach((m, i) => {
      const angle = step * i;

      const el = document.createElement("div");
      el.className = "orbit-member";

      // position in circle
      el.style.transform = `rotate(${angle}rad) translate(${radius}px) rotate(${-angle}rad)`;

      const avatarWrap = document.createElement("div");
      avatarWrap.className = "orbit-avatar";

      const img = document.createElement("img");
      img.src = m.avatar_url;
      img.alt = m.username;

      const status = document.createElement("span");
      status.className = `orbit-status status-${m.status || "online"}`;

      avatarWrap.appendChild(img);
      avatarWrap.appendChild(status);

      const name = document.createElement("span");
      name.textContent = m.username;

      el.appendChild(avatarWrap);
      el.appendChild(name);
      orbitContainer.appendChild(el);

      // spin each member individually
      let rotation = angle;
      const intervalId = setInterval(() => {
        rotation += 0.01;
        if (!document.body.contains(el)) { // stop if element removed
          clearInterval(intervalId);
          return;
        }
        el.style.transform = `rotate(${rotation}rad) translate(${radius}px) rotate(${-rotation}rad)`;
      }, 16);
    });

  } catch (err) {
    console.error("Discord widget error:", err);
  }
}

fetchDiscordWidget();
setInterval(fetchDiscordWidget, 60000);

      // spin each member individually
      let rotation = angle;
      const intervalId = setInterval(() => {
        rotation += 0.01;
        if (!document.body.contains(el)) { // stop if element removed
          clearInterval(intervalId);
          return;
        }
        el.style.transform = `rotate(${rotation}rad) translate(${radius}px) rotate(${-rotation}rad)`;
      }, 16);
    });

  } catch (err) {
    console.error("Discord widget error:", err);
  }
}

fetchDiscordWidget();
setInterval(fetchDiscordWidget, 60000);
