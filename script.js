// =======================
// THEME TOGGLE
// =======================
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

// Animate members on load
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
// DISCORD ONLINE COUNT & MEMBER CAROUSEL
// =======================
const GUILD_ID = "1433645535583277129";
const WIDGET_URL = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;

// Color palette for avatar backgrounds
const avatarColors = [
  "#5865f2", "#3ba55d", "#faa81a", "#ed4245", 
  "#9b4dff", "#ff73fa", "#00b0f4", "#ff9900",
  "#1abc9c", "#e74c3c", "#3498db", "#f1c40f"
];

class MembersCarousel {
  constructor() {
    this.container = document.getElementById('membersCarousel');
    this.controls = document.getElementById('carouselControls');
    this.members = [];
    this.currentIndex = 0;
    this.displayCount = 6;
    this.circleElement = null;
    this.interval = null;
    this.rotationInterval = 8000; // 8 seconds per batch
  }

  async init() {
    await this.loadMembers();
    this.setupCarousel();
    this.startBatchRotation();
  }

  async loadMembers() {
    try {
      const response = await fetch(WIDGET_URL);
      const data = await response.json();
      
      // Get online members from Discord API
      if (data.members) {
        // Filter for online members and map to our format
        this.members = data.members
          .filter(member => !member.bot) // Include both online and offline
          .map((member, index) => ({
            id: member.id || index,
            name: member.username || `User${index}`,
            avatar: member.avatar_url || null,
            discriminator: member.discriminator || '0000',
            status: member.status || 'offline',
            avatarLetter: member.username ? member.username.charAt(0).toUpperCase() : 'U'
          }));
        
        // Update online count
        const onlineCount = data.members.filter(m => m.status !== 'offline' && !m.bot).length;
        this.updateOnlineCount(onlineCount);
      }
      
      // If still empty, use fallback data
      if (this.members.length === 0) {
        this.members = this.getFallbackMembers();
      }
      
    } catch (error) {
      console.error('Error loading Discord members:', error);
      this.members = this.getFallbackMembers();
    }
  }

  getFallbackMembers() {
    return [
      { id: 1, name: "MidnightCane", avatar: null, discriminator: "0001", status: "online", avatarLetter: "M" },
      { id: 2, name: "Akiyama", avatar: null, discriminator: "0002", status: "idle", avatarLetter: "A" },
      { id: 3, name: "Tekking$$", avatar: null, discriminator: "0003", status: "dnd", avatarLetter: "T" },
      { id: 4, name: "LightSpeed", avatar: null, discriminator: "0004", status: "online", avatarLetter: "L" },
      { id: 5, name: "Albert", avatar: null, discriminator: "0005", status: "online", avatarLetter: "A" },
      { id: 6, name: "THE ONE", avatar: null, discriminator: "0006", status: "idle", avatarLetter: "T" },
      { id: 7, name: "zero_x", avatar: null, discriminator: "0007", status: "online", avatarLetter: "Z" },
      { id: 8, name: "VenomSong", avatar: null, discriminator: "0008", status: "dnd", avatarLetter: "V" },
      { id: 9, name: "MaiHunnids", avatar: null, discriminator: "0009", status: "online", avatarLetter: "M" },
      { id: 10, name: "Uncanny", avatar: null, discriminator: "0010", status: "idle", avatarLetter: "U" },
      { id: 11, name: "LostLight", avatar: null, discriminator: "0011", status: "online", avatarLetter: "L" },
      { id: 12, name: "Machina", avatar: null, discriminator: "0012", status: "offline", avatarLetter: "M" }
    ];
  }

  updateOnlineCount(count) {
    const onlineEl = document.getElementById('online');
    if (onlineEl) {
      // Smooth animation
      const current = parseInt(onlineEl.textContent) || 0;
      const target = count;
      
      let startTime = null;
      const duration = 1000;

      function animate(now) {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(current + (target - current) * progress);
        onlineEl.textContent = value;
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    }
  }

  setupCarousel() {
    // Clear loading text
    const loadingText = this.container.querySelector('.loading-text');
    if (loadingText) loadingText.style.display = 'none';
    
    // Create circle container
    this.circleElement = document.createElement('div');
    this.circleElement.className = 'circle-container rotating';
    this.container.appendChild(this.circleElement);
    
    // Create member profiles
    this.updateDisplayedMembers();
    
    // Create controls if we have multiple batches
    this.createControls();
  }

  createControls() {
    this.controls.innerHTML = '';
    const totalBatches = Math.ceil(this.members.length / this.displayCount);
    
    for (let i = 0; i < totalBatches; i++) {
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.showBatch(i));
      this.controls.appendChild(dot);
    }
  }

