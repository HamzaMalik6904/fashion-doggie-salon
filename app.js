(() => {
  'use strict';
  const es = document.body.dataset.lang === 'es';
  const tr = (en, spanish) => es ? spanish : en;
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  function closeMenu() {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', tr('Open navigation', 'Abrir menú'));
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', tr(open ? 'Close navigation' : 'Open navigation', open ? 'Cerrar menú' : 'Abrir menú'));
    nav.classList.toggle('open', open);
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.querySelector('.sprinkle-toggle').addEventListener('click', event => {
    const button = event.currentTarget;
    const enabled = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(enabled));
    document.body.classList.toggle('sprinkles-off', !enabled);
    button.querySelector('[data-toggle-state]').textContent = tr(enabled ? 'on' : 'off', enabled ? 'sí' : 'no');
  });

  const packages = [
    ['express', 'Express Bath', 'Baño Express', 'Wash, dry, brush-out and finishing touches for a fresh-looking pup.', 'Baño, secado, cepillado y detalles finales para dejarlo fresquito.'],
    ['luxury', 'Luxury Bath', 'Baño Luxury', 'The bath routine plus hygiene and coat-care extras, without a haircut.', 'El baño con más cuidados de higiene y pelaje, sin corte de pelo.'],
    ['mini', 'Mini Groom', 'Mini Groom', 'A maintenance groom with a tidy-up for the face, ears, feet and tail.', 'Un mantenimiento con retoque de cara, orejas, patitas y cola.'],
    ['full', 'Full Groom', 'Grooming Completo', 'The grooming essentials, detail work and a full body trim.', 'Los cuidados esenciales, retoques y corte del cuerpo.']
  ];
  // Transcribed from the salon's own published 14-row comparison (see footer source).
  const features = [[1,1,1,1],[0,1,1,1],[0,1,1,1],[0,1,1,1],[1,1,1,1],[0,1,1,1],[1,1,1,1],[0,1,1,1],[1,1,1,1],[1,1,1,1],[0,0,1,1],[0,0,0,1],['extra','extra','extra','extra'],['extra','extra','extra','extra']];
  const check = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L20 5"/></svg>';
  const cross = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>';
  document.querySelectorAll('[data-compare]').forEach(button => button.addEventListener('click', () => {
    const column = Number(button.dataset.compare);
    document.querySelectorAll('[data-compare]').forEach(tab => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('.mobile-plan-name').textContent = packages[column][es ? 2 : 1];
    document.querySelectorAll('[data-feature]').forEach(cell => {
      const value = features[Number(cell.dataset.feature)][column];
      cell.replaceChildren();
      const span = document.createElement('span');
      if (value === 'extra') {
        span.className = 'extra';
        span.textContent = tr('Extra charge', 'Costo extra');
      } else {
        span.className = `status ${value ? 'yes' : 'no'}`;
        span.innerHTML = value ? check : cross;
        const sr = document.createElement('span');
        sr.className = 'sr-only';
        sr.textContent = tr(value ? 'Included' : 'Not included', value ? 'Incluido' : 'No incluido');
        span.append(sr);
      }
      cell.append(span);
    });
  }));
  document.querySelectorAll('[data-goal]').forEach(button => button.addEventListener('click', () => {
    const item = packages.find(p => p[0] === button.dataset.goal);
    document.querySelectorAll('[data-goal]').forEach(option => {
      option.classList.toggle('active', option === button);
      option.setAttribute('aria-pressed', String(option === button));
    });
    document.querySelector('#finder-title').textContent = item[es ? 2 : 1];
    document.querySelector('#finder-description').textContent = item[es ? 4 : 3];
    document.querySelector('#finder-link').href = `visit.html?service=${item[0]}`;
  }));

  const dialog = document.querySelector('.lightbox');
  let activePhoto = 0;
  let lightboxButtons = [];
  function showPhoto(index) {
    if (!lightboxButtons.length) return;
    activePhoto = (index + lightboxButtons.length) % lightboxButtons.length;
    const button = lightboxButtons[activePhoto];
    const sourceImage = button.querySelector('img');
    const targetImage = dialog.querySelector('figure > img');
    targetImage.src = sourceImage.src;
    targetImage.alt = sourceImage.alt;
    dialog.querySelector('figcaption').textContent = button.closest('figure').querySelector('figcaption strong').textContent;
    dialog.querySelector('.photo-source').href = button.dataset.source;
  }
  document.querySelectorAll('.photo-open').forEach(button => button.addEventListener('click', () => {
    lightboxButtons = [...document.querySelectorAll('.photo-card:not([hidden]) .photo-open')];
    showPhoto(lightboxButtons.indexOf(button));
    dialog.showModal();
  }));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(activePhoto - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(activePhoto + 1));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(activePhoto - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(activePhoto + 1); }
  });
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    let count = 0;
    document.querySelectorAll('.photo-card').forEach(card => {
      const visible = button.dataset.filter === 'all' || button.dataset.filter === card.dataset.kind;
      card.hidden = !visible;
      if (visible) count++;
    });
    document.querySelectorAll('.filter').forEach(filter => {
      filter.classList.toggle('active', filter === button);
      filter.setAttribute('aria-pressed', String(filter === button));
    });
    document.querySelector('.gallery-count').textContent = tr(`${count} salon photo${count === 1 ? '' : 's'}`, `${count} foto${count === 1 ? '' : 's'} del salón`);
  }));

  const form = document.querySelector('#enquiry-form');
  if (form) {
    const service = document.querySelector('#pet-service');
    const requested = new URLSearchParams(location.search).get('service');
    if (packages.some(p => p[0] === requested)) service.value = requested;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const name = document.querySelector('#pet-name').value.trim();
      const breed = document.querySelector('#pet-breed').value.trim();
      const note = document.querySelector('#pet-note').value.trim();
      const selected = packages.find(p => p[0] === service.value);
      const lines = [tr('Hi Fashion Doggie Salon! I would like to ask about a grooming appointment.', '¡Hola Fashion Doggie Salon! Me gustaría consultar una cita de estética para mi perrito.'), '', `${tr('Service', 'Servicio')}: ${selected[es ? 2 : 1]}`];
      if (name) lines.push(`${tr('Dog’s name', 'Nombre del perrito')}: ${name}`);
      if (breed) lines.push(`${tr('Breed / coat', 'Raza / pelaje')}: ${breed}`);
      if (note) lines.push('', note);
      lines.push('', tr('Could you confirm a current quote and availability? Thank you!', '¿Me podrían confirmar el precio actual y la disponibilidad? ¡Gracias!'));
      const message = lines.join('\n');
      const preview = document.querySelector('#enquiry-preview');
      preview.querySelector('pre').textContent = message;
      document.querySelector('#enquiry-whatsapp').href = `https://wa.me/12109172293?text=${encodeURIComponent(message)}`;
      preview.hidden = false;
      preview.querySelector('h4').focus({preventScroll: true});
      preview.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest'});
    });
  }
})();
