import { sound } from '../audio.js';
import { MIU_CHEERS, MIU_ENCOURAGE, DIFFICULTY_LEVELS } from '../data.js';

export class GameAdvFruit {
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
    const isAdd = Math.random() > 0.45;
    let n1, n2, targetAnswer, promptText, equationStr;
    const diff = this.difficulty;

    if (diff === 'challenge') {
      const isMultiStep = Math.random() > 0.4;
      if (isMultiStep) {
        n1 = Math.floor(Math.random() * 15) + 10;
        n2 = Math.floor(Math.random() * 10) + 5;
        const n3 = Math.floor(Math.random() * 8) + 2;
        targetAnswer = n1 + n2 - n3;
        promptText = `Trong vườn có ${n1} quả cam, hái thêm ${n2} quả, biếu bà ${n3} quả. Còn lại bao nhiêu quả?`;
        equationStr = `${n1} + ${n2} - ${n3} = ?`;
      } else {
        const total = Math.floor(Math.random() * 25) + 20;
        const sub = Math.floor(Math.random() * 15) + 5;
        targetAnswer = total - sub;
        promptText = `Bác gấu có ${total} quả dưa hấu, sau khi tặng các bạn thì còn lại ${sub} quả. Đã tặng mấy quả?`;
        equationStr = `${total} - ? = ${sub}`;
      }
    } else if (diff === 'hard' || this.scope === '100') {
      const tens1 = (Math.floor(Math.random() * 4) + 1) * 10;
      const tens2 = (Math.floor(Math.random() * 3) + 1) * 10;
      if (isAdd) {
        n1 = tens1;
        n2 = tens2;
        targetAnswer = n1 + n2;
        promptText = `Trong giỏ có ${n1} quả cam, thêm ${n2} quả nữa. Có tất cả mấy quả cam?`;
      } else {
        n1 = tens1 + tens2;
        n2 = tens2;
        targetAnswer = tens1;
        promptText = `Trên cây có ${n1} quả cam, rụng bớt ${n2} quả. Trên cây còn mấy quả cam?`;
      }
      equationStr = `${n1} ${isAdd ? '+' : '-'} ${n2} = ?`;
    } else if (diff === 'medium' || this.scope === '20') {
      if (isAdd) {
        n1 = Math.floor(Math.random() * 6) + 8; // 8 to 13
        n2 = Math.floor(Math.random() * 5) + 2; // 2 to 6
        targetAnswer = n1 + n2;
        promptText = `Có ${n1} quả táo, thêm ${n2} quả táo nữa. Hỏi có tất cả bao nhiêu quả?`;
      } else {
        n1 = Math.floor(Math.random() * 7) + 12; // 12 to 18
        n2 = Math.floor(Math.random() * 6) + 2; // 2 to 7
        targetAnswer = n1 - n2;
        promptText = `Có ${n1} quả táo, bạn ăn hết ${n2} quả. Hỏi còn lại bao nhiêu quả táo?`;
      }
      equationStr = `${n1} ${isAdd ? '+' : '-'} ${n2} = ?`;
    } else {
      // Scope 10
      if (isAdd) {
        n1 = Math.floor(Math.random() * 5) + 1; // 1 to 5
        n2 = Math.floor(Math.random() * (9 - n1)) + 1;
        targetAnswer = n1 + n2;
        promptText = `Trong giỏ có ${n1} quả táo đỏ, hái thêm ${n2} quả nữa. Có tất cả bao nhiêu quả?`;
      } else {
        n1 = Math.floor(Math.random() * 6) + 4; // 4 to 9
        n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
        targetAnswer = n1 - n2;
        promptText = `Trên cây có ${n1} quả táo, hái đi ${n2} quả. Trên cây còn lại bao nhiêu quả?`;
      }
      equationStr = `${n1} ${isAdd ? '+' : '-'} ${n2} = ?`;
    }

