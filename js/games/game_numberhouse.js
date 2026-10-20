import { sound } from '../audio.js';
import { DIFFICULTY_LEVELS } from '../data.js';

export class GameNumberHouse {
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

    let total = 10;
    let partA = 5;
    let partB = 5;

    if (diff === 'easy') {
      total = Math.floor(Math.random() * 8) + 2; // 2 to 9
      partA = Math.floor(Math.random() * (total + 1));
      partB = total - partA;
    } else if (diff === 'medium') {
      total = Math.floor(Math.random() * 10) + 11; // 11 to 20
      partA = Math.floor(Math.random() * (total - 3)) + 2;
      partB = total - partA;
    } else if (diff === 'hard') {
      // Tens or 2 digits
      const isTens = Math.random() > 0.4;
      if (isTens) {
        total = (Math.floor(Math.random() * 7) + 3) * 10; // 30 to 90
        const tensA = (Math.floor(Math.random() * (total / 10 - 1)) + 1) * 10;
        partA = tensA;
        partB = total - partA;
      } else {
        const t = Math.floor(Math.random() * 7) + 2;
        const u = Math.floor(Math.random() * 9) + 1;
        total = t * 10 + u;
        partA = t * 10;
        partB = u;
      }
    } else {
      // challenge: 3 parts (a + b + c = total) OR tens-units missing
      const isThreeParts = Math.random() > 0.4;
      if (isThreeParts) {
        total = (Math.floor(Math.random() * 5) + 2) * 10; // 20, 30, 40, 50, 60
        partA = Math.floor(total / 3);
        const rem = total - partA;
        partB = Math.floor(rem / 2);
        const partC = rem - partB;
        return this.renderThreePartsQuestion(total, partA, partB, partC);
      } else {
        total = Math.floor(Math.random() * 70) + 20;
        partA = Math.floor(Math.random() * (total - 10)) + 5;
        partB = total - partA;
      }
    }

    // 0: find partB (Tách: Total gồm partA và mấy?)
    // 1: find total (Gộp: Gộp partA và partB được mấy?)
    const mode = Math.random() > 0.4 ? 'findPart' : 'findTotal';

    let promptText = '';
    let targetAnswer = 0;
    let roofHtml = '';
    let windowAHtml = '';
    let windowBHtml = '';

    if (mode === 'findPart') {
      promptText = `Số <b>${total}</b> gồm <b>${partA}</b> và mấy?`;
      targetAnswer = partB;
      roofHtml = `<div class="roof-number-badge">${total}</div>`;
      windowAHtml = `<div class="house-window">${partA}</div>`;
      windowBHtml = `<div class="house-window mystery" id="targetWindow">?</div>`;
    } else {
      promptText = `Gộp <b>${partA}</b> và <b>${partB}</b> được mấy?`;
      targetAnswer = total;
      roofHtml = `<div class="roof-number-badge mystery" id="targetWindow" style="background: #fde047;">?</div>`;
      windowAHtml = `<div class="house-window">${partA}</div>`;
      windowBHtml = `<div class="house-window">${partB}</div>`;
    }

    // Generate 4 distinct options
    const options = [targetAnswer];
    while (options.length < 4) {
      const delta = (Math.floor(Math.random() * 5) - 2) * (diff === 'hard' || diff === 'challenge' ? 10 : 1);
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
            <h2>Ngôi Nhà Tách - Gộp Số</h2>
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
        <span class="prompt-icon">🏠</span>
        <span class="prompt-text">${promptText}</span>
      </div>

      <div class="game-play-area">
        <div class="number-house">
          <div class="house-roof">
            ${roofHtml}
          </div>
          <div class="house-body">
            ${windowAHtml}
            ${windowBHtml}
          </div>
        </div>
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" data-val="${opt}">${opt}</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetAnswer);
  }

  renderThreePartsQuestion(total, partA, partB, partC) {
    const targetAnswer = partC;
    const promptText = `Số <b>${total}</b> gồm <b>${partA}</b>, <b>${partB}</b> và mấy?`;

    const options = [targetAnswer];
    while (options.length < 4) {
      const delta = Math.floor(Math.random() * 5) - 2;
      const opt = Math.max(0, targetAnswer + delta);
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    const diffInfo = DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.challenge;

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Ngôi Nhà Tách - Gộp Số</h2>
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
        <span class="prompt-icon">🏠</span>
        <span class="prompt-text">
          ${promptText}
          <span class="challenge-sparkle-tag">⚡ Tách gộp 3 số</span>
        </span>
      </div>

      <div class="game-play-area">
        <div class="number-house" style="width: 280px;">
          <div class="house-roof">
            <div class="roof-number-badge">${total}</div>
          </div>
          <div class="house-body" style="grid-template-columns: repeat(3, 1fr); gap: 8px;">
            <div class="house-window">${partA}</div>
            <div class="house-window">${partB}</div>
            <div class="house-window mystery" id="targetWindow">?</div>
          </div>
        </div>
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" data-val="${opt}">${opt}</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetAnswer);
  }

  bindEvents(targetAnswer) {
    const choices = this.container.querySelectorAll('.choice-btn');
    const targetWin = this.container.querySelector('#targetWindow');

    choices.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        if (val === targetAnswer) {
          sound.playCorrect();
          btn.classList.add('correct');
          if (targetWin) {
            targetWin.textContent = targetAnswer;
            targetWin.style.background = '#dcfce7';
            targetWin.style.color = '#15803d';
            targetWin.style.borderColor = '#16a34a';
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
