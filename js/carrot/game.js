/**
 * ============================================================================
 * THỎ GOM CÀ RỐT - GAME ENGINE & CORE GAMEPLAY LOOP
 * Quản lý vòng đời trò chơi, toán học Tách - Gộp số, tương tác hoạt hình
 * ============================================================================
 */

class CarrotGame {
  constructor(canvas, audio) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.graphics = new GraphicsRenderer(this.ctx);

    // Trạng thái chơi & Dữ liệu màn
    this.stars = 0;
    this.maxStars = 5;
    this.target = 7;
    this.collected = 0;
    this.selectedPatches = []; // Lưu các luống người chơi đã chọn [patchA, patchB]
    this.isEvaluating = false;
    this.isInputLocked = false;
    this.hoveredPatchIndex = -1;

    // Vị trí Bác Gấu và Giỏ
    this.bearPos = { x: 640, y: 250 };
    this.basketPos = { x: 740, y: 270 };
    this.basketShake = 0;
    this.bearState = 'idle'; // 'idle' | 'cheer'

    // Chú thỏ trắng
    this.bunny = {
      x: 320,
      y: 630,
      startX: 320,
      startY: 630,
      targetX: 320,
      targetY: 630,
      state: 'idle', // 'idle' | 'hopping' | 'digging' | 'carrying' | 'cheer' | 'scratch'
      facingRight: true,
      hopCycle: 0,
      jumpY: 0,
      speed: 4.8,
      carryingCarrot: false,
      actionQueue: []
    };

    // Luống cà rốt (4 luống trên sân)
    this.patches = [];
    this.patchPositions = [
      { x: 195, y: 510 },
      { x: 485, y: 510 },
      { x: 775, y: 510 },
      { x: 1065, y: 510 }
    ];

    // Hệ thống hạt hiệu ứng (Confetti & Đất bay)
    this.particles = [];

