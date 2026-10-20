import { SHAPES_DATA, DIFFICULTY_LEVELS } from '../data.js';
import { sound } from '../audio.js';

export class GameShapes {
  constructor(container, onComplete, onStarEarned, semester = 1, difficulty = 'medium') {
    this.container = container;
    this.onComplete = onComplete;
    this.onStarEarned = onStarEarned;
    this.semester = semester;
    this.difficulty = difficulty;
    this.currentQ = 0;
    this.totalQ = 5;
    this.correctCount = 0;
  }

  start() {
    this.currentQ = 0;
    this.correctCount = 0;
    this.nextQuestion();
  }

  nextQuestion() {
    if (this.currentQ >= this.totalQ) {
      this.onComplete(this.correctCount, this.totalQ);
      return;
    }

    this.currentQ++;

    // 60% shape recognition, 40% spatial orientation
    const isSpatial = Math.random() > 0.6;

    if (isSpatial) {
      this.renderSpatialQuestion();
    } else {
      this.renderShapeIdentifyQuestion();
    }
  }

  renderShapeIdentifyQuestion() {
    const availableShapes = this.difficulty === 'easy'
      ? SHAPES_DATA.filter(s => ['circle', 'square', 'triangle', 'rectangle'].includes(s.id))
      : SHAPES_DATA;
    const targetShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];

    // Generate 4 options (names of shapes)
    const options = [targetShape.name];
    const otherShapes = availableShapes.filter(s => s.id !== targetShape.id);
    otherShapes.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) {
      if (otherShapes[i]) options.push(otherShapes[i].name);
    }
    options.sort(() => Math.random() - 0.5);

    const diffInfo = DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium;

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Thợ Xây Hình Khối (Nhận diện hình)</h2>
            <span class="game-diff-badge diff-${this.difficulty}">
              ${diffInfo.icon} ${diffInfo.name}
            </span>
          </div>
        </div>
        <div class="game-progress-bar-wrap">
          <div class="progress-track">
            <div class="progress-fill" style="width: ${(this.currentQ / this.totalQ) * 100}%"></div>
          </div>
          <span class="question-counter">Câu ${this.currentQ}/${this.totalQ}</span>
        </div>
      </div>

      <div class="question-prompt-box">
        <span class="prompt-icon">🔷</span>
        <span class="prompt-text">Hình bên dưới là hình gì nào?</span>
      </div>

      <div class="game-play-area">
        <div class="shapes-display-box">
          <div class="target-shape-svg">${targetShape.svg}</div>
        </div>
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" style="min-width: 170px; font-size: 20px;" data-val="${opt}">${opt}</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetShape.name);
  }

  renderSpatialQuestion() {
    // Spatial orientations: Trên - Dưới or Trái - Phải (Bài 15)
    const type = Math.random() > 0.5 ? 'upDown' : 'leftRight';
    let promptText = '';
    let targetAnswer = '';
    let displayHtml = '';
    let options = [];

    if (type === 'upDown') {
      const topEmoji = '⭐';
      const bottomEmoji = '🎁';
      const askTop = Math.random() > 0.5;

      if (askTop) {
        promptText = `Vật phẩm nào đang ở <b>Ở TRÊN</b>?`;
        targetAnswer = 'Ngôi sao ⭐';
      } else {
        promptText = `Vật phẩm nào đang ở <b>Ở DƯỚI</b>?`;
        targetAnswer = 'Hộp quà 🎁';
      }

      displayHtml = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 30px; font-size: 56px;">
          <div class="pop-in" style="background: #e0f2fe; padding: 12px 30px; border-radius: 20px; border: 3px dashed #38bdf8;">${topEmoji}</div>
          <div class="pop-in" style="background: #fef3c7; padding: 12px 30px; border-radius: 20px; border: 3px dashed #f59e0b;">${bottomEmoji}</div>
        </div>
      `;

      options = ['Ngôi sao ⭐', 'Hộp quà 🎁'];
    } else {
      const leftEmoji = '🚗';
      const rightEmoji = '✈️';
      const askLeft = Math.random() > 0.5;

      if (askLeft) {
        promptText = `Phương tiện nào đang ở <b>BÊN TRÁI</b>?`;
        targetAnswer = 'Ô tô 🚗';
      } else {
        promptText = `Phương tiện nào đang ở <b>BÊN PHẢI</b>?`;
        targetAnswer = 'Máy bay ✈️';
      }

      displayHtml = `
        <div style="display: flex; align-items: center; gap: 50px; font-size: 56px;">
          <div class="pop-in" style="background: #fee2e2; padding: 16px 28px; border-radius: 20px; border: 3px dashed #f87171;">
            ${leftEmoji}
            <div style="font-size: 14px; font-weight: 800; color: #b91c1c; text-align: center; margin-top: 4px;">Bên Trái</div>
          </div>
          <div class="pop-in" style="background: #dbeafe; padding: 16px 28px; border-radius: 20px; border: 3px dashed #60a5fa;">
            ${rightEmoji}
            <div style="font-size: 14px; font-weight: 800; color: #1d4ed8; text-align: center; margin-top: 4px;">Bên Phải</div>
          </div>
        </div>
      `;

      options = ['Ô tô 🚗', 'Máy bay ✈️'];
    }

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Thợ Xây Hình Khối (Vị trí trong không gian)</h2>
            <span class="game-diff-badge diff-${this.difficulty}">
              ${(DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium).icon} ${(DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium).name}
            </span>
          </div>
        </div>
        <div class="game-progress-bar-wrap">
          <div class="progress-track">
            <div class="progress-fill" style="width: ${(this.currentQ / this.totalQ) * 100}%"></div>
          </div>
          <span class="question-counter">Câu ${this.currentQ}/${this.totalQ}</span>
        </div>
      </div>

      <div class="question-prompt-box orange">
        <span class="prompt-icon">🧭</span>
        <span class="prompt-text">${promptText}</span>
      </div>

      <div class="game-play-area">
        ${displayHtml}
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" style="min-width: 170px; font-size: 22px;" data-val="${opt}">${opt}</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetAnswer);
  }

  bindEvents(targetAnswer) {
    const choices = this.container.querySelectorAll('.choice-btn');

    choices.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        if (val === targetAnswer) {
          sound.playCorrect();
          btn.classList.add('correct');
          this.correctCount++;
          this.onStarEarned();
          choices.forEach(b => b.disabled = true);
          setTimeout(() => this.nextQuestion(), 900);
        } else {
          sound.playWrong();
          btn.classList.add('wrong');
          setTimeout(() => btn.classList.remove('wrong'), 500);
        }
      });
    });
  }
}
