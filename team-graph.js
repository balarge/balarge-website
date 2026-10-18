/* Ekip — Three.js bal peteği. Görev (role) alanları bilerek boş bırakılmıştır; isterseniz doldurun. */
const TEAM = [
  { name: 'Yasin Tuğra Özbayhan', role: '' },
  { name: 'Abdurrahman Işık', role: '' },
  { name: 'Yusuf Taha Sevilmiş', role: '' },
  { name: 'Bejan Zülal', role: '' },
  { name: 'Eyüp Ensar Baran', role: '' },
  { name: 'Yusuf Elüçünmüş', role: '' },
  { name: 'Hüseyin Yıldız', role: '' },
];

(function () {
  const roster = document.getElementById('team-roster');
  if (roster) roster.innerHTML = TEAM.map((m, i) => `<li data-i="${i}"><span>${String(i + 1).padStart(2, '0')}</span><strong>${m.name}</strong>${m.role ? `<em>${m.role}</em>` : ''}</li>`).join('');
  const wrap = document.getElementById('team-graph');
  if (!wrap || !window.THREE) return;
  const canvas = wrap.querySelector('canvas'); let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { wrap.classList.add('no-webgl'); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
  const group = new THREE.Group(); scene.add(group);
  const S = 1, W = Math.sqrt(3) * S, GOLD = 0xfec214;

  // Işıklar
  scene.add(new THREE.AmbientLight(0xffffff, .75));
  const key = new THREE.DirectionalLight(0xfffaea, .95); key.position.set(-3, 5, 8); scene.add(key);
  const glow = new THREE.PointLight(0xfec214, 1.8, 14); glow.position.set(0, 0, 4); scene.add(glow);

  // Altıgen geometrileri (sivri uçlu, XY düzleminde)
  const hexShape = (r) => { const s = new THREE.Shape(); for (let k = 0; k < 6; k++) { const a = Math.PI / 2 + (k * Math.PI) / 3; s[k ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); } s.closePath(); return s; };
  const tileGeo = new THREE.ExtrudeGeometry(hexShape(S * .9), { depth: .32, bevelEnabled: true, bevelThickness: .07, bevelSize: .06, bevelSegments: 3 });
  const cellGeo = new THREE.ExtrudeGeometry(hexShape(S * .9), { depth: .06, bevelEnabled: false });
  const edgeGeo = new THREE.EdgesGeometry(cellGeo);

  // Hücre konumu (axial -> dünya)
  const pos = (q, r) => new THREE.Vector3(W * (q + r / 2), -1.5 * S * r, 0);
  // Üyeler: üstte 4, altta 3 hücre (eşit, hiyerarşisiz petek)
  const slots = [[-2, 0], [-1, 0], [0, 0], [1, 0], [-2, 1], [-1, 1], [0, 1]];
  const off = new THREE.Vector3(W * .25, .75 * S, 0);
  const used = new Set(slots.map(([q, r]) => q + ',' + r));

  // Süs hücreleri
  const cells = [];
  for (let r = -3; r <= 4; r++) for (let q = -7; q <= 6; q++) {
    if (used.has(q + ',' + r)) continue; const p = pos(q, r).add(off); p.x -= W * .25 + 0; if (Math.abs(p.x) > 7.4 || Math.abs(p.y) > 4.1) continue;
    const m = new THREE.MeshBasicMaterial({ color: 0xffbf00, transparent: true, opacity: .06 }), mesh = new THREE.Mesh(cellGeo, m); mesh.position.copy(p); mesh.position.z = -.2;
    const ln = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: 0xffbf00, transparent: true, opacity: .25 })); mesh.add(ln); mesh.userData = { d: Math.hypot(p.x, p.y), ln }; group.add(mesh); cells.push(mesh);
  }

  // Yazı dokusu
  const initials = (n) => n.split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toLocaleUpperCase('tr');
  function label(i) {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#1a1200'; g.font = '800 104px Manrope, Arial, sans-serif'; g.fillText(initials(TEAM[i].name), 128, 136);
    g.font = '700 22px Arial'; g.globalAlpha = .6; g.fillText(String(i + 1).padStart(2, '0'), 128, 42);
    const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
  }
  const tiles = slots.map(([q, r], i) => {
    const p = pos(q, r).add(off); p.x -= W * .25;
    const mat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: .35, roughness: .32, emissive: 0x3a2000, emissiveIntensity: .25 });
    const mesh = new THREE.Mesh(tileGeo, mat); mesh.position.copy(p);
    const tag = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({ map: label(i), transparent: true })); tag.position.z = .4; mesh.add(tag);
    const t = { mesh, mat, base: p, z: 0, s: 0, delay: .15 * i }; mesh.scale.setScalar(.001); group.add(mesh); return t;
  });

  // Parlama sprite + toz
  const gc = document.createElement('canvas'); gc.width = gc.height = 128; const gg = gc.getContext('2d'), gr = gg.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,191,0,.55)'); gr.addColorStop(1, 'rgba(255,191,0,0)'); gg.fillStyle = gr; gg.fillRect(0, 0, 128, 128);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(gc), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); spr.scale.set(13, 9, 1); spr.position.z = -1.2; group.add(spr);
  const NP = 140, dp = new Float32Array(NP * 3), dv = new Float32Array(NP);
  for (let i = 0; i < NP; i++) { dp[i * 3] = (Math.random() - .5) * 15; dp[i * 3 + 1] = (Math.random() - .5) * 9; dp[i * 3 + 2] = Math.random() * 3 - 1; dv[i] = .004 + Math.random() * .01; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xffd45e, size: .06, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false })); group.add(dust);

  // Bilgi kartı
  wrap.tabIndex = 0;
  const card = document.createElement('div'); card.className = 'tg-card';
  card.innerHTML = '<div class="tg-info"><span class="tg-count">BİR ÜYEYE DOKUNUN</span><strong>&nbsp;</strong><em></em></div>'; wrap.appendChild(card);
  const cnt = card.querySelector('.tg-count'), nm = card.querySelector('strong'), rl = card.querySelector('em');
  let sel = -1, hov = -1; const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(9, 9); let px = 0, py = 0, time = 0, vis = true, down = null;
  const pick = (i) => { sel = i; if (i < 0) return; cnt.textContent = `${String(i + 1).padStart(2, '0')} / ${String(TEAM.length).padStart(2, '0')}`; nm.textContent = TEAM[i].name; rl.textContent = TEAM[i].role || ''; card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap'); roster?.querySelectorAll('li').forEach((li, k) => li.classList.toggle('is-active', k === i)); };
  const setPtr = (e) => { const r = canvas.getBoundingClientRect(); ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1; ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1; px = ptr.x; py = ptr.y; };
  canvas.addEventListener('pointermove', setPtr);
  canvas.addEventListener('pointerleave', () => { ptr.set(9, 9); px = py = 0; });
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; setPtr(e); });
  canvas.addEventListener('pointerup', (e) => { if (down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) < 8 && hov >= 0) pick(hov); down = null; });
  wrap.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') pick((sel + 1) % TEAM.length); if (e.key === 'ArrowLeft') pick((sel - 1 + TEAM.length) % TEAM.length); });
  roster?.addEventListener('mouseover', (e) => { const li = e.target.closest('li'); if (li) pick(+li.dataset.i); });
  roster?.addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) { pick(+li.dataset.i); wrap.scrollIntoView({ behavior: 'smooth', block: 'center' }); } });

  const resize = () => { const w = wrap.clientWidth, h = wrap.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.position.set(0, 0, Math.max(11, 4.9 / (Math.tan((camera.fov * Math.PI) / 360) * camera.aspect))); camera.updateProjectionMatrix(); };
  new ResizeObserver(resize).observe(wrap); resize();
  new IntersectionObserver((en) => { vis = en[0].isIntersecting; }).observe(wrap);

  (function frame() {
    requestAnimationFrame(frame); if (!vis) return; time += .016;
    const dark = document.documentElement.dataset.theme === 'dark', ink = dark ? 0xffbf00 : 0x9a6b00;
    group.rotation.y += ((px * .28) - group.rotation.y) * .06; group.rotation.x += ((-py * .16) - group.rotation.x) * .06;
    glow.position.x += (px * 6 - glow.position.x) * .08; glow.position.y += (py * 3.5 - glow.position.y) * .08;
    ray.setFromCamera(ptr, camera); const hit = ray.intersectObjects(tiles.map((t) => t.mesh))[0]; hov = hit ? tiles.findIndex((t) => t.mesh === hit.object) : -1;
    canvas.style.cursor = hov >= 0 ? 'pointer' : 'default';
    tiles.forEach((t, i) => {
      const on = i === hov || i === sel; t.delay -= .016; const appear = t.delay > 0 ? 0 : 1;
      t.s += ((appear ? (on ? 1.1 : 1) : .001) - t.s) * .09; t.z += ((on ? .9 : 0) - t.z) * .12;
      t.mesh.scale.setScalar(Math.max(t.s, .001)); t.mesh.position.set(t.base.x, t.base.y + (reduce ? 0 : Math.sin(time * 1.2 + i * .9) * .07), t.z);
      t.mesh.rotation.y += ((on ? (px * .25) : 0) - t.mesh.rotation.y) * .1; t.mat.emissiveIntensity += ((on ? .9 : .25) - t.mat.emissiveIntensity) * .12;
    });
    cells.forEach((c) => { const w = reduce ? 0 : Math.sin(c.userData.d * 1.1 - time * 1.6); c.material.color.set(ink); c.userData.ln.material.color.set(ink); c.material.opacity = .05 + Math.max(0, w) * .14; c.userData.ln.material.opacity = .22 + Math.max(0, w) * .5; });
    const p = dg.attributes.position; for (let i = 0; i < NP; i++) { let y = p.getY(i) + dv[i]; if (y > 4.6) y = -4.6; p.setY(i, y); } p.needsUpdate = true;
    spr.material.opacity = dark ? 1 : .5; renderer.render(scene, camera);
  })();
})();
