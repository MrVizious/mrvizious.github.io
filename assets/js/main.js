/**
* Template Name: iPortfolio
* Updated: May 30 2023 with Bootstrap v5.3.0
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function (e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  const typedIcon = select('.typed-icon i')
  const typedIcons = [
    'fa-solid fa-code',
    'fa-solid fa-gamepad',
    'fa-solid fa-cubes',
    'fa-solid fa-vr-cardboard',
    'fa-solid fa-people-group'
  ]

  if (typed) {
    const typed_strings = typed.getAttribute('data-typed-items').split(',')
    const originalBackspace = Typed.prototype.backspace

    Typed.prototype.backspace = function (str, pos) {
      const arrayPos = this.arrayPos ?? 0
      const nextIndex = (arrayPos + 1) % typedIcons.length
      if (typedIcon && typedIcons[nextIndex]) {
        typedIcon.className = typedIcons[nextIndex]
      }
      return originalBackspace.call(this, str, pos)
    }

    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1000,
      onBegin: () => {
        if (typedIcon) {
          typedIcon.className = 'fa-solid fa-code'
        }
      },
      onReset: () => {
        if (typedIcon) {
          typedIcon.className = 'fa-solid fa-code'
        }
      }
    });
  }

  const particleCanvas = select('.site-particles')
  if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d')
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false, radius: 180 }
    const particles = []

    const resizeCanvas = () => {
      particleCanvas.width = window.innerWidth
      particleCanvas.height = window.innerHeight
    }

    const buildParticles = () => {
      const referencePixels = 350 * 350
      const referenceCount = 25
      const largeReferencePixels = 2500 * 1200
      const largeReferenceCount = 500
      const area = particleCanvas.width * particleCanvas.height
      const ratio = (area - referencePixels) / (largeReferencePixels - referencePixels)
      const count = Math.round(referenceCount + (largeReferenceCount - referenceCount) * ratio)
      const drift_speed = 0.25
      particles.length = 0
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * particleCanvas.width,
          y: Math.random() * particleCanvas.height,
          vx: (Math.random() - 0.5) * drift_speed,
          vy: (Math.random() - 0.5) * drift_speed,
          radius: Math.random() * 1.6 + 1.3
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const distance = Math.hypot(dx, dy) || 1
          const mouse_force = 0.5

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius
            p.vx += (dx / distance) * force * mouse_force
            p.vy += (dy / distance) * force * mouse_force
          } else if (distance < mouse.radius * 2.5) {
            const pull = (distance - mouse.radius) / (mouse.radius * 1.8)
            p.vx -= (dx / distance) * pull * 0.04
            p.vy -= (dy / distance) * pull * 0.04
          }
        }

        p.x += p.vx
        p.y += p.vy

        if (p.x <= 0 || p.x >= particleCanvas.width) p.vx *= -1
        if (p.y <= 0 || p.y >= particleCanvas.height) p.vy *= -1
        p.x = Math.min(Math.max(p.x, 0), particleCanvas.width)
        p.y = Math.min(Math.max(p.y, 0), particleCanvas.height)

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const distance = Math.hypot(dx, dy) || 1
          const connection_distance = 150

          if (distance < connection_distance) {
            const alpha = 1 - distance / connection_distance
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(125, 211, 252, ${alpha * 0.24})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(196, 181, 253, 0.92)'
        ctx.fill()
      }

      requestAnimationFrame(drawParticles)
    }

    resizeCanvas()
    buildParticles()
    drawParticles()

    window.addEventListener('resize', () => {
      resizeCanvas()
      buildParticles()
    })

    document.addEventListener('pointermove', (event) => {
      mouse.active = true
      mouse.x = event.clientX
      mouse.y = event.clientY
    })

    document.addEventListener('pointerleave', () => {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    })
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function (direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-filters li', true);

      on('click', '#portfolio-filters li', function (e) {
        e.preventDefault();
        portfolioFilters.forEach(function (el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function () {
          AOS.refresh()
        });
      }, true);
    }

    document.querySelectorAll('.portfolio-wrap').forEach((wrap) => {
      const link = wrap.querySelector('a')
      if (link) {
        wrap.addEventListener('click', () => {
          window.location.href = link.getAttribute('href')
        })
      }
    })

  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();


})()