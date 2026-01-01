// =======================
// THEME TOGGLE - FIXED
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
  
  // Update toggle button text
  toggle.textContent = document.body.classList.contains("light") ? "🌙 / ☀" : "☀ / 🌙";
});

// Initialize toggle button text
toggle.textContent = document.body.classList.contains("light") ? "🌙 / ☀" : "☀ / 🌙";

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
// SCROLL TRIGGERED FADE-IN - FIXED FOR MOBILE
// =======================
const scrollElements = document.querySelectorAll(".card, .rules, .features");

// Remove moderators from scroll animation since we're forcing it visible
const moderatorsSection = document.getElementById("moderators");
if (moderatorsSection) {
  moderatorsSection.style.opacity = "1";
  moderatorsSection.style.transform = "translateY(0)";
}

// Remove stats from scroll animation
const statsElement = document.querySelector('.stats');
if (statsElement) {
  statsElement.style.opacity = "1";
  statsElement.style.transform = "none";
}

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

// Throttle scroll events for performance
let scrollTimeout;
window.addEventListener("scroll", () => {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      handleScrollAnimation();
      scrollTimeout = null;
    }, 100);
  }
});

window.addEventListener("load", handleScrollAnimation);

// =======================
// DISCORD ONLINE COUNT & MEMBER CAROUSEL - FIXED FOR MOBILE
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
    this.orbitElement = null;
    this.interval = null;
    this.rotationInterval = 8000; // 8 seconds per batch
    this.rotationAngle = 0;
    this.rotationSpeed = 0.5; // Reduced speed for mobile
    this.animationId = null;
    this.isRotating = true;
    this.isMobile = window.innerWidth <= 600;
  }

  async init() {
    await this.loadMembers();
    this.setupCarousel();
    this.startContinuousRotation();
    this.startBatchRotation();
    
    // Update mobile detection on resize
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 600;
      if (this.orbitElement) {
        this.positionMembers();
      }
    });
  }

  async loadMembers() {
    try {
      const response = await fetch(WIDGET_URL);
      const data = await response.json();
      
      // Get members from Discord API
      if (data.members) {
        // Include all members (online and offline)
        this.members = data.members
          .filter(member => !member.bot)
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
    
    // Create orbit container
    this.orbitElement = document.createElement('div');
    this.orbitElement.className = 'orbit-container';
    this.container.appendChild(this.orbitElement);
    
    // Create member profiles
    this.positionMembers();
    
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

  calculateOrbitDimensions() {
    if (!this.orbitElement) return { width: 400, height: 400 };
    
    const containerRect = this.container.getBoundingClientRect();
    const maxSize = Math.min(containerRect.width, containerRect.height) * 0.8;
    
    // Adjust for mobile
    if (this.isMobile) {
      return {
        width: Math.min(300, maxSize),
        height: Math.min(300, maxSize),
        radius: Math.min(300, maxSize) * 0.4
      };
    }
    
    return {
      width: Math.min(400, maxSize),
      height: Math.min(400, maxSize),
      radius: Math.min(400, maxSize) * 0.4
    };
  }

  positionMembers() {
    if (!this.orbitElement) return;
    
    // Clear existing members
    this.orbitElement.innerHTML = '';
    
    // Get current batch of members
    const startIndex = this.currentIndex * this.displayCount;
    const displayedMembers = this.members.slice(startIndex, startIndex + this.displayCount);
    
    // If we don't have enough members, loop from beginning
    if (displayedMembers.length < this.displayCount) {
      const needed = this.displayCount - displayedMembers.length;
      const extraMembers = this.members.slice(0, needed);
      displayedMembers.push(...extraMembers);
    }
    
    // Calculate dimensions based on screen size
    const dimensions = this.calculateOrbitDimensions();
    const radius = dimensions.radius;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const angleStep = (2 * Math.PI) / displayedMembers.length;
    
    // Adjust profile size for mobile
    const profileSize = this.isMobile ? 70 : 90;
    const avatarSize = this.isMobile ? 50 : 70;
    
    // Create member profiles at calculated positions
    displayedMembers.forEach((member, index) => {
      const angle = index * angleStep + this.rotationAngle * (Math.PI / 180);
      const x = centerX + radius * Math.cos(angle) - (profileSize / 2);
      const y = centerY + radius * Math.sin(angle) - (profileSize / 2);
      
      const profile = this.createMemberProfile(member, index, profileSize, avatarSize);
      profile.style.left = `${x}px`;
      profile.style.top = `${y}px`;
      
      // Add with delay for staggered appearance
      setTimeout(() => {
        profile.style.animation = 'fadeInProfile 0.8s ease forwards';
        this.orbitElement.appendChild(profile);
      }, index * 150);
    });
    
    // Update active dot
    this.updateActiveDot();
  }

  createMemberProfile(member, index, profileSize = 90, avatarSize = 70) {
    const profile = document.createElement('div');
    profile.className = 'member-profile';
    profile.dataset.id = member.id;
    profile.style.width = `${profileSize}px`;
    profile.style.height = `${profileSize}px`;
    
    // Get color for avatar background
    const colorIndex = index % avatarColors.length;
    const bgColor = avatarColors[colorIndex];
    
    // Create avatar
    let avatarContent = member.avatarLetter;
    if (member.avatar) {
      avatarContent = `<img src="${member.avatar}" alt="${member.name}" onerror="this.parentElement.textContent='${member.avatarLetter}'">`;
    }
    
    profile.innerHTML = `
      <div class="member-avatar" style="background: ${bgColor}; width: ${avatarSize}px; height: ${avatarSize}px; font-size: ${avatarSize * 0.4}px">
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
    const currentProfiles = this.orbitElement.querySelectorAll('.member-profile');
    currentProfiles.forEach((profile, index) => {
      profile.style.animation = 'slideOut 0.5s ease forwards';
    });
    
    // Update display after animation
    setTimeout(() => {
      this.positionMembers();
    }, 500);
    
    // Update active dot
    this.updateActiveDot();
  }

  updateActiveDot() {
    const dots = this.controls.querySelectorAll('.carousel-dot');
    const totalBatches = Math.ceil(this.members.length / this.displayCount);
    const activeBatch = this.currentIndex % totalBatches;
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeBatch);
    });
  }

  startContinuousRotation() {
    const rotate = () => {
      if (this.isRotating && this.orbitElement) {
        this.rotationAngle += this.rotationSpeed;
        if (this.rotationAngle >= 360) {
          this.rotationAngle = 0;
        }
        
        // Update member positions
        this.updateMemberPositions();
      }
      this.animationId = requestAnimationFrame(rotate);
    };
    
    rotate();
  }

  updateMemberPositions() {
    const profiles = this.orbitElement.querySelectorAll('.member-profile');
    if (profiles.length === 0) return;
    
    const dimensions = this.calculateOrbitDimensions();
    const radius = dimensions.radius;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const angleStep = (2 * Math.PI) / profiles.length;
    const profileSize = this.isMobile ? 70 : 90;
    
    profiles.forEach((profile, index) => {
      const angle = index * angleStep + this.rotationAngle * (Math.PI / 180);
      const x = centerX + radius * Math.cos(angle) - (profileSize / 2);
      const y = centerY + radius * Math.sin(angle) - (profileSize / 2);
      
      profile.style.left = `${x}px`;
      profile.style.top = `${y}px`;
      
      // Scale based on position (front profiles are larger)
      const scale = 0.9 + 0.2 * Math.abs(Math.cos(angle));
      profile.style.transform = `scale(${scale})`;
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
    this.isRotating = false;
    if (this.interval) clearInterval(this.interval);
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }

  resumeRotation() {
    this.isRotating = true;
    this.startContinuousRotation();
    this.startBatchRotation();
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
  
  // Pause rotation on hover
  const carouselContainer = document.querySelector('.online-members');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
      carousel.stopRotation();
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
      carousel.resumeRotation();
    });
    
    // Touch events for mobile
    carouselContainer.addEventListener('touchstart', () => {
      carousel.stopRotation();
    });
    
    carouselContainer.addEventListener('touchend', () => {
      setTimeout(() => carousel.resumeRotation(), 1000);
    });
  }
});

// Refresh members periodically
setInterval(async () => {
  if (carousel) {
    await carousel.loadMembers();
    carousel.positionMembers();
  }
}, 300000); // Every 5 minutes
