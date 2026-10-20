import { EMOJI_ITEMS, DIFFICULTY_LEVELS } from '../data.js';
import { sound } from '../audio.js';

export class GameCount {
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

    if (diff === 'challenge') {
      this.renderSequenceQuestion();
    } else if (diff === 'hard') {
      this.renderTensQuestion();
    } else {
      this.renderCountingQuestion();
    }
  }

  renderCountingQuestion() {
    const diff = this.difficulty;
    const maxCount = diff === 'easy' ? 10 : 20;
    const minCount = diff === 'easy' ? 1 : 8;
    const targetCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    const emoji = EMOJI_ITEMS[Math.floor(Math.random() * EMOJI_ITEMS.length)];

    // Generate 4 distinct options including targetCount
    const options = [targetCount];
    while (options.length < 4) {
      const delta = Math.floor(Math.random() * 7) - 3;
      const opt = Math.max(1, Math.min(maxCount, targetCount + delta));
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    const diffInfo = DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium;

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Đếm Nhanh Cùng Robot</h2>
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
        <span class="prompt-icon">👀</span>
        <span class="prompt-text">Bé hãy đếm xem có bao nhiêu ${emoji} nhé?</span>
      </div>

      <div class="game-play-area">
        <div class="count-items-grid" id="itemsGrid">
          ${Array.from({ length: targetCount }).map((_, i) => 
            `<span class="count-item" data-idx="${i + 1}">${emoji}</span>`
          ).join('')}
        </div>
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" data-val="${opt}">${opt}</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetCount);
  }

  renderTensQuestion() {
    // Grade 1 Semester 2: Chục và đơn vị
    const tens = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const units = Math.floor(Math.random() * 10);   // 0 to 9
    const number = tens * 10 + units;

    const askType = Math.random() > 0.5 ? 'findNumber' : 'findTensUnits';

    let promptText = '';
    let targetAnswer = '';
    let options = [];

    if (askType === 'findNumber') {
      promptText = `Số gồm <b>${tens} chục</b> và <b>${units} đơn vị</b> là số mấy?`;
      targetAnswer = `${number}`;
      options = [targetAnswer];
      while (options.length < 4) {
        const dummy = Math.floor(Math.random() * 80) + 15;
        if (!options.includes(`${dummy}`)) options.push(`${dummy}`);
      }
    } else {
      promptText = `Số <b>${number}</b> gồm mấy chục và mấy đơn vị?`;
      targetAnswer = `${tens} chục và ${units} đơn vị`;
      options = [
        targetAnswer,
        `${units} chục và ${tens} đơn vị`,
        `${Math.min(9, tens + 1)} chục và ${units} đơn vị`,
        `${tens} chục và ${Math.max(0, units - 1)} đơn vị`
      ];
      options = [...new Set(options)];
      while (options.length < 4) {
        options.push(`${Math.floor(Math.random() * 9) + 1} chục và ${Math.floor(Math.random() * 10)} đơn vị`);
        options = [...new Set(options)];
      }
    }

    options.sort(() => Math.random() - 0.5);
    const diffInfo = DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium;

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Đếm Nhanh Cùng Robot (Chục & Đơn vị)</h2>
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

      <div class="question-prompt-box orange">
        <span class="prompt-icon">💡</span>
        <span class="prompt-text">${promptText}</span>
      </div>

      <div class="game-play-area">
        <div style="font-size: 72px; font-weight: 900; color: #ea580c; background: #fff7ed; padding: 20px 40px; border-radius: 24px; border: 3px dashed #fdba74;">
          ${number}
        </div>
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" style="min-width: 140px; font-size: 18px;" data-val="${opt}">${opt}</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetAnswer);
  }

  renderSequenceQuestion() {
    // Challenge mode: Counting in steps (by 2, 5, or 10)
    const step = [2, 5, 10][Math.floor(Math.random() * 3)];
    const start = step === 10 ? 10 : step === 5 ? (Math.random() > 0.5 ? 5 : 10) : 2;
    const len = 5;
    const seq = [];
    for (let i = 0; i < len; i++) {
      seq.push(start + i * step);
    }
    const hideIndex = Math.floor(Math.random() * (len - 1)) + 1; // 1 to 4
    const targetAnswer = seq[hideIndex];

    const displaySeq = seq.map((val, idx) => idx === hideIndex ? '?' : val);

    const options = [targetAnswer];
    while (options.length < 4) {
      const delta = (Math.floor(Math.random() * 5) - 2) * step;
      const opt = Math.max(step, targetAnswer + delta);
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    const diffInfo = DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.challenge;

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Đếm Nhanh Cùng Robot</h2>
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
        <span class="prompt-icon">⚡</span>
        <span class="prompt-text">
          Bé hãy tìm số còn thiếu trong dãy số đếm bước <b>+${step}</b> này nhé!
          <span class="challenge-sparkle-tag">⚡ Dãy số quy luật</span>
        </span>
      </div>

      <div class="game-play-area">
        <div style="display: flex; gap: 14px; align-items: center; justify-content: center; flex-wrap: wrap;">
          ${displaySeq.map(item => item === '?'
            ? '<span class="mystery-number-box">?</span>'
            : `<span style="font-size: 32px; font-weight: 900; background: #e0f2fe; color: #0369a1; padding: 12px 20px; border-radius: 16px; border: 2px solid #7dd3fc;">${item}</span>`
          ).join('')}
        </div>
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" data-val="${opt}">${opt}</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetAnswer);
  }

  bindEvents(targetAnswer) {
    this.container.querySelectorAll('.count-item').forEach(item => {
      item.addEventListener('click', () => {
        sound.playClick();
        item.style.transform = 'scale(1.3) rotate(-10deg)';
        setTimeout(() => {
          item.style.transform = '';
        }, 300);
      });
    });

    const choices = this.container.querySelectorAll('.choice-btn');
    choices.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        if (`${val}` === `${targetAnswer}`) {
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
