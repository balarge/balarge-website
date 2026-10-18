/**
 * BAL AR-GE — Ultra-Detaylı 3D Bal Arısı, Sinematik Scroll Fiziği & Anime.js Entegrasyonu
 * Tek sayfa (Single-page) mimarisine göre optimize edilmiş 7 fazlı uçuş rotası.
 */

(function initMasterclass3DBee() {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // WebGL Renderer
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (e) {
    console.warn('WebGL başlatılamadı:', e);
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8.5);

  // Doğal Stüdyo & Mor/Altın Işıklandırması
  const ambientLight = new THREE.AmbientLight(0xf4eeff, 0.95);
  scene.add(ambientLight);

  // Ana Işık (Key Light - çokgen fasetlerin gölgelerini ve ışık açılarını belirginleştirir)
  const sunLight = new THREE.DirectionalLight(0xfff6dd, 1.8);
  sunLight.position.set(6, 8, 7);
  scene.add(sunLight);

  // Karşı Kontur Işığı (Rim Light - mor derinlik katar)
  const rimLight = new THREE.DirectionalLight(0x7933b8, 2.2);
  rimLight.position.set(-8, -4, -4);
  scene.add(rimLight);

  // Alttan Yumuşak Dolgu (Soft Fill Light - sıcak altın yansıma)
  const fillLight = new THREE.DirectionalLight(0xfec214, 0.6);
  fillLight.position.set(0, -6, 4);
  scene.add(fillLight);

  // İmleci Takip Eden Işık (Cursor Point Light)
  const cursorLight = new THREE.PointLight(0xfec214, 1.5, 16);
  cursorLight.position.set(0, 0, 4);
  scene.add(cursorLight);

  // ==========================================
  // 1. DOKULU & IŞIL IŞIL KANAT MATERYALİ
  // ==========================================
  function createWingTexture() {
    const cvs = document.createElement('canvas');
    cvs.width = 512;
    cvs.height = 512;
    const ctx = cvs.getContext('2d');

    // Şeffaf sarı/kehribar zemin
    const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 250);
    grad.addColorStop(0, 'rgba(255, 240, 180, 0.85)');
    grad.addColorStop(0.65, 'rgba(255, 200, 70, 0.5)');
    grad.addColorStop(1, 'rgba(255, 160, 0, 0.08)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Biyolojik Kanat Damar Ağı (Cell Venation Pattern)
    ctx.strokeStyle = 'rgba(255, 200, 50, 0.95)';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(30, 256);
    ctx.bezierCurveTo(150, 100, 320, 80, 490, 220);
    ctx.stroke();

    ctx.lineWidth = 2.0;
    const cells = [
      [[80, 230], [180, 160], [260, 210], [160, 280]],
      [[180, 160], [300, 130], [380, 190], [260, 210]],
      [[260, 210], [380, 190], [450, 240], [350, 280]],
      [[160, 280], [260, 210], [350, 280], [240, 340]],
      [[60, 270], [160, 280], [240, 340], [120, 350]],
      [[300, 130], [420, 120], [480, 190], [380, 190]]
    ];

    cells.forEach((poly) => {
      ctx.beginPath();
      ctx.moveTo(poly[0][0], poly[0][1]);
      for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
      ctx.closePath();
      ctx.stroke();
    });

    const tex = new THREE.CanvasTexture(cvs);
    tex.anisotropy = 4;
    return tex;
  }

  const wingTex = createWingTexture();

  // ==========================================
  // 2. ULTRA-DETAYLI 3D BAL ARISI MODELİ
  // ==========================================
  // ==========================================
  // 2. KLASÖRDEKİ BAL ROBOT ARI STL MODELİ (Kusursuz İki Tonlu & Doğal Uçuş Fiziği)
  // ==========================================
  const goldenBee = new THREE.Group();
  scene.add(goldenBee);

  goldenBee.userData = {
    currentPos: new THREE.Vector3(2.5, 0.2, 1.25),
    currentRot: new THREE.Euler(0, -0.45, 0),
    stuntPhase: 0,
    modelMesh: null
  };

  // STL dosyasını kusursuz iki tonlu (Mor Gövde + Altın Kanatlar & Şeritler) olarak yükle
  function loadRoboticBeeSTL() {
    function parseBuffer(buf) {
      if (typeof THREE.STLLoader !== 'undefined') {
        const l = new THREE.STLLoader();
        return l.parse(buf);
      }
      return null;
    }

    function b64ToBuffer(b64) {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return bytes.buffer;
    }

    const twoTone = window.__ROBOT_ARI_TWO_TONE__;
    if (!twoTone) return;

    try {
      const purpleGeo = parseBuffer(b64ToBuffer(twoTone.purple));
      const goldGeo = parseBuffer(b64ToBuffer(twoTone.gold));

      if (!purpleGeo || !goldGeo) return;

      const scaleFactor = 0.032;
      const centerOffY = 6.82;
      const centerOffZ = 48.05;

      const normalizeTransform = (geo) => {
        geo.computeVertexNormals();
        geo.translate(0, -centerOffY, -centerOffZ);
        geo.scale(scaleFactor, scaleFactor, scaleFactor);
      };

      normalizeTransform(purpleGeo);
      normalizeTransform(goldGeo);

      const stlContainer = new THREE.Group();
      stlContainer.rotation.set(-Math.PI / 2, 0, 0);

      // 1. Asil Derin Mor Metalik Gövde (#2e0a52)
      const purpleMat = new THREE.MeshStandardMaterial({
        color: 0x2e0a52,
        roughness: 0.35,
        metalness: 0.82
      });
      const purpleMesh = new THREE.Mesh(purpleGeo, purpleMat);
      stlContainer.add(purpleMesh);

      // 2. Canlı Altın Kanatlar, Gövde Şeritleri ve Detaylar (#fec214)
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xfec214,
        roughness: 0.25,
        metalness: 0.88
      });
      const goldMesh = new THREE.Mesh(goldGeo, goldMat);
      stlContainer.add(goldMesh);

      goldenBee.add(stlContainer);
      goldenBee.userData.modelMesh = stlContainer;
    } catch (e) {
      console.warn('Robot arı yükleme hatası:', e);
    }
  }

  loadRoboticBeeSTL();

  // ==========================================
  // 3. PARLAK ALTIN PARÇACIKLAR & POLENLER
  // ==========================================
  const starCount = 180;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 36;
    starPositions[i + 1] = (Math.random() - 0.5) * 28;
    starPositions[i + 2] = (Math.random() - 0.5) * 16 - 2;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starPoints = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      color: 0xffcf4d,
      size: 0.055,
      transparent: true,
      opacity: 0.45
    })
  );
  scene.add(starPoints);

  // Polen Kıvılcım İzi
  const trailCount = 60;
  const trailGeo = new THREE.BufferGeometry();
  const trailPositions = new Float32Array(trailCount * 3);
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  const trailPoints = new THREE.Points(
    trailGeo,
    new THREE.PointsMaterial({
      color: 0xffb700,
      size: 0.09,
      transparent: true,
      opacity: 0.85
    })
  );
  scene.add(trailPoints);

  const trailPool = [];
  for (let i = 0; i < trailCount; i++) {
    trailPool.push({
      pos: new THREE.Vector3(0, -999, 0),
      vel: new THREE.Vector3(),
      life: 0
    });
  }

  // ==========================================
  // 4. SCROLL & MOUSE TAKİBİ
  // ==========================================
  let targetScroll = 0;
  let smoothScroll = 0;
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, speed: 0 };
  let lastMouseTime = performance.now();
  let prevMouseX = 0;
  let prevMouseY = 0;

  function onWindowScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScroll = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
  }
  window.addEventListener('scroll', onWindowScroll, { passive: true });
  onWindowScroll();

  window.addEventListener('pointermove', (e) => {
    const now = performance.now();
    const dt = Math.max(1, now - lastMouseTime);
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

    const dist = Math.hypot(mouse.targetX - prevMouseX, mouse.targetY - prevMouseY);
    mouse.speed = dist / (dt * 0.001);

    prevMouseX = mouse.targetX;
    prevMouseY = mouse.targetY;
    lastMouseTime = now;
  });

  function onWindowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onWindowResize);
  onWindowResize();

  // Tıklamalarda akrobatik takla
  document.addEventListener('click', (e) => {
    if (
      e.target.closest('#explorer-tabs button') ||
      e.target.closest('.hero-actions a') ||
      e.target.closest('.header-nav-desktop a') ||
      e.target.closest('.value-card') ||
      e.target.closest('.shot')
    ) {
      goldenBee.userData.stuntPhase = 1.0;
    }
  });

  // ==========================================
  // 5. ANİMASYON DÖNGÜSÜ (SINGLE PAGE 7 FAZ)
  // ==========================================
  let clock = new THREE.Clock();
  let time = 0;

  function renderLoop() {
    requestAnimationFrame(renderLoop);

    const delta = clock.getDelta();
    time += delta;

    // Anime.js tarzı yumuşak yay (Spring Lerp)
    smoothScroll += (targetScroll - smoothScroll) * 0.085;
    mouse.x += (mouse.targetX - mouse.x) * 0.065;
    mouse.y += (mouse.targetY - mouse.y) * 0.065;

    cursorLight.position.x = mouse.x * 5;
    cursorLight.position.y = mouse.y * 4;

    const p = smoothScroll;
    const isMobile = window.innerWidth < 860;

    let targetBeePos = new THREE.Vector3();
    let targetBeeRot = new THREE.Euler();
    let targetCamZ = 8.5;
    let targetCamX = 0;

    // Tek sayfa rotaları (0.0 -> 1.0)
    if (p < 0.12) {
      // FAZ 0: HERO (#hero)
      const hoverY = Math.sin(time * 3.2) * 0.16;
      targetBeePos.set((isMobile ? 1.0 : 2.6), 0.25 + hoverY, 1.25);
      targetBeeRot.set(0.12 - mouse.y * 0.35, -0.45 + mouse.x * 0.45, Math.sin(time * 2.2) * 0.05);
      targetCamZ = 8.5;
    } else if (p >= 0.12 && p < 0.25) {
      // FAZ 1: HAKKIMIZDA (#hakkimizda) - Soldan kavisli viraj
      const norm = (p - 0.12) / 0.13;
      const arcX = 2.6 - norm * 5.4;
      const arcY = Math.sin(norm * Math.PI) * 1.6 - 0.2;
      targetBeePos.set(arcX, arcY, 1.8);
      targetBeeRot.set(0.28, -norm * 1.3, 0.3);
      targetCamX = -0.4 * norm;
      targetCamZ = 8.8;
    } else if (p >= 0.25 && p < 0.38) {
      // FAZ 2: ARININ ANLAMI & FELSEFESİ (#felsefe) - Odak sahnesi, arı ortada altın ışıkla parlar ve kovan felsefesini simgeler
      const hoverY = Math.sin(time * 3.0) * 0.18;
      targetBeePos.set((isMobile ? 0 : 2.2), 0.3 + hoverY, 2.2);
      targetBeeRot.set(0.18, -0.35 + Math.sin(time * 1.8) * 0.15, 0.08);
      targetCamX = isMobile ? 0 : -0.25;
      targetCamZ = 8.2;
    } else if (p >= 0.38 && p < 0.52) {
      // FAZ 3: VİZYON & MİSYON (#vizyon) - Ortada yükseliş
      const norm = (p - 0.38) / 0.14;
      targetBeePos.set(-1.8 + norm * 3.8, 0.4 + Math.sin(time * 2.6) * 0.12, 1.4);
      targetBeeRot.set(0.15, 0.4 - norm * 0.8, -0.15);
      targetCamZ = 8.4;
    } else if (p >= 0.52 && p < 0.68) {
      // FAZ 4: KEŞFET (#kesfet) - Sağ üstte refakatçi süzülüşü
      const hoverY = Math.sin(time * 2.8) * 0.14;
      targetBeePos.set(isMobile ? 1.1 : 2.4, 0.65 + hoverY, 1.1);
      targetBeeRot.set(0.16, -0.42, 0.08);
      targetCamX = isMobile ? 0 : -0.3;
      targetCamZ = 8.5;
    } else if (p >= 0.68 && p < 0.82) {
      // FAZ 5: EKİBİMİZ & 3D PETEK (#ekibimiz) - Peteklerin üzerinde yukarıda keşif
      targetBeePos.set((isMobile ? 0 : -2.2) + Math.cos(time * 2.2) * 0.3, 1.2 + Math.sin(time * 2.5) * 0.15, 1.6);
      targetBeeRot.set(0.35, 0.6, -0.1);
      targetCamZ = 8.6;
    } else if (p >= 0.82 && p < 0.94) {
      // FAZ 6: ÇALIŞMALAR GALERİSİ (#calismalar) - Galeri kartları üzerinden geçiş
      targetBeePos.set(isMobile ? 1.0 : 2.5, 0.9 + Math.sin(time * 2.4) * 0.12, 1.2);
      targetBeeRot.set(0.2, -0.6, 0.1);
      targetCamZ = 8.2;
    } else {
      // FAZ 7: İLETİŞİM (#iletisim) - Kameraya doğru yakınlaşarak selamlama
      targetBeePos.set(0, -0.25 + Math.sin(time * 3.2) * 0.08, 4.2);
      targetBeeRot.set(0.1, Math.sin(time * 2.2) * 0.2, 0);
      targetCamZ = 7.2;
    }

    // Akrobatik takla
    if (goldenBee.userData.stuntPhase > 0) {
      goldenBee.userData.stuntPhase -= delta * 1.9;
      if (goldenBee.userData.stuntPhase < 0) goldenBee.userData.stuntPhase = 0;
      const rollAngle = (1.0 - goldenBee.userData.stuntPhase) * Math.PI * 2;
      targetBeeRot.z += rollAngle;
      targetBeePos.y += Math.sin(rollAngle) * 0.6;
    }

    // Fare ile Çok Daha Aktif & Canlı Etkileşim: Arı fareyi daha çevik takip eder
    const mouseInfluenceX = mouse.x * (isMobile ? 0.75 : 1.65);
    const mouseInfluenceY = mouse.y * (isMobile ? 0.55 : 1.25);
    targetBeePos.x += mouseInfluenceX;
    targetBeePos.y += mouseInfluenceY;

    // Aktif Mikro-Uçuş & Havada Dinamik Salınım (Active Hover Dynamics)
    const activeJitterX = Math.sin(time * 5.2) * 0.08 + Math.cos(time * 8.4) * 0.03;
    const activeJitterY = Math.sin(time * 6.5) * 0.12 + Math.sin(time * 11.2) * 0.04;
    targetBeePos.x += activeJitterX;
    targetBeePos.y += activeJitterY;

    // Çevik Kafa ve Gövde Yönlenmesi (Agile Banking & Tracking)
    targetBeeRot.y += mouse.x * 0.75 + Math.sin(time * 4.2) * 0.06;
    targetBeeRot.x -= mouse.y * 0.55 + Math.cos(time * 5.0) * 0.04;
    targetBeeRot.z -= (mouse.x - (prevMouseX || 0)) * 2.8; // Hızlı fare hareketinde sert viraj yatışı

    // Arının ekranda dev gibi kalmasını önleyen zarif & responsive ölçekleme
    const desiredScale = isMobile ? 0.45 : 0.62;
    goldenBee.scale.set(desiredScale, desiredScale, desiredScale);

    // Daha hızlı & çevik takip lerp'i (0.085 -> 0.125)
    goldenBee.userData.currentPos.lerp(targetBeePos, 0.125);
    goldenBee.position.copy(goldenBee.userData.currentPos);

    goldenBee.rotation.x += (targetBeeRot.x - goldenBee.rotation.x) * 0.12;
    goldenBee.rotation.y += (targetBeeRot.y - goldenBee.rotation.y) * 0.12;
    goldenBee.rotation.z += (targetBeeRot.z - goldenBee.rotation.z) * 0.12;

    // Havada doğal süzülüş & reaktör titreşimi (Uçuş dinamikleri)
    const hoverTilt = Math.sin(time * 3.8) * 0.04;
    goldenBee.rotation.x += hoverTilt * 0.1;

    camera.position.z += (targetCamZ - camera.position.z) * 0.075;
    camera.position.x += (targetCamX - camera.position.x) * 0.075;

    // Polen Parçacık Üretimi
    if (Math.random() < 0.7) {
      const p = trailPool.find((item) => item.life <= 0);
      if (p) {
        p.life = 1.0;
        p.pos.copy(goldenBee.position);
        p.pos.z -= 0.38;
        p.pos.x += (Math.random() - 0.5) * 0.16;
        p.pos.y += (Math.random() - 0.5) * 0.16;
        p.vel.set((Math.random() - 0.5) * 0.022, -0.018 - Math.random() * 0.02, -0.025);
      }
    }

    const posAttr = trailGeo.attributes.position;
    for (let i = 0; i < trailCount; i++) {
      const p = trailPool[i];
      if (p.life > 0) {
        p.life -= delta * 1.4;
        p.pos.add(p.vel);
        posAttr.setXYZ(i, p.pos.x, p.pos.y, p.pos.z);
      } else {
        posAttr.setXYZ(i, 0, -999, 0);
      }
    }
    posAttr.needsUpdate = true;

    starPoints.rotation.y = time * 0.012;
    starPoints.rotation.x = Math.sin(time * 0.008) * 0.04;

    renderer.render(scene, camera);
  }

  renderLoop();
})();