    equationStr = `${n1} ${isAdd ? '+' : '-'} ${n2} = ?`;

    // 4 options
    const options = [targetAnswer];
    while (options.length < 4) {
      const delta = Math.floor(Math.random() * 5) - 2;
      const opt = Math.max(0, targetAnswer + delta);
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    return {
      isAdd,
      n1,
      n2,
      targetAnswer,
      promptText,
      equationStr,
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

    const settings = JSON.parse(localStorage.getItem('adv_parent_settings') || '{"autoVoice":true}');
    if (settings.autoVoice) {
      sound.speakVietnamese(this.currentProblem.promptText);
    }
  }

  render() {
    const { isAdd, n1, n2, equationStr, promptText, options } = this.currentProblem;

    this.container.innerHTML = `
      <div class="adv-game-wrapper">
        <!-- Top Bar -->
        <div class="game-top-bar">
          <div class="game-header-info">
            <button class="btn-back" id="advExitBtn">🏝️ Về Bản Đồ</button>
            <div class="game-title-badge">
              <h2>Trạm 2: Hái Quả Cộng Trừ</h2>
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
            <span class="adv-sub-prompt">${equationStr}</span>
          </div>
        </div>

        <!-- Visual Tree & Fruit Basket Area -->
        <div class="adv-fruit-scene">
          <div class="adv-tree-wrapper">
            <div class="adv-tree-foliage">
              ${Array.from({ length: isAdd ? n2 : n1 }).map((_, i) => `
                <span class="adv-hanging-apple bounce-slow" style="animation-delay: ${i * 0.2}s;">🍎</span>
              `).join('')}
            </div>
            <div class="adv-tree-trunk"></div>
          </div>

          <div class="adv-basket-wrapper">
            <div class="adv-basket-icon">🧺 Giỏ Quả</div>
            <div class="adv-basket-fruits">
              ${Array.from({ length: isAdd ? n1 : n1 - n2 }).map(() => `
                <span class="adv-basket-apple">🍎</span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Hint Guidance -->
        <div id="advHintBox" class="adv-hint-box" style="display: none;"></div>

        <!-- Choice Buttons -->
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
    this.container.querySelector('#repeatSpeechBtn')?.addEventListener('click', () => {
      sound.speakVietnamese(this.currentProblem.promptText);
    });

    const choiceButtons = this.container.querySelectorAll('.adv-big-choice-btn');
    const { targetAnswer, isAdd, n1, n2 } = this.currentProblem;
    const hintBox = this.container.querySelector('#advHintBox');

    choiceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);

        if (val === targetAnswer) {
          sound.playCorrect();
          btn.classList.add('choice-correct');
          choiceButtons.forEach(b => b.disabled = true);

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
                <span>Gợi ý: ${isAdd ? `Bé hãy đếm gộp ${n1} quả trong giỏ cùng ${n2} quả trên cây nhé!` : `Lấy ${n1} quả bớt đi ${n2} quả thì còn bao nhiêu?`}</span>
              `;
            }
            sound.speakVietnamese(isAdd ? `Bé đếm gộp ${n1} quả và ${n2} quả lại xem nhé!` : `Từ ${n1} quả bớt đi ${n2} quả thì còn bao nhiêu bé nhỉ?`);
          } else if (this.wrongTries >= 3) {
            choiceButtons.forEach(b => {
              if (parseInt(b.dataset.val, 10) === targetAnswer) {
                b.classList.add('choice-highlight');
              }
            });
            if (hintBox) {
              hintBox.innerHTML = `
                <span style="font-size: 20px;">🎯</span>
                <span>Kết quả đúng là <b>${targetAnswer}</b>. Bé bấm vào số ${targetAnswer} nhé!</span>
              `;
            }
            sound.speakVietnamese(`Kết quả đúng là ${targetAnswer}! Bé bấm số ${targetAnswer} nha!`);
          }
        }
      });
    });
  }
}
