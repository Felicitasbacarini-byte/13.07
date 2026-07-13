// APEX UI Kit interactions
(function () {
  const cursor = document.querySelector('.cursor-glow');

  if (cursor && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', (event) => {
      cursor.style.left = event.clientX + 'px';
      cursor.style.top = event.clientY + 'px';
      cursor.classList.add('is-visible');
    });

    window.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
  }

  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));

  const demoButtons = document.querySelectorAll('.circuit-demo button');
  const demoPopup = document.querySelector('.demo-popup');

  demoButtons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      if (!demoPopup) return;
      const label = button.dataset.demo === 'trazadas' ? 'Trazadas activas' : 'Telemetría activa';
      demoPopup.textContent = label;
    });
  });

  const gallery = document.querySelector('#galleryDemo .gallery-strip');
  const prev = document.querySelector('#galleryDemo .gallery-prev');
  const next = document.querySelector('#galleryDemo .gallery-next');

  if (gallery && prev && next) {
    prev.addEventListener('click', () => gallery.scrollBy({ left: -240, behavior: 'smooth' }));
    next.addEventListener('click', () => gallery.scrollBy({ left: 240, behavior: 'smooth' }));
  }
})();


// Real UI Kit interaction demos
(function () {
  const circuit = document.querySelector('#realCircuitDemo');
  if (circuit) {
    const buttons = Array.from(circuit.querySelectorAll('button'));
    const popup = circuit.querySelector('.real-circuit-popup');
    const popupTitle = popup?.querySelector('h4');
    const popupText = popup?.querySelector('p');
    const positions = [
      { left: '25%', top: '25%' },
      { left: '36%', top: '9%' },
      { left: '50%', top: '66%' },
      { left: '4%', top: '58%' }
    ];

    buttons.forEach((button, index) => {
      button.addEventListener('mouseenter', () => {
        buttons.forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        if (!popup || !popupTitle || !popupText) return;
        popupTitle.textContent = button.dataset.title || '';
        popupText.textContent = button.dataset.text || '';
        popup.style.left = positions[index].left;
        popup.style.top = positions[index].top;
      });
    });
    buttons[0]?.classList.add('is-active');
  }

  const wheel = document.querySelector('#realWheelDemo');
  if (wheel) {
    const buttons = Array.from(wheel.querySelectorAll('.real-wheel-visual button'));
    const eyebrow = wheel.querySelector('.real-wheel-panel span');
    const title = wheel.querySelector('.real-wheel-panel h4');
    const text = wheel.querySelector('.real-wheel-panel p');
    const copy = {
      screen: ['Display central', 'Pantalla del volante', 'Datos de vuelta, delta y referencias visibles durante la conducción.'],
      left: ['Input lateral', 'Sector izquierdo', 'Comandos de precisión para acciones rápidas y gestión de funciones.'],
      right: ['Botonera derecha', 'Sector derecho', 'Accesos rápidos para ajustes de carrera y control del simulador.'],
      bottom: ['Control dinámico', 'Ajuste rápido', 'Controles inferiores para modificar parámetros sin perder foco.']
    };

    buttons.forEach((button) => {
      button.addEventListener('mouseenter', () => {
        buttons.forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        const data = copy[button.dataset.zone];
        if (!data || !eyebrow || !title || !text) return;
        eyebrow.textContent = data[0];
        title.textContent = data[1];
        text.textContent = data[2];
      });
    });
  }

  const coachDemo = document.querySelector('#realCoachDemo');
  if (coachDemo) {
    const panels = Array.from(coachDemo.querySelectorAll('.kit-coach-panel'));

    function activateCoach(panel) {
      const index = panels.indexOf(panel);
      panels.forEach((item) => item.classList.toggle('is-active', item === panel));
      coachDemo.dataset.active = String(Math.max(index, 0));
    }

    panels.forEach((panel) => {
      const trigger = panel.querySelector('.kit-coach-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', () => activateCoach(panel));
      trigger.addEventListener('mouseenter', () => activateCoach(panel));
      trigger.addEventListener('focus', () => activateCoach(panel));
    });

    activateCoach(coachDemo.querySelector('.kit-coach-panel.is-active') || panels[0]);
  }

  const realGallery = document.querySelector('#realGalleryDemo .real-gallery-strip');
  const realPrev = document.querySelector('#realGalleryDemo .real-gallery-prev');
  const realNext = document.querySelector('#realGalleryDemo .real-gallery-next');
  if (realGallery && realPrev && realNext) {
    realPrev.addEventListener('click', () => realGallery.scrollBy({ left: -250, behavior: 'smooth' }));
    realNext.addEventListener('click', () => realGallery.scrollBy({ left: 250, behavior: 'smooth' }));
  }
})();


// UI Kit - demo de panel de telemetría actualizado
(function () {
  const demos = document.querySelectorAll('[data-kit-telemetry-demo]');
  if (!demos.length) return;

  demos.forEach((demo) => {
    const buttons = Array.from(demo.querySelectorAll('.kit-telemetry-steps button'));
    const stepEl = demo.querySelector('[data-telemetry-step]');
    const titleEl = demo.querySelector('[data-telemetry-title]');
    const textEl = demo.querySelector('[data-telemetry-text]');
    const barEl = demo.querySelector('[data-telemetry-bar]');

    if (!buttons.length || !stepEl || !titleEl || !textEl || !barEl) return;

    function activate(button) {
      buttons.forEach((item) => {
        item.classList.toggle('is-active', item === button);
      });

      stepEl.textContent = button.dataset.step || '';
      titleEl.textContent = button.dataset.title || '';
      textEl.textContent = button.dataset.text || '';
      barEl.style.width = button.dataset.bar || '70%';
    }

    buttons.forEach((button) => {
      button.addEventListener('mouseenter', () => activate(button));
      button.addEventListener('focus', () => activate(button));
      button.addEventListener('click', () => activate(button));
    });

    activate(demo.querySelector('.kit-telemetry-steps button.is-active') || buttons[0]);
  });
})();


/* =========================================
   UI KIT RESPONSIVE / NAVBAR HAMBURGUESA
========================================= */
(function () {
  const navbar = document.querySelector(".uk-navbar");
  const toggle = document.querySelector("#ukMenuToggle");
  const menu = document.querySelector("#ukNavMenu");

  if (!navbar || !toggle || !menu) return;

  function setOpen(isOpen) {
    navbar.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
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
    if (!window.matchMedia("(max-width: 900px)").matches) {
      setOpen(false);
    }
  });
})();
