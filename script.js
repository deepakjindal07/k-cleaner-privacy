/**
 * KAD Labs — Interactive Scripts
 * Lightweight, zero-dependency script for navigation, interactions, and dynamic year.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic copyright year
  const yearElements = document.querySelectorAll('#year, .current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach((el) => {
    el.textContent = currentYear;
  });

  // 2. Mobile navigation menu toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    const toggleMenu = () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close mobile menu when a nav link is clicked
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleMenu();
      }
    });
  }

  // 3. Featured Phone Mockup Carousel
  const sliderTrack = document.getElementById('phone-slider-track');
  const prevBtn = document.getElementById('mockup-prev');
  const nextBtn = document.getElementById('mockup-next');
  const dots = document.querySelectorAll('.carousel-dot');
  const pillTitle = document.getElementById('pill-title');
  const pillDesc = document.getElementById('pill-desc');
  const pillIcon = document.getElementById('pill-icon');

  if (sliderTrack) {
    const slides = sliderTrack.querySelectorAll('.phone-slide');
    let currentIndex = 0;
    const totalSlides = slides.length;

    const pillData = [
      {
        icon: '⚡',
        title: 'Storage & Device Clarity',
        desc: 'Transparent scan &middot; On-device control'
      },
      {
        icon: '📁',
        title: 'File & Duplicate Discovery',
        desc: 'Categorized breakdown &middot; Duplicate detection'
      },
      {
        icon: '🔋',
        title: 'Telemetry & App Diagnostics',
        desc: 'Battery health &middot; Data monitor &middot; App telemetry'
      }
    ];

    const updateCarousel = (index) => {
      currentIndex = (index + totalSlides) % totalSlides;
      sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentIndex);
      });

      dots.forEach((dot, idx) => {
        const isActive = idx === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      if (pillData[currentIndex]) {
        if (pillIcon) pillIcon.textContent = pillData[currentIndex].icon;
        if (pillTitle) pillTitle.textContent = pillData[currentIndex].title;
        if (pillDesc) pillDesc.innerHTML = pillData[currentIndex].desc;
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateCarousel(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateCarousel(currentIndex + 1);
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(targetIndex)) {
          updateCarousel(targetIndex);
        }
      });
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const phoneScreen = document.getElementById('phone-screen');
    if (phoneScreen) {
      phoneScreen.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      phoneScreen.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            updateCarousel(currentIndex + 1); // swipe left
          } else {
            updateCarousel(currentIndex - 1); // swipe right
          }
        }
      }, { passive: true });
    }
  }

  // 4. Copy email helper
  const copyButtons = document.querySelectorAll('[data-copy-text]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy-text');
      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      } catch (err) {
        // Fallback: mailto link click
        window.location.href = `mailto:${textToCopy}`;
      }
    });
  });

  // 5. Active section highlighting for desktop navigation
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav a');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }
});
