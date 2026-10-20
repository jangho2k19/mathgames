import { sound } from '../audio.js';
import { DIFFICULTY_LEVELS } from '../data.js';

export class GameBubbles {
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
      // Within 10
      isAdd = Math.random() > 0.5;
      if (isAdd) {
        num1 = Math.floor(Math.random() * 6) + 1; // 1 to 6
        num2 = Math.floor(Math.random() * (10 - num1 + 1));
        targetAnswer = num1 + num2;
      } else {
        num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
        num2 = Math.floor(Math.random() * num1) + 1;
        targetAnswer = num1 - num2;
      }
      equationStr = `${num1} ${isAdd ? '+' : '-'} ${num2} = ?`;
    } else if (diff === 'medium') {
      // Within 20
      isAdd = Math.random() > 0.45;
      if (isAdd) {
        num1 = Math.floor(Math.random() * 10) + 5; // 5 to 14
        num2 = Math.floor(Math.random() * (20 - num1)) + 1;
        targetAnswer = num1 + num2;
      } else {
        num1 = Math.floor(Math.random() * 9) + 11; // 11 to 19
        num2 = Math.floor(Math.random() * (num1 - 2)) + 1;
        targetAnswer = num1 - num2;
      }
      equationStr = `${num1} ${isAdd ? '+' : '-'} ${num2} = ?`;
    } else if (diff === 'hard') {
      // Within 100
      isAdd = Math.random() > 0.5;
      const isTensOnly = Math.random() > 0.4;
      if (isTensOnly) {
        const t1 = (Math.floor(Math.random() * 5) + 2) * 10;
        const t2 = (Math.floor(Math.random() * 4) + 1) * 10;
        if (isAdd) {
          num1 = t1;
          num2 = t2;
          targetAnswer = num1 + num2;
        } else {
          num1 = Math.max(t1, t2);
          num2 = Math.min(t1, t2);
          targetAnswer = num1 - num2;
        }
      } else {
        const tens1 = Math.floor(Math.random() * 4) + 2;
        const tens2 = Math.floor(Math.random() * 3) + 1;
        const u1 = Math.floor(Math.random() * 5) + 1;
        const u2 = Math.floor(Math.random() * (9 - u1));
        if (isAdd) {
          num1 = tens1 * 10 + u1;
          num2 = tens2 * 10 + u2;
          targetAnswer = num1 + num2;
        } else {
          num1 = (tens1 + tens2) * 10 + (u1 + u2);
          num2 = tens2 * 10 + u2;
          targetAnswer = num1 - num2;
        }
      }
      equationStr = `${num1} ${isAdd ? '+' : '-'} ${num2} = ?`;
    } else {
      // challenge: 3 numbers OR missing number equation
      const challengeType = Math.random() > 0.5 ? 'threeNumbers' : 'missingNumber';
      if (challengeType === 'threeNumbers') {
        const a = Math.floor(Math.random() * 15) + 10;
        const b = Math.floor(Math.random() * 10) + 5;
        const c = Math.floor(Math.random() * 8) + 2;
        const op2Add = Math.random() > 0.4;
        if (op2Add) {
          targetAnswer = a + b + c;
          equationStr = `${a} + ${b} + ${c} = ?`;
        } else {
          targetAnswer = a + b - c;
          equationStr = `${a} + ${b} - ${c} = ?`;
        }
      } else {
        // Missing number e.g. ? + 15 = 45 or 50 - ? = 20
        const isAddMissing = Math.random() > 0.5;
        if (isAddMissing) {
          const partA = Math.floor(Math.random() * 15) + 8;
          const partB = Math.floor(Math.random() * 20) + 10;
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
          const total = Math.floor(Math.random() * 30) + 25;
          const sub = Math.floor(Math.random() * 15) + 5;
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

    // Number of bubble options: 4 normally, 5 for challenge
    const optionCount = diff === 'challenge' ? 5 : 4;
    const options = [targetAnswer];
    while (options.length < optionCount) {
      const delta = (Math.floor(Math.random() * 7) - 3) * (diff === 'hard' || diff === 'challenge' ? (Math.random() > 0.5 ? 10 : 1) : 1);
      const opt = Math.max(0, targetAnswer + delta);
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    return {
      equationStr,
      targetAnswer,
      options
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
    const { equationStr, options } = this.currentProblem;
    const diffInfo = DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium;
    const animDuration = this.difficulty === 'challenge' ? '2.1s' : this.difficulty === 'hard' ? '2.7s' : this.difficulty === 'easy' ? '4.2s' : '3.4s';

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>🫧 Vương Quốc Bong Bóng</h2>
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
        <span class="prompt-icon">🫧</span>
        <span class="prompt-text">
          Bé hãy bấm vào quả bong bóng mang đáp án chính xác để làm nổ nhé!
          ${this.difficulty === 'challenge' ? '<span class="challenge-sparkle-tag">⚡ Thử thách phản xạ nhanh</span>' : ''}
        </span>
      </div>

      <!-- Bubble Floating Arena -->
      <div class="bubbles-arena">
        <div class="bubble-floating-list">
          ${options.map((opt, idx) => `
            <div class="bubble-target-ball" data-val="${opt}" style="animation: bubbleFloat ${animDuration} ease-in-out infinite; animation-delay: ${idx * 0.35}s;">
              ${opt}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Equation Board -->
      <div class="math-board" style="margin-top: 20px;">
        <span class="math-equation" style="font-size: 34px;">
          ${equationStr.includes('?') ? equationStr.replace('?', '<span class="math-question-mark" id="bubbleTargetVal">?</span>') : equationStr}
        </span>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const bubbles = this.container.querySelectorAll('.bubble-target-ball');
    const { targetAnswer } = this.currentProblem;
    const targetSpan = this.container.querySelector('#bubbleTargetVal');

    bubbles.forEach(bubble => {
      bubble.addEventListener('click', () => {
        const val = parseInt(bubble.dataset.val, 10);
        if (val === targetAnswer) {
          sound.playBubblePop();
          sound.playCorrect();
          bubble.classList.add('popping');

          if (targetSpan) {
            targetSpan.textContent = targetAnswer;
            targetSpan.style.background = '#4ade80';
            targetSpan.style.color = '#064e3b';
          }

          bubbles.forEach(b => b.style.pointerEvents = 'none');
          this.correctCount++;
          this.onStarEarned();

          setTimeout(() => {
            this.nextQuestion();
          }, 850);
        } else {
          sound.playWrong();
          bubble.style.animation = 'shakeWrong 0.5s ease-in-out';
          const animDuration = this.difficulty === 'challenge' ? '2.1s' : this.difficulty === 'hard' ? '2.7s' : this.difficulty === 'easy' ? '4.2s' : '3.4s';
          setTimeout(() => {
            bubble.style.animation = `bubbleFloat ${animDuration} ease-in-out infinite`;
          }, 500);
        }
      });
    });
  }
}
