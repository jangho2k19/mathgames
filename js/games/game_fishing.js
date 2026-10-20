import { sound } from '../audio.js';
import { DIFFICULTY_LEVELS } from '../data.js';

export class GameFishing {
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

  generateQuestion() {
    let num1, num2, isAdd, targetAnswer;
    let equationStr = '';
    const diff = this.difficulty;

    if (diff === 'easy') {
      isAdd = Math.random() > 0.4;
      if (isAdd) {
        num1 = Math.floor(Math.random() * 6) + 1;
        num2 = Math.floor(Math.random() * (10 - num1 + 1));
        targetAnswer = num1 + num2;
      } else {
        num1 = Math.floor(Math.random() * 8) + 2;
        num2 = Math.floor(Math.random() * num1) + 1;
        targetAnswer = num1 - num2;
      }
      equationStr = `${num1} ${isAdd ? '+' : '-'} ${num2} = ?`;
    } else if (diff === 'medium') {
      isAdd = Math.random() > 0.45;
      if (isAdd) {
        num1 = Math.floor(Math.random() * 10) + 5;
        num2 = Math.floor(Math.random() * (20 - num1)) + 1;
        targetAnswer = num1 + num2;
      } else {
        num1 = Math.floor(Math.random() * 9) + 11;
        num2 = Math.floor(Math.random() * 10) + 1;
        targetAnswer = num1 - num2;
      }
      equationStr = `${num1} ${isAdd ? '+' : '-'} ${num2} = ?`;
    } else if (diff === 'hard') {
      isAdd = Math.random() > 0.5;
      const t1 = (Math.floor(Math.random() * 5) + 2) * 10;
      const unit = Math.floor(Math.random() * 8) + 1;
      if (isAdd) {
        num1 = t1;
        num2 = unit;
        targetAnswer = num1 + num2;
      } else {
        num1 = t1 + unit;
        num2 = unit;
        targetAnswer = t1;
      }
      equationStr = `${num1} ${isAdd ? '+' : '-'} ${num2} = ?`;
    } else {
      // challenge: 3 numbers or missing operand
      const isThreeNums = Math.random() > 0.5;
      if (isThreeNums) {
        const a = Math.floor(Math.random() * 15) + 10;
        const b = Math.floor(Math.random() * 10) + 5;
        const c = Math.floor(Math.random() * 8) + 2;
        targetAnswer = a + b - c;
        equationStr = `${a} + ${b} - ${c} = ?`;
      } else {
        const p1 = Math.floor(Math.random() * 20) + 15;
        const p2 = Math.floor(Math.random() * 15) + 10;
        const sum = p1 + p2;
        targetAnswer = p2;
        equationStr = `${p1} + ? = ${sum}`;
      }
    }

    const fishTypes = ['🐠', '🐟', '🐡', '🐬'];

    // 4 fish options
    const options = [targetAnswer];
    while (options.length < 4) {
      const delta = (Math.floor(Math.random() * 7) - 3) * (diff === 'hard' || diff === 'challenge' ? 10 : 1);
      const opt = Math.max(0, targetAnswer + delta);
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    const fishList = options.map((opt, i) => ({
      val: opt,
      icon: fishTypes[i % fishTypes.length]
    }));

    return {
      equationStr,
      targetAnswer,
      fishList
    };
  }

  nextQuestion() {
    if (this.currentQ >= this.totalQ) {
      this.onComplete(this.correctCount, this.totalQ);
      return;
    }

    this.currentQ++;
    this.currentProblem = this.generateQuestion();
    this.render();
  }

  render() {
    const { equationStr, fishList } = this.currentProblem;
    const diffInfo = DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium;

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>🎣 Câu Cá Đại Dương (Ocean Fishing)</h2>
            <span class="game-diff-badge diff-${this.difficulty}">
              ${diffInfo.icon} ${diffInfo.name}
            </span>
          </div>
        </div>
        <div class="game-progress-bar-wrap">
          <div class="progress-track">
            <div class="progress-fill" style="width: ${(this.currentQ / this.totalQ) * 100}%"></div>
          </div>
          <span class="question-counter">Lần câu ${this.currentQ}/${this.totalQ}</span>
        </div>
      </div>

      <div class="question-prompt-box">
        <span class="prompt-icon">🌊</span>
        <span class="prompt-text">
          Bé hãy quan sát đàn cá và bấm câu chú cá mang số thích hợp nhé!
          ${this.difficulty === 'challenge' ? '<span class="challenge-sparkle-tag">⚡ Đại dương sâu thẳm</span>' : ''}
        </span>
      </div>

      <div class="fishing-arena">
        <!-- Ocean Surface & Boat -->
        <div class="fishing-surface">
          <div class="fishing-boat">
            ⛵ <span style="font-size: 32px;">🤖🎣</span>
          </div>
        </div>

        <!-- Underwater Fish Swimmers -->
        <div class="fishing-sea-depths">
          ${fishList.map((fish, idx) => `
            <button class="swimming-fish-btn" data-val="${fish.val}" style="animation-delay: ${idx * 0.4}s;">
              <span style="font-size: 36px;">${fish.icon}</span>
              <span>${fish.val}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Equation Board -->
      <div class="math-board" style="margin-top: 18px;">
        <span class="math-equation" style="font-size: 36px;">
          ${equationStr.replace('?', '<span class="math-question-mark" id="fishingTargetVal">?</span>')}
        </span>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const fishButtons = this.container.querySelectorAll('.swimming-fish-btn');
    const { targetAnswer } = this.currentProblem;
    const targetSpan = this.container.querySelector('#fishingTargetVal');

    fishButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        if (val === targetAnswer) {
          sound.playSplash();
          sound.playCorrect();
          btn.classList.add('hooked');

          if (targetSpan) {
            targetSpan.textContent = targetAnswer;
            targetSpan.style.background = '#4ade80';
            targetSpan.style.color = '#064e3b';
          }

          fishButtons.forEach(b => b.disabled = true);
          this.correctCount++;
          this.onStarEarned();

          setTimeout(() => {
            this.nextQuestion();
          }, 950);
        } else {
          sound.playWrong();
          btn.style.animation = 'shakeWrong 0.5s ease-in-out';
          setTimeout(() => {
            btn.style.animation = 'fishSwimLeft 3s ease-in-out infinite alternate';
          }, 500);
        }
      });
    });
  }
}
