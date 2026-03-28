document.addEventListener('DOMContentLoaded', () => {

  // 1. Intersection Observer for Fade Up Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const fadeUpElements = document.querySelectorAll('.js-fade-up');
  fadeUpElements.forEach(el => observer.observe(el));

  // 2. Header Style on Scroll
  const header = document.querySelector('.js-header');
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });

  // 3. Mobile Menu Toggle
  const menuBtn = document.querySelector('.js-menu-btn');
  const nav = document.querySelector('.header__nav');
  
  if(menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      menuBtn.classList.toggle('is-active');
      nav.classList.toggle('is-active');
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav__link, .nav__btn');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.classList.remove('is-active');
        nav.classList.remove('is-active');
      });
    });
  }

  // 4. Infinite Works Slider Setup
  const slider = document.querySelector('.js-works-slider');
  const sliderWrapper = document.querySelector('.works__slider-wrapper');
  
  if (slider && sliderWrapper) {
    // Clone all cards for seamless infinite scroll
    const cards = Array.from(slider.children);
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.remove('js-fade-up', 'is-inview'); 
      slider.appendChild(clone);
    });

    if (window.innerWidth > 768) {
      // Desktop: JS auto-scroll and drag
      let currentTranslate = 0;
      let isDragging = false;
      let startPos = 0;
      let draggedDistance = 0;
      let isHovering = false;
      let animationId;
      
      const baseSpeed = 0.8; 

      function animationLoop() {
        if (!isDragging && !isHovering) {
          currentTranslate -= baseSpeed;
        }
        const resetPoint = slider.scrollWidth / 2;
        if (currentTranslate <= -resetPoint) {
          currentTranslate += resetPoint;
        } else if (currentTranslate > 0) {
          currentTranslate -= resetPoint;
        }
        slider.style.transform = `translateX(${currentTranslate}px)`;
        animationId = requestAnimationFrame(animationLoop);
      }
      animationLoop();

      function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
      }

      slider.addEventListener('mouseenter', () => isHovering = true);
      slider.addEventListener('mouseleave', () => { isHovering = false; isDragging = false; });
      slider.addEventListener('mousedown', (e) => {
        isDragging = true; draggedDistance = 0; startPos = getPositionX(e); slider.style.transition = 'none';
      });
      slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentPosition = getPositionX(e); const delta = currentPosition - startPos;
        draggedDistance += Math.abs(delta); currentTranslate += delta; startPos = currentPosition;
      });
      slider.addEventListener('mouseup', () => isDragging = false);

      slider.querySelectorAll('img, a').forEach(el => el.addEventListener('dragstart', (e) => e.preventDefault()));
      slider.addEventListener('click', (e) => { if (draggedDistance > 5) e.preventDefault(); });

    } else {
      // Mobile: Native Scroll Snap with infinite loop repositioning
      sliderWrapper.addEventListener('scroll', () => {
         const maxScroll = slider.scrollWidth / 2;
         // If we scroll into the cloned set, silently jump back to the original set
         if (sliderWrapper.scrollLeft >= maxScroll) {
             // Temporarily disable scroll-snap to prevent jumping glitches
             sliderWrapper.style.scrollSnapType = 'none';
             sliderWrapper.scrollLeft -= maxScroll;
             // Re-enable scroll-snap
             setTimeout(() => { sliderWrapper.style.scrollSnapType = 'x mandatory'; }, 0);
         }
      }, { passive: true });
    }
  }

  // 5. Scroll Progress Bar
  const progressBar = document.querySelector('.js-scroll-progress');
  
  if (progressBar) {
    window.addEventListener('scroll', () => {
      // Calculate how far the user has scrolled
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      // Calculate total scrollable height
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      // Calculate percentage and update the width
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

});
