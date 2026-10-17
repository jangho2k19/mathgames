# 🎮 Bé Vui Học Toán Lớp 1 (Grade 1 Math Games)

Kho trò chơi toán học giáo dục trực quan, tương tác cao được thiết kế chuyên biệt cho học sinh Lớp 1 (6–7 tuổi). Game chạy trực tiếp trên trình duyệt, không cần cài đặt, hỗ trợ màn hình cảm ứng, có giọng đọc tiếng Việt và âm thanh sống động.

![HTML5](https://img.shields.io/badge/HTML5-Canvas%202D-orange?style=for-the-badge&logo=html5)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-yellow?style=for-the-badge&logo=javascript)
![Web Audio](https://img.shields.io/badge/Web%20Audio%20API-Synthesizer-blue?style=for-the-badge)
![Web Speech](https://img.shields.io/badge/Web%20Speech%20API-Vietnamese%20TTS-green?style=for-the-badge)

---

## 🕹️ Danh Sách Các Trò Chơi

### 1. 🥕 Thỏ Gom Cà Rốt (Carrot Harvester) - [Mở Game: `index.html`](index.html)
* **Chủ đề:** Nông trại hoạt hình với Bác Gấu nông dân và chú Thỏ Trắng đáng yêu.
* **Mục tiêu giáo dục:** Củng cố nhận diện số lượng và tư duy **Tách - Gộp số** (Bản chất của phép cộng: tìm 2 số $a + b = C$ hoặc $C - a = b$).
* **Cơ chế chơi:**
  - Bác Gấu đưa ra số lượng mục tiêu cần thu hoạch ($3 \le Target \le 10$) kèm giọng đọc tiếng Việt.
  - Trên sân có 4 luống cà rốt cắm số củ cụ thể và biển gỗ ghi số tương ứng.
  - Học sinh bấm chọn 2 luống cà rốt sao cho tổng số củ bằng đúng số Bác Gấu cần.
  - Chú Thỏ Trắng chạy tới đào đất, ôm cà rốt bỏ vào giỏ của Bác Gấu.
  - Khi đúng: Pháo giấy bay rực rỡ, hiện công thức toán $a + b = Target$, cộng 1 sao ⭐ (đủ 5 sao nhận Cúp Vàng).
  - Khi sai: Thỏ gãi tai bối rối, hoàn cà rốt về luống mà không bị phạt điểm.

---

### 2. 🎈 Đại Bác Bong Bóng (Bubble Cannon Math) - [Mở Game: `bubble-cannon.html`](bubble-cannon.html)
* **Chủ đề:** Bắn bóng bay hoạt hình trên bầu trời cầu vồng tươi sáng.
* **Mục tiêu giáo dục:** Rèn luyện phản xạ tính nhanh **phép cộng và phép trừ** trong phạm vi 10 ($5 + 2 = ?$, $8 - 3 = ?$).
* **Cơ chế chơi:**
  - Khẩu pháo ở đáy màn hình tự động xoay nòng theo con trỏ chuột (`Math.atan2`).
  - Click chuột hoặc chạm màn hình để bắn ra viên đạn ngôi sao lấp lánh bay theo hướng nòng pháo.
  - Trên thân pháo có bảng câu hỏi toán học kèm nút 📢 nghe giọng đọc tiếng Việt.
  - Trên trời có 4 quả bóng bay lơ lửng, trong đó 1 bóng mang đáp án đúng, 3 bóng mang đáp án sai.
  - **Bắn trúng bóng ĐÚNG:** Bóng vỡ tung tóe hạt màu sắc, phát âm thanh pop/ting, cộng 10 điểm và chuyển sang câu tiếp theo.
  - **Bắn trúng bóng SAI:** Bóng rung lắc biến mất, trừ 1 tim (tổng 3 tim ❤️❤️❤️).
  - **Tính năng mở rộng:** Có thanh đếm ngược thời gian (25s), đạt 100 điểm sẽ nhận Cúp Chiến Thắng 🏆, hết tim hiển thị màn hình Chơi lại.

---

## 🌟 Ưu Điểm Kỹ Thuật

1. **Chuẩn phân giải 16:9 (1280x720):** Tự động co giãn (`contain`), hiển thị sắc nét trên máy tính, laptop, iPad, máy tính bảng và màn hình tương tác thông minh.
2. **Âm thanh và Giọng đọc độc lập:**
   - Sử dụng **Web Audio API** tự tổng hợp âm thanh (tiếng pháo bắn, thỏ nhảy, nhổ cà rốt, chuông chúc mừng, nhạc nền BGM) không lo lỗi thiếu file MP3.
   - Tích hợp **Web Speech API** phát âm tiếng Việt chuẩn giúp các bé chưa thạo chữ vẫn có thể nghe hiểu đề bài dễ dàng.
3. **Đồ họa Vector Procedural:** Toàn bộ nhân vật, khẩu pháo, bóng bay, hoa cỏ được vẽ bằng Canvas 2D giúp game cực nhẹ, tải tức thì, chạy mượt mà 60 FPS.
4. **Nút chuyển đổi game nhanh:** Trên thanh HUD của cả 2 game đều có nút chuyển đổi qua lại thuận tiện.

---

## 🚀 Hướng Dẫn Mở & Chơi Trực Tiếp

### Cách 1: Mở trực tiếp trên máy
Nhấp đúp chuột vào file:
* [`index.html`](index.html) để chơi **Thỏ Gom Cà Rốt**
* [`bubble-cannon.html`](bubble-cannon.html) để chơi **Đại Bác Bong Bóng**

### Cách 2: Mở qua Live Server / Local Server
```bash
# Bằng Python:
python -m http.server 8080

# Hoặc bằng Node.js:
npx serve .
```
Truy cập: `http://localhost:8080` (hoặc `http://localhost:8080/bubble-cannon.html`).

### Cách 3: Chơi Online trên GitHub Pages
Bật tính năng GitHub Pages trên repository `jangho2k19/mathgames`:
* Vào **Settings** > **Pages** > Chọn nhánh **`main`** / **`/(root)`** > Nhấn **Save**.
* Game sẽ hoạt động online tại:
  - `https://jangho2k19.github.io/mathgames/`
  - `https://jangho2k19.github.io/mathgames/bubble-cannon.html`

---

## 📂 Cấu Trúc Thư Mục

```text
mathgames/
├── index.html            # Game 1: Thỏ Gom Cà Rốt
├── bubble-cannon.html    # Game 2: Đại Bác Bong Bóng
├── README.md             # Tài liệu giới thiệu & hướng dẫn chi tiết
├── .gitignore            # Cấu hình bỏ qua file rác
├── css/
│   └── style.css         # Styling chung phong cách hoạt hình
└── js/
    ├── audio.js          # Bộ tổng hợp âm thanh & giọng đọc TTS
    ├── graphics.js       # Bộ vẽ vector 2D (Bác Gấu, Thỏ, Luống đất)
    ├── game.js           # Logic toán học Tách - Gộp số
    └── main.js           # Điều khiển sự kiện & game loop
```

---
*Phát triển với ❤️ vì sự phát triển tư duy toán học của các bé!*
