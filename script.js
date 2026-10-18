const pageLinks = [
  { id: 'hero', href: '#hero', number: '00', label: 'Ana Sayfa' },
  { id: 'hakkimizda', href: '#hakkimizda', number: '01', label: 'Hakkımızda' },
  { id: 'felsefe', href: '#felsefe', number: '02', label: 'Arının Anlamı' },
  { id: 'vizyon', href: '#vizyon', number: '03', label: 'Vizyon & Misyon' },
  { id: 'kesfet', href: '#kesfet', number: '04', label: 'Keşfet' },
  { id: 'ekibimiz', href: '#ekibimiz', number: '05', label: 'Ekibimiz' },
  { id: 'calismalar', href: '#calismalar', number: '06', label: 'Çalışmalar' },
  { id: 'iletisim', href: '#iletisim', number: '07', label: 'İletişim' }
];

const logo = `
  <span class="brand-logo-wrap" aria-hidden="true"><span class="svg-logo"></span></span>`;

const headerSlot = document.querySelector('#site-header');
if (headerSlot) {
  headerSlot.innerHTML = `
    <header class="site-header" id="top">
      <a class="brand" href="#hero" aria-label="BAL AR-GE ana sayfa">${logo}
        <span class="brand-copy"><strong>BATMAN ANADOLU LİSESİ</strong><small>ARAŞTIRMA &amp; GELİŞTİRME EKİBİ</small></span>
      </a>
      <nav class="header-nav-desktop" aria-label="Hızlı menü">
        <a href="#hakkimizda">Hakkımızda</a>
        <a href="#felsefe">Arının Anlamı</a>
        <a href="#vizyon">Vizyon</a>
        <a href="#kesfet">Keşfet</a>
        <a href="#ekibimiz">Ekibimiz</a>
        <a href="#calismalar">Çalışmalar</a>
        <a href="#iletisim">İletişim</a>
      </nav>
      <div class="header-actions">
        <button class="theme-toggle" type="button" aria-label="Koyu temaya geç" aria-pressed="false" title="Temayı değiştir">
          <svg class="theme-icon icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.6A8.6 8.6 0 0 1 8.4 3.8 8.7 8.7 0 1 0 20.2 15.6Z"/></svg>
          <svg class="theme-icon icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>
          <span class="theme-label">Koyu tema</span>
        </button>
        <button class="menu-toggle" type="button" aria-label="Menüyü aç" aria-expanded="false" aria-controls="site-drawer">
          <span class="menu-text">Menü</span><svg viewBox="0 0 24 24" aria-hidden="true"><path class="menu-lines" d="M4 8h16M4 16h16"/><path class="menu-x" d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>
    </header>
    <button class="menu-backdrop" type="button" aria-label="Menüyü kapat" hidden></button>
    <aside class="menu-drawer" id="site-drawer" aria-label="Sayfa menüsü" aria-hidden="true" inert>
      <div class="drawer-top"><span class="drawer-kicker">BAL AR-GE / TEK SAYFA GEZİNTİ</span>
        <button class="drawer-close" type="button" aria-label="Menüyü kapat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
      </div>
      <p class="drawer-title">Bölümler</p>
      <nav class="drawer-nav" aria-label="Bölüm bağlantıları">${pageLinks.map((link) => `<a href="${link.href}"><span>${link.number}</span><strong>${link.label}</strong><b aria-hidden="true">↓</b></a>`).join('')}</nav>
      <div class="drawer-bottom"><span>BATMAN ANADOLU LİSESİ</span><span>ARAŞTIRMA VE GELİŞTİRME EKİBİ</span></div>
    </aside>`;
}

const footerSlot = document.querySelector('#site-footer');
if (footerSlot) {
  footerSlot.innerHTML = `
    <footer class="site-footer">
      <div class="footer-main">
        <a class="footer-brand" href="#hero" aria-label="BAL AR-GE ana sayfa">${logo}</a>
        <div class="footer-school"><strong>Batman Anadolu Lisesi</strong><span>ARAŞTIRMA &amp; GELİŞTİRME EKİBİ</span><p>Öğrenci araştırma ve proje ekibi.</p></div>
        <nav class="footer-links" aria-label="Alt menü">${pageLinks.slice(1).map((link) => `<a href="${link.href}">${link.label}</a>`).join('')}</nav>
        <a class="footer-top" href="#top">Yukarı dön <span aria-hidden="true">↑</span></a>
      </div>
      <div class="footer-bottom"><span>© ${new Date().getFullYear()} BAL AR-GE</span><span>BATMAN · TÜRKİYE</span><a href="#hero">Başa Dön ↑</a></div>
    </footer>`;
}

