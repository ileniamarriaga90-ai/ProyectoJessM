// ===========================================================
// Vida International Ministries — script.js (Definitivo / Unificado)
// ===========================================================

document.addEventListener('DOMContentLoaded', function () {

  // 0. Video del banner: reproducir apenas cargue el sitio (iOS + Android)
  var heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.setAttribute('playsinline', '');

    var tryPlay = function () {
      var p = heroVideo.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    };

    tryPlay();
    heroVideo.addEventListener('loadeddata', tryPlay);
    heroVideo.addEventListener('canplay', tryPlay);

    ['touchend', 'click', 'keydown'].forEach(function (evt) {
      window.addEventListener(evt, function () {
        if (heroVideo.paused) tryPlay();
      }, { passive: true, once: true });
    });

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && heroVideo.paused) tryPlay();
    });
  }


  // 1. Reveal-on-scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  // 2. Galería y Filtros
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const category = btn.getAttribute("data-filter");

        galleryItems.forEach((item) => {
          if (category === "all" || item.getAttribute("data-category") === category) {
            item.classList.remove("hide");
          } else {
            item.classList.add("hide");
          }
        });
      });
    });
  }


  // 3. Lightbox de la Galería
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImg");
  const caption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtnGallery = document.getElementById("lightboxPrev");
  const nextBtnGallery = document.getElementById("lightboxNext");

  if (modal && modalImg) {
    let activeItems = [];
    let currentIndexGallery = 0;

    function updateActiveItems() {
      activeItems = Array.from(galleryItems).filter((item) => !item.classList.contains("hide"));
    }

    function showImage(index) {
      updateActiveItems();
      currentIndexGallery = index;
      const item = activeItems[currentIndexGallery];
      if (item) {
        modalImg.src = item.getAttribute("data-src");
        if (caption) caption.innerText = item.querySelector("h3") ? item.querySelector("h3").innerText : "";
        modal.classList.add("active");
      }
    }

    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        updateActiveItems();
        const index = activeItems.indexOf(item);
        if (index !== -1) showImage(index);
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    if (nextBtnGallery) nextBtnGallery.addEventListener("click", () => showImage((currentIndexGallery + 1) % activeItems.length));
    if (prevBtnGallery) prevBtnGallery.addEventListener("click", () => showImage((currentIndexGallery - 1 + activeItems.length) % activeItems.length));

    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("active")) return;
      if (e.key === "Escape") modal.classList.remove("active");
      if (e.key === "ArrowRight") showImage((currentIndexGallery + 1) % activeItems.length);
      if (e.key === "ArrowLeft") showImage((currentIndexGallery - 1 + activeItems.length) % activeItems.length);
    });
  }


  // 4. Carrusel de Testimonios por Capas (Fade)
  const track = document.getElementById('testimonialTrack');
  if (track) {
    const cards = Array.from(track.children);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const dotsNav = document.getElementById('sliderDots');
    const dots = dotsNav ? Array.from(dotsNav.children) : [];

    let currentIndex = 0;

    function goToSlide(index) {
      if (index >= cards.length) {
        currentIndex = 0;
      } else if (index < 0) {
        currentIndex = cards.length - 1;
      } else {
        currentIndex = index;
      }

      cards.forEach((card, idx) => {
        if (idx === currentIndex) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active', 'is-active');
        } else {
          dot.classList.remove('active', 'is-active');
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
      });
    }

    if (dotsNav) {
      dotsNav.addEventListener('click', (e) => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;
        const index = parseInt(targetDot.dataset.index, 10);
        goToSlide(index);
      });
    }

    goToSlide(0);
  }


  // 5. Carrusel de fondo desvanecido (Fade Slider) para el Hero
  const heroSlides = document.querySelectorAll(".hero-bg-slide");
  if (heroSlides.length > 0) {
    let currentSlide = 0;
    const intervalTime = 3500; 

    setInterval(() => {
      heroSlides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add("active");
    }, intervalTime);
  }

});


// ===========================================================
// Lógica Global de la Sección de Membership & Partners
// ===========================================================

let selectedFrequency = 'monthly';
let selectedAmount = 50;

function setFrequency(type) {
  selectedFrequency = type;
  
  const btnOneTime = document.getElementById('btnOneTime');
  const btnMonthly = document.getElementById('btnMonthly');
  const durationNotice = document.getElementById('durationNotice');
  const containerOneTime = document.getElementById('paypal-button-container-one-time');
  const containerSub = document.getElementById('paypal-button-container-subscription');

  if (btnOneTime && btnMonthly) {
    btnOneTime.classList.toggle('active', type === 'one-time');
    btnMonthly.classList.toggle('active', type === 'monthly');
  }

  if (durationNotice) {
    durationNotice.style.display = (type === 'monthly') ? 'block' : 'none';
  }

  // Alternar la visibilidad entre el botón de pago único y el de suscripción
  if (type === 'one-time') {
    if (containerOneTime) containerOneTime.style.display = 'block';
    if (containerSub) containerSub.style.display = 'none';
  } else {
    if (containerOneTime) containerOneTime.style.display = 'none';
    if (containerSub) containerSub.style.display = 'block';
  }
}

function selectAmount(value, e) {
  const btns = document.querySelectorAll('.amount-btn');
  btns.forEach(b => b.classList.remove('active'));
  
  const clickedBtn = e ? e.target : (event ? event.target : null);
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  }

  const customAmountBox = document.getElementById('customAmountBox');

  if (value === 'custom') {
    if (customAmountBox) customAmountBox.style.display = 'block';
    selectedAmount = 'custom';
  } else {
    if (customAmountBox) customAmountBox.style.display = 'none';
    selectedAmount = value;
  }
}


// ===========================================================
// Función externa para Zelle
// ===========================================================
function openZelleAndCopy() {
  const emailElem = document.getElementById('zelleEmail');
  if (!emailElem) return;
  const email = emailElem.innerText;
  
  navigator.clipboard.writeText(email).then(() => {
    const notice = document.getElementById('zelleCopyNotice');
    if (notice) {
      notice.style.display = 'block';
      setTimeout(() => {
        notice.style.display = 'none';
      }, 3000);
    }
  }).catch(err => {
    console.error('Error al copiar al portapapeles: ', err);
  });
}