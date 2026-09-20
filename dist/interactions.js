(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? '收起 ×' : '菜单';
    nav.classList.toggle('menu-open', open);
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a') && menu.getAttribute('aria-expanded') === 'true') menu.click();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') menu.click();
  });

  const dialog = document.querySelector('#project-dialog');
  const content = document.querySelector('#project-content');
  let request;
  let returnFocus;
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  const openProject = async (id, trigger) => {
    request?.abort();
    const controller = new AbortController();
    request = controller;
    returnFocus = trigger;
    content.replaceChildren(node('p', '正在加载项目…', 'detail-loading'));
    dialog.setAttribute('aria-label', '正在加载项目详情');
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('dialog-open');
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(id)}`, {signal:controller.signal});
      if (!response.ok) throw new Error('项目暂时无法加载，请检查网络后重试。');
      const {project} = await response.json();
      const heading = node('h2', project.title); heading.id = 'project-dialog-title';
      content.replaceChildren(node('p', `${project.category} · ${project.year}`, 'section-kicker'), heading, node('p',project.role,'detail-role'), node('p',project.summary,'detail-summary'));
      dialog.removeAttribute('aria-label');
      for (const [title, text] of project.sections) {
        const section = node('section'); section.append(node('h3',title),node('p',text)); content.append(section);
      }
      const gallery = node('div',null,'detail-gallery');
      for (const picture of project.images) {
        const figure = node('figure');
        const link = node('a'); link.href = picture.src; link.target = '_blank'; link.rel = 'noopener'; link.setAttribute('aria-label',`${picture.alt}，打开原图`);
        const img = node('img'); img.src = picture.src; img.alt = picture.alt; img.loading = 'lazy';
        link.append(img); figure.append(link,node('figcaption',`${picture.alt} · 点击查看原图`)); gallery.append(figure);
      }
      content.append(gallery);
      dialog.scrollTop = 0;
    } catch (error) {
      if (error.name === 'AbortError') return;
      const title = node('h2','暂时无法打开项目'); title.id = 'project-dialog-title';
      const retry = node('button','重试','project-open'); retry.type = 'button'; retry.addEventListener('click',()=>openProject(id,trigger));
      content.replaceChildren(title,node('p','请确认网站服务正在运行，再重试。'),retry);
    }
  };
  document.querySelectorAll('[data-project]').forEach(card => {
    card.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      openProject(card.dataset.project,card.querySelector('[data-open]'));
    });
  });
  document.querySelector('#close-project').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close(); } });
  dialog.addEventListener('close',()=>{request?.abort(); document.body.classList.remove('dialog-open'); returnFocus?.focus();});

  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#contact-status');
  const submit = form.querySelector('[type=submit]');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || submit.disabled) return;
    submit.disabled = true; submit.textContent = '正在发送…'; status.textContent = ''; status.className = '';
    const values = new FormData(form);
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(),15000);
    try {
      const response = await fetch('/api/contact', {
        method:'POST', headers:{'Content-Type':'application/json'}, signal:controller.signal,
        body: JSON.stringify({name:values.get('name'),email:values.get('email'),message:values.get('message'),website:values.get('website'),consent:values.get('consent') === 'on'})
      });
      let result;
      try { result = await response.json(); } catch { throw new Error('联系服务暂时不可用，请稍后重试或直接发送邮件。'); }
      if (!response.ok) throw new Error(result.error || '留言未能保存，请重试。');
      status.textContent = '留言已成功保存，谢谢你的联系。'; status.className = 'success'; form.reset();
    } catch (error) {
      status.textContent = error.name === 'AbortError' ? '提交结果暂时无法确认，请稍后联系邮箱确认，避免重复提交。' : error.message;
      status.className = 'error';
    } finally { clearTimeout(timeout); submit.disabled = false; submit.textContent = '发送留言 ↗'; }
  });
})();
