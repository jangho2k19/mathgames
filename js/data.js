// Mathematics Curriculum Data & Assets (Grade 1 - Kết nối tri thức với cuộc sống)

export const EMOJI_ITEMS = ['🍎', '⭐', '🎈', '🚗', '🐥', '🥕', '🍓', '🐟', '🌸', '🧁'];

export const DAYS_OF_WEEK = [
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
  'Chủ Nhật'
];

export const SHAPES_DATA = [
  {
    id: 'circle',
    name: 'Hình tròn',
    svg: `<svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="50" fill="#38bdf8" stroke="#0284c7" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'square',
    name: 'Hình vuông',
    svg: `<svg width="120" height="120" viewBox="0 0 120 120">
      <rect x="15" y="15" width="90" height="90" rx="8" fill="#facc15" stroke="#ca8a04" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'triangle',
    name: 'Hình tam giác',
    svg: `<svg width="120" height="120" viewBox="0 0 120 120">
      <polygon points="60,15 110,105 10,105" fill="#f43f5e" stroke="#e11d48" stroke-width="4" stroke-linejoin="round"/>
    </svg>`
  },
  {
    id: 'rectangle',
    name: 'Hình chữ nhật',
    svg: `<svg width="150" height="100" viewBox="0 0 150 100">
      <rect x="10" y="15" width="130" height="70" rx="8" fill="#4ade80" stroke="#16a34a" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'cube',
    name: 'Khối lập phương',
    svg: `<svg width="120" height="120" viewBox="0 0 120 120">
      <!-- 3D Cube Isometric -->
      <polygon points="60,15 105,40 60,65 15,40" fill="#a78bfa" stroke="#6d28d9" stroke-width="3"/>
      <polygon points="15,40 60,65 60,105 15,80" fill="#8b5cf6" stroke="#6d28d9" stroke-width="3"/>
      <polygon points="60,65 105,40 105,80 60,105" fill="#7c3aed" stroke="#6d28d9" stroke-width="3"/>
    </svg>`
  },
  {
    id: 'cuboid',
    name: 'Khối hộp chữ nhật',
    svg: `<svg width="150" height="110" viewBox="0 0 150 110">
      <!-- 3D Cuboid Isometric -->
      <polygon points="50,15 135,35 95,65 10,45" fill="#fb923c" stroke="#ea580c" stroke-width="3"/>
      <polygon points="10,45 95,65 95,100 10,80" fill="#f97316" stroke="#ea580c" stroke-width="3"/>
      <polygon points="95,65 135,35 135,70 95,100" fill="#c2410c" stroke="#ea580c" stroke-width="3"/>
    </svg>`
  }
];

export const GAMES_INFO = [
  {
    id: 'count',
    title: 'Đếm Nhanh Cùng Robot',
    subtitle: 'Chủ đề 1 & 6: Đếm số & Cấu tạo số',
    semester: 1,
    tag: 'Tập 1 & 2',
    tagClass: 'tag-tap1',
    icon: '🔢',
    bgColor: '#e0f2fe',
    desc: 'Đếm số lượng đồ vật, hoa quả ngộ nghĩnh và nhận biết hàng chục, hàng đơn vị.'
  },
  {
    id: 'compare',
    title: 'Bập Bênh So Sánh',
    subtitle: 'Bài 3, 4 & 22: Lớn hơn, Bé hơn, Bằng nhau',
    semester: 1,
    tag: 'Tập 1 & 2',
    tagClass: 'tag-tap1',
    icon: '⚖️',
    bgColor: '#fef3c7',
    desc: 'Quan sát bập bênh hoặc so sánh hai số và chọn dấu đúng: >, < hoặc =.'
  },
  {
    id: 'numberhouse',
    title: 'Ngôi Nhà Tách - Gộp',
    subtitle: 'Bài 5: "Mấy và Mấy" - Tách gộp số',
    semester: 1,
    tag: 'Tập 1',
    tagClass: 'tag-tap1',
    icon: '🏠',
    bgColor: '#ffedd5',
    desc: 'Mô hình nhà số đặc trưng của SGK Toán 1: số ở mái nhà gồm 2 số ở 2 cửa sổ!'
  },
  {
    id: 'math',
    title: 'Khu Vườn Phép Tính',
    subtitle: 'Chủ đề 3 & 8: Phép cộng và trừ',
    semester: 1,
    tag: 'Tập 1 & 2',
    tagClass: 'tag-tap1',
    icon: '🍎',
    bgColor: '#dcfce7',
    desc: 'Giúp Robot tính nhẩm phép cộng, trừ trong phạm vi 10 và mở rộng đến 100.'
  },
  {
    id: 'shapes',
    title: 'Thợ Xây Hình Khối',
    subtitle: 'Chủ đề 2 & 4: Hình phẳng, hình khối & Vị trí',
    semester: 1,
    tag: 'Tập 1',
    tagClass: 'tag-tap1',
    icon: '🔷',
    bgColor: '#f3e8ff',
    desc: 'Nhận diện hình vuông, tròn, tam giác, chữ nhật, khối lập phương và vị trí không gian.'
  },
  {
    id: 'measure',
    title: 'Cây Thước Kì Diệu',
    subtitle: 'Chủ đề 7: Đo độ dài xăng-ti-mét (cm)',
    semester: 2,
    tag: 'Tập 2',
    tagClass: 'tag-tap2',
    icon: '📏',
    bgColor: '#fef9c3',
    desc: 'Dùng thước kẻ centimet để đo chiều dài bút chì, cục tẩy, que kem đáng yêu.'
  },
  {
    id: 'clock',
    title: 'Bác Đồng Hồ & Lịch Vui',
    subtitle: 'Chủ đề 9: Xem giờ đúng & Thứ trong tuần',
    semester: 2,
    tag: 'Tập 2',
    tagClass: 'tag-tap2',
    icon: '⏰',
    bgColor: '#fce7f3',
    desc: 'Xem đồng hồ chỉ mấy giờ đúng và sắp xếp toa tàu ngày trong tuần.'
  },
  {
    id: 'brick',
    title: 'Thợ Phá Gạch Toán Học',
    subtitle: 'Đúng phá vỡ gạch - Sai chồng thêm tầng',
    semester: 1,
    tag: 'Mới Lạ ⭐',
    tagClass: 'tag-tap1',
    icon: '🧱',
    bgColor: '#ffe4e6',
    desc: 'Tính đúng để pháo laze bắn vỡ 1-5 viên gạch theo độ khó! Nếu sai gạch sẽ dâng cao đấy nhé!'
  },
  {
    id: 'racing',
    title: 'Cuộc Đua Siêu Tốc',
    subtitle: 'Kích hoạt Nitro bứt phá về đích',
    semester: 1,
    tag: 'Tốc Độ 🏁',
    tagClass: 'tag-tap1',
    icon: '🏎️',
    bgColor: '#e0e7ff',
    desc: 'Chọn đúng cánh cổng mang đáp án của phép tính để xe đua của Robot phóng vọt lên dẫn đầu!'
  },
  {
    id: 'bubbles',
    title: 'Vương Quốc Bong Bóng',
    subtitle: 'Bắn vỡ bong bóng phép tính',
    semester: 1,
    tag: 'Vui Nhộn 🫧',
    tagClass: 'tag-tap1',
    icon: '🫧',
    bgColor: '#cffafe',
    desc: 'Những quả bong bóng xà phòng ngũ sắc lơ lửng mang các con số. Bấm nổ bong bóng mang kết quả đúng!'
  },
  {
    id: 'fishing',
    title: 'Câu Cá Đại Dương',
    subtitle: 'Khám phá đáy biển xanh & Thả câu',
    semester: 2,
    tag: 'Khám Phá 🌊',
    tagClass: 'tag-tap2',
    icon: '🎣',
    bgColor: '#ccfbf1',
    desc: 'Đàn cá đại dương bơi lội mang các số phép tính. Thả cần câu chú cá chuẩn xác để kéo lên thuyền!'
  },
  {
    id: 'frog',
    title: 'Ếch Nhảy Tia Số',
    subtitle: 'Cộng trừ & Bước nhảy trên tia số ao sen',
    semester: 1,
    tag: 'Tia Số 🐸',
    tagClass: 'tag-tap1',
    icon: '🐸',
    bgColor: '#dcfce7',
    desc: 'Quan sát chú ếch nhảy tiến, nhảy lùi trên đài sen để hiểu sâu bản chất phép cộng trừ.'
  },
  {
    id: 'carrot',
    title: 'Thỏ Gom Cà Rốt',
    subtitle: 'Bài 5: Tách - Gộp số cùng Bác Gấu & Thỏ Trắng',
    semester: 1,
    tag: 'Tách - Gộp 🥕',
    tagClass: 'tag-tap1',
    icon: '🥕',
    bgColor: '#ffedd5',
    desc: 'Giúp Bác Gấu nông dân và Thỏ Trắng đào 2 luống cà rốt sao cho tổng số củ bằng đúng yêu cầu!'
  },
  {
    id: 'cannon',
    title: 'Đại Bác Bong Bóng',
    subtitle: 'Chủ đề 3 & 8: Bắn đại bác tính nhanh cộng trừ',
    semester: 1,
    tag: 'Bắn Pháo 🎈',
    tagClass: 'tag-tap1',
    icon: '🎈',
    bgColor: '#e0f2fe',
    desc: 'Xoay nòng đại bác ngôi sao và ngắm bắn nổ các quả bóng bay mang đáp án phép tính chính xác!'
  }
];

export const BADGES = [
  { id: 'first_game', title: 'Ngôi Sao Khởi Đầu', icon: '🌟', reqStars: 5, desc: 'Đạt 5 ngôi sao đầu tiên' },
  { id: 'master_math', title: 'Thần Đồng Tính Nhẩm', icon: '⚡', reqStars: 15, desc: 'Đạt 15 ngôi sao trong các phép tính' },
  { id: 'carrot_hero', title: 'Siêu Thỏ Nhổ Cà Rốt', icon: '🥕', reqStars: 20, desc: 'Bậc thầy tách gộp số cùng Thỏ Trắng và Bác Gấu' },
  { id: 'master_shapes', title: 'Kiến Trúc Sư Nhí', icon: '📐', reqStars: 25, desc: 'Chinh phục các thử thách hình khối' },
  { id: 'brick_master', title: 'Vua Phá Gạch', icon: '🧱', reqStars: 35, desc: 'Bậc thầy công phá tường gạch số học' },
  { id: 'cannon_ace', title: 'Thiện Xạ Đại Bác', icon: '🎈', reqStars: 40, desc: 'Bách phát bách trúng bóng bay phép tính' },
  { id: 'speed_racer', title: 'Tay Đua Siêu Cấp', icon: '🏎️', reqStars: 45, desc: 'Kích hoạt nitro làm chủ đường đua' },
  { id: 'frog_master', title: 'Vua Tia Số', icon: '🐸', reqStars: 55, desc: 'Bậc thầy nhảy trên tia số ao sen cùng chú ếch!' },
  { id: 'time_traveler', title: 'Chuyên Gia Thời Gian', icon: '🧭', reqStars: 60, desc: 'Nắm vững giờ giấc và thứ trong tuần' },
  { id: 'math_champion', title: 'Quán Quân Toán 1', icon: '🏆', reqStars: 75, desc: 'Hoàn thành xuất sắc 75 sao toán học!' }
];

export const ROBOT_CHEERS = [
  'Bé giỏi quá! Tuyệt vời lắm!',
  'Chính xác rồi! Tiếp tục phát huy nhé!',
  'Xuất sắc! Bé thông minh quá!',
  'Hoan hô! Thêm một ngôi sao nữa rồi!',
  'Đúng rồi! Bạn Robot rất tự hào về bé!'
];

export const ROBOT_ENCOURAGE = [
  'Gần đúng rồi, bé thử lại xem sao nhé!',
  'Đừng lo, hãy đếm cẩn thận lại một lần nữa nhé!',
  'Bé quan sát kĩ hơn một chút nào!',
  'Cố lên nào, bạn Robot tin bé sẽ làm được!'
];

// ============================================================================
// BÉ HỌC TOÁN PHIÊU LƯU (ADVENTURE ISLAND) DATA
// ============================================================================

export const ISLAND_STATIONS = [
  {
    id: 'adv_count',
    number: 1,
    title: 'Đếm & Chọn Số',
    subtitle: 'Khu Rừng Đom Đóm',
    gameType: 'adv_count',
    icon: '🍎',
    bgTheme: '#ecfdf5',
    color: '#10b981',
    desc: 'Đếm các đồ vật đáng yêu và bấm chọn số đúng. Chạm vào đồ vật để đếm!',
    x: 18,
    y: 75
  },
  {
    id: 'adv_fruit',
    number: 2,
    title: 'Hái Quả Cộng Trừ',
    subtitle: 'Nông Trại Trái Cây',
    gameType: 'adv_fruit',
    icon: '🧺',
    bgTheme: '#fffbeb',
    color: '#f59e0b',
    desc: 'Quả rơi vào giỏ sinh động giúp bé nhìn thấy phép tính cộng trừ cực dễ!',
    x: 42,
    y: 52
  },
  {
    id: 'adv_balloons',
    number: 3,
    title: 'Bắt Bóng Bay',
    subtitle: 'Thung Lũng Cầu Vồng',
    gameType: 'adv_balloons',
    icon: '🎈',
    bgTheme: '#f0fdf4',
    color: '#06b6d4',
    desc: 'Bóng bay mang số bay lên, bé tính nhanh và bấm quả bóng nổ bốc khói sao!',
    x: 68,
    y: 35
  },
  {
    id: 'adv_compare',
    number: 4,
    title: 'Cá Lớn Nuốt Cá Bé',
    subtitle: 'Vịnh Biển San Hô',
    gameType: 'adv_compare',
    icon: '🐟',
    bgTheme: '#eff6ff',
    color: '#3b82f6',
    desc: 'Chú cá há to miệng về bên nhiều hơn! So sánh số và chọn dấu đúng.',
    x: 84,
    y: 68
  },
  {
    id: 'adv_frog',
    number: 5,
    title: 'Ếch Nhảy Tia Số',
    subtitle: 'Ao Sen Diệu Kỳ',
    gameType: 'adv_frog',
    icon: '🐸',
    bgTheme: '#ecfdf5',
    color: '#059669',
    desc: 'Cùng chú ếch xanh nhảy trên hàng đài sen tia số để tìm đáp án chính xác!',
    x: 55,
    y: 85
  },
  {
    id: 'adv_shapes',
    number: 6,
    title: 'Thành Phố Hình Khối',
    subtitle: 'Lâu Đài Phép Màu',
    gameType: 'adv_shapes',
    icon: '🔷',
    bgTheme: '#faf5ff',
    color: '#8b5cf6',
    desc: 'Nhận biết hình tròn, vuông, tam giác, chữ nhật và các hình khối 3D đáng yêu!',
    x: 75,
    y: 88
  }
];

export const WARDROBE_ITEMS = [
  { id: 'hat_straw', name: 'Mũ Thám Hiểm', type: 'hat', icon: '👒', cost: 5, desc: 'Mũ rơm thám hiểm đảo hoang' },
  { id: 'hat_crown', name: 'Vương Miện Vàng', type: 'hat', icon: '👑', cost: 15, desc: 'Vương miện công chúa/hoàng tử' },
  { id: 'glasses_cool', name: 'Kính Mát Ngầu', type: 'glasses', icon: '🕶️', cost: 10, desc: 'Kính râm chống nắng biển' },
  { id: 'ribbon_red', name: 'Nơ Đỏ Xinh', type: 'accessory', icon: '🎀', cost: 8, desc: 'Chiếc nơ cài siêu dễ thương' },
  { id: 'jetpack', name: 'Balo Phản Lực', type: 'back', icon: '🚀', cost: 25, desc: 'Bay vù vù giữa các hòn đảo' }
];

export const MIU_CHEERS = [
  'Miu Miu thấy bé giỏi quá!',
  'Chính xác rồi! Bé thông minh tuyệt vời!',
  'Hoan hô bé yêu! Bé làm nhanh quá!',
  'Thêm một ngôi sao lấp lánh cho bé nè!',
  'Bé của Miu Miu đỉnh thật đấy!'
];

export const MIU_ENCOURAGE = [
  'Không sao đâu, bé thử lại một lần nữa nhé!',
  'Bé đếm lại từ từ cùng Miu Miu nào!',
  'Gần đúng rồi đấy, cố lên bé ơi!',
  'Miu Miu tin bé nhất định sẽ tìm ra đáp số!'
];

export const DIFFICULTY_LEVELS = {
  easy: {
    id: 'easy',
    name: 'Dễ',
    shortName: 'Dễ',
    icon: '🌱',
    color: '#16a34a',
    bgColor: '#dcfce7',
    borderColor: '#86efac',
    tag: 'Cơ bản (0 - 10)',
    scope: '10',
    desc: 'Phạm vi số 0 - 10 (Học kì 1 cơ bản, đếm và tính đơn giản)'
  },
  medium: {
    id: 'medium',
    name: 'Vừa',
    shortName: 'Vừa',
    icon: '⭐',
    color: '#d97706',
    bgColor: '#fef3c7',
    borderColor: '#fcd34d',
    tag: 'Chuẩn lớp 1 (0 - 20)',
    scope: '20',
    desc: 'Phạm vi số 0 - 20 (Cộng trừ không nhớ, chuẩn lớp 1)'
  },
  hard: {
    id: 'hard',
    name: 'Khó',
    shortName: 'Khó',
    icon: '🔥',
    color: '#ea580c',
    bgColor: '#ffedd5',
    borderColor: '#fdba74',
    tag: 'Học kì 2 (0 - 100)',
    scope: '100',
    desc: 'Phạm vi số 0 - 100 (Số 2 chữ số, tròn chục, tốc độ nhanh hơn)'
  },
  challenge: {
    id: 'challenge',
    name: 'Thử thách',
    shortName: 'Thử thách',
    icon: '⚡',
    color: '#7c3aed',
    bgColor: '#f3e8ff',
    borderColor: '#d8b4fe',
    tag: 'Toán tư duy & 3 số',
    scope: 'challenge',
    desc: 'Toán tư duy nâng cao: Phép tính 3 số, tìm số bí mật (?), toán so sánh biểu thức'
  }
};

export function getCurrentDifficulty() {
  const saved = localStorage.getItem('adv_difficulty_level');
  if (saved && DIFFICULTY_LEVELS[saved]) return saved;
  const parentSettings = JSON.parse(localStorage.getItem('adv_parent_settings') || '{}');
  if (parentSettings.difficulty && DIFFICULTY_LEVELS[parentSettings.difficulty]) return parentSettings.difficulty;
  if (parentSettings.scope === '100') return 'hard';
  if (parentSettings.scope === '20') return 'medium';
  if (parentSettings.scope === '10') return 'easy';
  return 'medium';
}

export function setDifficulty(level) {
  if (!DIFFICULTY_LEVELS[level]) return;
  localStorage.setItem('adv_difficulty_level', level);
  const parentSettings = JSON.parse(localStorage.getItem('adv_parent_settings') || '{"autoVoice":true}');
  parentSettings.difficulty = level;
  parentSettings.scope = DIFFICULTY_LEVELS[level].scope;
  localStorage.setItem('adv_parent_settings', JSON.stringify(parentSettings));
}

