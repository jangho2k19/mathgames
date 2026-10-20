import { sound } from '../audio.js';
import { MIU_CHEERS, MIU_ENCOURAGE, DIFFICULTY_LEVELS } from '../data.js';

export class GameAdvBalloons {
  constructor(container, onComplete, onStarEarned, currentScope = '10', difficulty = 'medium') {
    this.container = container;
    this.onComplete = onComplete;
    this.onStarEarned = onStarEarned;
    this.scope = currentScope;
    this.difficulty = difficulty;
    this.currentQ = 0;
    this.totalQ = 5;
    this.correctCount = 0;
    this.wrongTries = 0;
  }

  start() {
    this.currentQ = 0;
    this.correctCount = 0;
    this.nextQuestion();
  }

  generateQuestion() {
    this.wrongTries = 0;
    const isAdd = Math.random() > 0.5;
    let n1, n2, targetAnswer, promptText, equationStr;
    const diff = this.difficulty;

    if (diff === 'challenge') {
      const isThree = Math.random() > 0.5;
      if (isThree) {
        n1 = Math.floor(Math.random() * 15) + 10;
        n2 = Math.floor(Math.random() * 10) + 5;
        const n3 = Math.floor(Math.random() * 8) + 2;
        targetAnswer = n1 + n2 - n3;
        equationStr = `${n1} + ${n2} - ${n3} = ?`;
        promptText = `Bé hãy bắt quả bóng mang kết quả: ${n1} cộng ${n2} trừ ${n3}!`;
      } else {
        const p1 = Math.floor(Math.random() * 20) + 15;
        const p2 = Math.floor(Math.random() * 15) + 8;
        const sum = p1 + p2;
        targetAnswer = p2;
        equationStr = `${p1} + ? = ${sum}`;
        promptText = `Bé hãy tìm số bí mật trong bóng: ${p1} cộng mấy bằng ${sum}?`;
      }
    } else if (diff === 'hard' || this.scope === '100') {
      const t1 = (Math.floor(Math.random() * 4) + 1) * 10;
      const t2 = (Math.floor(Math.random() * 3) + 1) * 10;
      if (isAdd) {
        n1 = t1;
        n2 = t2;
        targetAnswer = n1 + n2;
      } else {
        n1 = t1 + t2;
        n2 = t2;
        targetAnswer = t1;
      }
      equationStr = `${n1} ${isAdd ? '+' : '-'} ${n2} = ?`;
      promptText = `Bé hãy bắt quả bóng có đáp số của phép tính: ${n1} ${isAdd ? 'cộng' : 'trừ'} ${n2}!`;
    } else if (diff === 'medium' || this.scope === '20') {
      if (isAdd) {
        n1 = Math.floor(Math.random() * 6) + 6;
        n2 = Math.floor(Math.random() * 6) + 2;
        targetAnswer = n1 + n2;
      } else {
        n1 = Math.floor(Math.random() * 7) + 12;
        n2 = Math.floor(Math.random() * 6) + 2;
        targetAnswer = n1 - n2;
      }
      equationStr = `${n1} ${isAdd ? '+' : '-'} ${n2} = ?`;
      promptText = `Bé hãy bắt quả bóng có đáp số của phép tính: ${n1} ${isAdd ? 'cộng' : 'trừ'} ${n2}!`;
    } else {
      if (isAdd) {
        n1 = Math.floor(Math.random() * 5) + 1;
        n2 = Math.floor(Math.random() * (9 - n1)) + 1;
        targetAnswer = n1 + n2;
      } else {
        n1 = Math.floor(Math.random() * 6) + 4;
        n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
        targetAnswer = n1 - n2;
      }
      equationStr = `${n1} ${isAdd ? '+' : '-'} ${n2} = ?`;
      promptText = `Bé hãy bắt quả bóng có đáp số của phép tính: ${n1} ${isAdd ? 'cộng' : 'trừ'} ${n2}!`;
    }

    // 4 balloon colors and numbers
    const balloonColors = ['#f43f5e', '#38bdf8', '#fbbf24', '#4ade80', '#a855f7'];
    const options = [targetAnswer];
    while (options.length < 4) {
      const delta = Math.floor(Math.random() * 5) - 2;
      const opt = Math.max(0, targetAnswer + delta);
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    const balloons = options.map((val, idx) => ({
      val,
      color: balloonColors[idx % balloonColors.length]
    }));

    return {
      equationStr,
      targetAnswer,
      promptText,
      balloons
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

    const settings = JSON.parse(localStorage.getItem('adv_parent_settings') || '{"autoVoice":true}');
    if (settings.autoVoice) {
      sound.speakVietnamese(this.currentProblem.promptText);
    }
  }

  render() {
    const { equationStr, promptText, balloons } = this.currentProblem;

    this.container.innerHTML = `
      <div class="adv-game-wrapper">
        <!-- Top Bar -->
        <div class="game-top-bar">
          <div class="game-header-info">
            <button class="btn-back" id="advExitBtn">🏝️ Về Bản Đồ</button>
            <div class="game-title-badge">
              <h2>Trạm 3: Bắt Bóng Bay</h2>
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

        <!-- Prompt Card with Speaker -->
        <div class="adv-prompt-card">
          <button class="adv-speaker-btn" id="repeatSpeechBtn" title="Bấm để Miu Miu đọc lại">
            🔊
          </button>
          <div class="adv-prompt-text-group">
            <span class="adv-main-prompt">${promptText}</span>
            <span class="adv-sub-prompt" style="font-size: 28px; font-weight: 900; color: #0284c7;">${equationStr}</span>
          </div>
        </div>

        <!-- Floating Balloons Sky -->
        <div class="adv-balloons-sky">
          <div class="adv-sky-clouds">☁️ 🌈 ☁️</div>
          <div class="adv-balloons-container">
            ${balloons.map((b, i) => `
              <div class="adv-balloon-item bounce-slow" style="animation-delay: ${i * 0.4}s;" data-val="${b.val}">
                <div class="adv-balloon-body" style="background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8), ${b.color});">
                  ${b.val}
                </div>
                <div class="adv-balloon-string"></div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Hint Guidance -->
        <div id="advHintBox" class="adv-hint-box" style="display: none;"></div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelector('#repeatSpeechBtn')?.addEventListener('click', () => {
      sound.speakVietnamese(this.currentProblem.promptText);
    });

    const balloonElements = this.container.querySelectorAll('.adv-balloon-item');
    const { targetAnswer } = this.currentProblem;
    const hintBox = this.container.querySelector('#advHintBox');

    balloonElements.forEach(item => {
      item.addEventListener('click', () => {
        const val = parseInt(item.dataset.val, 10);

        if (val === targetAnswer) {
          sound.playBubblePop();
          sound.playCorrect();
          item.classList.add('adv-balloon-pop');

          balloonElements.forEach(b => b.style.pointerEvents = 'none');

          if (this.wrongTries === 0) {
            this.correctCount++;
          }
          this.onStarEarned();

          const cheer = MIU_CHEERS[Math.floor(Math.random() * MIU_CHEERS.length)];
          sound.speakVietnamese(cheer);

          setTimeout(() => {
            this.nextQuestion();
          }, 950);

        } else {
          this.wrongTries++;
          sound.playGentleRetry();
          item.style.animation = 'shakeWrong 0.5s ease-in-out';
          setTimeout(() => {
            item.style.animation = 'bounceSlow 2.5s ease-in-out infinite';
          }, 500);

          if (this.wrongTries === 1) {
            const enc = MIU_ENCOURAGE[Math.floor(Math.random() * MIU_ENCOURAGE.length)];
            sound.speakVietnamese(enc);
          } else if (this.wrongTries === 2) {
            if (hintBox) {
              hintBox.style.display = 'block';
              hintBox.innerHTML = `
                <span style="font-size: 20px;">💡</span>
                <span>Gợi ý: Bé tính nhẩm cẩn thận lại phép tính <b>${this.currentProblem.equationStr}</b> nhé!</span>
              `;
            }
            sound.speakVietnamese(`Gợi ý cho bé nè: bé tính lại xem ${this.currentProblem.equationStr} bằng mấy nhé!`);
          } else if (this.wrongTries >= 3) {
            balloonElements.forEach(b => {
              if (parseInt(b.dataset.val, 10) === targetAnswer) {
                b.querySelector('.adv-balloon-body').style.boxShadow = '0 0 25px #facc15, 0 0 40px #f59e0b';
              }
            });
            if (hintBox) {
              hintBox.innerHTML = `
                <span style="font-size: 20px;">🎯</span>
                <span>Đáp án đúng là quả bóng số <b>${targetAnswer}</b>!</span>
              `;
            }
            sound.speakVietnamese(`Quả bóng số ${targetAnswer} là đáp án đúng! Bé bấm quả bóng số ${targetAnswer} nha!`);
          }
        }
      });
    });
  }
}
