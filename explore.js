/* Ekibi keşfet — konu sekmeleri. Single page uyumlu */
const NODES = [
  { title: 'Neden Arı?', tag: 'FELSEFE & SİMGE', href: '#felsefe', go: 'Felsefeyi Keşfet', text: ['BAL AR-GE için arı yalnızca okulun kısaltması değil; kolektif aklın, sabırlı üretimin ve bilginin polen gibi yayılmasının yaşayan simgesidir.', 'Tek bir arı tek başına bal yapamaz; ancak kovan bilinciyle bir araya gelen zihinler kusursuz bir mimari ve bilimsel değer inşa eder.'] },
  { title: 'BAL AR-GE', tag: 'EKİP', href: '#hakkimizda', go: 'Hakkımızda', text: ['BAL AR-GE, Batman Anadolu Lisesi öğrencilerinin araştırma ve proje çalışmaları için bir araya geldiği Araştırma ve Geliştirme Ekibi’dir.', 'Ekip merak edilen konuları araştırır, fikirleri planlı çalışmalara dönüştürür ve öğrendiklerini paylaşır.'] },
  { title: 'Araştırma', tag: 'ÇALIŞMA ALANI', text: ['Her çalışma bir soruyla başlar. Tıpkı polen toplayan bir işçi arı gibi ekip, sorulara güvenilir kaynaklardan yanıt arar.', 'Araştırma, projelerin temelidir: neyin merak edildiğini netleştirmek ve doğru bilgiye ulaşmak ilk adımdır.'] },
  { title: 'Proje geliştirme', tag: 'ÇALIŞMA ALANI', text: ['Fikirler planlanır ve uygulanabilir adımlara taşınır.', 'Araştırmada öğrenilenler, ekip içinde ortak bir çalışma planına dönüşür.'] },
  { title: 'Paylaşım', tag: 'ÇALIŞMA ALANI', text: ['Yapılan çalışmalar okul topluluğuna aktarılır.', 'Bilgi paylaşıldıkça çoğalır: ekip, öğrendiklerini ve ürettiklerini başkalarıyla buluşturmayı amaçlar.'] },
  { title: 'Vizyonumuz', tag: 'HEDEF', href: '#vizyon', go: 'Vizyon ve misyon', text: ['Bilimsel merakı destekleyen, araştıran ve üreten öğrencilerin yetişmesine katkı sunmak.', 'Bu, ekibin uzun vadeli hedefidir.'] },
  { title: 'Misyonumuz', tag: 'YÖNTEM', href: '#vizyon', go: 'Vizyon ve misyon', text: ['Öğrencilerin fikirlerini araştırma ve proje çalışmalarıyla geliştirebilecekleri bir ortam oluşturmak ve deneyimlerini paylaşmalarını sağlamak.', 'Bu, ekibin çalışma yöntemidir.'] },
  { title: 'Ekibimiz', tag: 'İNSANLAR', href: '#ekibimiz', go: 'Ekibimiz', text: ['Ekip, Batman Anadolu Lisesi’nde araştırma ve proje çalışmaları yürüten 7 öğrenciden oluşur.', 'Üyeleri aşağıdaki üç boyutlu interaktif petek galerisinde inceleyebilirsiniz.'] },
  { title: 'Çalışmalar', tag: 'ARŞİV', href: '#calismalar', go: 'Ne yaptık?', text: ['Projeler ve etkinlikler arşiv galerisinde toplanır.', 'Her kayıtta kısa bir açıklama, tarih ve görseller yer alır.'] },
  { title: 'İletişim', tag: 'ULAŞIN', href: '#iletisim', go: 'İletişim', text: ['Proje fikirleriniz, sorularınız ve iş birliği önerileriniz için bize doğrudan ulaşabilirsiniz.', 'E-posta: example@example.com'] },
];

(function () {
  const panel = document.getElementById('explorer-panel'), tabs = document.getElementById('explorer-tabs');
  if (!panel || !tabs) return;
  const show = (i) => {
    const n = NODES[i];
    panel.innerHTML = `<span class="panel-tag">${String(i + 1).padStart(2, '0')} / ${n.tag}</span><h3>${n.title}</h3>${n.text.map((t) => `<p>${t}</p>`).join('')}${n.href ? `<a class="text-link" href="${n.href}">${n.go} <span>↓</span></a>` : ''}`;
    
    // Anime.js ile yumuşak geçiş
    if (typeof anime !== 'undefined') {
      anime({
        targets: panel.children,
        opacity: [0, 1],
        translateY: [16, 0],
        delay: anime.stagger(60),
        duration: 500,
        easing: 'easeOutQuad'
      });
    } else {
      panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
    }

    tabs.querySelectorAll('button').forEach((b, k) => b.setAttribute('aria-selected', k === i));
  };

  tabs.innerHTML = NODES.map((n, i) => `<button type="button" role="tab" data-i="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${n.title}</button>`).join('');
  tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(+b.dataset.i); });
  tabs.addEventListener('keydown', (e) => { const k = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0; if (!k) return; const bs = [...tabs.querySelectorAll('button')], c = bs.findIndex((b) => b === document.activeElement); const n = (c + k + bs.length) % bs.length; bs[n].focus(); show(n); e.preventDefault(); });
  show(0);
})();
