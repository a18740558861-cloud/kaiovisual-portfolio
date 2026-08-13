document.addEventListener('DOMContentLoaded', () => {
  applyEnglish();
  initNavbar();
  initBanner();
  initMarquee();
  initSection('space');
  initSection('plane');
  initReveal();
});

/* ---------- English subtitles ---------- */
const EN = {
  banners: [
    "German Cologne Furniture Fair — SIHOO Ergonomic Chair",
    "Pop-up Tour Vehicle — SIHOO Ergonomic Chair",
    "Our Sports Field, Come on! — Decathlon (Chongqing)",
    "Overseas Exhibition SI — SIHOO Ergonomic Chair",
    "Seaside SHOWROOM — Decathlon",
    "Philippines Store Terminal — SIHOO Ergonomic Chair",
    "Snack Store SI — Ling San Mang"
  ],
  sections: { space: "Brand Space", plane: "Brand Graphic" },
  modules: {
    terminal: "Terminal Display",
    campaign: "Marketing Campaign",
    culture: "Cultural Space",
    render: "Product Rendering",
    packaging: "Packaging Design",
    material: "Online / Offline Materials",
    aigc: "AIGC Application"
  },
  projects: {
    "s1-1": "German Cologne Furniture Fair — SIHOO Ergonomic Chair",
    "s1-2": "Japan Shop-in-shop — SIHOO Ergonomic Chair",
    "s1-3": "Overseas Exhibition SI — SIHOO Ergonomic Chair",
    "s1-4": "Philippines Store — SIHOO Ergonomic Chair",
    "s1-5": "Snack Store SI — Ling San Mang",
    "s2-1": "Pop-up Tour Vehicle — SIHOO Ergonomic Chair",
    "s2-2": "Our Sports Field, Come on! — Decathlon (Chongqing)",
    "s2-3": "Seaside — Decathlon",
    "s3-1": "TCM Hall — Ankang Central Hospital",
    "s3-2": "Poverty Alleviation Window — Zhenping Rural Commercial Bank",
    "s4-1": "Brand Product Rendering Visual",
    "p1-1": "Brand Packaging Design",
    "p2-1": "Brand Online / Offline Materials",
    "p3-1": "AIGC Effect Application"
  }
};

function applyEnglish() {
  SITE.banners.forEach((b, i) => { b.en = EN.banners[i]; });
  [SITE.space, SITE.plane].forEach(sec => {
    sec.en = EN.sections[sec === SITE.space ? "space" : "plane"];
    sec.modules.forEach(m => { m.en = EN.modules[m.key]; });
    sec.modules.forEach(m => m.projects.forEach(p => { p.en = EN.projects[p.id]; }));
  });
}

/* ---------- Navbar ---------- */
function initNavbar() {
  const logoImg = document.getElementById('nav-logo-img');
  logoImg.src = SITE.logo;
  logoImg.alt = SITE.brandName;

  const linksEl = document.getElementById('nav-links');
  linksEl.innerHTML = SITE.nav.map(n =>
    `<li><a href="${n.href}">${n.label}</a></li>`
  ).join('');

  const navbar = document.getElementById('navbar');
  let lastY = 0;
  let ticking = false;
  let scrollStopTimer = null;

  const handleScroll = () => {
    const y = window.scrollY;
    const bannerHeight = document.getElementById('banner').offsetHeight;

    if (y < 80) {
      navbar.classList.remove('is-solid', 'is-hidden');
    } else {
      navbar.classList.add('is-solid');
      if (y > lastY) {
        navbar.classList.add('is-hidden');
      } else {
        navbar.classList.remove('is-hidden');
      }
    }

    lastY = y;
    clearTimeout(scrollStopTimer);
    scrollStopTimer = setTimeout(() => {
      if (y > bannerHeight) navbar.classList.remove('is-hidden');
    }, 180);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });
}

