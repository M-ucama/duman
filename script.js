(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Intro cleanup */
  const intro = document.getElementById('intro');
  if (intro) {
    const introDuration = reducedMotion ? 700 : 2700;
    setTimeout(() => {
      intro.style.pointerEvents = 'none';
      setTimeout(() => intro.remove(), 750);
    }, introDuration);
  }

  /* Smooth scroll */
  const meetBtn = document.getElementById('meetBtn');
  const aboutSection = document.getElementById('about');
  if (meetBtn && aboutSection) {
    meetBtn.addEventListener('click', () => {
      aboutSection.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* Scroll reveal */
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

  /* Hero reveal */
  const heroReveals = document.querySelectorAll('.hero-content .reveal-up');
  window.addEventListener('load', () => {
    const delay = reducedMotion ? 200 : 1900;
    setTimeout(() => heroReveals.forEach((el) => el.classList.add('is-visible')), delay);
  });

  /* Gallery + Lightbox */
  const galleryData = [
    { src: 'assets/duman-1.jpg', alt: 'دُمان مستلقٍ على ظهره فوق كنبة فاتحة، يُخرج لسانه', caption: 'بهذا الوجه كان يأخذ قلوبنا.' },
    { src: 'assets/duman-2.jpg', alt: 'دُمان وهو صغير جالس على بطانية', caption: 'صغيرًا، كما بدأ كل شيء.' }
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

  function updateLightboxContent() {
    const item = galleryData[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxCaption.textContent = item.caption;
  }
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
  function showNext() { currentIndex = (currentIndex + 1) % galleryData.length; updateLightboxContent(); }
  function showPrev() { currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length; updateLightboxContent(); }
  function handleLightboxKeydown(e) {
    // RTL: left arrow = next, right arrow = previous
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showNext();
    if (e.key === 'ArrowRight') showPrev();
  }

  galleryButtons.forEach((btn) => {
    btn.addEventListener('click', () => openLightbox(parseInt(btn.getAttribute('data-index'), 10) || 0));
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  /* Feature video */
  const featureVideo = document.getElementById('featureVideo');
  const playToggle = document.getElementById('playToggle');
  const iconPlay = playToggle ? playToggle.querySelector('.icon-play') : null;
  const iconPause = playToggle ? playToggle.querySelector('.icon-pause') : null;

  if (featureVideo && playToggle) {
    playToggle.addEventListener('click', () => {
      if (featureVideo.paused) featureVideo.play(); else featureVideo.pause();
    });
    featureVideo.addEventListener('play', () => {
      iconPlay.hidden = true; iconPause.hidden = false;
      playToggle.setAttribute('aria-label', 'إيقاف الفيديو');
    });
    featureVideo.addEventListener('pause', () => {
      iconPlay.hidden = false; iconPause.hidden = true;
      playToggle.setAttribute('aria-label', 'تشغيل الفيديو');
    });
  }

  /* Candles */
  const candleBtn = document.getElementById('candleBtn');
  const candleRow = document.getElementById('candleRow');
  const candleStage = document.getElementById('candleStage');
  const candleMessage = document.getElementById('candleMessage');
  const candleWords = [
    'وصلت شمعتك إلى دُمان.',
    'شكرًا لأنك تتذكّره.',
    'نورٌ صغير لسحابة صغيرة.',
    'سيبقى في القلب دائمًا.',
    'نَم بسلام يا دُمان.'
  ];
  let candleCount = 0;

  function makeCandle() {
    const c = document.createElement('div');
    c.className = 'candle';
    c.innerHTML = '<span class="flame"></span><span class="wick"></span><span class="wax"></span>';
    c.style.setProperty('--h', (46 + Math.random() * 22).toFixed(0) + 'px');
    c.style.setProperty('--d', (Math.random() * 1.5).toFixed(2) + 's');
    return c;
  }

  if (candleBtn && candleRow) {
    // one candle is already lit
    candleRow.appendChild(makeCandle());
    candleStage.classList.add('lit');

    candleBtn.addEventListener('click', () => {
      if (candleRow.children.length < 9) candleRow.appendChild(makeCandle());
      candleCount++;
      candleMessage.classList.remove('show');
      void candleMessage.offsetWidth;
      candleMessage.textContent = candleWords[(candleCount - 1) % candleWords.length];
      candleMessage.classList.add('show');
    });
  }

  /* Gentle floating embers */
  const particleField = document.getElementById('particleField');
  function spawnEmber() {
    if (!particleField || document.hidden) return;
    const el = document.createElement('span');
    el.className = 'particle spark';
    const duration = 12 + Math.random() * 8;
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.animationDuration = duration + 's';
    particleField.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 500);
  }
  if (!reducedMotion) {
    spawnEmber();
    setInterval(spawnEmber, 2200);
  }

  /* Pause hero video off-screen */
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) heroVideo.play().catch(() => {});
        else heroVideo.pause();
      });
    }, { threshold: 0.05 }).observe(heroVideo);
  }
})();
