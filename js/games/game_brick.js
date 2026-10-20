import { sound } from '../audio.js';
import { DIFFICULTY_LEVELS } from '../data.js';

export class GameBrick {
  constructor(container, onComplete, onStarEarned, semester = 1, difficulty = 'medium') {
    this.container = container;
    this.onComplete = onComplete;
    this.onStarEarned = onStarEarned;
    this.semester = semester;
    this.difficulty = difficulty;
    this.currentQ = 0;
    this.totalQ = 5;
    this.correctCount = 0;
    // Total bricks currently in the wall
    this.bricks = [];
    this.maxWallCapacity = 24;
  }

  start() {
    this.currentQ = 0;
    this.correctCount = 0;
    // Start with 12 bricks (2 rows of 6)
    this.bricks = [];
    for (let i = 0; i < 12; i++) {
      this.bricks.push({
        id: 'brick_' + Math.random().toString(36).substr(2, 9),
        color: (i % 6) + 1,
        icon: ['🧱', '⭐', '💎', '🔷', '🔶', '✨'][i % 6]
      });
    }
    this.nextQuestion();
  }

  generateQuestion() {
    const diff = this.difficulty;
    let bricksToBreak = 3;
    let diffClass = 'diff-med';
    let diffText = '⚡ Bắn vừa (Vỡ 3 viên)';

    if (diff === 'easy') {
      bricksToBreak = 2;
      diffClass = 'diff-easy';
      diffText = '🌱 Bắn nhẹ (Vỡ 2 viên)';
    } else if (diff === 'medium') {
      bricksToBreak = 3;
      diffClass = 'diff-med';
      diffText = '⭐ Bắn chuẩn (Vỡ 3 viên)';
    } else if (diff === 'hard') {
      bricksToBreak = 4;
      diffClass = 'diff-hard';
      diffText = '🔥 Pháo mạnh (Vỡ 4 viên)';
    } else {
      bricksToBreak = 5;
      diffClass = 'diff-hard';
      diffText = '⚡ Siêu pháo Laze (Vỡ 5 viên)';
    }

    let num1, num2, isAdd, targetAnswer, equationStr;

    if (diff === 'easy') {
      isAdd = Math.random() > 0.4;
      if (isAdd) {
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * (10 - num1 + 1));
        targetAnswer = num1 + num2;
        equationStr = `${num1} + ${num2} = ?`;
      } else {
        num1 = Math.floor(Math.random() * 6) + 3; // 3 to 8
        num2 = Math.floor(Math.random() * num1) + 1;
        targetAnswer = num1 - num2;
        equationStr = `${num1} - ${num2} = ?`;
      }
    } else if (diff === 'medium') {
      isAdd = Math.random() > 0.5;
      if (isAdd) {
        num1 = Math.floor(Math.random() * 8) + 4; // 4 to 11
        num2 = Math.floor(Math.random() * 8) + 2; // 2 to 9
        targetAnswer = num1 + num2;
        equationStr = `${num1} + ${num2} = ?`;
      } else {
        num1 = Math.floor(Math.random() * 9) + 10; // 10 to 18
        num2 = Math.floor(Math.random() * 7) + 2;
        targetAnswer = num1 - num2;
        equationStr = `${num1} - ${num2} = ?`;
      }
    } else if (diff === 'hard') {
      const tens1 = (Math.floor(Math.random() * 5) + 2) * 10;
      const tens2 = (Math.floor(Math.random() * 4) + 1) * 10;
      isAdd = Math.random() > 0.4;
      if (isAdd) {
        targetAnswer = tens1 + tens2;
        equationStr = `${tens1} + ${tens2} = ?`;
      } else {
        num1 = Math.max(tens1, tens2);
        num2 = Math.min(tens1, tens2);
        targetAnswer = num1 - num2;
        equationStr = `${num1} - ${num2} = ?`;
      }
    } else {
      // challenge: 3 numbers or missing operand
      const isThreeNums = Math.random() > 0.5;
      if (isThreeNums) {
        const a = Math.floor(Math.random() * 15) + 10;
        const b = Math.floor(Math.random() * 10) + 5;
        const c = Math.floor(Math.random() * 8) + 2;
        targetAnswer = a + b - c;
        equationStr = `${a} + ${b} - ${c} = ?`;
      } else {
        const p1 = Math.floor(Math.random() * 20) + 15;
        const p2 = Math.floor(Math.random() * 15) + 10;
        const sum = p1 + p2;
        targetAnswer = p2;
        equationStr = `${p1} + ? = ${sum}`;
      }
    }

    // 4 answer choices
    const options = [targetAnswer];
    while (options.length < 4) {
      const delta = (Math.floor(Math.random() * 7) - 3) * (diff === 'hard' || diff === 'challenge' ? 10 : 1);
      const opt = Math.max(0, targetAnswer + delta);
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    return {
      diff,
      diffClass,
      diffText,
      bricksToBreak,
      equationStr,
      targetAnswer,
      options
    };
  }

  nextQuestion() {
    if (this.currentQ >= this.totalQ || this.bricks.length === 0) {
      this.onComplete(this.correctCount, this.totalQ);
      return;
    }

    this.currentQ++;
    this.currentProblem = this.generateQuestion();
    this.render();
  }

