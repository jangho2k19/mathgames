import { DAYS_OF_WEEK, DIFFICULTY_LEVELS } from '../data.js';
import { sound } from '../audio.js';

export class GameClock {
  constructor(container, onComplete, onStarEarned, semester = 2, difficulty = 'medium') {
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

    // 60% clock questions, 40% days of the week questions
    const isCalendar = Math.random() > 0.6;

    if (isCalendar) {
      this.renderCalendarQuestion();
    } else {
      this.renderClockQuestion();
    }
  }

  renderClockQuestion() {
    // Exact hours 1 to 12
    const targetHour = Math.floor(Math.random() * 12) + 1;
    const hourAngle = (targetHour % 12) * 30; // 360 / 12 = 30 deg per hour
    const minuteAngle = 0; // Exactly on 12

    // Numbers positions on 240px circle (radius = 95px from center 120,120)
    const numbersHtml = Array.from({ length: 12 }).map((_, i) => {
      const num = i + 1;
      const angle = (num * 30 - 90) * (Math.PI / 180);
      const x = 120 + 82 * Math.cos(angle) - 12;
      const y = 120 + 82 * Math.sin(angle) - 12;
      return `<div class="clock-number" style="left: ${x}px; top: ${y}px; width: 24px; height: 24px;">${num}</div>`;
    }).join('');

    const targetAnswer = `${targetHour} giờ đúng`;

    // Generate 4 distinct options
    const options = [targetAnswer];
    while (options.length < 4) {
      const h = Math.floor(Math.random() * 12) + 1;
      const opt = `${h} giờ đúng`;
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Bác Đồng Hồ & Lịch Vui (Xem giờ)</h2>
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

      <div class="question-prompt-box">
        <span class="prompt-icon">⏰</span>
        <span class="prompt-text">Đồng hồ bên dưới đang chỉ mấy giờ đúng?</span>
      </div>

      <div class="game-play-area">
        <div class="clock-container">
          ${numbersHtml}
          <!-- Center Pin -->
          <div class="clock-pin"></div>
          <!-- Hour Hand (Red) -->
          <div class="clock-hand-hour" style="transform: rotate(${hourAngle}deg);"></div>
          <!-- Minute Hand (Blue) -->
          <div class="clock-hand-minute" style="transform: rotate(${minuteAngle}deg);"></div>
        </div>
        <span style="font-size: 14px; font-weight: 700; color: #64748b;">(Kim ngắn màu đỏ chỉ giờ, Kim dài màu xanh chỉ phút)</span>
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" style="min-width: 150px; font-size: 20px;" data-val="${opt}">${opt}</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetAnswer);
  }

  renderCalendarQuestion() {
    // Pick a day of the week
    const dayIdx = Math.floor(Math.random() * 6); // 0 to 5
    const today = DAYS_OF_WEEK[dayIdx];
    const tomorrow = DAYS_OF_WEEK[(dayIdx + 1) % 7];

    const promptText = `Hôm nay là <b>${today}</b>. Vậy ngày mai là thứ mấy?`;
    const targetAnswer = tomorrow;

    // Generate 4 options from DAYS_OF_WEEK
    const options = [targetAnswer];
    while (options.length < 4) {
      const d = DAYS_OF_WEEK[Math.floor(Math.random() * DAYS_OF_WEEK.length)];
      if (!options.includes(d)) options.push(d);
    }
    options.sort(() => Math.random() - 0.5);

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Bác Đồng Hồ & Lịch Vui (Lịch tuần)</h2>
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

      <div class="question-prompt-box orange">
        <span class="prompt-icon">📅</span>
        <span class="prompt-text">${promptText}</span>
      </div>

      <div class="game-play-area">
        <div style="background: #faf5ff; border: 3px dashed #c084fc; border-radius: 24px; padding: 24px 36px; text-align: center;">
          <div style="font-size: 52px; margin-bottom: 8px;">🗓️</div>
          <div style="font-size: 28px; font-weight: 900; color: #7e22ce;">Hôm nay: ${today}</div>
          <div style="font-size: 22px; font-weight: 700; color: #a855f7; margin-top: 6px;">Ngày mai: <span style="background: #f3e8ff; padding: 2px 14px; border-radius: 12px; border: 2px solid #c084fc;">?</span></div>
        </div>
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" style="min-width: 140px; font-size: 20px;" data-val="${opt}">${opt}</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetAnswer);
  }

  bindEvents(targetAnswer) {
    const choices = this.container.querySelectorAll('.choice-btn');

    choices.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        if (val === targetAnswer) {
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