/* ---------- Banner carousel with mask interaction ---------- */
function initBanner() {
  const track = document.getElementById('banner-track');
  const titleEl = document.getElementById('banner-title');
  const introEl = document.getElementById('banner-intro');
  const enEl = document.getElementById('banner-en');
  const progressEl = document.getElementById('banner-progress');
  const prevBtn = document.getElementById('banner-prev');
  const nextBtn = document.getElementById('banner-next');

  SITE.banners.forEach((b, i) => {
    const slide = document.createElement('div');
    slide.className = `slide ${i === 0 ? 'is-active' : ''}`;
    slide.dataset.index = i;
    slide.innerHTML = `
      <div class="slide-base" style="background-image:url('${b.src}')"></div>
      <div class="slide-mask" style="background-image:url('${b.mask}')"></div>
    `;
    track.appendChild(slide);
  });

  let current = 0;
  const interval = 8000;
  const slides = track.querySelectorAll('.slide');

  const updateText = (i) => {
    enEl.textContent = SITE.banners[i].en;
    titleEl.textContent = SITE.banners[i].title;
    introEl.textContent = SITE.banners[i].intro;
  };
  updateText(0);

  progressEl.style.transition = `width ${interval}ms linear`;

  const go = (next) => {
    slides[current].classList.remove('is-active');
    current = (next + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    updateText(current);
    progressEl.style.transition = 'none';
    progressEl.style.width = '0%';
    requestAnimationFrame(() => {
      progressEl.style.transition = `width ${interval}ms linear`;
      progressEl.style.width = '100%';
    });
  };

  setTimeout(() => { progressEl.style.width = '100%'; }, 50);
  let timer = setInterval(() => go(current + 1), interval);

  track.addEventListener('mousemove', (e) => {
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    slides[current].style.setProperty('--mx', `${x}px`);
    slides[current].style.setProperty('--my', `${y}px`);
  });

  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', () => {
    timer = setInterval(() => go(current + 1), interval);
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearInterval(timer);
    go(current - 1);
    timer = setInterval(() => go(current + 1), interval);
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearInterval(timer);
    go(current + 1);
    timer = setInterval(() => go(current + 1), interval);
  });
}

/* ---------- Logo marquee ---------- */
function initMarquee() {
  const track = document.getElementById('marquee-track');
  const items = SITE.brandLogos.map(src => `<img class="marquee-item" src="${src}" alt="" loading="lazy">`).join('');
  track.innerHTML = items + items;
}

/* ---------- Section tabs & grid ---------- */
function initSection(type) {
  const data = SITE[type];
  const tabsEl = document.getElementById(`${type}-tabs`);
  const gridEl = document.getElementById(`${type}-grid`);
  const moreBtn = document.getElementById(`${type}-more`);
  let activeIndex = 0;

  const renderTabs = () => {
    tabsEl.innerHTML = data.modules.map((m, i) =>
      `<button class="tab ${i === activeIndex ? 'is-active' : ''}" data-index="${i}" type="button">${m.name}</button>`
    ).join('');
  };

  const renderGrid = () => {
    const projects = data.modules[activeIndex].projects;
    gridEl.innerHTML = projects.map(p => `
      <article class="card reveal" data-id="${p.id}" title="${p.title}">
        <div class="card-thumb" style="background-image:url('${p.thumb}')"></div>
        <div class="card-overlay"></div>
        <div class="card-info">
          <p class="card-en">${p.en || ''}</p>
          <h3 class="card-title">${p.title}</h3>
          <p class="card-intro">${p.intro}</p>
        </div>
      </article>
    `).join('');

    gridEl.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.href = `detail.html?id=${card.dataset.id}`;
      });
    });

    // re-trigger reveal for new cards
    observeReveals(gridEl.querySelectorAll('.reveal'));
  };

  tabsEl.addEventListener('click', (e) => {
    if (!e.target.classList.contains('tab')) return;
    activeIndex = Number(e.target.dataset.index);
    renderTabs();
    renderGrid();
  });

  moreBtn.addEventListener('click', () => {
    const m = data.modules[activeIndex];
    if (m.projects.length) {
      window.location.href = `detail.html?id=${m.projects[0].id}`;
    }
  });

  renderTabs();
  renderGrid();
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  observeReveals(document.querySelectorAll('.reveal'));
}

function observeReveals(nodes) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  nodes.forEach(n => io.observe(n));
}
