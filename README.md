# 🥕 Thỏ Gom Cà Rốt (Carrot Harvester) - Bé Vui Học Toán Lớp 1

Trò chơi toán học giáo dục trực quan, tương tác cao được thiết kế dành cho học sinh Lớp 1 (6–7 tuổi). Game giúp củng cố nhận diện số lượng và tư duy **Tách - Gộp số** (tiền đề của phép cộng và phép trừ $a + b = C$) trong phạm vi 10.

![HTML5](https://img.shields.io/badge/HTML5-Canvas%202D-orange?style=for-the-badge&logo=html5)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-yellow?style=for-the-badge&logo=javascript)
![Web Audio](https://img.shields.io/badge/Web%20Audio%20API-Synthesizer-blue?style=for-the-badge)
![Web Speech](https://img.shields.io/badge/Web%20Speech%20API-Vietnamese%20TTS-green?style=for-the-badge)

---

## 🌟 Tính năng nổi bật

1. **Giao diện chuẩn 16:9 (1280x720):**
   - Tự động co giãn (`contain`), hiển thị sắc nét trên mọi thiết bị: Máy tính, Laptop, Máy tính bảng, Màn hình tương tác cảm ứng.
   - Phong cách hoạt hình tươi sáng, thân thiện cho trẻ thơ, sử dụng font chữ bo tròn *Nunito* & *Quicksand*.

2. **Giọng đọc tiếng Việt (Web Speech API):**
   - Bác Gấu nông dân đọc to yêu cầu nhiệm vụ: *"Bác Gấu cần [X] củ cà rốt"*.
   - Có nút loa 📢 để bé nghe lại bất cứ lúc nào và lời khen ngợi khi làm đúng.

3. **Cơ chế Tách - Gộp trực quan:**
   - 4 luống đất có số lượng củ cà rốt cắm thực tế để bé tập đếm $(1, 2, 3...)$ kết hợp nhận diện chữ số trên biển gỗ.
   - Thao tác chọn 2 luống sao cho tổng số củ của 2 luống bằng đúng số Bác Gấu cần ($a + b = Target$).

4. **Hoạt hình Thỏ Trắng tương tác sống động:**
   - Khi chọn luống, Thỏ Trắng chạy tới đào đất (hiệu ứng đất văng, âm thanh *pop*), ôm cà rốt chạy về bỏ vào giỏ của Bác Gấu.
   - Có nút **🔄 Chọn lại** nếu bé muốn đổi ý khi mới chọn 1 luống.

5. **Phản hồi sư phạm tích cực (Giảm tâm lý sợ sai):**
   - **Khi đúng:** Thỏ nhảy ăn mừng, pháo hoa giấy rực rỡ, hiện bảng công thức toán tóm tắt `$a + b = Target$`, cộng 1 sao ⭐. Đủ 5 sao sẽ nhận được **Cúp Vàng Chiến Thắng 🏆**.
   - **Khi chưa đúng:** Thỏ gãi tai bối rối, thông báo nhẹ nhàng *"Ồ, chưa đúng rồi, bé thử lại nhé!"*, tự hoàn cà rốt về luống mà không bị trừ điểm.

6. **Không cần cài đặt phức tạp:**
   - Toàn bộ đồ họa vẽ bằng Canvas 2D vector procedural, âm thanh tự tổng hợp qua Web Audio API. Chạy độc lập 100% không lo lỗi thiếu file hình ảnh/âm thanh.

---

## 🎮 Cách chơi

1. Quan sát số cà rốt mà **Bác Gấu** cần (hoặc nhấn nút **📢 Nghe**).
2. Quan sát 4 luống cà rốt trong vườn, đếm số củ và xem số ghi trên biển gỗ.
3. Bấm chọn lần lượt **2 luống cà rốt** sao cho **tổng 2 số bằng đúng số Bác Gấu cần**.
4. Hoàn thành 5 vòng để giành Cúp Chiến Thắng!

---

## 🚀 Hướng dẫn khởi chạy

### Cách 1: Mở trực tiếp
Nhấp đúp vào file `index.html` để mở ngay trên trình duyệt (Chrome, Edge, Firefox, Safari...).

### Cách 2: Dùng Live Server / HTTP Server
Sử dụng bất kỳ local server nào:
```bash
# Sử dụng Python:
python -m http.server 8080

# Hoặc Node.js npx serve:
npx serve .
```
Sau đó truy cập `http://localhost:8080` trên trình duyệt.

### Cách 3: Đưa lên GitHub Pages
Vào **Settings** của repository trên GitHub -> mục **Pages** -> Chọn Branch `main` (hoặc `master`) / root (`/`) -> Lưu lại để game chạy trực tiếp qua đường link GitHub Pages miễn phí.

---

## 📂 Cấu trúc thư mục

```text
mathgames/
├── index.html            # File HTML chính chứa canvas 1280x720 và UI HUD
├── README.md             # Hướng dẫn chi tiết dự án
├── css/
│   └── style.css         # Styling hoạt hình, màu sắc tươi sáng, responsive
└── js/
    ├── audio.js          # Web Audio API Synthesizer & Web Speech API TTS
    ├── graphics.js       # Bộ vẽ vector 2D (Bác Gấu, Thỏ Trắng, Luống cà rốt, Confetti)
    ├── game.js           # Quản lý game loop, logic Tách - Gộp số, cỗ máy trạng thái
    └── main.js           # Khởi tạo, xử lý tương tác chuột & chạm cảm ứng
```

---
*Phát triển với ❤️ vì sự phát triển tư duy toán học của trẻ nhỏ!*