// ==========================================
// 6. ANIME.JS İLE SCROLL REVEAL & TIKLAMA ANİMASYONLARI
// ==========================================
function initAnimeScrollAnimations() {
  if (typeof anime === 'undefined') return;

  // Hero Giriş Animasyonu
  anime({
    targets: '.home-hero .anime-item',
    opacity: [0, 1],
    translateY: [32, 0],
    duration: 1000,
    delay: anime.stagger(150, { start: 300 }),
    easing: 'easeOutExpo'
  });

  // IntersectionObserver ile kartları ve etkinlikleri aşağı indikçe sağa-sola dönerek getirme (Anime.js 3D tilt & slide)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const index = parseInt(el.dataset.animIndex || '0', 10);
          const isEven = index % 2 === 0;

          // Etkinlik veya kartların sağa/sola hafif dönerek (rotateZ & rotateY) yaylanarak gelmesi
          anime({
            targets: el,
            opacity: [0, 1],
            translateY: [60, 0],
            translateX: [isEven ? -30 : 30, 0],
            rotateZ: [isEven ? -5 : 5, 0],
            rotateY: [isEven ? 7 : -7, 0],
            scale: [0.94, 1],
            duration: 1050,
            easing: 'easeOutElastic(1, .75)'
          });
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.1 }
  );

  const animatedElements = document.querySelectorAll('.anime-card, .anime-shot');
  animatedElements.forEach((card, i) => {
    card.dataset.animIndex = i;
    card.style.opacity = '0';
    card.style.willChange = 'transform, opacity';
    observer.observe(card);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimeScrollAnimations);
} else {
  initAnimeScrollAnimations();
}
