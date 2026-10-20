import { sound } from '../audio.js';
import { MIU_CHEERS, MIU_ENCOURAGE, DIFFICULTY_LEVELS } from '../data.js';

export class GameAdvCount {
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
    this.itemsCounted = 0;
  }

  start() {
    this.currentQ = 0;
    this.correctCount = 0;
    this.nextQuestion();
  }

  generateQuestion() {
    this.wrongTries = 0;
    this.itemsCounted = 0;

    let targetCount;
    const diff = this.difficulty;
    if (diff === 'challenge') {
      targetCount = (Math.floor(Math.random() * 6) + 4) * 5; // 20 to 45 in groups of 5
    } else if (diff === 'hard' || this.scope === '100') {
      targetCount = (Math.floor(Math.random() * 5) + 3) * 5; // 15 to 35
    } else if (diff === 'medium' || this.scope === '20') {
      targetCount = Math.floor(Math.random() * 11) + 6; // 6 to 16
    } else {
      targetCount = Math.floor(Math.random() * 7) + 2; // 2 to 8
    }

    const items = ['🍎', '⭐', '🎈', '🐟', '🍦', '🍓', '🥕', '🌸'];
    const chosenItem = items[Math.floor(Math.random() * items.length)];

    const promptText = `Có bao nhiêu ${chosenItem} vậy bé nhỉ?`;

    // 4 big numeric choices
    const options = [targetCount];
    while (options.length < 4) {
      const delta = Math.floor(Math.random() * 5) - 2;
      const opt = Math.max(1, targetCount + delta);
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    return {
      targetCount,
      chosenItem,
      promptText,
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

    // Auto speech if enabled
    const settings = JSON.parse(localStorage.getItem('adv_parent_settings') || '{"autoVoice":true}');
    if (settings.autoVoice) {
      sound.speakVietnamese(this.currentProblem.promptText);
    }
  }

  render() {
    const { targetCount, chosenItem, promptText, options } = this.currentProblem;

    this.container.innerHTML = `
      <div class="adv-game-wrapper">
        <!-- Top Bar -->
        <div class="game-top-bar">
          <div class="game-header-info">
            <button class="btn-back" id="advExitBtn">🏝️ Về Bản Đồ</button>
            <div class="game-title-badge">
              <h2>Trạm 1: Đếm & Chọn Số</h2>
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

        <!-- Big Voice Speaker & Prompt Box -->
        <div class="adv-prompt-card">
          <button class="adv-speaker-btn" id="repeatSpeechBtn" title="Bấm để Miu Miu đọc lại">
            🔊
          </button>
          <div class="adv-prompt-text-group">
            <span class="adv-main-prompt">${promptText}</span>
            <span class="adv-sub-prompt">Bé hãy chạm vào từng hình để đếm nhé!</span>
          </div>
        </div>

        <!-- Interactive Item Counting Field -->
        <div class="adv-count-field" id="countField">
          ${Array.from({ length: targetCount }).map((_, i) => `
            <div class="adv-touch-item" data-index="${i + 1}">
              <span class="adv-item-icon">${chosenItem}</span>
              <span class="adv-item-number" id="itemNum_${i + 1}"></span>
            </div>
          `).join('')}
        </div>

        <!-- Hint Guidance Area -->
        <div id="advHintBox" class="adv-hint-box" style="display: none;"></div>

        <!-- Big Colorful Number Choices -->
        <div class="adv-choices-grid">
          ${options.map(opt => `
            <button class="adv-big-choice-btn" data-val="${opt}">
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const repeatBtn = this.container.querySelector('#repeatSpeechBtn');
    repeatBtn?.addEventListener('click', () => {
      sound.speakVietnamese(this.currentProblem.promptText);
    });

    // Touch items to count
    const touchItems = this.container.querySelectorAll('.adv-touch-item');
    touchItems.forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index, 10);
        this.itemsCounted = Math.max(this.itemsCounted, idx);
        sound.playNumberTick(idx);

        item.classList.add('counted-bounce');
        const numSpan = item.querySelector('.adv-item-number');
        if (numSpan) numSpan.textContent = idx;
      });
    });

    // Answer choices
    const choiceButtons = this.container.querySelectorAll('.adv-big-choice-btn');
    const { targetCount } = this.currentProblem;
    const hintBox = this.container.querySelector('#advHintBox');

    choiceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);

        if (val === targetCount) {
          // Correct
          sound.playCorrect();
          btn.classList.add('choice-correct');
          choiceButtons.forEach(b => b.disabled = true);

          if (this.wrongTries === 0) {
            this.correctCount++;
          }
          this.onStarEarned();

          // Mascot Cheer
          const cheer = MIU_CHEERS[Math.floor(Math.random() * MIU_CHEERS.length)];
          sound.speakVietnamese(cheer);

          setTimeout(() => {
            this.nextQuestion();
          }, 950);

        } else {
          // Wrong
          this.wrongTries++;
          sound.playGentleRetry();
          btn.classList.add('choice-wrong');
          setTimeout(() => btn.classList.remove('choice-wrong'), 500);

          if (this.wrongTries === 1) {
            const enc = MIU_ENCOURAGE[Math.floor(Math.random() * MIU_ENCOURAGE.length)];
            sound.speakVietnamese(enc);
          } else if (this.wrongTries === 2) {
            // Hint 2: Show dots and count labels
            if (hintBox) {
              hintBox.style.display = 'block';
              hintBox.innerHTML = `
                <span style="font-size: 20px;">💡</span>
                <span>Gợi ý: Bé chạm vào từng hình từ trái qua phải để đếm nhé!</span>
              `;
            }
            touchItems.forEach(item => {
              const idx = item.dataset.index;
              const numSpan = item.querySelector('.adv-item-number');
              if (numSpan) numSpan.textContent = idx;
              item.classList.add('counted-bounce');
            });
            sound.speakVietnamese('Gợi ý cho bé nè, bé hãy đếm theo các số hiện trên hình nhé!');
          } else if (this.wrongTries >= 3) {
            // Hint 3: Highlight correct answer
            choiceButtons.forEach(b => {
              if (parseInt(b.dataset.val, 10) === targetCount) {
                b.classList.add('choice-highlight');
              }
            });
            if (hintBox) {
              hintBox.innerHTML = `
                <span style="font-size: 20px;">🎯</span>
                <span>Đáp án đúng là <b>${targetCount}</b>. Bé bấm vào số ${targetCount} nhé!</span>
              `;
            }
            sound.speakVietnamese(`Đáp án đúng là ${targetCount}! Bé bấm vào số ${targetCount} nhé!`);
          }
        }
      });
    });
  }
}
