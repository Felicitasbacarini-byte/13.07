// =========================
// NAVBAR SCROLLED
// =========================

const navbar = document.querySelector(".navbar");
let navbarTicking = false;
let navbarScrolled = null;

function updateNavbar() {
  navbarTicking = false;
  if (!navbar) return;

  const shouldBeScrolled = window.scrollY > 24;
  if (shouldBeScrolled === navbarScrolled) return;

  navbarScrolled = shouldBeScrolled;
  navbar.classList.toggle("is-scrolled", shouldBeScrolled);
}

function requestNavbarUpdate() {
  if (navbarTicking) return;
  navbarTicking = true;
  requestAnimationFrame(updateNavbar);
}

window.addEventListener("scroll", requestNavbarUpdate, { passive: true });
requestNavbarUpdate();


// =========================
// CURSOR GLOW
// =========================

const cursorGlow = document.querySelector(".cursor-glow");

if (cursorGlow) {
  let cursorFrame = 0;
  let cursorX = 0;
  let cursorY = 0;

  window.addEventListener("mousemove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    cursorGlow.classList.add("is-visible");

    if (cursorFrame) return;
    cursorFrame = requestAnimationFrame(() => {
      cursorGlow.style.transform = `translate3d(${cursorX - 17}px, ${cursorY - 17}px, 0)`;
      cursorFrame = 0;
    });
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    cursorGlow.classList.remove("is-visible");
  });

  const hoverElements = document.querySelectorAll("a, button, .btn");

  hoverElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursorGlow.classList.add("is-hover");
    });

    element.addEventListener("mouseleave", () => {
      cursorGlow.classList.remove("is-hover");
    });
  });
}


// =========================
// SCROLL REVEAL
// =========================

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -80px 0px"
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

/* =========================
   02 SOBRE APEX
   circuito + contadores
========================= */