  render() {
    const { diff, bricksToBreak, equationStr, options, diffClass, diffText } = this.currentProblem;
    const diffInfo = DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium;

    // Render wall bricks in rows of 6
    const rows = [];
    for (let i = 0; i < this.bricks.length; i += 6) {
      rows.push(this.bricks.slice(i, i + 6));
    }

    const wallHtml = rows.map((row) => `
      <div class="brick-row">
        ${row.map(b => `
          <div class="brick-item brick-color-${b.color}" id="${b.id}">
            ${b.icon}
          </div>
        `).join('')}
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>🧱 Thợ Phá Gạch Toán Học</h2>
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

      <div class="brick-game-layout">
        <!-- Status Bar -->
        <div class="brick-status-bar">
          <div class="brick-difficulty-badge ${diffClass}">
            <span>${diffText}</span>
          </div>
          <div style="color: #475569; font-size: 15px;">
            Số gạch còn lại: <b style="color: #e11d48; font-size: 18px;" id="brickCountNum">${this.bricks.length}</b> viên
          </div>
        </div>

        <!-- Brick Wall Area -->
        <div class="brick-wall-container" id="brickWallBox">
          <div class="brick-danger-line">⚠️ Vạch báo động nguy hiểm</div>
          <div class="brick-wall-grid" id="brickGrid">
            ${wallHtml}
          </div>
          <div id="laserBeamWrap"></div>
        </div>

        <!-- Math Prompt Box -->
        <div class="question-prompt-box" style="margin-bottom: 0;">
          <span class="prompt-icon">🤖</span>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span class="prompt-text">Bắn đạn phép tính phá vỡ tường gạch!</span>
            <span style="font-size: 13px; color: #64748b;">(Đúng: vỡ ${bricksToBreak} gạch | Sai: rơi thêm gạch mới)</span>
          </div>
        </div>

        <!-- Math Board -->
        <div class="math-board" style="padding: 14px 20px;">
          <span class="math-equation" style="font-size: 34px;">
            ${equationStr.replace('?', '<span class="math-question-mark" id="brickTargetVal">?</span>')}
          </span>
        </div>

        <!-- Answer Choices -->
        <div class="answer-choices-area" id="choicesArea">
          ${options.map(opt => `<button class="choice-btn" data-val="${opt}">${opt}</button>`).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const choices = this.container.querySelectorAll('.choice-btn');
    const targetSpan = this.container.querySelector('#brickTargetVal');
    const wallBox = this.container.querySelector('#brickWallBox');
    const laserWrap = this.container.querySelector('#laserBeamWrap');
    const { targetAnswer, bricksToBreak } = this.currentProblem;

    choices.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        if (val === targetAnswer) {
          // CORRECT ANSWER
          sound.playLaserShoot();
          btn.classList.add('correct');
          if (targetSpan) {
            targetSpan.textContent = targetAnswer;
            targetSpan.style.background = '#4ade80';
            targetSpan.style.color = '#064e3b';
          }
          choices.forEach(b => b.disabled = true);
          this.correctCount++;
          this.onStarEarned();

          // Visual laser effect
          if (laserWrap) {
            const beam = document.createElement('div');
            beam.className = 'brick-laser-beam';
            beam.style.left = '50%';
            laserWrap.appendChild(beam);
          }

          // Break bricks with slight delay
          setTimeout(() => {
            sound.playBrickBreak();
            const countToBreak = Math.min(bricksToBreak, this.bricks.length);
            const brokenIds = [];
            for (let i = 0; i < countToBreak; i++) {
              if (this.bricks.length > 0) {
                const popped = this.bricks.pop();
                brokenIds.push(popped.id);
              }
            }

            brokenIds.forEach(id => {
              const el = document.getElementById(id);
              if (el) el.classList.add('shattering');
            });

            const countNum = document.getElementById('brickCountNum');
            if (countNum) countNum.textContent = this.bricks.length;

            setTimeout(() => {
              this.nextQuestion();
            }, 800);
          }, 200);

        } else {
          // WRONG ANSWER: Chồng gạch tăng thêm!
          sound.playWarning();
          btn.classList.add('wrong');
          setTimeout(() => btn.classList.remove('wrong'), 500);

          if (wallBox) {
            wallBox.style.animation = 'towerTremble 0.5s ease';
            setTimeout(() => wallBox.style.animation = '', 500);
          }

          // Add 2 new bricks falling in
          const addedCount = 2;
          for (let i = 0; i < addedCount; i++) {
            if (this.bricks.length < this.maxWallCapacity) {
              const newBrick = {
                id: 'brick_' + Math.random().toString(36).substr(2, 9),
                color: (this.bricks.length % 6) + 1,
                icon: '🧱'
              };
              this.bricks.push(newBrick);
            }
          }

          const countNum = document.getElementById('brickCountNum');
          if (countNum) countNum.textContent = this.bricks.length;

          // Re-render rows to show newly fallen bricks
          const grid = document.getElementById('brickGrid');
          if (grid) {
            const rows = [];
            for (let i = 0; i < this.bricks.length; i += 6) {
              rows.push(this.bricks.slice(i, i + 6));
            }
            grid.innerHTML = rows.map((row) => `
              <div class="brick-row">
                ${row.map(b => `
                  <div class="brick-item brick-color-${b.color} falling-in" id="${b.id}">
                    ${b.icon}
                  </div>
                `).join('')}
              </div>
            `).join('');
          }
        }
      });
    });
  }
}
