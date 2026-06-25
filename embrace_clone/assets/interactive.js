document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuBtn = document.querySelector('button[aria-label="Open menu"]');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const menu = document.querySelector('.md\\:hidden.hidden.absolute.top-full');
      if (menu) {
        menu.classList.toggle('hidden');
      }
    });
  }

  // 2. Action Buttons & Booking Modal
  const modalHTML = `
    <div id="booking-modal" class="fixed inset-0 hidden flex items-center justify-center px-4" style="z-index: 2147483647; background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);">
      <div class="w-full max-w-xl relative rounded-3xl overflow-hidden" style="background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 8px 32px 0 rgba(31,38,135,0.15);">
          <button id="close-modal" class="absolute top-5 right-6 text-gray-500 hover:text-black text-4xl font-light cursor-pointer leading-none transition-colors" style="z-index: 10;">&times;</button>
          
          <div class="flex border-b border-gray-300/50 relative" style="z-index: 10; background: rgba(255, 255, 255, 0.3);">
             <button id="tab-new" class="flex-1 py-5 text-center font-bold text-lg md:text-xl border-b-4 border-[var(--blue-fig)] text-[var(--blue-fig)] transition-colors cursor-pointer" style="background: rgba(255,255,255,0.6);">New Patient</button>
             <button id="tab-existing" class="flex-1 py-5 text-center font-bold text-lg md:text-xl border-b-4 border-transparent text-gray-600 hover:text-gray-900 transition-colors cursor-pointer" style="background: transparent;">Existing Patient</button>
          </div>
          
          <div class="p-8 md:p-12 relative" style="z-index: 10;">
             <div id="content-new" class="flex flex-col items-center justify-center py-6 gap-6 transition-opacity duration-300">
                <div class="w-16 h-16 rounded-full flex items-center justify-center mb-2" style="background: rgba(35, 67, 148, 0.1);">
                    <svg class="w-8 h-8 text-[var(--blue-fig)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                </div>
                <h3 class="text-2xl font-bold text-center text-gray-800">Welcome to eMbrace!</h3>
                <p class="text-lg text-center text-gray-700 mb-2">Please fill out our intake form to help us understand your needs and match you with the right specialist.</p>
                <a href="./appointment.html" class="bg-[var(--blue-fig)] text-white font-semibold text-lg px-12 py-4 rounded-full hover:scale-105 transition-transform duration-300 cursor-pointer inline-block" style="box-shadow: 0 4px 15px rgba(35, 67, 148, 0.3);">Fill the Form</a>
             </div>
             
             <div id="content-existing" class="hidden flex flex-col items-center justify-center py-6 gap-6 transition-opacity duration-300">
                <div class="w-16 h-16 rounded-full flex items-center justify-center mb-2" style="background: rgba(16, 185, 129, 0.1);">
                    <svg class="w-8 h-8" style="color: #10B981;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 class="text-2xl font-bold text-center text-gray-800">Welcome back!</h3>
                <p class="text-lg text-center text-gray-700 mb-2">Please click below to access our partner portal and securely book your next session.</p>
                <a href="https://meet-my-doctor.firebaseapp.com/#/app?eid=47033" target="_blank" class="bg-[var(--blue-fig)] text-white font-semibold text-lg px-12 py-4 rounded-full hover:scale-105 transition-transform duration-300 cursor-pointer inline-block" style="box-shadow: 0 4px 15px rgba(35, 67, 148, 0.3);">Book the Appointment</a>
             </div>
          </div>
      </div>
    </div>
  `;

  // Inject modal into body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const bookingModal = document.getElementById('booking-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const tabNew = document.getElementById('tab-new');
  const tabExisting = document.getElementById('tab-existing');
  const contentNew = document.getElementById('content-new');
  const contentExisting = document.getElementById('content-existing');

  // Close modal logic
  closeModalBtn.addEventListener('click', () => {
    bookingModal.classList.add('hidden');
  });
  
  // Close on outside click
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      bookingModal.classList.add('hidden');
    }
  });

  // Tab switching logic
  tabNew.addEventListener('click', () => {
    tabNew.classList.remove('border-transparent', 'text-gray-600');
    tabNew.classList.add('border-[var(--blue-fig)]', 'text-[var(--blue-fig)]');
    tabNew.style.background = 'rgba(255,255,255,0.6)';
    
    tabExisting.classList.remove('border-[var(--blue-fig)]', 'text-[var(--blue-fig)]');
    tabExisting.classList.add('border-transparent', 'text-gray-600');
    tabExisting.style.background = 'transparent';
    
    contentNew.classList.remove('hidden');
    contentExisting.classList.add('hidden');
  });

  tabExisting.addEventListener('click', () => {
    tabExisting.classList.remove('border-transparent', 'text-gray-600');
    tabExisting.classList.add('border-[var(--blue-fig)]', 'text-[var(--blue-fig)]');
    tabExisting.style.background = 'rgba(255,255,255,0.6)';
    
    tabNew.classList.remove('border-[var(--blue-fig)]', 'text-[var(--blue-fig)]');
    tabNew.classList.add('border-transparent', 'text-gray-600');
    tabNew.style.background = 'transparent';
    
    contentExisting.classList.remove('hidden');
    contentNew.classList.add('hidden');
  });

  // Attach modal to action buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    const text = btn.innerText.trim().toLowerCase();
    if (text.includes('request session') || text.includes('book a consultation') || text.includes('book a session') || text.includes('book appointment')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        bookingModal.classList.remove('hidden');
      });
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
    './assets/carousel1-BUqaO1dK.jpg',
    './assets/carousel2-DTTdaTuf.jpg',
    './assets/carousel3-GFF7ZgxW.jpg',
    './assets/carousel4-kql07uS0.jpg',
    './assets/carousel5-5PBn5vWJ.jpg',
    './assets/carousel6-BRLlaZgG.jpg',
    './assets/carousel7-BPTj019V.jpg',
    './assets/carousel8-DtyaDwxk.jpg'
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

});