(function () {
  const section = document.querySelector("#sobre-apex");
  if (!section) return;

  const points = Array.from(section.querySelectorAll(".track-point"));
  const popup = section.querySelector("#trackPopup");
  const popupTitle = section.querySelector("#trackPopupTitle");
  const popupText = section.querySelector("#trackPopupText");

  /* -------------------------
     CIRCUITO
     Las cards NO aparecen al inicio.
     Solo aparecen con hover.
  ------------------------- */

  const popupData = [
    {
      title: "Telemetría",
      text: "Detecta frenadas, aceleración y trazadas con datos reales.",
      left: 2,
      top: 55
    },
    {
      title: "Trazadas",
      text: "Ajusta entrada, vértice y salida para ganar precisión.",
      left: 24,
      top: 6
    },
    {
      title: "Comparativas",
      text: "Compara vueltas y sectores para ver dónde perdés tiempo.",
      left: 58,
      top: 66
    },
    {
      title: "Decisiones",
      text: "Convertí datos en acciones concretas durante carrera.",
      left: 8,
      top: 68
    }
  ];

  function showCard(index) {
    const item = popupData[index];
    if (!item || !popup || !popupTitle || !popupText) return;

    points.forEach((point, pointIndex) => {
      point.classList.toggle("is-active", pointIndex === index);
    });

    popupTitle.textContent = item.title;
    popupText.textContent = item.text;

    popup.style.left = `${item.left}%`;
    popup.style.top = `${item.top}%`;

    popup.classList.add("is-visible");
  }

  function hideCard() {
    points.forEach((point) => {
      point.classList.remove("is-active");
    });

    if (popup) {
      popup.classList.remove("is-visible");
    }
  }

  points.forEach((point, index) => {
    point.classList.remove("is-active");

    point.addEventListener("mouseenter", () => {
      showCard(index);
    });

    point.addEventListener("mouseleave", () => {
      hideCard();
    });

    point.addEventListener("focus", () => {
      showCard(index);
    });

    point.addEventListener("blur", () => {
      hideCard();
    });
  });

  hideCard();

  /* -------------------------
     CONTADORES
  ------------------------- */

  const counterSpans = Array.from(section.querySelectorAll(".count-up"));
  let countersStarted = false;

  const counterItems = counterSpans.map((span) => {
    const strong = span.closest("strong");
    const target = parseInt(span.dataset.target, 10) || 0;

    if (strong) {
      strong.textContent = "+0";
    }

    return { strong, target };
  });

  function animateCounter(strong, target, delay) {
    if (!strong) return;

    setTimeout(() => {
      const duration = 2200;
      const startTime = performance.now();

      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * eased);

        strong.textContent = `+${value.toLocaleString("es-AR")}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          strong.textContent = `+${target.toLocaleString("es-AR")}`;
        }
      }

      requestAnimationFrame(update);
    }, delay);
  }

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;

    counterItems.forEach((item, index) => {
      animateCounter(item.strong, item.target, index * 180);
    });
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startCounters();
      }
    });
  }, {
    threshold: 0.45,
    rootMargin: "0px 0px -120px 0px"
  });

  counterObserver.observe(section);
})();

// =========================
// STATEMENT - LETRA POR LETRA CON PANTALLA FIJA
// =========================

function initStatementSection() {
  const section = document.querySelector(".statement-section");
  if (!section) return;

  const splitElements = section.querySelectorAll("[data-split]");
  let chars = [];

  splitElements.forEach((element) => {
    if (element.dataset.splitted === "true") return;

    const text = element.textContent;
    element.textContent = "";
    element.dataset.splitted = "true";

    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.className = "statement-char";

      if (char === " ") {
        span.innerHTML = "&nbsp;";
      } else {
        span.textContent = char;
      }

      element.appendChild(span);
      chars.push(span);
    });
  });

  let statementTicking = false;
  let lastVisibleCount = 0;

  function updateStatementReveal() {
    statementTicking = false;
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollInsideSection = -rect.top;
    const maxScroll = Math.max(section.offsetHeight - windowHeight, 1);

    let progress = scrollInsideSection / (maxScroll * 0.74);
    progress = Math.max(0, Math.min(progress, 1));

    const visibleCount = Math.floor(progress * chars.length);
    if (visibleCount === lastVisibleCount) return;

    if (visibleCount > lastVisibleCount) {
      for (let i = lastVisibleCount; i < visibleCount; i += 1) {
        chars[i]?.classList.add("is-visible");
      }
    } else {
      for (let i = visibleCount; i < lastVisibleCount; i += 1) {
        chars[i]?.classList.remove("is-visible");
      }
    }

    lastVisibleCount = visibleCount;
  }

  function requestStatementUpdate() {
    if (statementTicking) return;
    statementTicking = true;
    requestAnimationFrame(updateStatementReveal);
  }

  requestStatementUpdate();
  window.addEventListener("scroll", requestStatementUpdate, { passive: true });
  window.addEventListener("resize", requestStatementUpdate);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStatementSection);
} else {
  initStatementSection();
}

// =========================
// PILARES - ACCORDION HORIZONTAL
// =========================

(() => {
  const pillarCards = document.querySelectorAll(".pillar-card");
  if (!pillarCards.length) return;

  pillarCards.forEach((card) => {
    card.addEventListener("click", () => {
      pillarCards.forEach((otherCard) => {
        otherCard.classList.remove("is-active");
      });

      card.classList.add("is-active");
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });
  });
})();

// =========================
// 04 TECNOLOGÍA INTERACTIVA
// =========================

function initTech2Section() {
  const section = document.querySelector(".tech2-section");
  const scene = document.querySelector(".tech2-scene");
  const hotspots = document.querySelectorAll(".tech2-hotspot");

  const title = document.getElementById("tech2Title");
  const text = document.getElementById("tech2Text");
  const data = document.getElementById("tech2Data");
  const eyebrow = document.getElementById("tech2Eyebrow");

  if (!section || !scene || !hotspots.length) return;

  // Mantiene visibles los cuadraditos desde el estado 0.
  // La activación de textos sigue dependiendo del scroll/hover original.
  scene.classList.add("hotspots-ready");

  const info = {
    screen: {
      eyebrow: "Display central",
      title: "Pantalla LCD",
      text: "Lectura de velocidad, marcha, delta y datos clave para corregir decisiones en tiempo real.",
      data: ["200 km/h", "Delta en vivo", "Lectura rápida"]
    },
    bottom: {
      eyebrow: "Control dinámico",
      title: "Ajuste rápido",
      text: "Controles inferiores para modificar parámetros durante la sesión sin perder foco en la conducción.",
      data: ["4 encoders", "Setup dinámico", "Respuesta inmediata"]
    },
    left: {
      eyebrow: "Input lateral",
      title: "Sector izquierdo",
      text: "Comandos de precisión para acciones rápidas, gestión de funciones y reducción del tiempo de reacción.",
      data: ["Acceso con pulgar", "Control lateral", "Menor reacción"]
    },
    right: {
      eyebrow: "Gestión avanzada",
      title: "Sector derecho",
      text: "Área destinada a funciones de carrera, cambios de configuración y control avanzado del vehículo.",
      data: ["Gestión de carrera", "Inputs rápidos", "Mayor precisión"]
    }
  };

  function limit(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function mix(a, b, t) {
    return a + (b - a) * t;
  }

  function isMobile() {
    return window.innerWidth <= 980;
  }

  function clearSelectedHotspots() {
    hotspots.forEach((hotspot) => {
      hotspot.classList.remove("is-selected");
    });
  }

  function setDefaultPanel() {
    if (eyebrow) {
      eyebrow.textContent = isMobile() ? "Interacción táctil" : "Interacción guiada";
    }

    if (title) {
      title.textContent = "Explorá el volante";
    }

    if (text) {
      text.textContent = isMobile()
        ? "Tocá una zona del volante para ver la información correspondiente."
        : "Hacé scroll y pasá el cursor sobre cada zona del volante.";
    }

    if (data) {
      data.innerHTML = `
        <small>Display</small>
        <small>Inputs</small>
        <small>Precisión</small>
      `;
    }
  }

  function updateTech2() {
    if (isMobile()) {
      scene.classList.add("is-interactive");
      scene.style.setProperty("--copy-opacity", 1);
      scene.style.setProperty("--wheel-left", "50%");
      scene.style.setProperty("--wheel-width", "min(96vw, 760px)");
      return;
    }

    const rect = section.getBoundingClientRect();
    const sceneHeight = scene.offsetHeight;
    const total = section.offsetHeight - sceneHeight;
    const progress = limit(-rect.top / total, 0, 1);

    let left = 68;
    let top = 44;
    let width = 38;
    let copyOpacity = 1;

    scene.classList.remove("is-interactive");
    scene.classList.remove("has-zone");
    scene.dataset.zone = "";
    clearSelectedHotspots();
    setDefaultPanel();

    /* FASE 1: desaparece rápido el texto institucional */
    if (progress <= 0.16) {
      const t = progress / 0.16;

      left = 68;
      top = 44;
      width = mix(38, 42, t);

      copyOpacity = 1 - limit(t * 2.6, 0, 1);
    }

    /* FASE 2: el volante viaja hacia el centro */
    if (progress > 0.16 && progress <= 0.42) {
      const t = (progress - 0.16) / 0.26;

      left = mix(68, 40, t);
      top = mix(44, 45, t);
      width = mix(42, 50, t);

      copyOpacity = 0;

      if (t > 0.35) {
        scene.classList.add("is-interactive");
      }
    }

    /* FASE 3: volante grande + panel al costado */
    if (progress > 0.42) {
      const t = (progress - 0.42) / 0.58;

      left = 40;
      top = 45;
      width = mix(50, 56, t);

      copyOpacity = 0;
      scene.classList.add("is-interactive");
    }

    scene.style.setProperty("--wheel-left", `${left}vw`);
    scene.style.setProperty("--wheel-top", `${top}%`);
    scene.style.setProperty("--wheel-width", `${width}vw`);
    scene.style.setProperty("--copy-opacity", copyOpacity);
  }

  function showZone(zone, keepSelected = false) {
    const item = info[zone];
    if (!item) return;

    scene.dataset.zone = zone;
    scene.classList.add("has-zone");

    if (eyebrow) eyebrow.textContent = item.eyebrow;
    if (title) title.textContent = item.title;
    if (text) text.textContent = item.text;

    if (data) {
      data.innerHTML = item.data.map((value) => `<small>${value}</small>`).join("");
    }

    clearSelectedHotspots();

    if (keepSelected) {
      const active = document.querySelector(`.tech2-hotspot[data-zone="${zone}"]`);
      if (active) active.classList.add("is-selected");
    }
  }

  function hideZone() {
    if (isMobile()) return;

    scene.dataset.zone = "";
    scene.classList.remove("has-zone");
    clearSelectedHotspots();
    setDefaultPanel();
  }

  hotspots.forEach((hotspot) => {
    const zone = hotspot.dataset.zone;

    hotspot.addEventListener("mouseenter", () => {
      if (!isMobile() && scene.classList.contains("is-interactive")) {
        showZone(zone, false);
      }
    });

    hotspot.addEventListener("mouseleave", () => {
      if (!isMobile()) {
        hideZone();
      }
    });

    hotspot.addEventListener("click", () => {
      if (isMobile()) {
        showZone(zone, true);
      } else if (scene.classList.contains("is-interactive")) {
        showZone(zone, true);
      }
    });

    hotspot.addEventListener("focus", () => {
      if (!isMobile() && scene.classList.contains("is-interactive")) {
        showZone(zone, false);
      }
    });

    hotspot.addEventListener("blur", () => {
      if (!isMobile()) {
        hideZone();
      }
    });
  });

  let techTicking = false;

  function requestTechUpdate() {
    if (techTicking) return;
    techTicking = true;
    requestAnimationFrame(() => {
      techTicking = false;
      updateTech2();
    });
  }

  setDefaultPanel();
  requestTechUpdate();

  window.addEventListener("scroll", requestTechUpdate, { passive: true });
  window.addEventListener("resize", () => {
    setDefaultPanel();
    requestTechUpdate();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTech2Section);
} else {
  initTech2Section();
}

// =========================
// 05 CURSOS - HOVER / TAP
// =========================

function initCoursesSection() {
  const section = document.querySelector(".courses-section");
  if (!section) return;

  /* No toca las placas técnicas nuevas: tienen su propio comportamiento */
  if (section.classList.contains("courses-section-tech")) return;

  const cards = section.querySelectorAll(".course-card:not(.course-tech-card)");

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;

      cards.forEach((item) => {
        if (item !== card) {
          item.classList.remove("is-active");
        }
      });

      card.classList.toggle("is-active");
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCoursesSection);
} else {
  initCoursesSection();
}

/* =========================
   FORMULA 3 - DRAG SCROLL MOBILE
========================= */

function initF3Section() {
  const track = document.querySelector("[data-drag-scroll]");
  if (!track) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  function isMobileLayout() {
    return window.innerWidth <= 768;
  }

  track.addEventListener("pointerdown", (event) => {
    if (!isMobileLayout()) return;

    isDown = true;
    startX = event.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;

    track.classList.add("is-dragging");
  });

  track.addEventListener("pointerleave", () => {
    isDown = false;
    track.classList.remove("is-dragging");
  });

  track.addEventListener("pointerup", () => {
    isDown = false;
    track.classList.remove("is-dragging");
  });

  track.addEventListener("pointermove", (event) => {
    if (!isDown || !isMobileLayout()) return;

    event.preventDefault();

    const x = event.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.15;

    track.scrollLeft = scrollLeft - walk;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initF3Section);
} else {
  initF3Section();
}

/* =========================
   CIRCUITOS - SCROLL HORIZONTAL
========================= */

function initCircuitsHorizontalScroll() {
  const section = document.querySelector(".circuits-section");
  const track = document.querySelector("#circuitsTrack");

  if (!section || !track) return;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function updateHeight() {
    if (isMobile()) {
      section.style.height = "auto";
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    const viewportWidth = window.innerWidth;
    const trackWidth = track.scrollWidth;

    const scrollDistance = Math.max(0, trackWidth - viewportWidth + 260);

    section.style.height = `${window.innerHeight + scrollDistance}px`;
  }

  function updateScroll() {
    if (isMobile()) {
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    const rect = section.getBoundingClientRect();
    const maxScroll = section.offsetHeight - window.innerHeight;

    const current = Math.min(Math.max(-rect.top, 0), maxScroll);
    const progress = maxScroll === 0 ? 0 : current / maxScroll;

    const viewportWidth = window.innerWidth;
    const trackWidth = track.scrollWidth;
    const maxTranslate = Math.max(0, trackWidth - viewportWidth + 260);

    track.style.transform = `translate3d(${-maxTranslate * progress}px, 0, 0)`;
  }

  let ticking = false;

  function onScroll() {
    if (ticking) return;

    ticking = true;

    window.requestAnimationFrame(() => {
      updateScroll();
      ticking = false;
    });
  }

  window.addEventListener("resize", () => {
    updateHeight();
    updateScroll();
  });

  window.addEventListener("scroll", onScroll, { passive: true });

  window.addEventListener("load", () => {
    updateHeight();
    updateScroll();
  });

  updateHeight();
  updateScroll();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCircuitsHorizontalScroll);
} else {
  initCircuitsHorizontalScroll();
}

/* =========================
   SECCIÓN 02 - CARD PEGADA AL CUADRADO
   NO MODIFICA LA ANIMACIÓN DEL CIRCUITO
========================= */

function initAboutCircuitCardNextToPoint() {
  const section = document.querySelector("#sobre-apex");
  if (!section) return;

  const wrap = section.querySelector(".circuit-wrap");
  const info = section.querySelector(".circuit-wrap > .circuit-info");
  const points = section.querySelectorAll(".circuit-point");

  if (!wrap || !info || !points.length) return;

  const content = [
    {
      step: "01",
      title: "Telemetría en tiempo real",
      text: "Lectura de frenadas, aceleración y trazadas para entender cada vuelta."
    },
    {
      step: "02",
      title: "Comparación de sectores",
      text: "Comparamos cada sector para detectar dónde se pierde tiempo y dónde se puede mejorar."
    },
    {
      step: "03",
      title: "Mejora aplicada",
      text: "Convertimos los datos en decisiones concretas para corregir la conducción."
    }
  ];

  const stepEl = info.querySelector("#circuitStep");
  const titleEl = info.querySelector("#circuitTitle");
  const textEl = info.querySelector("#circuitText");

  function moveCardToPoint(point) {
    const wrapRect = wrap.getBoundingClientRect();
    const pointRect = point.getBoundingClientRect();

    const cardWidth = info.offsetWidth || 198;
    const cardHeight = info.offsetHeight || 118;
    const gap = 22;

    const pointCenterX = pointRect.left - wrapRect.left + pointRect.width / 2;
    const pointCenterY = pointRect.top - wrapRect.top + pointRect.height / 2;

    let left = pointCenterX + gap;
    let top = pointCenterY;

    /* Si la card se va para la derecha, aparece a la izquierda del cuadrado */
    if (left + cardWidth > wrapRect.width) {
      left = pointCenterX - cardWidth - gap;
    }

    /* Si se va muy a la izquierda, la vuelve a meter */
    if (left < 8) {
      left = pointCenterX + gap;
    }

    /* Evita que se corte arriba o abajo */
    const minTop = cardHeight / 2 + 8;
    const maxTop = wrapRect.height - cardHeight / 2 - 8;
    top = Math.max(minTop, Math.min(top, maxTop));

    /* IMPORTANTE: esto pisa cualquier posición vieja */
    info.style.setProperty("left", `${left}px`, "important");
    info.style.setProperty("top", `${top}px`, "important");
    info.style.setProperty("right", "auto", "important");
    info.style.setProperty("bottom", "auto", "important");
    info.style.setProperty("inset", "auto", "important");
  }

  function activatePoint(index) {
    const point = points[index];
    const data = content[index];

    if (!point || !data) return;

    points.forEach((item, i) => {
      item.classList.toggle("is-active", i === index);
    });

    if (stepEl) stepEl.textContent = data.step;
    if (titleEl) titleEl.textContent = data.title;
    if (textEl) textEl.textContent = data.text;

    wrap.classList.add("has-info");

    requestAnimationFrame(() => {
      moveCardToPoint(point);
    });
  }

  points.forEach((point, index) => {
    point.addEventListener("mouseenter", () => {
      setTimeout(() => activatePoint(index), 0);
    });

    point.addEventListener("click", () => {
      setTimeout(() => activatePoint(index), 0);
    });

    point.addEventListener("focus", () => {
      setTimeout(() => activatePoint(index), 0);
    });
  });

  window.addEventListener("resize", () => {
    const activeIndex = [...points].findIndex((point) =>
      point.classList.contains("is-active")
    );

    if (activeIndex >= 0) {
      activatePoint(activeIndex);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAboutCircuitCardNextToPoint);
} else {
  initAboutCircuitCardNextToPoint();
}


/* =========================
   ADVANCED - COACHES ACORDEÓN
========================= */

(function () {
  const accordion = document.querySelector(".coach-accordion");
  if (!accordion) return;

  const panels = accordion.querySelectorAll(".coach-panel");

  panels.forEach((panel, index) => {
    const trigger = panel.querySelector(".coach-trigger");

    trigger.addEventListener("click", () => {
      accordion.dataset.active = index;

      panels.forEach((item, itemIndex) => {
        item.classList.toggle("is-active", itemIndex === index);
      });
    });
  });
})();

/* =========================
   ADVANCED - FAQ ACORDEÓN
========================= */

(function () {
  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((faq) => {
        faq.classList.remove("is-open");
      });

      if (!isOpen) {
        item.classList.add("is-open");
      }
    });
  });
})();

/* =========================
   PANTALLA DE CARGA GLOBAL
   transición breve, sin frenar la navegación
========================= */

(function () {
  const loader = document.getElementById("pageLoader");
  if (!loader) return;

  const ENTER_MIN_TIME = 180;
  const NAVIGATION_DELAY = 160;
  const startedAt = performance.now();

  function showLoader() {
    loader.classList.remove("is-hidden");
  }

  function hideLoader() {
    loader.classList.add("is-hidden");
  }

  function hideAfterMinimum() {
    const remaining = Math.max(0, ENTER_MIN_TIME - (performance.now() - startedAt));
    window.setTimeout(hideLoader, remaining);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hideAfterMinimum, { once: true });
  } else {
    hideAfterMinimum();
  }

  window.addEventListener("pageshow", hideAfterMinimum, { once: true });

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const isExcluded =
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      link.target === "_blank";

    const isInternalPage = href.includes("index.html") || href.includes("advanced.html");
    if (isExcluded || !isInternalPage) return;

    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showLoader();
      window.setTimeout(() => {
        window.location.assign(href);
      }, NAVIGATION_DELAY);
    });
  });
})();



/* =========================
   ADVANCED MOBILE - CLASE A CLASE FINAL
========================= */

(function () {
  const section = document.querySelector(".adv-program-free-section");
  if (!section) return;

  const viewport = section.querySelector(".adv-program-free-window");
  const track = section.querySelector(".adv-program-free-track");

  if (!viewport || !track) return;

  let ticking = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }

  function updateAdvancedProgram() {
    ticking = false;

    const isMobile = window.matchMedia("(max-width: 700px)").matches;

    if (!isMobile) {
      track.style.transform = "";
      return;
    }

    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;

    const start = sectionTop;
    const end = sectionTop + sectionHeight - viewportHeight;

    const progress = clamp((window.scrollY - start) / Math.max(end - start, 1), 0, 1);

    const maxMove = Math.max(track.scrollWidth - viewport.clientWidth, 0);
    const moveX = -maxMove * progress;

    track.style.transform = `translate3d(${moveX}px, 0, 0)`;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateAdvancedProgram);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("load", requestUpdate);

  setTimeout(requestUpdate, 400);
  requestUpdate();
})();

/* =====================================================
   FINAL MOBILE JS PATCH - APEX
   About popups + Advanced section 03 scroll
===================================================== */

(function () {
  const section = document.querySelector("#sobre-apex");
  if (!section) return;

  const points = Array.from(section.querySelectorAll(".track-point"));
  const popup = section.querySelector("#trackPopup");
  const popupTitle = section.querySelector("#trackPopupTitle");
  const popupText = section.querySelector("#trackPopupText");
  if (!points.length || !popup || !popupTitle || !popupText) return;

  const positions = [
    { left: "23%", top: "24%" },
    { left: "33%", top: "7%" },
    { left: "43%", top: "37%" },
    { left: "4%", top: "80%" }
  ];

  const isMobile = () => window.matchMedia("(max-width: 700px)").matches;

  function openPopup(point, index) {
    if (!isMobile()) return;
    const pos = positions[index] || positions[0];

    popupTitle.textContent = point.dataset.title || "";
    popupText.textContent = point.dataset.text || "";
    popup.style.setProperty("--mobile-popup-left", pos.left);
    popup.style.setProperty("--mobile-popup-top", pos.top);

    points.forEach((p) => p.classList.remove("is-active"));
    point.classList.add("is-active");
    popup.classList.add("is-visible");
  }

  points.forEach((point, index) => {
    point.addEventListener("click", (event) => {
      if (!isMobile()) return;
      event.preventDefault();
      event.stopPropagation();
      openPopup(point, index);
    });

    point.addEventListener("mouseenter", () => openPopup(point, index));
  });

  function closePopup() {
    popup.classList.remove("is-visible");
    points.forEach((p) => p.classList.remove("is-active"));
  }

  document.addEventListener("click", (event) => {
    if (isMobile() && !section.contains(event.target)) closePopup();
  });

  window.addEventListener("resize", closePopup);
  if (isMobile()) closePopup();
})();


(function () {
  const section = document.querySelector(".tech2-section");
  const scene = document.querySelector(".tech2-scene");
  if (!section || !scene) return;

  function fixMobileTechVisibility() {
    if (!window.matchMedia("(max-width: 700px)").matches) return;
    scene.classList.add("is-interactive");
    section.style.display = "block";
    section.style.visibility = "visible";
    section.style.opacity = "1";
  }

  window.addEventListener("load", fixMobileTechVisibility);
  window.addEventListener("resize", fixMobileTechVisibility);
  setTimeout(fixMobileTechVisibility, 250);
  fixMobileTechVisibility();
})();


// AJUSTE FINAL VOLANTE:
// Los hotspots NO aparecen mientras el volante está junto al texto institucional.
// Aparecen cuando el volante entra en la fase interactiva, con halo celeste pulsante.
(function () {
  const section = document.querySelector(".tech2-section");
  const scene = document.querySelector(".tech2-scene");
  if (!section || !scene) return;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function isMobile() {
    return window.innerWidth <= 980;
  }

  const hotspotNodes = Array.from(scene.querySelectorAll(".tech2-hotspot"));
  let hotspotsVisible = null;

  function updateHotspotVisibility() {
    if (isMobile()) {
      if (hotspotsVisible !== true) scene.classList.add("hotspots-ready");
      hotspotsVisible = true;
      return;
    }

    const sceneHeight = scene.offsetHeight || window.innerHeight;
    const total = Math.max(section.offsetHeight - sceneHeight, 1);
    const rect = section.getBoundingClientRect();
    const progress = clamp(-rect.top / total, 0, 1);

    // Coincide con el momento en que el volante ya empieza a entrar en modo interactivo.
    // Antes de este punto queda limpio, sin botones sobre la imagen.
    const shouldShow = progress >= 0.25;
    if (shouldShow === hotspotsVisible) return;

    hotspotsVisible = shouldShow;
    scene.classList.toggle("hotspots-ready", shouldShow);

    if (!shouldShow) {
      scene.classList.remove("has-zone");
      scene.dataset.zone = "";
      hotspotNodes.forEach((hotspot) => {
        hotspot.classList.remove("is-selected", "active", "is-active");
      });
    }
  }

  let raf = null;
  function requestUpdate() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      updateHotspotVisibility();
    });
  }

  window.addEventListener("load", requestUpdate);
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  setTimeout(updateHotspotVisibility, 60);
  setTimeout(updateHotspotVisibility, 350);
  updateHotspotVisibility();
})();

/* =====================================================
   ADVANCED 03 - CLASE A CLASE / VELOCIDAD DE SCROLL
   Hace que el track horizontal complete el recorrido en
   menos scroll, sin cambiar la estructura del HTML.
===================================================== */
(function () {
  const section = document.querySelector(".advanced-program-section");
  const sticky = document.querySelector(".advanced-program-sticky");
  const track = document.getElementById("advancedProgramTrack");

  if (!section || !sticky || !track) return;

  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
  const isMobile = () => window.matchMedia("(max-width: 700px)").matches;

  function updateFastAdvancedProgram() {
    const sectionTop = section.offsetTop;
    const total = Math.max(section.offsetHeight - window.innerHeight, 1);
    const rawProgress = (window.scrollY - sectionTop) / total;

    /* Un poquito de aceleración para que no se sienta eterno. */
    const speed = isMobile() ? 1.16 : 1.12;
    const progress = clamp(rawProgress * speed, 0, 1);

    if (isMobile()) {
      const maxMove = Math.max(track.scrollWidth - window.innerWidth + 60, 0);
      const x = -maxMove * progress;

      track.style.setProperty("--advanced-mobile-x", `${x}px`);
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      return;
    }

    track.style.removeProperty("--advanced-mobile-x");

    const trackScrollDistance = Math.max(track.scrollWidth - sticky.clientWidth + 120, 0);
    const moveX = progress * trackScrollDistance;

    track.style.transform = `translate3d(${-moveX}px, 0, 0)`;
  }

  let ticking = false;

  function requestFastUpdate() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      ticking = false;
      updateFastAdvancedProgram();
    });
  }

  window.addEventListener("scroll", requestFastUpdate, { passive: true });
  window.addEventListener("resize", requestFastUpdate);
  window.addEventListener("load", requestFastUpdate);
  setTimeout(requestFastUpdate, 300);
  requestFastUpdate();
})();



/* =========================
   CURSOS - ACTIVACIÓN DE CARDS
========================= */

(function () {
  const section = document.querySelector('.courses-section-enhanced');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.course-card[data-course-index]'));
  if (!cards.length) return;

  function setActive(index) {
    cards.forEach((card, cardIndex) => {
      card.classList.toggle('is-active', cardIndex === index);
    });
  }

  cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => setActive(index));
    card.addEventListener('focusin', () => setActive(index));
    card.addEventListener('click', (event) => {
      if (event.target.closest('a')) return;
      setActive(index);
    });
  });

  setActive(0);
})();


/* =========================
   CURSOS - PLACAS TECNICAS ACTIVACION
   hover no queda pegado al salir
========================= */

(function () {
  const section = document.querySelector('.courses-section-tech');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.course-tech-card'));
  if (!cards.length) return;

  function setActive(activeCard) {
    cards.forEach((card) => card.classList.toggle('is-active', card === activeCard));
  }

  function clearActive() {
    cards.forEach((card) => card.classList.remove('is-active'));
  }

  function isTouchLike() {
    return window.matchMedia('(hover: none), (pointer: coarse)').matches;
  }

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      if (!isTouchLike()) setActive(card);
    });

    card.addEventListener('mouseleave', () => {
      if (!isTouchLike()) clearActive();
    });

    card.addEventListener('focusin', () => setActive(card));
    card.addEventListener('focusout', clearActive);

    card.addEventListener('click', (event) => {
      if (event.target.closest('a')) return;

      if (isTouchLike()) {
        setActive(card);
      } else {
        clearActive();
      }
    });
  });

  section.addEventListener('mouseleave', () => {
    if (!isTouchLike()) clearActive();
  });
})();

/* =========================
   CURSOS TÉCNICOS - LIMPIAR HOVER PEGADO
========================= */

(function () {
  const section = document.querySelector('.courses-section-tech');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.course-tech-card'));
  if (!cards.length) return;

  function clearCourseTechActive() {
    cards.forEach((card) => {
      card.classList.remove('is-active', 'is-hover', 'active');
    });
  }

  cards.forEach((card) => {
    card.addEventListener('mouseleave', clearCourseTechActive);
    card.addEventListener('pointerleave', clearCourseTechActive);
    card.addEventListener('blur', clearCourseTechActive, true);
  });

  section.addEventListener('mouseleave', clearCourseTechActive);
  section.addEventListener('pointerleave', clearCourseTechActive);

  document.addEventListener('mousemove', (event) => {
    if (!section.contains(event.target)) {
      clearCourseTechActive();
    }
  });
})();

/* =========================
   CURSOS TÉCNICOS - LIMPIEZA FINAL DE HOVER
========================= */
(function () {
  const section = document.querySelector('.courses-section-tech');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.course-tech-card'));
  if (!cards.length) return;

  function clearAll() {
    cards.forEach((card) => card.classList.remove('is-active', 'is-hover', 'active'));
  }

  cards.forEach((card) => {
    card.addEventListener('mouseleave', clearAll);
    card.addEventListener('pointerleave', clearAll);
    card.addEventListener('mouseout', (event) => {
      if (!card.contains(event.relatedTarget)) clearAll();
    });
  });

  section.addEventListener('mouseleave', clearAll);
  window.addEventListener('blur', clearAll);
})();


/* =========================
   ADVANCED - RECORRIDO SECCIÓN 02
========================= */
(function () {
  const journey = document.querySelector('.advanced-method-journey');
  if (!journey) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        journey.classList.add('is-animated');
      }
    });
  }, { threshold: 0.35 });

  observer.observe(journey);
})();


/* =========================
   ADVANCED - CIRCUITO POR TRAMOS SECCIÓN 02
========================= */
(function () {
  const journey = document.querySelector('.advanced-method-journey');
  if (!journey) return;

  const nodes = Array.from(journey.querySelectorAll('.advanced-journey-node'));
  const segments = Array.from(journey.querySelectorAll('.advanced-circuit-progress'));

  const stepEl = document.getElementById('advancedJourneyStep');
  const titleEl = document.getElementById('advancedJourneyTitle');
  const textEl = document.getElementById('advancedJourneyText');

  if (!nodes.length || !segments.length || !stepEl || !titleEl || !textEl) return;

  function activateJourney(index) {
    const node = nodes[index];
    if (!node) return;

    nodes.forEach((item, itemIndex) => {
      item.classList.toggle('is-active', itemIndex === index);
      item.setAttribute('aria-pressed', itemIndex === index ? 'true' : 'false');
    });

    segments.forEach((segment, segmentIndex) => {
      segment.classList.toggle('is-filled', segmentIndex <= index);
    });

    stepEl.textContent = `Paso ${node.dataset.step}`;
    titleEl.textContent = node.dataset.title || '';
    textEl.textContent = node.dataset.text || '';
  }

  function clearJourney() {
    nodes.forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-pressed', 'false');
    });

    segments.forEach((segment) => {
      segment.classList.remove('is-filled');
    });

    stepEl.textContent = 'Recorrido';
    titleEl.textContent = 'Tocá un punto';
    textEl.textContent = 'Cada punto activa una etapa del proceso y completa el circuito de entrenamiento.';
  }

  nodes.forEach((node, index) => {
    node.setAttribute('aria-pressed', 'false');

    node.addEventListener('mouseenter', () => activateJourney(index));
    node.addEventListener('focus', () => activateJourney(index));
    node.addEventListener('click', () => activateJourney(index));
  });

  journey.addEventListener('mouseleave', clearJourney);

  clearJourney();
})();


/* =========================
   ADVANCED - PANEL TELEMETRÍA SECCIÓN 02
========================= */
(function () {
  const panel = document.querySelector('.advanced-method-telemetry');
  if (!panel) return;

  const steps = Array.from(panel.querySelectorAll('.advanced-telemetry-step'));
  const stepEl = document.getElementById('advancedTelemetryStep');
  const titleEl = document.getElementById('advancedTelemetryTitle');
  const textEl = document.getElementById('advancedTelemetryText');
  const barEl = document.getElementById('advancedTelemetryBar');

  if (!steps.length || !stepEl || !titleEl || !textEl || !barEl) return;

  function activateStep(step) {
    steps.forEach((item) => {
      const active = item === step;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    stepEl.textContent = step.dataset.step || '';
    titleEl.textContent = step.dataset.title || '';
    textEl.textContent = step.dataset.text || '';
    barEl.style.width = step.dataset.bar || '70%';
  }

  steps.forEach((step) => {
    step.setAttribute('aria-pressed', step.classList.contains('is-active') ? 'true' : 'false');

    step.addEventListener('mouseenter', () => activateStep(step));
    step.addEventListener('focus', () => activateStep(step));
    step.addEventListener('click', () => activateStep(step));
  });

  activateStep(steps[0]);
})();


/* =========================
   NAVBAR / SALTO A SECCIONES CON OFFSET
========================= */
(function () {
  function getAnchorOffset() {
    const navbar = document.querySelector(".navbar");
    const extra = window.matchMedia("(max-width: 900px)").matches ? 28 : 34;
    return navbar ? navbar.offsetHeight + extra : 120;
  }

  function scrollToCurrentHash(behavior = "smooth") {
    if (!window.location.hash) return;

    const target = document.querySelector(window.location.hash);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.pageYOffset - getAnchorOffset();

    window.scrollTo({
      top,
      behavior
    });
  }

  window.addEventListener("load", () => {
    if (!window.location.hash) return;

    setTimeout(() => {
      scrollToCurrentHash("auto");
    }, 1150);
  });

  window.addEventListener("hashchange", () => {
    setTimeout(() => {
      scrollToCurrentHash("smooth");
    }, 40);
  });
})();


/* =========================================
   RESPONSIVE / FOOTER ACORDEÓN
========================================= */
(function () {
  const columns = Array.from(document.querySelectorAll(".footer-col, .advanced-footer-col"));
  if (!columns.length) return;

  const mobileQuery = window.matchMedia("(max-width: 900px)");

  function closeColumn(column) {
    column.classList.remove("is-open");
    const trigger = column.querySelector(".footer-accordion-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  }

  function openColumn(column) {
    column.classList.add("is-open");
    const trigger = column.querySelector(".footer-accordion-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
  }

  columns.forEach((column) => {
    const trigger = column.querySelector(".footer-accordion-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      if (!mobileQuery.matches) return;

      const isOpen = column.classList.contains("is-open");
      const parentNav = column.closest(".footer-nav, .advanced-footer-nav");
      const siblingColumns = parentNav
        ? Array.from(parentNav.querySelectorAll(".footer-col, .advanced-footer-col"))
        : columns;

      siblingColumns.forEach(closeColumn);

      if (!isOpen) {
        openColumn(column);
      }
    });
  });

  function resetOnDesktop() {
    if (mobileQuery.matches) return;
    columns.forEach(closeColumn);
  }

  mobileQuery.addEventListener("change", resetOnDesktop);
  resetOnDesktop();
})();


/* =========================================
   MOBILE / NAVBAR DESPLEGABLE
========================================= */
(function () {
  const navbars = Array.from(document.querySelectorAll(".navbar"));
  if (!navbars.length) return;

  const mobileQuery = window.matchMedia("(max-width: 700px)");

  navbars.forEach((navbar) => {
    const toggle = navbar.querySelector(".menu-toggle");
    const menu = navbar.querySelector(".nav-links");

    if (!toggle || !menu) return;

    function setOpen(isOpen) {
      navbar.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!mobileQuery.matches) return;
      setOpen(!navbar.classList.contains("is-open"));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("click", (event) => {
      if (!navbar.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });

    window.addEventListener("resize", () => {
      if (!mobileQuery.matches) {
        setOpen(false);
      }
    });
  });
})();
