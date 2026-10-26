/* Deeplab contact dock: quick answers from the site's own FAQ, then Zalo / Messenger. Shared by the homepage and every subpage.
   Nothing typed here is stored or sent anywhere; a typed question only pre-fills the Messenger link. */
(() => {
  const $ = (q, c = document) => c.querySelector(q);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const R = (document.currentScript && document.currentScript.dataset.root) || '';  // path back to the site root ('' or '../')
  // count contact clicks in whichever cookieless counter the build loaded (GoatCounter totals, or Amplitude with no cookies / no IP)
  const tally = (path, title) => { try { window.goatcounter && window.goatcounter.count && window.goatcounter.count({ path, title, event: true }); window.amplitude && window.amplitude.track && window.amplitude.track(title, { action: path, page: location.pathname }); } catch (_) {} };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href], #dc-open'); if (!a) return;
    const h = a.getAttribute('href') || '';
    if (a.id === 'dc-open') tally('mo-hoi-deeplab', 'Mở khung Hỏi Deeplab');
    else if (h.includes('zalo.me')) tally('bam-zalo', 'Bấm Zalo');
    else if (h.includes('m.me/')) tally('bam-messenger', 'Bấm Messenger');
    else if (h.startsWith('mailto:')) tally('bam-email', 'Bấm Email');
  }, true);
  const chat = $('#dl-chat');
  if (chat) {
    const ZALO = 'https://zalo.me/0345926347', MSG = 'https://m.me/61586418617853';
    const panel = $('#dc-panel'), log = $('#dc-log'), quick = $('#dc-quick'), openBtn = $('#dc-open'), teaser = $('#dc-teaser'), zbox = $('#dc-zalo'), msgA = $('.ch-msg', chat);
    const desktop = !matchMedia('(pointer:coarse)').matches;
    const QA = [
      { k: 'Báo giá thế nào?', re: /giá|chi phí|bao nhiêu|tiền|ngân sách/i, a: 'Chi phí tính theo phạm vi thực tế: số video, số buổi quay, mức độ hậu kỳ. Gửi brief qua Zalo hoặc Messenger, Deeplab gửi báo giá chi tiết trong 24 giờ làm việc.' },
      { k: 'Nên chọn gói nào?', re: /gói|chọn|phù hợp|dịch vụ|làm gì/i, a: 'Cần kênh TikTok đăng đều: <b>TikTok trọn gói</b>. Đã tự quay: <b>Dựng video ngắn</b>. Có footage cần dựng, màu, VFX: <b>Hậu kỳ chuyên sâu</b>. Cần TVC hay bộ video chiến dịch: <b>Quay phim social &amp; TVC</b>. <a href="' + R + '#services">Xem 6 gói →</a>' },
      { k: 'Mất bao lâu?', re: /bao lâu|thời gian|mấy ngày|deadline|gấp|khi nào/i, a: 'Dựng video ngắn: giao trong 3 ngày làm việc. Hậu kỳ: 2 – 3 tuần. Quay phim, TVC: 2 – 6 tuần tuỳ quy mô. TikTok trọn gói chạy theo tháng.' },
      { k: 'Làm cho doanh nghiệp Nhật?', re: /nhật|japan|日本|nhat/i, a: 'Có. Deeplab đã làm phim cho doanh nghiệp và bệnh viện Nhật như 日鋼サッシュ製作所, bệnh viện Ouji, Nichino, quay ở cả Việt Nam và Nhật Bản. <a href="' + R + 'ja/">日本語のページ →</a>' },
      { k: 'Quay ở đâu?', re: /ở đâu|địa điểm|hà nội|hồ chí minh|hcm|sài gòn|văn phòng|tỉnh|địa chỉ/i, a: 'Ê-kíp quay tại cả Hà Nội và TP. Hồ Chí Minh, hậu kỳ nhận từ xa trên toàn quốc. Văn phòng: 342 Võ Văn Kiệt, Q.1 và Toà nhà CEO, Phạm Hùng, Hà Nội.' },
      { k: 'Soi kênh TikTok miễn phí', re: /soi|kênh|tiktok/i, a: 'Gửi link kênh TikTok qua Zalo, Deeplab gửi lại 3 điểm cần sửa trong 24 giờ làm việc, miễn phí.' },
      { k: 'Xem dự án', re: /dự án|portfolio|mẫu|phim đã làm|sản phẩm/i, a: '45 phim trong phòng chiếu và các kênh TikTok xây từ số 0. <a href="' + R + '#work">Mở phòng chiếu →</a>' },
    ];
    let greeted = false, asked = new Set();
    const add = (html, who) => { const d = document.createElement('div'); d.className = 'm ' + who; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; };
    const bot = html => { const t = add('<i></i><i></i><i></i>', 'bot typing'); setTimeout(() => { t.remove(); add(html, 'bot'); chips(); }, reduce ? 0 : 650); };
    const chips = () => { quick.innerHTML = ''; QA.filter(q => !asked.has(q.k)).slice(0, 4).forEach(q => { const b = document.createElement('button'); b.type = 'button'; b.textContent = q.k; b.onclick = () => ask(q); quick.appendChild(b); }); };
    const ask = q => { asked.add(q.k); add(q.k, 'me'); quick.innerHTML = ''; bot(q.a); };
    const open = () => { panel.hidden = false; chat.classList.add('open'); openBtn.setAttribute('aria-expanded', 'true'); teaser.hidden = true; if (!greeted) { greeted = true; bot('Xin chào! Bạn cần Deeplab hỗ trợ gì? Chọn câu hỏi bên dưới hoặc nhập câu hỏi của bạn.'); } };
    const close = () => { panel.hidden = true; chat.classList.remove('open'); openBtn.setAttribute('aria-expanded', 'false'); zbox.hidden = true; };
    openBtn.addEventListener('click', () => panel.hidden ? open() : close());
    $('.dc-close', chat).addEventListener('click', close);
    addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(); });
    log.addEventListener('click', e => { const a = e.target.closest('a'); if (a && innerWidth < 700) close(); });
    $('#dc-ask').addEventListener('submit', e => {
      e.preventDefault(); const inp = $('#dc-q'), q = inp.value.trim(); if (!q) return; inp.value = '';
      const me = add('', 'me'); me.textContent = q;
      const hit = QA.find(x => x.re.test(q));
      msgA.href = MSG + '?text=' + encodeURIComponent(q);  // Messenger opens with the question already typed
      if (hit) { asked.add(hit.k); bot(hit.a + '<br><br>Cần trao đổi thêm? Bấm <b>Messenger</b> để gửi nguyên câu hỏi này.'); }
      else bot('Câu này Deeplab trả lời trực tiếp sẽ nhanh và đúng hơn. Bấm <b>Messenger</b> bên dưới, câu hỏi của bạn đã được điền sẵn, hoặc nhắn <b>Zalo</b>.');
    });
    teaser.addEventListener('click', e => { if (e.target.closest('.dc-x')) { teaser.hidden = true; try { sessionStorage.setItem('dcT', '1'); } catch (_) {} return; } open(); });
    let seenT = false; try { seenT = !!sessionStorage.getItem('dcT'); } catch (_) {}
    if (!seenT) setTimeout(() => { if (panel.hidden) { teaser.hidden = false; try { sessionStorage.setItem('dcT', '1'); } catch (_) {} } }, 9000);
    // desktop: zalo.me asks for a Zalo login, so offer the faster routes first (QR, Zalo Web, copy number, Messenger)
    if (desktop) document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="' + ZALO + '"]'); if (!a || a.closest('.dc-zalo')) return;
      e.preventDefault(); open(); zbox.hidden = false; zbox.scrollIntoView({ block: 'nearest' });
    }, true);
    $('.dz-copy', chat).addEventListener('click', e => { tally('chep-so-zalo', 'Chép số Zalo'); const b = e.currentTarget; const done = () => { b.textContent = 'Đã sao chép 0345 926 347'; }; (navigator.clipboard ? navigator.clipboard.writeText(b.dataset.copy).then(done) : Promise.reject()).catch(() => { b.textContent = '0345 926 347'; }); });
  }

})();
