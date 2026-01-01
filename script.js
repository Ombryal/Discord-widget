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

// Mock data for online members (in production, you'd get this from Discord API)
const mockMembers = [
  { id: 1, name: "Alex", avatar: "A", status: "online" },
  { id: 2, name: "Sam", avatar: "S", status: "idle" },
  { id: 3, name: "Jordan", avatar: "J", status: "dnd" },
  { id: 4, name: "Taylor", avatar: "T", status: "online" },
  { id: 5, name: "Casey", avatar: "C", status: "online" },
  { id: 6, name: "Riley", avatar: "R", status: "idle" },
  { id: 7, name: "Morgan", avatar: "M", status: "online" },
  { id: 8, name: "Drew", avatar: "D", status: "online" },
  { id: 9, name: "Blake", avatar: "B", status: "dnd" },
  { id: 10, name: "Cameron", avatar: "C", status: "online" },
  { id: 11, name: "Jamie", avatar: "J", status: "idle" },
  { id: 12, name: "Quinn", avatar: "Q", status: "online" }
];

// Color palette for avatar backgrounds
const avatarColors = [
  "#5865f2", "#3ba55d", "#faa81a", "#ed4245", 
  "#9b4dff", "#ff73fa", "#00b0f4", "#ff9900"
];

class MembersCarousel {
  constructor() {
    this.container = document.getElementById('membersCarousel');
    this.controls = document.getElementById('carouselControls');
    this.members = [];
    this.currentBatch = 0;
    this.batchSize = 6;
    this.totalBatches = 0;
    this.interval = null;
    this.rotationInterval = 8000; // 8 seconds per batch
  }

  init() {
    this.loadMembers();
    this.setupCarousel();
    this.startRotation();
  }

  loadMembers() {
    // In production, fetch from Discord API
    // For now, use mock data
    this.members = [...mockMembers];
    this.totalBatches = Math.ceil(this.members.length / this.batchSize);
  }

  setupCarousel() {
    // Clear loading text
    this.container.innerHTML = '';
    
    // Create controls
    this.createControls();
    
    // Show first batch
    this.showBatch(0);
  }

  createControls() {
    this.controls.innerHTML = '';
    for (let i = 0; i < this.totalBatches; i++) {
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.showBatch(i));
      this.controls.appendChild(dot);
    }
  }

  showBatch(batchIndex) {
    this.currentBatch = batchIndex;
    
    // Update active dot
    const dots = this.controls.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === batchIndex);
    });
    
    // Clear container
    this.container.innerHTML = '';
    
    // Calculate batch members
    const start = batchIndex * this.batchSize;
    const end = start + this.batchSize;
    const batchMembers = this.members.slice(start, end);
    
    // Position profiles in a circular pattern
    const radius = Math.min(this.container.offsetWidth, this.container.offsetHeight) * 0.35;
    const centerX = this.container.offsetWidth / 2;
    const centerY = this.container.offsetHeight / 2;
    const angleStep = (2 * Math.PI) / batchMembers.length;
    
    batchMembers.forEach((member, index) => {
      const angle = index * angleStep;
      const x = centerX + radius * Math.cos(angle) - 50; // 50 = half profile width
      const y = centerY + radius * Math.sin(angle) - 50; // 50 = half profile height
      
      const profile = this.createMemberProfile(member, index);
      profile.style.left = `${x}px`;
      profile.style.top = `${y}px`;
      
      // Add with slight delay for staggered appearance
      setTimeout(() => {
        profile.classList.add('active');
        this.container.appendChild(profile);
      }, index * 150);
    });
  }

  createMemberProfile(member, index) {
    const profile = document.createElement('div');
    profile.className = 'member-profile';
    profile.dataset.id = member.id;
    
    // Get color for avatar background
    const colorIndex = index % avatarColors.length;
    const bgColor = avatarColors[colorIndex];
    
    profile.innerHTML = `
      <div class="member-avatar" style="background: ${bgColor}">
        ${member.avatar}
      </div>
      <div class="member-name">${member.name}</div>
      <div class="member-status status-${member.status}"></div>
    `;
    
    return profile;
  }

  startRotation() {
    // Clear any existing interval
    if (this.interval) clearInterval(this.interval);
    
    // Set up automatic rotation
    this.interval = setInterval(() => {
      const nextBatch = (this.currentBatch + 1) % this.totalBatches;
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

    // Smooth animation of online count
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
    // Fallback to mock data for online count
    const onlineEl = document.getElementById("online");
    if (onlineEl) {
      onlineEl.textContent = "42"; // Mock online count
    }
  }
}

// =======================
// INITIALIZE EVERYTHING
// =======================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize carousel
  const carousel = new MembersCarousel();
  carousel.init();
  
  // Fetch online count
  fetchOnlineCount();
  
  // Refresh online count every 60 seconds
  setInterval(fetchOnlineCount, 60000);
  
  // Pause carousel on hover
  const carouselContainer = document.querySelector('.online-members');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => carousel.stopRotation());
    carouselContainer.addEventListener('mouseleave', () => carousel.startRotation());
  }
});
