

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Année dans le footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav : fond au scroll ---------- */
  const nav = document.getElementById('nav');
  const onScrollNav = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Menu burger (mobile) ---------- */
  const burger = document.getElementById('burger');
  const navLinksEl = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Lien actif selon la section visible ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const setActiveLink = () => {
    let current = sections[0].id;
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  setActiveLink();
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ---------- Reveal au scroll (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Halo qui suit la souris (desktop uniquement) ---------- */
  const glow = document.getElementById('cursorGlow');
  if (window.matchMedia('(min-width: 861px)').matches) {
    window.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  }

  /* ---------- Animation de frappe dans le terminal ---------- */
  const typedCodeEl = document.getElementById('typedCode');
  if (typedCodeEl) {
    // Chaque ligne : texte brut affiché caractère par caractère,
    // puis remplacé par une version colorée (tokens) une fois complète.
    const lines = [
      { raw: 'const bernice = {', html: '<span class="tk-key">const</span> bernice = {' },
      { raw: '  role: "Développeuse Web",', html: '&nbsp;&nbsp;role: <span class="tk-str">"Développeuse Web"</span>,' },
      { raw: '  stack: ["HTML","CSS3","JS","React","PHP","Laravel"],', html: '&nbsp;&nbsp;stack: [<span class="tk-str">"HTML"</span>, <span class="tk-str">"CSS3"</span>, <span class="tk-str">"JS"</span>, <span class="tk-str">"React"</span>, <span class="tk-str">"PHP"</span>, <span class="tk-str">"Laravel"</span>],' },
      { raw: '  formation: "EIG Bénin",', html: '&nbsp;&nbsp;formation: <span class="tk-str">"EIG Bénin"</span>,' },
      { raw: '  passion: "IA générative",', html: '&nbsp;&nbsp;passion: <span class="tk-str">"IA "</span>,' },
      { raw: '  disponible: true', html: '&nbsp;&nbsp;disponible: <span class="tk-bool">true</span>' },
      { raw: '};', html: '};' },
    ];

    const typeSpeed = 18;
    const linePause = 120;

    async function typeLines() {
      let builtHtml = '';
      for (const line of lines) {
        let current = '';
        for (const char of line.raw) {
          current += char;
          typedCodeEl.innerHTML = builtHtml + escapeHtml(current);
          if (!prefersReducedMotion) await sleep(typeSpeed);
        }
        builtHtml += line.html + '\n';
        typedCodeEl.innerHTML = builtHtml;
        await sleep(linePause);
      }
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

    if (prefersReducedMotion) {
      typedCodeEl.innerHTML = lines.map(l => l.html).join('\n');
    } else {
      typeLines();
    }
  }

  /* ---------- Photo de profil : arrière-plan animé qui change de couleur ----------
     Le cadre de la photo change automatiquement de couleur de fond toutes les 3
     secondes, avec une transition douce (voir la transition CSS sur .photo-frame).
     Cela remplace l'ancienne interaction "toucher pour changer la couleur". */
  const photoFrame = document.getElementById('photoFrame');
  if (photoFrame) {
    const bgColors = [
      '#6E93CE', // bleu signature
      '#E0904D', // orange signature
      '#8FBE9B', // vert doux
      '#C77DFF', // violet
      '#5BC0EA', // cyan
      '#E1685E', // rouge corail
      '#F2C14E', // jaune moutarde
    ];
    let colorIndex = 0;

    if (prefersReducedMotion) {
      // Une seule couleur fixe si l'utilisateur préfère moins d'animations
      photoFrame.style.backgroundColor = bgColors[0];
    } else {
      photoFrame.style.backgroundColor = bgColors[colorIndex];
      setInterval(() => {
        colorIndex = (colorIndex + 1) % bgColors.length;
        photoFrame.style.backgroundColor = bgColors[colorIndex];
      }, 3000);
    }
  }
});