    // Khởi tạo vòng chơi đầu tiên
    this.initLevel();
  }

  // ---------------- SINH CÂU ĐỐ TOÁN HỌC (TÁCH - GỘP SỐ) ----------------
  generateLevelData(targetMax = 10) {
    // 1. Chọn số đích ngẫu nhiên từ 3 đến targetMax (Phù hợp chương trình Lớp 1)
    const target = Math.floor(Math.random() * (targetMax - 2)) + 3;

    // 2. Tách target thành 2 phần: a và b (a, b >= 1)
    const a = Math.floor(Math.random() * (target - 1)) + 1;
    const b = target - a;

    // 3. Tạo 2 số gây nhiễu (distractors) hợp lý từ 1 đến targetMax
    const pools = [a, b];
    let attempts = 0;
    while (pools.length < 4 && attempts < 50) {
      attempts++;
      const dummy = Math.floor(Math.random() * (targetMax - 1)) + 1;
      // Tránh trùng số nếu có thể để tăng độ phong phú
      if (!pools.includes(dummy) && dummy !== target) {
        pools.push(dummy);
      }
    }
    // Nếu vẫn chưa đủ 4, điền số an toàn
    while (pools.length < 4) {
      pools.push((pools.length % (targetMax - 1)) + 1);
    }

    // 4. Xáo trộn vị trí 4 luống đất
    const shuffled = [...pools].sort(() => Math.random() - 0.5);

    return {
      target: target,
      correctPair: [a, b],
      options: shuffled
    };
  }

  // Khởi tạo vòng chơi mới
  initLevel() {
    const urlParams = new URLSearchParams(window.location.search);
    const diff = urlParams.get('diff') || localStorage.getItem('math_difficulty') || 'easy';
    let targetMax = 10;
    if (diff === 'medium') targetMax = 15;
    else if (diff === 'hard') targetMax = 20;
    else if (diff === 'challenge') targetMax = 30;

    const levelData = this.generateLevelData(targetMax);
    this.target = levelData.target;
    this.collected = 0;
    this.selectedPatches = [];
    this.isEvaluating = false;
    this.isInputLocked = false;
    this.bearState = 'idle';

    // Tạo các đối tượng luống cà rốt
    this.patches = levelData.options.map((count, index) => {
      const pos = this.patchPositions[index];
      return {
        id: index,
        x: pos.x,
        y: pos.y,
        count: count,
        harvested: false,
        selected: false,
        width: 190,
        height: 120
      };
    });

    // Cập nhật giao diện HUD
    this.updateHUD();

    // Thỏ trở về tư thế nghỉ ngơi
    this.bunny.state = 'idle';
    this.bunny.carryingCarrot = false;

    // Tự động phát âm thanh Bác Gấu đọc to yêu cầu bằng tiếng Việt
    setTimeout(() => {
      this.speakMission();
    }, 400);
  }

  // Bác Gấu đọc yêu cầu qua Web Speech API
  speakMission(onEnd = null) {
    const speakBtn = document.getElementById('btn-speak');
    if (speakBtn) speakBtn.classList.add('speaking');

    const text = `Bác Gấu cần ${this.target} củ cà rốt`;
    this.audio.speak(text, () => {
      if (speakBtn) speakBtn.classList.remove('speaking');
      if (onEnd) onEnd();
    });
  }

  // Cập nhật giao diện thanh HUD và bảng yêu cầu
  updateHUD() {
    const targetEl = document.getElementById('target-number');
    const collectedEl = document.getElementById('collected-val');
    const cartTargetEl = document.getElementById('cart-target-val');
    const starCountText = document.getElementById('star-count-text');
    const guideTarget = document.getElementById('guide-target');
    const guideText = document.getElementById('guide-text');
    const resetTurnBtn = document.getElementById('btn-reset-turn');

    if (targetEl) targetEl.textContent = this.target;
    if (collectedEl) collectedEl.textContent = this.collected;
    if (cartTargetEl) cartTargetEl.textContent = this.target;
    if (starCountText) starCountText.textContent = `${this.stars} / ${this.maxStars}`;
    if (guideTarget) guideTarget.textContent = this.target;

    // Cập nhật các ngôi sao nhỏ trên HUD
    const starTrack = document.getElementById('stars-track');
    if (starTrack) {
      const stars = starTrack.querySelectorAll('.mini-star');
      stars.forEach((s, idx) => {
        if (idx < this.stars) {
          s.classList.add('earned');
        } else {
          s.classList.remove('earned');
        }
      });
    }

    // Hiển thị nút "Chọn lại" nếu đã chọn 1 luống
    if (resetTurnBtn) {
      resetTurnBtn.style.display = this.selectedPatches.length === 1 && !this.isInputLocked ? 'flex' : 'none';
    }

    // Cập nhật nội dung nhắc nhở bé
    if (guideText) {
      if (this.selectedPatches.length === 0) {
        guideText.innerHTML = `🌟 Bé hãy bấm chọn <strong>2 luống cà rốt</strong> có tổng bằng <strong>${this.target}</strong> nhé!`;
      } else if (this.selectedPatches.length === 1) {
        const remaining = this.target - this.collected;
        guideText.innerHTML = `🧺 Đã có <strong>${this.collected}</strong> củ. Bé hãy chọn thêm 1 luống nữa (cần thêm <strong>${remaining > 0 ? remaining : '?'}</strong> củ)!`;
      }
    }
  }

  // ---------------- XỬ LÝ CLICK / TƯƠNG TÁC NGƯỜI CHƠI ----------------
  handlePointerDown(canvasX, canvasY) {
    if (this.isInputLocked || this.isEvaluating) return;

    // Kiểm tra xem bé click vào luống cà rốt nào
    for (let i = 0; i < this.patches.length; i++) {
      const patch = this.patches[i];
      if (patch.harvested || patch.selected) continue;

      // Vùng va chạm luống đất
      const dx = canvasX - patch.x;
      const dy = canvasY - (patch.y + 20);
      const isInside = (dx * dx) / (95 * 95) + (dy * dy) / (55 * 55) <= 1;

      // Hoặc click vào tấm biển gỗ
      const isInsideSign = Math.abs(canvasX - patch.x) <= 45 && canvasY >= patch.y + 40 && canvasY <= patch.y + 100;

      if (isInside || isInsideSign) {
        this.selectPatch(patch);
        break;
      }
    }
  }

  handlePointerMove(canvasX, canvasY) {
    let found = -1;
    for (let i = 0; i < this.patches.length; i++) {
      const patch = this.patches[i];
      if (patch.harvested || patch.selected) continue;
      const dx = canvasX - patch.x;
      const dy = canvasY - (patch.y + 20);
      const isInside = (dx * dx) / (95 * 95) + (dy * dy) / (55 * 55) <= 1;
      const isInsideSign = Math.abs(canvasX - patch.x) <= 45 && canvasY >= patch.y + 40 && canvasY <= patch.y + 100;
      if (isInside || isInsideSign) {
        found = i;
        break;
      }
    }
    this.hoveredPatchIndex = found;
    this.canvas.style.cursor = found !== -1 ? 'pointer' : 'default';
  }

  // Khi học sinh chọn một luống cà rốt
  selectPatch(patch) {
    this.audio.playClick();
    this.isInputLocked = true;
    patch.selected = true;
    this.selectedPatches.push(patch);

    // Kích hoạt chuỗi hành động của thỏ: Chạy tới luống -> Nhổ cà rốt -> Mang về giỏ Bác Gấu
    this.queueBunnyHarvest(patch, () => {
      this.collected += patch.count;
      patch.harvested = true;
      this.updateHUD();

      // Nếu đã chọn đủ 2 luống -> Tiến hành kiểm tra kết quả!
      if (this.selectedPatches.length === 2) {
        this.evaluateResult();
      } else {
        // Mới chọn 1 luống -> Cho phép bé chọn luống thứ 2
        this.isInputLocked = false;
        this.updateHUD();
      }
    });
  }

  // Chuỗi hành động thỏ chạy tới thu hoạch
  queueBunnyHarvest(patch, onComplete) {
    const bunny = this.bunny;

    // 1. Thỏ chạy đến bên cạnh luống cà rốt
    bunny.targetX = patch.x - 30;
    bunny.targetY = patch.y + 25;
    bunny.state = 'hopping';
    bunny.facingRight = bunny.targetX > bunny.x;

    bunny.onReachTarget = () => {
      // 2. Thỏ nhổ cà rốt (Đào bới & hiệu ứng đất văng)
      bunny.state = 'digging';
      this.audio.playPop();
      this.spawnDirtParticles(patch.x, patch.y + 15);

      setTimeout(() => {
        // 3. Thỏ ôm củ cà rốt chạy về phía giỏ của Bác Gấu
        bunny.carryingCarrot = true;
        bunny.state = 'hopping';
        bunny.targetX = this.basketPos.x - 45;
        bunny.targetY = this.basketPos.y + 35;
        bunny.facingRight = bunny.targetX > bunny.x;

        bunny.onReachTarget = () => {
          // 4. Bỏ cà rốt vào giỏ
          bunny.carryingCarrot = false;
          bunny.state = 'idle';
          this.audio.playPop();
          this.basketShake = 1;

          // Sau khi bỏ xong, thỏ bước nhẹ về vị trí chờ
          bunny.targetX = 640;
          bunny.targetY = 630;
          bunny.facingRight = false;
          bunny.state = 'hopping';

          bunny.onReachTarget = () => {
            bunny.state = 'idle';
            if (onComplete) onComplete();
          };
        };
      }, 500);
    };
  }

  // ---------------- ĐÁNH GIÁ KẾT QUẢ (EVALUATION) ----------------
  evaluateResult() {
    this.isEvaluating = true;
    this.isInputLocked = true;

    const patchA = this.selectedPatches[0];
    const patchB = this.selectedPatches[1];
    const sum = patchA.count + patchB.count;

    if (sum === this.target) {
      // ===== ĐÚNG (CORRECT) =====
      this.handleCorrectAnswer(patchA.count, patchB.count);
    } else {
      // ===== CHƯA ĐÚNG (INCORRECT / RETRY) =====
      this.handleIncorrectAnswer(patchA.count, patchB.count, sum);
    }
  }

  // Khi bé trả lời ĐÚNG
  handleCorrectAnswer(a, b) {
    // 1. Thỏ nhảy cẫng lên ăn mừng, Bác Gấu vẫy tay cười
    this.bunny.state = 'cheer';
    this.bearState = 'cheer';

    // 2. Âm thanh chuông vàng rộn rã & Pháo giấy bung nở
    this.audio.playSuccess();
    this.spawnConfetti(640, 360, 60);

    // 3. Hiển thị bảng công thức toán Tách - Gộp: a + b = Target
    const successBanner = document.getElementById('success-banner');
    const mathA = document.getElementById('math-a');
    const mathB = document.getElementById('math-b');
    const mathTarget = document.getElementById('math-target');

    if (mathA) mathA.textContent = a;
    if (mathB) mathB.textContent = b;
    if (mathTarget) mathTarget.textContent = this.target;
    if (successBanner) successBanner.classList.remove('hidden');

    // 4. Giọng đọc khen ngợi bé
    this.audio.speak(`Chính xác! ${a} cộng ${b} bằng ${this.target}. Bé giỏi quá!`);

    // 5. Cộng thêm 1 sao tiến trình
    this.stars++;
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'MATH_STAR_EARNED' }, '*');
    }
    setTimeout(() => {
      this.audio.playStar();
      this.updateHUD();
    }, 600);

    // 6. Sau 2.8 giây, kiểm tra chiến thắng hoặc chuyển câu tiếp theo
    setTimeout(() => {
      if (successBanner) successBanner.classList.add('hidden');

      if (this.stars >= this.maxStars) {
        // Bé đã hoàn thành 5 màn -> Hiện màn hình Cúp Chiến Thắng!
        this.showVictoryModal();
      } else {
        // Sang màn mới
        this.initLevel();
      }
    }, 2800);
  }

  // Khi bé chọn CHƯA ĐÚNG
  handleIncorrectAnswer(a, b, sum) {
    // 1. Thỏ gãi tai bối rối, giỏ lắc lư
    this.bunny.state = 'scratch';
    this.basketShake = 1;
    this.audio.playWrong();

    // 2. Hiển thị thông báo nhắc nhở nhẹ nhàng (không trừ điểm)
    const toast = document.getElementById('wrong-toast');
    const toastDetail = document.getElementById('wrong-detail');
    if (toastDetail) {
      if (sum < this.target) {
        toastDetail.textContent = `${a} + ${b} = ${sum} (vẫn còn thiếu). Bé hãy thử lại nhé!`;
      } else {
        toastDetail.textContent = `${a} + ${b} = ${sum} (nhiều hơn ${this.target} rồi). Bé hãy thử lại nhé!`;
      }
    }
    if (toast) toast.classList.remove('hidden');

    // Giọng nói động viên nhẹ nhàng
    this.audio.speak('Ồ, chưa đúng rồi, bé thử lại nhé!');

    // 3. Hoàn trả cà rốt về các luống ban đầu sau 1.8 giây
    setTimeout(() => {
      if (toast) toast.classList.add('hidden');

      // Khôi phục trạng thái các luống
      this.selectedPatches.forEach(p => {
        p.harvested = false;
        p.selected = false;
      });
      this.selectedPatches = [];
      this.collected = 0;
      this.bunny.state = 'idle';
      this.isEvaluating = false;
      this.isInputLocked = false;
      this.updateHUD();
    }, 2000);
  }

  // Nút "Chọn lại" khi bé mới chọn 1 luống mà muốn đổi ý
  resetCurrentTurn() {
    if (this.selectedPatches.length !== 1 || this.isInputLocked) return;
    this.audio.playClick();
    const p = this.selectedPatches[0];
    p.harvested = false;
    p.selected = false;
    this.selectedPatches = [];
    this.collected = 0;
    this.updateHUD();
  }

  // Màn hình Cúp Chiến Thắng
  showVictoryModal() {
    this.audio.playVictory();
    this.spawnConfetti(640, 360, 100);
    const modal = document.getElementById('victory-modal');
    if (modal) modal.classList.remove('hidden');

    this.audio.speak('Xuất sắc! Bé đã chiến thắng và nhận được Cúp Vàng!');

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'GAME_COMPLETE', correct: this.stars, total: this.maxStars }, '*');
    }
  }

  // Chơi lại từ đầu
  restartGame() {
    this.stars = 0;
    const modal = document.getElementById('victory-modal');
    if (modal) modal.classList.add('hidden');
    this.initLevel();
  }

  // ---------------- HIỆU ỨNG HẠT (PARTICLES) ----------------
  spawnDirtParticles(x, y) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color: Math.random() > 0.5 ? '#78350F' : '#451A03',
        type: 'dirt',
        rotation: 0,
        rotSpeed: 0,
        life: 1,
        decay: 0.04
      });
    }
  }

  spawnConfetti(x, y, count = 50) {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FBBF24'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 8 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.4 ? 'confetti' : 'star',
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        life: 1,
        decay: 0.015 + Math.random() * 0.01
      });
    }
  }

  // ---------------- CẬP NHẬT TRẠNG THÁI & HOẠT HÌNH (UPDATE LOOP) ----------------
  update(dt) {
    this.graphics.update(dt);

    // Cập nhật chú thỏ
    const bunny = this.bunny;
    if (bunny.state === 'hopping') {
      const dx = bunny.targetX - bunny.x;
      const dy = bunny.targetY - bunny.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 5) {
        bunny.x += (dx / dist) * bunny.speed;
        bunny.y += (dy / dist) * bunny.speed;
        bunny.hopCycle += 0.25;
        bunny.jumpY = Math.abs(Math.sin(bunny.hopCycle)) * 26; // Độ nảy bước nhảy
      } else {
        bunny.x = bunny.targetX;
        bunny.y = bunny.targetY;
        bunny.jumpY = 0;
        if (bunny.onReachTarget) {
          const cb = bunny.onReachTarget;
          bunny.onReachTarget = null;
          cb();
        }
      }
    } else if (bunny.state === 'cheer') {
      // Nhảy tưng tưng ăn mừng
      bunny.jumpY = Math.abs(Math.sin(this.graphics.time * 8)) * 30;
    } else {
      bunny.jumpY = 0;
    }

    // Giảm dần rung giỏ
    if (this.basketShake > 0) {
      this.basketShake -= dt * 2;
      if (this.basketShake < 0) this.basketShake = 0;
    }

    // Cập nhật hạt
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18; // Trọng lực nhẹ
      p.rotation += p.rotSpeed;
      p.life -= p.decay;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  // ---------------- VẼ TẤT CẢ LÊN CANVAS (RENDER) ----------------
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 1280, 720);

    // 1. Vẽ nền trời, đồi cỏ và hoa
    this.graphics.renderBackground();

    // 2. Vẽ Bác Gấu nông dân và Giỏ chứa cà rốt
    this.graphics.renderFarmerBear(this.bearPos.x, this.bearPos.y, this.bearState);
    this.graphics.renderBasket(this.basketPos.x, this.basketPos.y, this.collected, this.target, this.basketShake);

    // 3. Vẽ 4 luống cà rốt trên sân
    this.patches.forEach((patch, index) => {
      const isHovered = this.hoveredPatchIndex === index;
      this.graphics.renderCarrotPatch(patch, isHovered, patch.selected);
    });

    // 4. Vẽ chú thỏ trắng đáng yêu
    this.graphics.renderBunny(this.bunny);

    // 5. Vẽ hiệu ứng pháo giấy / đất bay
    this.graphics.renderParticles(this.particles);
  }
}
