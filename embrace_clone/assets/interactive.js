document.addEventListener('DOMContentLoaded', () => {
  // Determine page depth for relative path resolution
  const subdirPattern = /\/(?:adhd|autism|learning-disabilities|speech-therapy|occupational-therapy|child-psychology|teen-mental-health|adult-mental-health|parent-hub|schools-hub|corporate-wellness|locations)\//;
  const isSubdir = subdirPattern.test(window.location.pathname);
  const isLocalFile = window.location.protocol === 'file:';
  const prefix = isLocalFile ? (isSubdir ? '../' : './') : '/';

  // 1. Mobile Menu Toggle
  document.addEventListener('click', (e) => {
    const menuBtn = e.target.closest('button[aria-label="Open menu"]');
    if (menuBtn) {
      const menu = document.querySelector('.md\\:hidden.hidden.absolute.top-full');
      if (menu) {
        menu.classList.toggle('hidden');
      }
    }
  });

  // 2. Action Buttons redirection to Appointment Form
  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, a');
    if (el) {
      // Ignore elements inside forms
      if (el.closest('form')) return;
      
      const text = el.innerText.trim().toLowerCase();
      if (text.includes('request session') || text.includes('book a consultation') || text.includes('book a session') || text.includes('book appointment')) {
        e.preventDefault();
        window.location.href = prefix + 'appointment' + (isLocalFile ? '.html' : '');
      }
    }
  });

  // 3. FAQ Accordions
  const faqs = document.querySelectorAll('button.w-full.text-left.flex.justify-between.items-center');
  faqs.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('img');
      if (content && content.classList.contains('transition-all')) {
        const isHidden = content.classList.contains('max-h-0');
        if (isHidden) {
          content.classList.remove('max-h-0', 'opacity-0');
          content.classList.add('max-h-[1000px]', 'opacity-100');
          if (icon) icon.classList.add('rotate-45');
        } else {
          content.classList.add('max-h-0', 'opacity-0');
          content.classList.remove('max-h-[1000px]', 'opacity-100');
          if (icon) icon.classList.remove('rotate-45');
        }
      }
    });
  });

  // 4. Hero Carousel (5 images sliding)
  const heroNextBtn = document.querySelector('button[aria-label="Next"]');
  const heroPrevBtn = document.querySelector('button[aria-label="Previous"]');
  if (heroNextBtn && heroPrevBtn) {
    const btnContainer = heroNextBtn.parentElement;
    const imgContainer = btnContainer.previousElementSibling;
    if (imgContainer) {
      const images = Array.from(imgContainer.querySelectorAll('img'));
      if (images.length === 5) {
        // Capture initial classes and styles
        let classArray = images.map(img => img.className);
        let styleArray = images.map(img => img.getAttribute('style') || '');
        
        const dotsContainer = btnContainer.querySelector('.flex.gap-2');
        const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('span')) : [];
        let currentIndex = 0;

        const updateDots = () => {
          dots.forEach((dot, i) => {
            if (i === currentIndex) {
              dot.className = 'h-2 w-2 rounded-full bg-purple-500';
            } else {
              dot.className = 'h-2 w-2 rounded-full bg-gray-300';
            }
          });
        };

        heroNextBtn.addEventListener('click', () => {
          classArray.unshift(classArray.pop());
          styleArray.unshift(styleArray.pop());
          images.forEach((img, i) => {
            img.className = classArray[i];
            img.setAttribute('style', styleArray[i]);
          });
          currentIndex = (currentIndex + 1) % 5;
          updateDots();
        });

        heroPrevBtn.addEventListener('click', () => {
          classArray.push(classArray.shift());
          styleArray.push(styleArray.shift());
          images.forEach((img, i) => {
            img.className = classArray[i];
            img.setAttribute('style', styleArray[i]);
          });
          currentIndex = (currentIndex - 1 + 5) % 5;
          updateDots();
        });
      }
    }
  }

  // 5. Wellbeing Spaces Carousel (Single image rotation)
  const wbImages = [
    prefix + 'assets/carousel1-BUqaO1dK.jpg',
    prefix + 'assets/carousel2-DTTdaTuf.jpg',
    prefix + 'assets/carousel3-GFF7ZgxW.jpg',
    prefix + 'assets/carousel4-kql07uS0.jpg',
    prefix + 'assets/carousel5-5PBn5vWJ.jpg',
    prefix + 'assets/carousel6-BRLlaZgG.jpg',
    prefix + 'assets/carousel7-BPTj019V.jpg',
    prefix + 'assets/carousel8-DtyaDwxk.jpg'
  ];
  
  const wbImgEl = document.querySelector('img[alt="carousel-1"]');
  if (wbImgEl) {
    const wbPrevBtn = wbImgEl.nextElementSibling;
    const wbNextBtn = wbPrevBtn ? wbPrevBtn.nextElementSibling : null;
    
    if (wbPrevBtn && wbNextBtn) {
      let wbIdx = 0;
      wbNextBtn.addEventListener('click', () => {
        wbIdx = (wbIdx + 1) % wbImages.length;
        wbImgEl.src = wbImages[wbIdx];
      });
      wbPrevBtn.addEventListener('click', () => {
        wbIdx = (wbIdx - 1 + wbImages.length) % wbImages.length;
        wbImgEl.src = wbImages[wbIdx];
      });
    }
  }

  // 6. Auto-Scrolling Marquees (Featured Partners & Testimonials)
  
  // A. Slick Slider (Featured Partners)
  const slickTracks = document.querySelectorAll('.slick-track');
  slickTracks.forEach(track => {
    // Remove static transform so it doesn't get stuck
    track.style.transform = 'translate3d(0px, 0px, 0px)';
    
    let position = 0;
    const speed = 1.0; // pixels per frame
    
    const animateSlick = () => {
      position -= speed;
      // When we've scrolled half the track (since it has clones), reset to 0
      if (Math.abs(position) >= track.scrollWidth / 2) {
        position = 0;
      }
      track.style.transform = `translate3d(${position}px, 0px, 0px)`;
      requestAnimationFrame(animateSlick);
    };
    requestAnimationFrame(animateSlick);
  });

  // B. Testimonials (Overflow auto containers)
  const testimonialContainers = document.querySelectorAll('.flex.overflow-x-auto.hide-scrollbar');
  testimonialContainers.forEach(container => {
    // Skip the testimonials carousel that has manual navigation buttons
    if (container.id === 'testimonials-carousel') return;

    // Clone children to create a seamless loop
    const children = Array.from(container.children);
    children.forEach(child => {
      const clone = child.cloneNode(true);
      container.appendChild(clone);
    });

    let scrollPos = 0;
    const speed = 0.5; // pixels per frame

    const animateTestimonials = () => {
      scrollPos += speed;
      // If we've scrolled past the original set of children
      if (scrollPos >= container.scrollWidth / 2) {
        scrollPos = 0;
      }
      container.scrollLeft = scrollPos;
      requestAnimationFrame(animateTestimonials);
    };
    
    // Disable manual scroll interference for a smooth auto-scroll
    container.style.overflowX = 'hidden';
    requestAnimationFrame(animateTestimonials);
  });

  // 6. Number Count-Up Animation
  const countUpElements = document.querySelectorAll('.count-up');
  const animateCountUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    let current = 0;
    
    const startTime = performance.now();
    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      current = Math.floor(target * ease);
      
      el.innerText = current.toLocaleString() + '+';
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.innerText = target.toLocaleString() + '+';
      }
    };
    requestAnimationFrame(updateCount);
  };

  if (countUpElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCountUp(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    countUpElements.forEach(el => observer.observe(el));
  }

  // 7. Component Loader
  const loadComponent = async (placeholderId, componentPath) => {
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      try {
        const response = await fetch(componentPath);
        if (response.ok) {
          let html = await response.text();
          // Rewrite relative paths in loaded components to match current page depth
          html = html.replace(/"(\.\/)(assets\/|index\.html)/g, '"' + prefix + '$2');
          html = html.replace(/href="\.\//g, 'href="' + prefix);
          
          if (!isLocalFile) {
            // Strip .html from all links to prevent 301/308 redirects that crash proxies like Ruttl
            html = html.replace(/\.html"/g, '"');
            html = html.replace(/href="\/index"/g, 'href="/"');
            html = html.replace(/href="index"/g, 'href="/"');
          }
          
          placeholder.outerHTML = html;
        }
      } catch (err) {
        console.error('Failed to load component:', componentPath, err);
      }
    }
  };

  loadComponent('header-placeholder', prefix + 'components/header.html?v=' + new Date().getTime());
  loadComponent('footer-placeholder', prefix + 'components/footer.html?v=' + new Date().getTime());

  // 8. Global Widget Injection
  const widgetScript = document.createElement('script');
  widgetScript.defer = true;
  widgetScript.src = 'https://app.wacrs.com/install-widget/bundle.js?key=6a4151f9-3b56-4868-993a-34ddc5e31b35';
  document.body.appendChild(widgetScript);

  // 9. Ruttl Compatibility (Remove .html to prevent proxy redirect crash)
  if (!isLocalFile) {
    const stripHtmlLinks = () => {
      document.querySelectorAll('a').forEach(a => {
        let href = a.getAttribute('href');
        if (href && href.endsWith('.html') && !href.startsWith('http')) {
          a.setAttribute('href', href.replace(/\.html$/, ''));
        }
      });
    };
    // Run initially and then observe DOM for dynamic additions
    stripHtmlLinks();
    const observer = new MutationObserver(stripHtmlLinks);
    observer.observe(document.body, { childList: true, subtree: true });
  }
});