  updateDisplayedMembers() {
    if (!this.circleElement) return;
    
    // Clear existing members
    this.circleElement.innerHTML = '';
    
    // Get current batch of members
    const startIndex = this.currentIndex * this.displayCount;
    const displayedMembers = this.members.slice(startIndex, startIndex + this.displayCount);
    
    // If we don't have enough members, loop from beginning
    if (displayedMembers.length < this.displayCount) {
      const needed = this.displayCount - displayedMembers.length;
      const extraMembers = this.members.slice(0, needed);
      displayedMembers.push(...extraMembers);
    }
    
    // Create member profiles
    displayedMembers.forEach((member, index) => {
      const profile = this.createMemberProfile(member, index);
      this.circleElement.appendChild(profile);
    });
    
    // Update active dot
    this.updateActiveDot();
  }

  createMemberProfile(member, index) {
    const profile = document.createElement('div');
    profile.className = 'member-profile';
    profile.dataset.id = member.id;
    
    // Get color for avatar background
    const colorIndex = index % avatarColors.length;
    const bgColor = avatarColors[colorIndex];
    
    // Create avatar
    let avatarContent = member.avatarLetter;
    if (member.avatar) {
      avatarContent = `<img src="${member.avatar}" alt="${member.name}" onerror="this.parentElement.textContent='${member.avatarLetter}'">`;
    }
    
    profile.innerHTML = `
      <div class="member-avatar" style="background: ${bgColor}">
        ${avatarContent}
      </div>
      <div class="member-name">${member.name}</div>
      <div class="member-status status-${member.status}"></div>
    `;
    
    return profile;
  }

  showBatch(batchIndex) {
    // Calculate new batch index
    const totalBatches = Math.ceil(this.members.length / this.displayCount);
    this.currentIndex = (batchIndex + totalBatches) % totalBatches;
    
    // Animate out current members
    const currentProfiles = this.circleElement.querySelectorAll('.member-profile');
    currentProfiles.forEach((profile, index) => {
      profile.style.animation = 'slideOut 0.5s ease forwards';
    });
    
    // Update display after animation
    setTimeout(() => {
      this.updateDisplayedMembers();
    }, 500);
  }

  updateActiveDot() {
    const dots = this.controls.querySelectorAll('.carousel-dot');
    const totalBatches = Math.ceil(this.members.length / this.displayCount);
    const activeBatch = this.currentIndex % totalBatches;
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeBatch);
    });
  }

  startBatchRotation() {
    // Auto-rotate batches every 8 seconds
    this.interval = setInterval(() => {
      const totalBatches = Math.ceil(this.members.length / this.displayCount);
      const nextBatch = (this.currentIndex + 1) % totalBatches;
      this.showBatch(nextBatch);
    }, this.rotationInterval);
  }

  stopRotation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

// =======================
// DISCORD ONLINE COUNT FETCH
// =======================
async function fetchOnlineCount() {
  try {
    const res = await fetch(WIDGET_URL);
    if (!res.ok) throw new Error("Discord widget fetch failed");

    const data = await res.json();

    const onlineEl = document.getElementById("online");
    if (!onlineEl) return;

    // Get online count
    const onlineCount = data.members ? 
      data.members.filter(m => m.status !== 'offline' && !m.bot).length : 0;

    // Smooth animation
    const current = parseInt(onlineEl.textContent) || 0;
    const target = onlineCount;

    let startTime = null;
    const duration = 800;

    function animate(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
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

// =======================
// INITIALIZE EVERYTHING
// =======================
let carousel;

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize carousel
  carousel = new MembersCarousel();
  await carousel.init();
  
  // Fetch initial online count
  fetchOnlineCount();
  
  // Refresh online count every 60 seconds
  setInterval(fetchOnlineCount, 60000);
});

// Refresh members periodically
setInterval(async () => {
  if (carousel) {
    await carousel.loadMembers();
    carousel.updateDisplayedMembers();
  }
}, 300000); // Every 5 minutes
