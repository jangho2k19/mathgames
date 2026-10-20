import { sound } from '../audio.js';
import { DIFFICULTY_LEVELS } from '../data.js';

export class GameMeasure {
  constructor(container, onComplete, onStarEarned, semester = 2, difficulty = 'medium') {
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
    const diff = this.difficulty;

    // Items to measure
    const items = [
      { name: 'Bút chì', icon: '✏️', color: '#f59e0b' },
      { name: 'Cục tẩy', icon: '🧼', color: '#ec4899' },
      { name: 'Bút màu', icon: '🖍️', color: '#10b981' },
      { name: 'Que kem', icon: '🍦', color: '#8b5cf6' },
      { name: 'Cái thìa', icon: '🥄', color: '#0284c7' }
    ];
    const chosen = items[Math.floor(Math.random() * items.length)];

    let targetCm = 5;
    let rulerMax = 12;
    let startCm = 0;
    let endCm = 5;
    let promptText = `Bé hãy nhìn thước kẻ và cho biết <b>${chosen.name}</b> dài bao nhiêu cm nhé!`;

    if (diff === 'easy') {
      targetCm = Math.floor(Math.random() * 5) + 2; // 2 to 6 cm
      startCm = 0;
      endCm = targetCm;
      rulerMax = 10;
    } else if (diff === 'medium') {
      targetCm = Math.floor(Math.random() * 7) + 3; // 3 to 9 cm
      startCm = 0;
      endCm = targetCm;
      rulerMax = 12;
    } else if (diff === 'hard') {
      targetCm = Math.floor(Math.random() * 8) + 5; // 5 to 12 cm
      startCm = 0;
      endCm = targetCm;
      rulerMax = 15;
    } else {
      // challenge: offset start (e.g. from 2cm to 8cm -> length = 6cm!)
      startCm = Math.floor(Math.random() * 3) + 2; // 2 to 4
      targetCm = Math.floor(Math.random() * 5) + 3; // 3 to 7
      endCm = startCm + targetCm;
      rulerMax = 15;
      promptText = `Vật bắt đầu từ vạch <b>${startCm} cm</b> đến vạch <b>${endCm} cm</b>. Hỏi <b>${chosen.name}</b> dài bao nhiêu cm?`;
    }

    // Generate 4 distinct options
    const options = [targetCm];
    while (options.length < 4) {
      const delta = Math.floor(Math.random() * 5) - 2;
      const opt = Math.max(1, Math.min(rulerMax, targetCm + delta));
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    // Calculate percentage width on ruler
    const leftOffsetPercent = (startCm / rulerMax) * 100;
    const itemWidthPercent = (targetCm / rulerMax) * 100;

    const diffInfo = DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium;

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Cây Thước Kì Diệu (Đo độ dài cm)</h2>
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
        <span class="prompt-icon">📏</span>
        <span class="prompt-text">
          ${promptText}
          ${this.difficulty === 'challenge' ? '<span class="challenge-sparkle-tag">⚡ Đo lệch vạch 0</span>' : ''}
        </span>
      </div>

      <div class="game-play-area">
        <div class="ruler-measurement-stage">
          <!-- Item to measure -->
          <div class="measured-item-wrap" style="padding-left: ${leftOffsetPercent}%;">
            <div class="measured-item-bar" style="width: ${itemWidthPercent}%; background: ${chosen.color};">
              <span class="measured-icon">${chosen.icon}</span>
              <span class="measured-label">${chosen.name}</span>
            </div>
          </div>

          <!-- Ruler Graphic -->
          <div class="wooden-ruler">
            <div class="ruler-ticks-track">
              ${Array.from({ length: rulerMax + 1 }).map((_, i) => `
                <div class="ruler-cm-tick ${i === startCm || i === endCm ? 'highlight-tick' : ''}">
                  <span class="tick-line"></span>
                  <span class="tick-num">${i}</span>
                </div>
              `).join('')}
            </div>
            <span class="ruler-unit">cm</span>
          </div>
        </div>
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" data-val="${opt}">${opt} cm</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetCm);
  }

  bindEvents(targetCm) {
    const choices = this.container.querySelectorAll('.choice-btn');

    choices.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        if (val === targetCm) {
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
