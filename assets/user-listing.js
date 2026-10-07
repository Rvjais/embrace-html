(async function () {
  'use strict';

  var search = document.querySelector('input[placeholder="Search by name, specialty, language..."]');
  if (!search) return;

  var listingSection = search.closest('.max-w-6xl');
  if (!listingSection) return;

  var cardGrid = Array.from(listingSection.querySelectorAll('div')).find(function (element) {
    return element.classList.contains('grid-cols-1') && element.querySelector('h3');
  });
  if (!cardGrid) return;

  var staticCards = Array.from(cardGrid.children).filter(function (element) {
    return element.querySelector && element.querySelector('h3');
  });
  var cardTemplate = staticCards[0] ? staticCards[0].cloneNode(true) : null;

  function normaliseName(name) {
    return String(name || '').toLowerCase().replace(/[^a-z]/g, '');
  }

  function providerImage(provider) {
    if (provider.imageFileName) {
      return 'https://mmdconnect.appspot.com/images?id=' + encodeURIComponent(provider.uid) + '&ifn=' + encodeURIComponent(provider.imageFileName);
    }
    var initials = String(provider.name || 'eM').split(/\s+/).map(function (part) { return part.charAt(0); }).join('').slice(0, 2).toUpperCase();
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="#FFE1DF"/><circle cx="120" cy="92" r="48" fill="#F39F9A"/><path d="M40 220c8-53 39-80 80-80s72 27 80 80" fill="#F39F9A"/><text x="120" y="226" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#234394">' + initials + '</text></svg>';
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function buildProviderCard(provider) {
    var existing = staticCards.find(function (card) {
      var heading = card.querySelector('h3');
      var existingName = heading ? normaliseName(heading.textContent) : '';
      var providerName = normaliseName(provider.name);
      return existingName === providerName || existingName.indexOf(providerName) !== -1 || providerName.indexOf(existingName) !== -1;
    });
    var card = (existing || cardTemplate).cloneNode(true);
    var heading = card.querySelector('h3');
    var designation = heading.nextElementSibling;
    var image = card.querySelector('img[alt]');
    var experience = Array.from(card.querySelectorAll('span')).find(function (span) {
      return /experience|years|months/i.test(span.textContent);
    });
    var departmentBadge = Array.from(card.querySelectorAll('span')).find(function (span) {
      return span.className.indexOf('bg-[#FFE1DF]') !== -1;
    });
    var price = Array.from(card.querySelectorAll('p')).find(function (paragraph) {
      return /session/i.test(paragraph.textContent) && /₹|price/i.test(paragraph.textContent);
    });
    var booking = card.querySelector('a[href*="appointment"]');

    heading.textContent = provider.name || 'eMbrace therapist';
    designation.textContent = provider.department || 'Therapist';
    image.src = providerImage(provider);
    image.alt = provider.name || 'eMbrace therapist';
    image.removeAttribute('width');
    image.removeAttribute('height');
    if (!existing && experience) experience.textContent = 'Contact our team for experience details';
    if (!existing) {
      var languageBadge = card.querySelector('.bg-gray-100');
      var languageRow = languageBadge && languageBadge.parentElement ? languageBadge.parentElement.parentElement : null;
      if (languageRow) languageRow.remove();
    }
    if (departmentBadge) departmentBadge.textContent = provider.department || 'eMbrace';
    if (price && (!provider.fees || provider.fees === 'N/A')) price.innerHTML = '<span class="text-xs font-normal text-gray-500">Price on request</span>';
    if (booking) booking.href = '/appointment?pid=' + encodeURIComponent(provider.uid);

    var modeBadges = Array.from(card.querySelectorAll('span')).filter(function (span) {
      return span.textContent.trim() === 'Video' || span.textContent.trim() === 'In-Person';
    });
    modeBadges.forEach(function (badge) {
      if (badge.textContent.trim() === 'Video' && !provider.videoConsultEnabled) badge.remove();
      if (badge.textContent.trim() === 'In-Person' && !provider.inPersonConsultEnabled) badge.remove();
    });
    return card;
  }

  try {
    var response = await fetch('https://mmdconnect.appspot.com/api?request=getDoctorInfo', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: 'getDoctorInfo',
        entityId: 47033,
        fetchCalendarInfo: false,
        startRow: 0,
        numRows: 100,
        mmd: true
      })
    });
    if (!response.ok) throw new Error('Provider service returned ' + response.status);
    var providerData = await response.json();
    var providers = Array.isArray(providerData.doctorInfoList) ? providerData.doctorInfoList.filter(function (provider) {
      return provider && provider.isDoctor !== false;
    }) : [];
    if (providers.length) {
      var liveCards = providers.map(buildProviderCard);
      cardGrid.replaceChildren.apply(cardGrid, liveCards);
    }
  } catch (error) {
    console.warn('Live provider directory unavailable; showing the verified local profiles.', error);
  }

  var cards = Array.from(cardGrid.children).filter(function (element) {
    return element.querySelector && element.querySelector('h3');
  });
  var pageSize = 4;
  var visibleLimit = pageSize;
  var query = '';
  var department = '';
  var specialty = '';
  var language = '';
  var condition = '';
  var ageGroup = '';
  var location = '';

  cards.forEach(function (card) {
    var heading = card.querySelector('h3');
    var designation = heading && heading.nextElementSibling;
    var languageNodes = card.querySelectorAll('.bg-gray-100');
    var departmentNode = Array.from(card.querySelectorAll('span')).find(function (span) {
      return span.className.indexOf('bg-[#FFE1DF]') !== -1;
    });

    card.dataset.name = heading ? heading.textContent.trim() : '';
    card.dataset.specialty = designation ? designation.textContent.trim() : '';
    card.dataset.languages = Array.from(languageNodes).map(function (node) {
      return node.textContent.trim();
    }).join('|');
    card.dataset.department = departmentNode ? departmentNode.textContent.trim() : '';
    card.dataset.search = card.textContent.replace(/\s+/g, ' ').trim().toLowerCase();

    var profileText = (card.dataset.specialty + ' ' + card.dataset.department).toLowerCase();
    if (profileText.indexOf('speech') !== -1) card.dataset.conditions = 'Speech & language concerns|Developmental delays';
    else if (profileText.indexOf('special educator') !== -1) card.dataset.conditions = 'Learning difficulties|Developmental delays';
    else if (profileText.indexOf('clinical') !== -1) card.dataset.conditions = 'Emotional & behavioural concerns|Autism & ADHD';
    else card.dataset.conditions = 'Emotional & behavioural concerns|Developmental delays';

    card.dataset.ageGroups = profileText.indexOf('adolescent') !== -1 ? 'Children|Adolescents' : 'Children';
    card.dataset.locations = 'Vasant Kunj';
  });

  var liveRegion = listingSection.querySelector('[aria-live="polite"]');
  var headingLabel = Array.from(listingSection.querySelectorAll('span')).find(function (span) {
    return span.textContent.trim() === 'All therapists';
  });
  var loadButton = Array.from(listingSection.querySelectorAll('button')).find(function (button) {
    return button.textContent.trim() === 'Load More';
  });
  var loadWrapper = loadButton ? loadButton.parentElement : null;

  function uniqueValues(key) {
    return cards.reduce(function (values, card) {
      var items = (card.dataset[key] || '').split('|').filter(Boolean);
      items.forEach(function (item) {
        if (values.indexOf(item) === -1) values.push(item);
      });
      return values;
    }, []).sort();
  }

  function matchingCards() {
    return cards.filter(function (card) {
      var matchesQuery = !query || card.dataset.search.indexOf(query) !== -1;
      var matchesDepartment = !department || card.dataset.search.indexOf(department) !== -1;
      var matchesSpecialty = !specialty || card.dataset.specialty === specialty;
      var matchesLanguage = !language || card.dataset.languages.split('|').indexOf(language) !== -1;
      var matchesCondition = !condition || card.dataset.conditions.split('|').indexOf(condition) !== -1;
      var matchesAge = !ageGroup || card.dataset.ageGroups.split('|').indexOf(ageGroup) !== -1;
      var matchesLocation = !location || card.dataset.locations.split('|').indexOf(location) !== -1;
      return matchesQuery && matchesDepartment && matchesSpecialty && matchesLanguage && matchesCondition && matchesAge && matchesLocation;
    });
  }

  function render() {
    var matches = matchingCards();
    cards.forEach(function (card) { card.hidden = true; });
    matches.slice(0, visibleLimit).forEach(function (card) { card.hidden = false; });

    var countText = matches.length + ' therapist' + (matches.length === 1 ? '' : 's') + ' found';
    if (liveRegion) liveRegion.textContent = countText;
    if (headingLabel) headingLabel.textContent = query || department || specialty || language || condition || ageGroup || location ? countText : 'All therapists';

    var existingEmpty = listingSection.querySelector('[data-listing-empty]');
    if (!matches.length && !existingEmpty) {
      existingEmpty = document.createElement('p');
      existingEmpty.dataset.listingEmpty = 'true';
      existingEmpty.className = 'text-center text-gray-500 py-8';
      existingEmpty.textContent = 'No therapists match your search or selected filters.';
      cardGrid.after(existingEmpty);
    } else if (matches.length && existingEmpty) {
      existingEmpty.remove();
    }

    if (loadWrapper && loadButton) {
      loadWrapper.hidden = matches.length <= pageSize;
      loadButton.hidden = matches.length <= visibleLimit;
      loadButton.textContent = 'Load More';
    }
  }

  search.addEventListener('input', function () {
    query = search.value.trim().toLowerCase();
    visibleLimit = pageSize;
    render();
  });

  if (loadButton) {
    loadButton.type = 'button';
    loadButton.addEventListener('click', function () {
      visibleLimit += pageSize;
      render();
    });
  }

  var hero = listingSection.previousElementSibling;
  if (hero) {
    Array.from(hero.querySelectorAll('button')).forEach(function (button) {
      var label = button.textContent.trim().toLowerCase();
      button.type = 'button';
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', function () {
        var isActive = department === label;
        department = isActive ? '' : label;
        visibleLimit = pageSize;
        Array.from(hero.querySelectorAll('button')).forEach(function (item) {
          item.setAttribute('aria-pressed', 'false');
          item.classList.remove('bg-[#F39F9A]', 'text-white');
          item.classList.add('bg-white', 'text-gray-700');
        });
        if (!isActive) {
          button.setAttribute('aria-pressed', 'true');
          button.classList.remove('bg-white', 'text-gray-700');
          button.classList.add('bg-[#F39F9A]', 'text-white');
        }
        render();
      });
    });
  }

  var openMenu = null;
  var filterConfig = {
    'Filter by Specialty': { key: 'specialty', all: 'All specialties' },
    'Filter by Condition Treated': { key: 'conditions', all: 'All conditions' },
    'Filter by Age Group': { key: 'ageGroups', all: 'All age groups' },
    'Filter by Language': { key: 'languages', all: 'All languages' },
    'Filter by Location': { key: 'locations', all: 'All locations' }
  };

  function setFilter(key, value) {
    if (key === 'specialty') specialty = value;
    if (key === 'conditions') condition = value;
    if (key === 'ageGroups') ageGroup = value;
    if (key === 'languages') language = value;
    if (key === 'locations') location = value;
    visibleLimit = pageSize;
    render();
  }

  function closeMenus(except) {
    Array.from(listingSection.querySelectorAll('[data-filter-menu]')).forEach(function (menu) {
      if (menu !== except) {
        menu.hidden = true;
        var trigger = menu.parentElement.querySelector('button[aria-controls]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
    if (!except) openMenu = null;
  }

  Array.from(listingSection.querySelectorAll('button[aria-label^="Filter by"]')).forEach(function (button, index) {
    var config = filterConfig[button.getAttribute('aria-label')];
    if (!config) return;

    var menu = document.createElement('div');
    var menuId = 'provider-filter-menu-' + index;
    menu.id = menuId;
    menu.hidden = true;
    menu.dataset.filterMenu = 'true';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-label', button.getAttribute('aria-label'));
    menu.className = 'absolute left-0 top-full mt-2 min-w-56 max-h-64 overflow-y-auto rounded-xl border border-[#FFE1DF] bg-white p-2 shadow-lg z-40';

    button.type = 'button';
    button.setAttribute('aria-controls', menuId);
    button.setAttribute('aria-expanded', 'false');

    [{ value: '', text: config.all }].concat(uniqueValues(config.key).map(function (value) {
      return { value: value, text: value };
    })).forEach(function (item) {
      var option = document.createElement('button');
      option.type = 'button';
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', item.value === '' ? 'true' : 'false');
      option.className = 'block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-[#FFE1DF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234394]';
      option.textContent = item.text;
      option.addEventListener('click', function () {
        Array.from(menu.querySelectorAll('[role="option"]')).forEach(function (entry) {
          entry.setAttribute('aria-selected', 'false');
          entry.classList.remove('bg-[#FFE1DF]', 'font-semibold');
        });
        option.setAttribute('aria-selected', 'true');
        option.classList.add('bg-[#FFE1DF]', 'font-semibold');
        setFilter(config.key, item.value);
        closeMenus();
        button.focus();
      });
      menu.appendChild(option);
    });

    button.parentElement.appendChild(menu);
    button.addEventListener('click', function () {
      var willOpen = menu.hidden;
      closeMenus(menu);
      menu.hidden = !willOpen;
      button.setAttribute('aria-expanded', String(willOpen));
      openMenu = willOpen ? menu : null;
      if (willOpen) menu.querySelector('[role="option"]').focus();
    });
    button.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (menu.hidden) button.click();
      }
    });
    menu.addEventListener('keydown', function (event) {
      var options = Array.from(menu.querySelectorAll('[role="option"]'));
      var current = options.indexOf(document.activeElement);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        var direction = event.key === 'ArrowDown' ? 1 : -1;
        options[(current + direction + options.length) % options.length].focus();
      } else if (event.key === 'Escape') {
        closeMenus();
        button.focus();
      }
    });
  });

  document.addEventListener('click', function (event) {
    if (openMenu && !openMenu.parentElement.contains(event.target)) closeMenus();
  });

  render();
})();
