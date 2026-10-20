import { EMOJI_ITEMS, DIFFICULTY_LEVELS } from '../data.js';
import { sound } from '../audio.js';

export class GameCompare {
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
    const diff = this.difficulty;

    let leftVal = 0, rightVal = 0;
    let leftDisplay = '', rightDisplay = '';
    let showItems = false;
    const emoji = EMOJI_ITEMS[Math.floor(Math.random() * EMOJI_ITEMS.length)];

    if (diff === 'easy') {
      const max = 10;
      if (Math.random() < 0.25) {
        leftVal = Math.floor(Math.random() * (max + 1));
        rightVal = leftVal;
      } else {
        leftVal = Math.floor(Math.random() * (max + 1));
        rightVal = Math.floor(Math.random() * (max + 1));
        if (leftVal === rightVal) rightVal = (leftVal + 1) % (max + 1);
      }
      leftDisplay = `${leftVal}`;
      rightDisplay = `${rightVal}`;
      showItems = true;
    } else if (diff === 'medium') {
      const max = 20;
      if (Math.random() < 0.25) {
        leftVal = Math.floor(Math.random() * (max - 4)) + 5;
        rightVal = leftVal;
      } else {
        leftVal = Math.floor(Math.random() * (max - 4)) + 5;
        rightVal = Math.floor(Math.random() * (max - 4)) + 5;
        if (leftVal === rightVal) rightVal = (leftVal + 1) % (max + 1);
      }
      leftDisplay = `${leftVal}`;
      rightDisplay = `${rightVal}`;
      showItems = false;
    } else if (diff === 'hard') {
      const max = 99;
      if (Math.random() < 0.25) {
        leftVal = Math.floor(Math.random() * 80) + 15;
        rightVal = leftVal;
      } else {
        leftVal = Math.floor(Math.random() * 80) + 15;
        rightVal = Math.floor(Math.random() * 80) + 15;
        if (leftVal === rightVal) rightVal = (leftVal + 2) % 100;
      }
      leftDisplay = `${leftVal}`;
      rightDisplay = `${rightVal}`;
      showItems = false;
    } else {
      // challenge: Compare expressions! (e.g. 15 + 4 ... 20 or 30 + 20 ... 60 - 10)
      const isDualExpr = Math.random() > 0.4;
      const a1 = Math.floor(Math.random() * 15) + 10;
      const a2 = Math.floor(Math.random() * 10) + 2;
      const isAdd1 = Math.random() > 0.3;
      leftVal = isAdd1 ? a1 + a2 : a1 - a2;
      leftDisplay = `${a1} ${isAdd1 ? '+' : '-'} ${a2}`;

      if (isDualExpr) {
        const b1 = Math.floor(Math.random() * 15) + 10;
        const b2 = Math.floor(Math.random() * 10) + 2;
        const isAdd2 = Math.random() > 0.3;
        // 30% chance make them equal
        if (Math.random() < 0.3) {
          rightVal = leftVal;
          rightDisplay = `${leftVal - 5} + 5`;
        } else {
          rightVal = isAdd2 ? b1 + b2 : b1 - b2;
          rightDisplay = `${b1} ${isAdd2 ? '+' : '-'} ${b2}`;
        }
      } else {
        // Single expression vs number
        if (Math.random() < 0.3) {
          rightVal = leftVal;
        } else {
          const delta = (Math.floor(Math.random() * 5) - 2);
          rightVal = Math.max(1, leftVal + delta);
        }
        rightDisplay = `${rightVal}`;
      }
    }

    const correctSign = leftVal > rightVal ? '>' : leftVal < rightVal ? '<' : '=';

    // Seesaw tilt angle
    let plankRotation = 0;
    if (leftVal > rightVal) plankRotation = -10;
    else if (leftVal < rightVal) plankRotation = 10;

    const diffInfo = DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium;

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Bập Bênh So Sánh (&gt;, &lt;, =)</h2>
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
        <span class="prompt-icon">⚖️</span>
        <span class="prompt-text">
          Bé hãy chọn dấu thích hợp (<b>&gt;</b>, <b>&lt;</b>, hoặc <b>=</b>) vào ô vuông nhé!
          ${this.difficulty === 'challenge' ? '<span class="challenge-sparkle-tag">⚡ So sánh biểu thức</span>' : ''}
        </span>
      </div>

      <div class="game-play-area">
        <div class="seesaw-center-box" id="centerBox">?</div>

        <div class="seesaw-container">
          <div class="seesaw-plank" id="seesawPlank" style="transform: rotate(${plankRotation}deg);">
            <!-- Left Pan -->
            <div class="seesaw-pan">
              <span class="pan-value" style="font-size: ${leftDisplay.length > 3 ? '24px' : '36px'};">${leftDisplay}</span>
              ${showItems ? `<div class="pan-items-grid">${Array.from({ length: leftVal }).map(() => emoji).join('')}</div>` : ''}
            </div>

            <!-- Right Pan -->
            <div class="seesaw-pan">
              <span class="pan-value" style="font-size: ${rightDisplay.length > 3 ? '24px' : '36px'};">${rightDisplay}</span>
              ${showItems ? `<div class="pan-items-grid">${Array.from({ length: rightVal }).map(() => emoji).join('')}</div>` : ''}
            </div>
          </div>
          <div class="seesaw-fulcrum"></div>
        </div>
      </div>

      <div class="answer-choices-area" id="choicesArea">
        <button class="choice-btn" data-sign=">">&gt; (Lớn hơn)</button>
        <button class="choice-btn" data-sign="=">= (Bằng nhau)</button>
        <button class="choice-btn" data-sign="<">&lt; (Bé hơn)</button>
      </div>
    `;

    this.bindEvents(correctSign);
  }

  bindEvents(correctSign) {
    const choices = this.container.querySelectorAll('.choice-btn');
    const centerBox = this.container.querySelector('#centerBox');

    choices.forEach(btn => {
      btn.addEventListener('click', () => {
        const sign = btn.dataset.sign;
        if (sign === correctSign) {
          sound.playCorrect();
          btn.classList.add('correct');
          centerBox.textContent = correctSign;
          centerBox.style.color = '#10b981';
          centerBox.style.borderColor = '#10b981';
          centerBox.classList.add('correct-yay');
          
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