// Yükleme Animasyonu (Loader)
const siteLoader = document.createElement('div');
siteLoader.className = 'site-loader';
siteLoader.setAttribute('role', 'status');
siteLoader.setAttribute('aria-live', 'polite');
siteLoader.innerHTML = `
  <div class="loader-content">
    <span class="svg-logo loader-logo"></span>
    <span class="loader-name">BAL <i>AR-GE</i></span>
    <span class="loader-caption">BATMAN ANADOLU LİSESİ</span>
    <span class="loader-track" aria-hidden="true"><i></i></span>
  </div>`;
document.body.append(siteLoader);

const loaderStartedAt = performance.now();
let loaderDismissed = false;
function hideSiteLoader() {
  if (loaderDismissed) return;
  loaderDismissed = true;
  const remaining = Math.max(0, 520 - (performance.now() - loaderStartedAt));
  window.setTimeout(() => {
    siteLoader.classList.add('is-hidden');
    siteLoader.setAttribute('aria-hidden', 'true');
    window.setTimeout(() => siteLoader.remove(), 420);
  }, remaining);
}
window.addEventListener('load', hideSiteLoader, { once: true });
window.setTimeout(hideSiteLoader, 2500);
if (document.readyState === 'complete') hideSiteLoader();

// Tema Değiştirme
const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-label');
const themeMeta = document.querySelector('meta[name="theme-color"]');
let savedTheme = null;
try { savedTheme = localStorage.getItem('bal-arge-theme'); } catch {}

function setTheme(theme, save = false) {
  const isDark = theme === 'dark';
  root.dataset.theme = isDark ? 'dark' : 'light';
  if (themeButton) {
    themeButton.setAttribute('aria-pressed', String(isDark));
    themeButton.setAttribute('aria-label', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
    if (themeLabel) themeLabel.textContent = isDark ? 'Açık tema' : 'Koyu tema';
  }
  if (themeMeta) themeMeta.setAttribute('content', isDark ? '#0b0d08' : '#faf9f4');
  if (save) {
    try { localStorage.setItem('bal-arge-theme', theme); } catch {}
  }
}

if (savedTheme === 'dark' || savedTheme === 'light') {
  setTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme('dark');
}

themeButton?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next, true);
});

// Menü Çekmecesi & Tıklama Olayları
const menuToggle = document.querySelector('.menu-toggle');
const menuDrawer = document.querySelector('.menu-drawer');
const menuBackdrop = document.querySelector('.menu-backdrop');
const drawerClose = document.querySelector('.drawer-close');

function openMenu() {
  if (!menuDrawer) return;
  menuDrawer.setAttribute('aria-hidden', 'false');
  menuDrawer.removeAttribute('inert');
  menuToggle?.setAttribute('aria-expanded', 'true');
  menuBackdrop?.removeAttribute('hidden');
  root.classList.add('menu-open');
}

function closeMenu() {
  if (!menuDrawer) return;
  menuDrawer.setAttribute('aria-hidden', 'true');
  menuDrawer.setAttribute('inert', '');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuBackdrop?.setAttribute('hidden', '');
  root.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  open ? closeMenu() : openMenu();
});
drawerClose?.addEventListener('click', closeMenu);
menuBackdrop?.addEventListener('click', closeMenu);

// Çekmece içi bağlantılara basınca menüyü kapat ve pürüzsüz kaydır
menuDrawer?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});

// Single-page Scroll-Spy (Aktif bölümü belirleme)
const sections = document.querySelectorAll('section[id]');
function updateActiveNavLink() {
  const scrollPos = window.scrollY + 200;
  sections.forEach((sec) => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.header-nav-desktop a, .drawer-nav a').forEach((a) => {
        if (a.getAttribute('href') === `#${id}`) {
          a.classList.add('is-active');
        } else {
          a.classList.remove('is-active');
        }
      });
    }
  });
}
window.addEventListener('scroll', updateActiveNavLink, { passive: true });
