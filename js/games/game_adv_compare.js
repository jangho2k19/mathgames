import { sound } from '../audio.js';
import { MIU_CHEERS, MIU_ENCOURAGE, DIFFICULTY_LEVELS } from '../data.js';

export class GameAdvCompare {
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
    let n1, n2, targetSign, promptText;
    const diff = this.difficulty;

    if (diff === 'challenge') {
      const isExpression = Math.random() > 0.4;
      if (isExpression) {
        const a1 = Math.floor(Math.random() * 15) + 10;
        const a2 = Math.floor(Math.random() * 8) + 2;
        const isAdd = Math.random() > 0.3;
        const exprVal = isAdd ? a1 + a2 : a1 - a2;
        const numVal = exprVal + (Math.floor(Math.random() * 5) - 2);
        n1 = `${a1} ${isAdd ? '+' : '-'} ${a2}`;
        n2 = `${numVal}`;
        const v1 = exprVal;
        const v2 = numVal;
        if (v1 > v2) targetSign = '>';
        else if (v1 < v2) targetSign = '<';
        else targetSign = '=';
        promptText = `Bé hãy so sánh phép tính ${n1} với số ${n2} nhé!`;
        return { n1, n2, targetSign, promptText, signs: ['>', '=', '<'], v1, v2 };
      } else {
        const base = Math.floor(Math.random() * 70) + 20;
        n1 = base;
        n2 = base + (Math.floor(Math.random() * 5) - 2);
      }
    } else if (diff === 'hard' || this.scope === '100') {
      n1 = (Math.floor(Math.random() * 8) + 1) * 10;
      n2 = (Math.floor(Math.random() * 8) + 1) * 10;
    } else if (diff === 'medium' || this.scope === '20') {
      n1 = Math.floor(Math.random() * 16) + 3;
      n2 = Math.floor(Math.random() * 16) + 3;
    } else {
      n1 = Math.floor(Math.random() * 9) + 1;
      n2 = Math.floor(Math.random() * 9) + 1;
    }

    if (n1 > n2) {
      targetSign = '>';
      promptText = `Số ${n1} lớn hơn hay bé hơn số ${n2} bé nhỉ?`;
    } else if (n1 < n2) {
      targetSign = '<';
      promptText = `Số ${n1} lớn hơn hay bé hơn số ${n2} bé nhỉ?`;
    } else {
      targetSign = '=';
      promptText = `Hai số ${n1} và ${n2} có bằng nhau không bé nhỉ?`;
    }

    const signs = ['>', '=', '<'];

    return {
      n1,
      n2,
      targetSign,
      promptText,
      signs
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
    const { n1, n2, targetSign, promptText, signs } = this.currentProblem;

    this.container.innerHTML = `
      <div class="adv-game-wrapper">
        <!-- Top Bar -->
        <div class="game-top-bar">
          <div class="game-header-info">
            <button class="btn-back" id="advExitBtn">🏝️ Về Bản Đồ</button>
            <div class="game-title-badge">
              <h2>Trạm 4: Cá Lớn Nuốt Cá Bé (So Sánh)</h2>
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
            <span class="adv-sub-prompt">Miệng chú cá sẽ há to về bên có số lớn hơn nhé!</span>
          </div>
        </div>

        <!-- Ocean Chomping Arena -->
        <div class="adv-compare-ocean">
          <!-- Left Number Card & Fish Group -->
          <div class="adv-compare-card left-side">
            <div class="adv-compare-number">${n1}</div>
            <div class="adv-compare-fishes">
              ${Array.from({ length: Math.min(n1, 10) }).map(() => '<span>🐠</span>').join('')}
              ${n1 > 10 ? `<span style="font-size: 13px; font-weight:800; color:#0369a1;">+${n1 - 10}</span>` : ''}
            </div>
          </div>

          <!-- Hungry Chomping Fish Mascot In Center -->
          <div class="adv-chomping-fish" id="chompingFish">
            ${targetSign === '>' ? '🦈💨 (Há miệng sang Trái)' : targetSign === '<' ? '(Há miệng sang Phải) 💨🦈' : '🤝 Bằng nhau'}
          </div>

          <!-- Right Number Card & Fish Group -->
          <div class="adv-compare-card right-side">
            <div class="adv-compare-number">${n2}</div>
            <div class="adv-compare-fishes">
              ${Array.from({ length: Math.min(n2, 10) }).map(() => '<span>🐟</span>').join('')}
              ${n2 > 10 ? `<span style="font-size: 13px; font-weight:800; color:#0369a1;">+${n2 - 10}</span>` : ''}
            </div>
          </div>
        </div>

        <!-- Hint Guidance -->
        <div id="advHintBox" class="adv-hint-box" style="display: none;"></div>

        <!-- Big Sign Choices (>, =, <) -->
        <div class="adv-sign-choices-grid">
          ${signs.map(sign => `
            <button class="adv-sign-choice-btn" data-sign="${sign}">
              <span style="font-size: 42px;">${sign}</span>
              <span style="font-size: 14px; font-weight: 700; color: #64748b;">
                ${sign === '>' ? 'Lớn hơn' : sign === '<' ? 'Bé hơn' : 'Bằng nhau'}
              </span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelector('#repeatSpeechBtn')?.addEventListener('click', () => {
      sound.speakVietnamese(this.currentProblem.promptText);
    });

    const signButtons = this.container.querySelectorAll('.adv-sign-choice-btn');
    const { targetSign, n1, n2 } = this.currentProblem;
    const hintBox = this.container.querySelector('#advHintBox');

    signButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const chosenSign = btn.dataset.sign;

        if (chosenSign === targetSign) {
          sound.playCorrect();
          sound.playSplash();
          btn.classList.add('choice-correct');
          signButtons.forEach(b => b.disabled = true);

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
          btn.classList.add('choice-wrong');
          setTimeout(() => btn.classList.remove('choice-wrong'), 500);

          if (this.wrongTries === 1) {
            const enc = MIU_ENCOURAGE[Math.floor(Math.random() * MIU_ENCOURAGE.length)];
            sound.speakVietnamese(enc);
          } else if (this.wrongTries === 2) {
            if (hintBox) {
              hintBox.style.display = 'block';
              hintBox.innerHTML = `
                <span style="font-size: 20px;">💡</span>
                <span>Gợi ý: Bên trái có <b>${n1}</b> chú cá, bên phải có <b>${n2}</b> chú cá. Bên nào nhiều hơn nhỉ?</span>
              `;
            }
            sound.speakVietnamese(`Bên trái có ${n1} chú cá, bên phải có ${n2} chú cá. Số nào nhiều hơn hả bé?`);
          } else if (this.wrongTries >= 3) {
            signButtons.forEach(b => {
              if (b.dataset.sign === targetSign) {
                b.classList.add('choice-highlight');
              }
            });
            if (hintBox) {
              hintBox.innerHTML = `
                <span style="font-size: 20px;">🎯</span>
                <span>Dấu đúng là dấu <b>"${targetSign}"</b>! Bé bấm dấu ${targetSign} nhé!</span>
              `;
            }
            sound.speakVietnamese(`Dấu đúng là dấu ${targetSign}! Bé bấm dấu ${targetSign} nha!`);
          }
        }
      });
    });
  }
}
