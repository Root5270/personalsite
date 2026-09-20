(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');

  if (header) {
    const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 18);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  }

  const canvas = document.querySelector('#visual-field');
  if (!canvas || prefersReducedMotion) return;

  const context = canvas.getContext('2d');
  const frames = document.querySelectorAll('.intro-frame');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
  const nodes = Array.from({ length: 34 }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    radius: index % 7 === 0 ? 2.2 : 1.1,
    speed: 0.00012 + Math.random() * 0.0002,
    phase: Math.random() * Math.PI * 2,
  }));

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = (time) => {
    context.clearRect(0, 0, width, height);
    const positions = nodes.map((node) => {
      const x = node.x * width + Math.sin(time * node.speed + node.phase) * 18;
      const y = node.y * height + Math.cos(time * node.speed * .78 + node.phase) * 14;
      return { ...node, x, y };
    });

    positions.forEach((node, index) => {
      positions.slice(index + 1).forEach((other) => {
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 190) {
          context.strokeStyle = `rgba(111, 92, 255, ${0.11 * (1 - distance / 190)})`;
          context.lineWidth = .7;
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      });
      context.fillStyle = index % 7 === 0 ? 'rgba(111,92,255,.62)' : 'rgba(17,19,26,.25)';
      context.beginPath();
      context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      context.fill();
    });

    const gradient = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 210);
    gradient.addColorStop(0, 'rgba(255,255,255,.62)');
    gradient.addColorStop(.45, 'rgba(101,220,230,.08)');
    gradient.addColorStop(1, 'rgba(101,220,230,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    requestAnimationFrame(draw);
  };

  const move = (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    const nx = (event.clientX / width - .5) * 2;
    const ny = (event.clientY / height - .5) * 2;
    frames.forEach((frame, index) => {
      const depth = 8 + index * 6;
      frame.style.setProperty('--shift-x', `${nx * depth}px`);
      frame.style.setProperty('--shift-y', `${ny * depth}px`);
    });
  };

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', move, { passive: true });
  requestAnimationFrame(draw);
})();
