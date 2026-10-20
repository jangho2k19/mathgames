import { sound } from './audio.js';
import { getCurrentDifficulty, setDifficulty } from './data.js';

export class ParentZone {
  constructor(overlay, modalBody, onResetProgress, onSettingsChanged) {
    this.overlay = overlay;
    this.modalBody = modalBody;
    this.onResetProgress = onResetProgress;
    this.onSettingsChanged = onSettingsChanged;
    this.isUnlocked = false;
  }

  open() {
    this.isUnlocked = false;
    this.renderGate();
    this.overlay.classList.add('active');
  }

  close() {
    this.overlay.classList.remove('active');
  }

  renderGate() {
    // Math security question for adults
    const n1 = Math.floor(Math.random() * 4) + 6; // 6 to 9
    const n2 = Math.floor(Math.random() * 4) + 6; // 6 to 9
    const ans = n1 * n2;

    this.modalBody.innerHTML = `
      <div class="parent-gate-layout" style="text-align: center; padding: 12px;">
        <div style="font-size: 48px; margin-bottom: 8px;">🔐</div>
        <h2 style="font-size: 22px; color: #0f172a; margin-bottom: 6px;">Khu Vực Dành Riêng Cho Phụ Huynh</h2>
        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">
          Để bảo vệ trải nghiệm của bé, xin ba mẹ vui lòng giải phép tính sau:
        </p>

        <div style="background: #f1f5f9; border-radius: 16px; padding: 16px; font-size: 28px; font-weight: 900; color: #0284c7; margin-bottom: 16px;">
          ${n1} × ${n2} = ?
        </div>

        <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 16px;">
          <input type="number" id="parentGateInput" placeholder="Nhập đáp số..." 
                 style="font-size: 20px; font-weight: 700; text-align: center; padding: 10px 16px; border: 2px solid #cbd5e1; border-radius: 12px; width: 160px;">
          <button class="play-action-btn" id="parentGateSubmitBtn" style="font-size: 16px; padding: 10px 20px;">
            Mở Khóa 🔓
          </button>
        </div>
        <div id="parentGateError" style="color: #ef4444; font-size: 13px; font-weight: 700; height: 18px;"></div>
      </div>
    `;

    const input = this.modalBody.querySelector('#parentGateInput');
    const submitBtn = this.modalBody.querySelector('#parentGateSubmitBtn');
    const err = this.modalBody.querySelector('#parentGateError');

    const checkAns = () => {
      const val = parseInt(input.value.trim(), 10);
      if (val === ans) {
        sound.playCorrect();
        this.isUnlocked = true;
        this.renderDashboard();
      } else {
        sound.playWrong();
        if (err) err.textContent = 'Đáp số chưa đúng, xin thử lại!';
        input.value = '';
        input.focus();
      }
    };

    submitBtn?.addEventListener('click', checkAns);
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkAns();
    });
  }

  renderDashboard() {
    const stats = JSON.parse(localStorage.getItem('adv_learning_stats') || '{"totalQ":0,"correctFirst":0,"hintUsed":0}');
    const settings = JSON.parse(localStorage.getItem('adv_parent_settings') || '{"scope":"10","autoVoice":true}');

    const accuracy = stats.totalQ > 0 ? Math.round((stats.correctFirst / stats.totalQ) * 100) : 100;

    this.modalBody.innerHTML = `
      <div class="parent-dashboard-layout" style="text-align: left; padding: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
          <h2 style="font-size: 22px; color: #0284c7; margin: 0;">📊 Tiến Trình Học Tập Của Bé</h2>
          <span style="font-size: 12px; font-weight: 700; background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 20px;">✓ Đã xác thực</span>
        </div>

        <!-- Metric Cards -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
          <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 14px; padding: 12px; text-align: center;">
            <div style="font-size: 12px; color: #64748b; font-weight: 700;">Tổng số câu</div>
            <div style="font-size: 24px; font-weight: 900; color: #0f172a; margin-top: 4px;">${stats.totalQ}</div>
          </div>
          <div style="background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 14px; padding: 12px; text-align: center;">
            <div style="font-size: 12px; color: #166534; font-weight: 700;">Đúng lần đầu</div>
            <div style="font-size: 24px; font-weight: 900; color: #15803d; margin-top: 4px;">${stats.correctFirst}</div>
          </div>
          <div style="background: #eff6ff; border: 2px solid #bfdbfe; border-radius: 14px; padding: 12px; text-align: center;">
            <div style="font-size: 12px; color: #1e40af; font-weight: 700;">Tỉ lệ chính xác</div>
            <div style="font-size: 24px; font-weight: 900; color: #2563eb; margin-top: 4px;">${accuracy}%</div>
          </div>
        </div>

        <!-- Settings Group -->
        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 16px; margin-bottom: 20px;">
          <h3 style="font-size: 16px; color: #334155; margin-top: 0; margin-bottom: 12px;">⚙️ Tùy Chỉnh Cấp Độ Khó & Giọng Đọc</h3>
          
          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 14px; font-weight: 700; color: #475569; margin-bottom: 6px;">
              Cấp độ luyện tập cho bé:
            </label>
            <select id="diffSelect" style="font-size: 15px; font-weight: 700; padding: 10px 12px; border-radius: 10px; border: 2px solid #cbd5e1; width: 100%; background: white;">
              <option value="easy" ${getCurrentDifficulty() === 'easy' ? 'selected' : ''}>🌱 Dễ - Phạm vi 0 - 10 (Học kì 1 cơ bản)</option>
              <option value="medium" ${getCurrentDifficulty() === 'medium' ? 'selected' : ''}>⭐ Vừa - Phạm vi 0 - 20 (Chuẩn lớp 1)</option>
              <option value="hard" ${getCurrentDifficulty() === 'hard' ? 'selected' : ''}>🔥 Khó - Phạm vi 0 - 100 (Học kì 2 nâng cao)</option>
              <option value="challenge" ${getCurrentDifficulty() === 'challenge' ? 'selected' : ''}>⚡ Thử thách - Toán tư duy (3 số & điền số bí mật ?)</option>
            </select>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="autoVoiceCheck" ${settings.autoVoice ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
            <label for="autoVoiceCheck" style="font-size: 14px; font-weight: 700; color: #475569; cursor: pointer;">
              Tự động đọc to câu hỏi bằng tiếng Việt khi vào bài
            </label>
          </div>
        </div>

        <!-- Danger Zone -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px dashed #e2e8f0; padding-top: 14px;">
          <button id="resetProgressBtn" style="background: #fee2e2; border: 2px solid #fca5a5; color: #b91c1c; padding: 8px 14px; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer;">
            🗑️ Đặt Lại Tiến Độ
          </button>
          <button class="play-action-btn" id="saveParentSettingsBtn" style="font-size: 15px; padding: 8px 20px;">
            Lưu & Đóng
          </button>
        </div>
      </div>
    `;

    this.bindDashboardEvents();
  }

  bindDashboardEvents() {
    this.modalBody.querySelector('#saveParentSettingsBtn')?.addEventListener('click', () => {
      sound.playClick();
      const diff = this.modalBody.querySelector('#diffSelect')?.value || 'medium';
      const autoVoice = this.modalBody.querySelector('#autoVoiceCheck')?.checked ?? true;

      setDifficulty(diff);
      const parentSettings = JSON.parse(localStorage.getItem('adv_parent_settings') || '{}');
      parentSettings.autoVoice = autoVoice;
      localStorage.setItem('adv_parent_settings', JSON.stringify(parentSettings));

      if (this.onSettingsChanged) {
        this.onSettingsChanged(diff);
      }
      this.close();
    });

    this.modalBody.querySelector('#resetProgressBtn')?.addEventListener('click', () => {
      if (confirm('Ba mẹ có chắc muốn đặt lại toàn bộ tiến độ chơi và sao của bé không?')) {
        sound.playClick();
        localStorage.removeItem('math_stars');
        localStorage.removeItem('adv_unlocked_stations');
        localStorage.removeItem('adv_station_stars');
        localStorage.removeItem('adv_current_station');
        localStorage.removeItem('adv_learning_stats');
        localStorage.removeItem('adv_owned_wardrobe');
        localStorage.removeItem('adv_equipped_wardrobe');
        this.onResetProgress();
        this.close();
      }
    });
  }
}
