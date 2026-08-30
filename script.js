(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Intro cleanup (removes from DOM once its CSS animation ends)
  --------------------------------------------------------- */
  const intro = document.getElementById('intro');
  if (intro) {
    const introDuration = reducedMotion ? 700 : 2700;
    setTimeout(() => {
      intro.style.pointerEvents = 'none';
      setTimeout(() => intro.remove(), 750);
    }, introDuration);
  }

  /* ---------------------------------------------------------
     Smooth scroll: "Meet Duman" button
  --------------------------------------------------------- */
  const meetBtn = document.getElementById('meetBtn');
  const aboutSection = document.getElementById('about');
  if (meetBtn && aboutSection) {
    meetBtn.addEventListener('click', () => {
      aboutSection.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* ---------------------------------------------------------
     Scroll reveal via IntersectionObserver
  --------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.reveal, .reveal-up');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------
     Hero content reveal (delayed group, independent of scroll)
  --------------------------------------------------------- */
  const heroReveals = document.querySelectorAll('.hero-content .reveal-up');
  window.addEventListener('load', () => {
    const delay = reducedMotion ? 200 : 1900;
    setTimeout(() => {
      heroReveals.forEach((el) => el.classList.add('is-visible'));
    }, delay);
  });

  /* ---------------------------------------------------------
     Custom cursor glow (desktop / fine pointer only)
  --------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (cursorGlow && hasFinePointer && !reducedMotion) {
    window.addEventListener('pointermove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }

  /* ---------------------------------------------------------
     Magnetic buttons
  --------------------------------------------------------- */
  if (hasFinePointer && !reducedMotion) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ---------------------------------------------------------
     Gallery tilt effect
  --------------------------------------------------------- */
  if (hasFinePointer && !reducedMotion) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${px * 6}deg) rotateX(${py * -6}deg) translateZ(0)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = 'rotateY(0) rotateX(0)';
      });
    });
  }

  /* ---------------------------------------------------------
     Gallery + Lightbox
  --------------------------------------------------------- */
  const galleryData = [
    { src: 'assets/duman-1.jpg', alt: 'Duman the cat lying on his back on a light-colored armchair, tongue out, looking at the camera', caption: 'Look at this face.' },
    { src: 'assets/duman-2.jpg', alt: 'Duman as a small kitten sitting on a blanket on an office chair, looking directly at the camera', caption: 'Absolutely illegal levels of cuteness.' }
  ];

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const galleryButtons = document.querySelectorAll('.gallery-item');

  let currentIndex = 0;
  let lastFocused = null;

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lastFocused = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
    document.addEventListener('keydown', handleLightboxKeydown);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleLightboxKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function updateLightboxContent() {
    const item = galleryData[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxCaption.textContent = item.caption;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  function handleLightboxKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  }

  galleryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10) || 0;
      openLightbox(idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  /* ---------------------------------------------------------
     Feature video play/pause toggle
  --------------------------------------------------------- */
  const featureVideo = document.getElementById('featureVideo');
  const playToggle = document.getElementById('playToggle');
  const iconPlay = playToggle ? playToggle.querySelector('.icon-play') : null;
  const iconPause = playToggle ? playToggle.querySelector('.icon-pause') : null;

  if (featureVideo && playToggle) {
    playToggle.addEventListener('click', () => {
      if (featureVideo.paused) {
        featureVideo.play();
      } else {
        featureVideo.pause();
      }
    });
    featureVideo.addEventListener('play', () => {
      iconPlay.hidden = true;
      iconPause.hidden = false;
      playToggle.setAttribute('aria-label', 'Pause video');
    });
    featureVideo.addEventListener('pause', () => {
      iconPlay.hidden = false;
      iconPause.hidden = true;
      playToggle.setAttribute('aria-label', 'Play video');
    });
  }

  /* ---------------------------------------------------------
     Animated stat bars (0 -> value) on scroll into view
  --------------------------------------------------------- */
  const statRows = document.querySelectorAll('.stat-row');
  if ('IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const row = entry.target;
          const value = parseInt(row.getAttribute('data-value'), 10) || 0;
          const fill = row.querySelector('.stat-fill');
          const num = row.querySelector('.stat-num');
          requestAnimationFrame(() => {
            fill.style.width = value + '%';
          });
          animateCount(num, value);
          statObserver.unobserve(row);
        }
      });
    }, { threshold: 0.4 });

    statRows.forEach((row) => statObserver.observe(row));
  }

  function animateCount(el, target) {
    if (reducedMotion) { el.textContent = target + '%'; return; }
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + '%';
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------
     Pet Duman button
  --------------------------------------------------------- */
  const petBtn = document.getElementById('petBtn');
  const petCard = document.getElementById('petCard');
  const petMessage = document.getElementById('petMessage');
  const messages = [
    'Duman approves.',
    'One more pet.',
    'He is judging you.',
    'Duman has accepted your presence.',
    'You may continue.'
  ];
  let lastMessageIndex = -1;

  function randomPaw(container) {
    const paw = document.createElement('span');
    paw.className = 'paw';
    paw.textContent = '🐾';
    paw.setAttribute('aria-hidden', 'true');
    const x = 40 + Math.random() * 20;
    const rot = (Math.random() * 40 - 20).toFixed(1);
    paw.style.left = x + '%';
    paw.style.bottom = '18px';
    paw.style.setProperty('--rot', rot + 'deg');
    container.appendChild(paw);
    setTimeout(() => paw.remove(), 1200);
  }

  if (petBtn && petCard && petMessage) {
    petBtn.addEventListener('click', () => {
      if (!reducedMotion) {
        petCard.classList.remove('shake');
        void petCard.offsetWidth;
        petCard.classList.add('shake');

        for (let i = 0; i < 3; i++) {
          setTimeout(() => randomPaw(petCard), i * 90);
        }
      }

      let idx = Math.floor(Math.random() * messages.length);
      if (idx === lastMessageIndex) idx = (idx + 1) % messages.length;
      lastMessageIndex = idx;

      petMessage.classList.remove('show');
      void petMessage.offsetWidth;
      petMessage.textContent = messages[idx];
      petMessage.classList.add('show');
    });
  }

  /* ---------------------------------------------------------
     Duman Mode toggle + ambient particles
  --------------------------------------------------------- */
  const dumanModeBtn = document.getElementById('dumanModeBtn');
  const particleField = document.getElementById('particleField');
  let particleInterval = null;

  function spawnParticle() {
    const el = document.createElement('span');
    const isSpark = Math.random() > 0.5;
    el.className = isSpark ? 'particle spark' : 'particle';
    if (!isSpark) el.textContent = '🐾';
    const left = Math.random() * 100;
    const duration = 10 + Math.random() * 8;
    const size = isSpark ? '' : (12 + Math.random() * 8) + 'px';
    el.style.left = left + 'vw';
    el.style.animationDuration = duration + 's';
    if (size) el.style.fontSize = size;
    particleField.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 500);
  }

  function startParticles() {
    if (reducedMotion) return;
    spawnParticle();
    particleInterval = setInterval(spawnParticle, 1400);
  }

  function stopParticles() {
    if (particleInterval) clearInterval(particleInterval);
    particleInterval = null;
    if (particleField) particleField.innerHTML = '';
  }

  if (dumanModeBtn) {
    dumanModeBtn.addEventListener('click', () => {
      const isOn = document.body.classList.toggle('duman-mode');
      dumanModeBtn.setAttribute('aria-pressed', String(isOn));
      if (isOn) {
        startParticles();
      } else {
        stopParticles();
      }
    });
  }

  /* ---------------------------------------------------------
     Pause hero video when off-screen (perf on long pages)
  --------------------------------------------------------- */
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          heroVideo.play().catch(() => {});
        } else {
          heroVideo.pause();
        }
      });
    }, { threshold: 0.05 });
    heroObserver.observe(heroVideo);
  }

})();
