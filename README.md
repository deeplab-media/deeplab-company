# Deeplab Media — website công ty

Static site (HTML/CSS/JS thuần), không cần build. Mở `index.html` hoặc chạy:

```bash
python -m http.server 8765
```

## Nội dung đã đưa lên trang
- 35 video YouTube (9 thể loại) + website founder profile Nozomi, 21 ảnh 3D/CGI, 18 video TikTok của 3 kênh + Facebook Reels, 16 thumbnail, 37 clip hậu trường, 8 ảnh ekip, toàn bộ link kênh.
- Chuẩn ngành đã áp dụng (ColorMedia, TVC360, ProMedia, Zarla): H1 chứa từ khoá + địa phương, "Khách hàng tiêu biểu", "Vì sao chọn", "Dịch vụ của chúng tôi", "Các loại video thực hiện", "Dự án đã hoàn thành", "Quy trình sản xuất", "Hậu trường", nút Zalo nổi, CTA "Nhận tư vấn miễn phí" / "Nhận báo giá".

## Phiên bản v3 (layout awwwards)
Dựng lại theo các pattern mã nguồn mở đã clone về đọc: `olivierlarose/awwwards-landing-page` (preloader cong, header magnetic, menu trượt cạnh cong, hero chữ chạy theo scroll, đoạn văn lộ từng từ, danh sách dự án có ảnh bám chuột, hai hàng ảnh trượt ngược + đường cong, footer dính), `olivierlarose/cards-parallax` (dịch vụ dạng thẻ xếp chồng), `olivierlarose/zoom-parallax` (3D ghim màn hình phóng to), `codrops/ColumnScroll` (cột TikTok cuộn ngược chiều). Toàn bộ chuyển từ React/Framer sang vanilla GSAP ScrollTrigger + Lenis. File chính: `assets/css/site.css`, `assets/js/main.js`, generator `gen3.py` + `body3.html` (ngoài repo) sinh `index.html`.

## Brand (từ H:/Image/Logo/Logo.svg)
- Navy `#071752` (chính), đen `#231f20`, trắng. Trên web: nền `#060b24` / `#0a1238` / `#111b4d` (navy tối dần), section sáng `#f3f5fb`, accent "dolphin ice" `#4fc3f7` dùng < 10% (chữ nhấn, nút, số).
- Font: Archivo Expanded 800/900 (tiêu đề, giống tinh thần wordmark) + Manrope (thân) + Space Grotesk (số, giá, nhãn). Cả hai có subset tiếng Việt trên Google Fonts.
- Logo: `assets/img/logo-mark*.svg`, `logo-word*.svg`, `logo-lockup*.svg` (white/navy) tách từ file SVG gốc; favicon, OG image dựng từ file brand.

## Khu video (phòng chiếu)
35 phim, khung HD đã cắt viền đen ở `assets/img/yt/<id>.webp` (+ `-s.webp` bản nhỏ). Màn ảnh rộng 2.2:1, ảnh hiển thị trọn khung, phần trống lấp bằng bản mờ của chính khung hình. Tự chuyển phim mỗi 7 giây, dừng khi rê chuột; mô tả từng phim nằm trong `data-desc` của nút trong dải phim.

## Thêm showreel và đoạn lặp cho từng phim
1. **Showreel đầu trang:** xuất file MP4 H.264, 1920×1080, 20–60 giây, không tiếng, dưới ~12 MB. Lưu thành `assets/video/showreel.mp4`, rồi sửa `assets/video/media.json` thành `"showreel": true`.
2. **Đoạn lặp khi rê chuột vào ô phim:** mỗi phim một file 3–5 giây, 640px ngang, không tiếng, dưới ~1 MB. Đặt tên theo mã YouTube của phim, ví dụ `assets/video/loops/G13RBL9-J7Y.mp4`, rồi thêm mã đó vào mảng `"loops"` trong `media.json`.
Không cần sửa code. Màn chiếu tự phát bản xem trước từ YouTube (tắt tiếng) trên máy tính; điện thoại chỉ hiện ảnh tĩnh để tiết kiệm dữ liệu.

## Cấu trúc
- `index.html` — toàn bộ nội dung + JSON-LD (Organization, LocalBusiness, OfferCatalog, FAQPage)
- `assets/css/site.css` — design tokens (nền đen ấm `#0c0b09`, vàng đồng `#c9a96e`, teal `#5fb4d0` dùng dưới 5%), font Cormorant Garamond + Be Vietnam Pro
- `assets/js/main.js` — Lenis (cuộn mượt) + GSAP ScrollTrigger (hero, parallax), reveal, count-up, lọc dự án, modal YouTube, marquee BTS, form → mailto
- `assets/img`, `assets/video` — logo, favicon, OG image, ảnh webp, 6 clip hậu trường
- `robots.txt`, `sitemap.xml`, `llms.txt`, `site.webmanifest` — SEO / AEO / GEO

## Deploy lên GitHub Pages
1. Tạo repo mới trên GitHub, ví dụ `deeplab-media/deeplab-company`, push toàn bộ thư mục này lên nhánh `main`.
2. Settings → Pages → Source: `main` / root.
3. Nếu dùng tên repo khác hoặc domain riêng (ví dụ `deeplabmedia.vn`): thay toàn bộ `https://deeplab-media.github.io/deeplab-company/` trong `index.html`, `sitemap.xml`, `robots.txt`, `llms.txt` bằng URL thật, rồi thêm file `CNAME`.
4. Gửi `sitemap.xml` lên Google Search Console.

## Giá
Site KHÔNG công khai giá (quyết định của Sinh, 20/10/2026). Mọi CTA dẫn tới form gửi brief; báo giá gửi riêng trong 24 giờ.

## Form liên hệ
Hiện form mở ứng dụng email với nội dung điền sẵn (không có backend). Khi cần lưu lead tự động, đổi sang Formspree hoặc Google Form trong `main.js`.
