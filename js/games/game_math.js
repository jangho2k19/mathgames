import { sound } from '../audio.js';
import { DIFFICULTY_LEVELS } from '../data.js';

export class GameMath {
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

    let num1 = 0, num2 = 0, isAdd = true, targetAnswer = 0;
    let equationStr = '';
    let visualCountersHtml = '';
    const diff = this.difficulty;

    if (diff === 'easy') {
      // Within 10 with visual helpers
      isAdd = Math.random() > 0.5;
      if (isAdd) {
        num1 = Math.floor(Math.random() * 7) + 1; // 1 to 7
        num2 = Math.floor(Math.random() * (10 - num1 + 1));
        targetAnswer = num1 + num2;
        equationStr = `${num1} + ${num2} = ?`;
      } else {
        num1 = Math.floor(Math.random() * 9) + 2; // 2 to 10
        num2 = Math.floor(Math.random() * (num1 + 1));
        targetAnswer = num1 - num2;
        equationStr = `${num1} - ${num2} = ?`;
      }

      visualCountersHtml = `
        <div class="visual-counters-bar">
          <span>🍎 x ${num1}</span>
          <span>${isAdd ? '➕' : '➖'}</span>
          <span>🍎 x ${num2}</span>
        </div>
      `;
    } else if (diff === 'medium') {
      // Within 20
      isAdd = Math.random() > 0.45;
      if (isAdd) {
        num1 = Math.floor(Math.random() * 11) + 4; // 4 to 14
        num2 = Math.floor(Math.random() * (20 - num1)) + 1;
        targetAnswer = num1 + num2;
        equationStr = `${num1} + ${num2} = ?`;
      } else {
        num1 = Math.floor(Math.random() * 10) + 11; // 11 to 20
        num2 = Math.floor(Math.random() * 10) + 1;
        targetAnswer = num1 - num2;
        equationStr = `${num1} - ${num2} = ?`;
      }
    } else if (diff === 'hard') {
      // Within 100 without regrouping
      isAdd = Math.random() > 0.5;
      const type = Math.random() > 0.4 ? 'twoPlusTwo' : 'tens';

      if (type === 'tens') {
        const t1 = (Math.floor(Math.random() * 5) + 2) * 10;
        const t2 = (Math.floor(Math.random() * 4) + 1) * 10;
        if (isAdd) {
          num1 = t1;
          num2 = t2;
          targetAnswer = num1 + num2;
          equationStr = `${num1} + ${num2} = ?`;
        } else {
          num1 = Math.max(t1, t2);
          num2 = Math.min(t1, t2);
          targetAnswer = num1 - num2;
          equationStr = `${num1} - ${num2} = ?`;
        }
      } else {
        const t1 = Math.floor(Math.random() * 4) + 1;
        const t2 = Math.floor(Math.random() * (8 - t1)) + 1;
        const u1 = Math.floor(Math.random() * 5);
        const u2 = Math.floor(Math.random() * (9 - u1));
        if (isAdd) {
          num1 = t1 * 10 + u1;
          num2 = t2 * 10 + u2;
          targetAnswer = num1 + num2;
          equationStr = `${num1} + ${num2} = ?`;
        } else {
          num1 = (t1 + t2) * 10 + (u1 + u2);
          num2 = t2 * 10 + u2;
          targetAnswer = num1 - num2;
          equationStr = `${num1} - ${num2} = ?`;
        }
      }
    } else {
      // challenge: 3 numbers OR missing number equation
      const challengeType = Math.random() > 0.5 ? 'threeNumbers' : 'missingNumber';
      if (challengeType === 'threeNumbers') {
        const a = Math.floor(Math.random() * 20) + 10;
        const b = Math.floor(Math.random() * 15) + 5;
        const c = Math.floor(Math.random() * 10) + 2;
        const isSecondAdd = Math.random() > 0.4;
        if (isSecondAdd) {
          targetAnswer = a + b + c;
          equationStr = `${a} + ${b} + ${c} = ?`;
        } else {
          targetAnswer = a + b - c;
          equationStr = `${a} + ${b} - ${c} = ?`;
        }
      } else {
        const isAddMissing = Math.random() > 0.5;
        if (isAddMissing) {
          const partA = Math.floor(Math.random() * 20) + 10;
          const partB = Math.floor(Math.random() * 25) + 15;
          const sum = partA + partB;
          const hideLeft = Math.random() > 0.5;
          if (hideLeft) {
            targetAnswer = partA;
            equationStr = `? + ${partB} = ${sum}`;
          } else {
            targetAnswer = partB;
            equationStr = `${partA} + ? = ${sum}`;
          }
        } else {
          const total = Math.floor(Math.random() * 35) + 30;
          const sub = Math.floor(Math.random() * 20) + 10;
          const rem = total - sub;
          const hideSub = Math.random() > 0.5;
          if (hideSub) {
            targetAnswer = sub;
            equationStr = `${total} - ? = ${rem}`;
          } else {
            targetAnswer = total;
            equationStr = `? - ${sub} = ${rem}`;
          }
        }
      }
    }

    // Generate 4 options
    const options = [targetAnswer];
    while (options.length < 4) {
      const delta = (Math.floor(Math.random() * 7) - 3) * (diff === 'hard' || diff === 'challenge' ? (Math.random() > 0.5 ? 10 : 1) : 1);
      const opt = Math.max(0, targetAnswer + delta);
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    const diffInfo = DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium;

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Khu Vườn Phép Tính</h2>
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
        <span class="prompt-icon">🍎</span>
        <span class="prompt-text">
          Bé hãy nhẩm tính và bấm chọn kết quả chính xác nhé!
          ${this.difficulty === 'challenge' ? '<span class="challenge-sparkle-tag">⚡ Toán tư duy nâng cao</span>' : ''}
        </span>
      </div>

      <div class="game-play-area">
        <div class="math-board">
          <span class="math-equation">${equationStr.replace('?', '<span class="math-question-mark" id="mathTarget">?</span>')}</span>
        </div>
        ${visualCountersHtml}
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" data-val="${opt}">${opt}</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetAnswer);
  }

  bindEvents(targetAnswer) {
    const choices = this.container.querySelectorAll('.choice-btn');
    const targetSpan = this.container.querySelector('#mathTarget');

    choices.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        if (val === targetAnswer) {
          sound.playCorrect();
          btn.classList.add('correct');
          if (targetSpan) {
            targetSpan.textContent = targetAnswer;
            targetSpan.style.background = '#4ade80';
            targetSpan.style.color = '#064e3b';
          }
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
