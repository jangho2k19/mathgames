import { sound } from '../audio.js';
import { DIFFICULTY_LEVELS } from '../data.js';

export class GameFrog {
  constructor(container, onComplete, onStarEarned, level = 1, difficulty = 'medium') {
    this.container = container;
    this.onComplete = onComplete;
    this.onStarEarned = onStarEarned;
    this.difficulty = difficulty;
    if (difficulty === 'easy') this.level = 1;
    else if (difficulty === 'medium') this.level = 2;
    else this.level = 3;
    this.currentQIndex = 0;
    this.totalQ = 8;
    this.correctCount = 0;
    this.firstTryCount = 0;
    this.wrongTries = 0;

    // Frog position and animation state
    this.currentFrogPos = 0;
    this.isJumping = false;
    this.manualJumpsDone = 0;

    this.questions = [];
  }

  start() {
    this.currentQIndex = 0;
    this.correctCount = 0;
    this.firstTryCount = 0;
    this.questions = this.generateQuestionsList();
    this.nextQuestion();
  }

  // Generate 8 questions according to the spec
  generateQuestionsList() {
    const list = [];
    const maxVal = this.level === 1 ? 10 : this.level === 2 ? 20 : 100;

    // Question distribution per spec:
    // Level 1: 4 forward, 3 back, 1 find steps
    // Level 2: 3 forward, 3 back, 2 find steps (>= 40% cross 10)
    // Level 3: 3 forward, 3 back, 2 find steps
    let types = [];
    if (this.level === 1) {
      types = ['JUMP_FORWARD', 'JUMP_FORWARD', 'JUMP_FORWARD', 'JUMP_FORWARD', 'JUMP_BACK', 'JUMP_BACK', 'JUMP_BACK', 'FIND_STEPS'];
    } else if (this.level === 2) {
      types = ['JUMP_FORWARD', 'JUMP_FORWARD', 'JUMP_FORWARD', 'JUMP_BACK', 'JUMP_BACK', 'JUMP_BACK', 'FIND_STEPS', 'FIND_STEPS_BACK'];
    } else {
      types = ['JUMP_FORWARD', 'JUMP_FORWARD', 'JUMP_FORWARD', 'JUMP_BACK', 'JUMP_BACK', 'JUMP_BACK', 'FIND_STEPS', 'FIND_STEPS_BACK'];
    }

    // Shuffle types
    types.sort(() => Math.random() - 0.5);

    let cross10Count = 0;

    types.forEach((type, idx) => {
      let q = null;
      let attempts = 0;

      while (!q && attempts < 100) {
        attempts++;
        const candidate = this.generateSingleQuestion(type, idx + 1, maxVal);

        // Check level 2 condition: at least 40% across 10 (e.g. 3 out of 8)
        if (this.level === 2) {
          const crosses = (candidate.type === 'JUMP_FORWARD' && candidate.start < 10 && candidate.answer > 10) ||
                          (candidate.type === 'JUMP_BACK' && candidate.start > 10 && candidate.answer < 10);
          if (cross10Count < 3 && !crosses && attempts < 50) {
            continue; // try to generate one crossing 10
          }
          if (crosses) cross10Count++;
        }

        // Avoid exact same answer consecutively
        if (list.length > 0 && candidate.answer === list[list.length - 1].answer) {
          continue;
        }

        q = candidate;
      }

      list.push(q || this.generateSingleQuestion(type, idx + 1, maxVal));
    });

    return list;
  }

  generateSingleQuestion(type, idNum, maxVal) {
    let start = 0, amount = 1, unit = 1, answer = 0, target = 0;

    if (this.level === 1) {
      // 0 - 10, steps 1 - 5
      amount = Math.floor(Math.random() * 4) + 1; // 1 to 4
      if (type === 'JUMP_FORWARD') {
        start = Math.floor(Math.random() * (10 - amount));
        answer = start + amount;
      } else if (type === 'JUMP_BACK') {
        start = Math.floor(Math.random() * (10 - amount)) + amount;
        answer = start - amount;
      } else {
        // FIND_STEPS
        start = Math.floor(Math.random() * 6); // 0 to 5
        amount = Math.floor(Math.random() * 4) + 1;
        target = start + amount;
        answer = amount; // child selects number of steps!
      }
    } else if (this.level === 2) {
      // 0 - 20, steps 2 - 9, cross 10
      if (type === 'JUMP_FORWARD') {
        // either within 10-20 or crossing 10
        const cross = Math.random() > 0.4;
        if (cross) {
          start = Math.floor(Math.random() * 4) + 6; // 6 to 9
          amount = Math.floor(Math.random() * 5) + 3; // 3 to 7 -> sum 11 to 16
        } else {
          start = Math.floor(Math.random() * 8) + 10;
          amount = Math.floor(Math.random() * (20 - start - 1)) + 1;
        }
        answer = start + amount;
      } else if (type === 'JUMP_BACK') {
        const cross = Math.random() > 0.4;
        if (cross) {
          start = Math.floor(Math.random() * 6) + 11; // 11 to 16
          amount = Math.floor(Math.random() * 5) + (start - 9); // so answer < 10
          amount = Math.min(amount, start);
        } else {
          start = Math.floor(Math.random() * 6) + 14;
          amount = Math.floor(Math.random() * 4) + 2;
        }
        answer = start - amount;
      } else if (type === 'FIND_STEPS') {
        start = Math.floor(Math.random() * 8) + 3;
        amount = Math.floor(Math.random() * 6) + 2;
        target = Math.min(20, start + amount);
        amount = target - start;
        answer = amount;
      } else {
        // FIND_STEPS_BACK
        start = Math.floor(Math.random() * 8) + 12; // 12 to 19
        amount = Math.floor(Math.random() * 6) + 2;
        target = Math.max(0, start - amount);
        amount = start - target;
        answer = amount;
      }
    } else {
      // Level 3: 0 - 100, tens or units
      const isTens = Math.random() > 0.4;
      if (isTens) {
        unit = 10;
        const tensStart = Math.floor(Math.random() * 6) + 2; // 2 to 7
        const tensAmount = Math.floor(Math.random() * 3) + 1;
        if (type === 'JUMP_FORWARD') {
          start = tensStart * 10;
          amount = tensAmount;
          answer = start + amount * 10;
        } else if (type === 'JUMP_BACK') {
          start = Math.max(40, tensStart * 10);
          amount = Math.min(tensAmount, Math.floor(start / 10) - 1);
          answer = start - amount * 10;
        } else {
          start = tensStart * 10;
          amount = tensAmount;
          target = start + (type === 'FIND_STEPS' ? amount * 10 : -amount * 10);
          answer = amount; // child selects number of tens
        }
      } else {
        // Units within tens without regrouping
        unit = 1;
        const tensBase = (Math.floor(Math.random() * 7) + 2) * 10;
        const uStart = Math.floor(Math.random() * 5) + 2;
        const uStep = Math.floor(Math.random() * 3) + 1;
        if (type === 'JUMP_FORWARD') {
          start = tensBase + uStart;
          amount = uStep;
          answer = start + amount;
        } else if (type === 'JUMP_BACK') {
          start = tensBase + uStart;
          amount = Math.min(uStart, uStep);
          answer = start - amount;
        } else {
          start = tensBase + uStart;
          amount = uStep;
          target = start + amount;
          answer = amount;
        }
      }
    }

    // Build distractors using pedagogical rules: OFF_BY_ONE, WRONG_OP, ONLY_START, WRONG_UNIT
    const optionCount = this.level === 3 ? 4 : 3;
    const options = [{ value: answer, correct: true }];

    const addDistractor = (val, tag) => {
      if (options.some(o => o.value === val)) return false;
      if (val < 0 || val > maxVal) return false;
      options.push({ value: val, correct: false, errorTag: tag });
      return true;
    };

    // 1. OFF_BY_ONE
    if (Math.random() > 0.5) {
      addDistractor(answer + 1, 'OFF_BY_ONE');
      addDistractor(answer - 1, 'OFF_BY_ONE');
    } else {
      addDistractor(answer - 1, 'OFF_BY_ONE');
      addDistractor(answer + 1, 'OFF_BY_ONE');
    }

    // 2. WRONG_OP (opposite direction result)
    if (type === 'JUMP_FORWARD') {
      addDistractor(Math.max(0, start - amount * unit), 'WRONG_OP');
    } else if (type === 'JUMP_BACK') {
      addDistractor(Math.min(maxVal, start + amount * unit), 'WRONG_OP');
    }

    // 3. WRONG_UNIT (Level 3: confused 10s with 1s)
    if (this.level === 3 && unit === 10) {
      addDistractor(start + amount, 'WRONG_UNIT');
    }

    // 4. ONLY_START
    addDistractor(start, 'ONLY_START');

    // Fill remaining if needed
    let delta = 2;
    while (options.length < optionCount) {
      addDistractor(answer + delta, 'RANDOM_CLOSE');
      if (options.length < optionCount) addDistractor(answer - delta, 'RANDOM_CLOSE');
      delta++;
    }

    // Ensure strictly sorted ascending from left to right as required by spec
    options.sort((a, b) => a.value - b.value);

    // Vietnamese spoken prompt
    let promptText = '';
    let equationDisplay = '';
    const unitWord = unit === 10 ? `${amount} chục` : `${amount} bước`;

    if (type === 'JUMP_FORWARD') {
      promptText = `Ếch đang ở số ${sound.numberToVietnameseWords(start)}. Ếch nhảy thêm ${unitWord}. Ếch đến số mấy?`;
      equationDisplay = `${start} + ${unit === 10 ? amount * 10 : amount} = ?`;
    } else if (type === 'JUMP_BACK') {
      promptText = `Ếch đang ở số ${sound.numberToVietnameseWords(start)}. Ếch nhảy lùi ${unitWord}. Ếch đến số mấy?`;
      equationDisplay = `${start} - ${unit === 10 ? amount * 10 : amount} = ?`;
    } else if (type === 'FIND_STEPS') {
      promptText = `Ếch đang ở số ${sound.numberToVietnameseWords(start)}. Ếch muốn đến cờ ở số ${sound.numberToVietnameseWords(target)}. Ếch cần nhảy mấy ${unit === 10 ? 'chục' : 'bước'}?`;
      equationDisplay = `${start} + ? = ${target}`;
    } else {
      promptText = `Ếch đang ở số ${sound.numberToVietnameseWords(start)}. Ếch muốn về cờ ở số ${sound.numberToVietnameseWords(target)}. Ếch nhảy lùi mấy ${unit === 10 ? 'chục' : 'bước'}?`;
      equationDisplay = `${start} - ? = ${target}`;
    }

    return {
      id: `frog-L${this.level}-${type.toLowerCase()}-${idNum}`,
      type,
      start,
      amount,
      unit,
      target,
      answer,
      range: [0, maxVal],
      options,
      promptText,
      equationDisplay
    };
  }

  nextQuestion() {
    if (this.currentQIndex >= this.totalQ) {
      this.onComplete(this.firstTryCount, this.totalQ);
      return;
    }

    this.currentProblem = this.questions[this.currentQIndex];
    this.currentQIndex++;
    this.wrongTries = 0;
    this.manualJumpsDone = 0;
    this.currentFrogPos = this.currentProblem.start;

    this.render();

    // Auto speech if enabled
    const settings = JSON.parse(localStorage.getItem('adv_parent_settings') || '{"autoVoice":true}');
    if (settings.autoVoice) {
      sound.speakVietnamese(this.currentProblem.promptText);
    }
  }

  render() {
    const q = this.currentProblem;
    const maxVal = q.range[1];

    // Total lily pads to generate on number line (0 to maxVal)
    const pads = [];
    for (let i = 0; i <= maxVal; i++) {
      pads.push(i);
    }

    const isLevel1 = this.level === 1;

    this.container.innerHTML = `
      <div class="adv-game-wrapper frog-game-wrapper">
        <!-- Top Bar -->
        <div class="game-top-bar">
          <div class="game-header-info">
            <button class="btn-back" id="advExitBtn">🏝️ Về Bản Đồ</button>
            <div class="game-title-badge">
              <h2>🐸 Ếch Nhảy Tia Số</h2>
              <span class="game-diff-badge diff-${this.difficulty}">
                ${(DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium).icon} ${(DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium).name}
              </span>
            </div>
          </div>
          <div class="game-progress-bar-wrap">
            <div class="progress-track">
              <div class="progress-fill" style="width: ${(this.currentQIndex / this.totalQ) * 100}%"></div>
            </div>
            <span class="question-counter">Câu ${this.currentQIndex}/${this.totalQ}</span>
          </div>
        </div>

        <!-- Question Prompt with Big Speaker -->
        <div class="adv-prompt-card frog-prompt-card">
          <button class="adv-speaker-btn" id="frogSpeakerBtn" title="Nghe lại câu hỏi">
            🔊
          </button>
          <div class="adv-prompt-text-group">
            <span class="adv-main-prompt">${q.promptText}</span>
            <span class="adv-sub-prompt" style="font-size: 26px; font-weight: 900; color: #0284c7;">
              ${q.equationDisplay}
            </span>
          </div>
        </div>

        <!-- Pond & Lily Pads Number Line Viewport -->
        <div class="frog-pond-viewport" id="pondViewport">
          <div class="frog-pond-track" id="pondTrack">
            ${pads.map(num => {
              const isMilestone = num === 0 || num === 10 || num === 20 || (num > 0 && num % 10 === 0);
              const hasFlag = (q.type === 'FIND_STEPS' || q.type === 'FIND_STEPS_BACK') && num === q.target;

              return `
                <div class="lily-pad-item ${isMilestone ? 'milestone-pad' : ''}" id="pad_${num}" data-num="${num}">
                  ${hasFlag ? '<span class="target-flag">🚩 ĐÍCH</span>' : ''}
                  <div class="lily-leaf">
                    <span class="pad-number">${num}</span>
                  </div>
                </div>
              `;
            }).join('')}

            <!-- Animated Frog Mascot -->
            <div class="frog-avatar-sprite" id="frogAvatar">
              <div class="frog-counting-bubble" id="frogBubble" style="display: none;"></div>
              <div class="frog-body">🐸</div>
            </div>
          </div>
        </div>

        <!-- Control Action: Big "NHẢY!" for Level 1 or "Ếch nhảy giúp" for Level 2 & 3 -->
        <div class="frog-action-bar">
          ${isLevel1 ? `
            <button class="frog-jump-action-btn" id="frogJumpBtn">
              🐸 NHẢY! (${this.manualJumpsDone}/${q.amount})
            </button>
          ` : `
            <button class="frog-auto-jump-btn" id="frogHelpJumpBtn">
              🐾 Ếch nhảy giúp
            </button>
          `}
        </div>

        <!-- Hint Guidance Box -->
        <div id="frogHintBox" class="adv-hint-box" style="display: none;"></div>

        <!-- Answer Cards (Ascending Left to Right - Always Visible & Clickable) -->
        <div class="frog-choices-container" id="choicesContainer">
          <div style="font-size: 14px; font-weight: 800; color: #475569; text-align: center; margin-bottom: 8px;">
            ${(q.type === 'FIND_STEPS' || q.type === 'FIND_STEPS_BACK') ? 'Bé hãy chọn số bước nhảy:' : 'Bé hãy chọn đài sen đích đến:'}
          </div>
          <div class="frog-choices-grid">
            ${q.options.map(opt => `
              <button class="frog-choice-card" data-val="${opt.value}" id="card_${opt.value}">
                <span class="choice-card-num">${opt.value}</span>
                ${q.unit === 10 && (q.type === 'FIND_STEPS' || q.type === 'FIND_STEPS_BACK') ? '<span style="font-size:12px; font-weight:700; color:#64748b;">chục</span>' : ''}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Position frog initially and scroll viewport
    this.updateFrogPosition(this.currentProblem.start, false);
    this.bindEvents();
  }

  // Smoothly position frog on the number line and auto-scroll viewport
  updateFrogPosition(padNum, animate = true) {
    const pad = this.container.querySelector(`#pad_${padNum}`);
    const frog = this.container.querySelector('#frogAvatar');
    const track = this.container.querySelector('#pondTrack');
    const viewport = this.container.querySelector('#pondViewport');

    if (!pad || !frog || !viewport || !track) return;

    const padRect = pad.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const targetLeft = (pad.offsetLeft + pad.offsetWidth / 2) - (frog.offsetWidth / 2);

    if (animate) {
      frog.style.transition = 'left 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      frog.classList.add('frog-arc-jumping');
      setTimeout(() => {
        frog.classList.remove('frog-arc-jumping');
        pad.classList.add('pad-rippling');
        setTimeout(() => pad.classList.remove('pad-rippling'), 400);
      }, 450);
    } else {
      frog.style.transition = 'none';
    }

    frog.style.left = `${targetLeft}px`;

    // Auto-scroll viewport so frog stays comfortably centered
    const viewportWidth = viewport.clientWidth;
    const targetScroll = pad.offsetLeft - viewportWidth / 2 + pad.offsetWidth / 2;
    viewport.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: animate ? 'smooth' : 'auto'
    });

    this.currentFrogPos = padNum;
  }

  bindEvents() {
    const q = this.currentProblem;

    // Speaker repeat
    this.container.querySelector('#frogSpeakerBtn')?.addEventListener('click', () => {
      sound.speakVietnamese(q.promptText);
    });

    // Level 1: "NHẢY!" button (interactive helper, hops frog)
    const jumpBtn = this.container.querySelector('#frogJumpBtn');
    if (jumpBtn) {
      jumpBtn.addEventListener('click', () => {
        if (this.manualJumpsDone >= q.amount) return;

        this.manualJumpsDone++;

        const stepDir = (q.type === 'JUMP_FORWARD' || q.type === 'FIND_STEPS') ? 1 : -1;
        const nextPad = this.currentFrogPos + stepDir * q.unit;

        sound.playBoing();

        // Update bubble on frog head
        const bubble = this.container.querySelector('#frogBubble');
        if (bubble) {
          bubble.style.display = 'block';
          bubble.textContent = this.manualJumpsDone;
        }

        this.updateFrogPosition(nextPad, true);

        setTimeout(() => {
          sound.playPondSplash();
          sound.speakVietnameseNumber(nextPad);
          jumpBtn.textContent = `🐸 NHẢY! (${this.manualJumpsDone}/${q.amount})`;
          if (this.manualJumpsDone >= q.amount) {
            jumpBtn.disabled = true;
            jumpBtn.style.opacity = '0.5';
          }
        }, 480);
      });
    }

    // Level 2 & 3: "Ếch nhảy giúp" button
    const helpJumpBtn = this.container.querySelector('#frogHelpJumpBtn');
    if (helpJumpBtn) {
      helpJumpBtn.addEventListener('click', () => {
        this.performAnimatedJumpSeries(q.amount, q.unit, (q.type === 'JUMP_FORWARD' || q.type === 'FIND_STEPS') ? 1 : -1);
      });
    }

    // Answer cards - clicking card submits answer
    const cards = this.container.querySelectorAll('.frog-choice-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const val = parseInt(card.dataset.val, 10);
        this.submitAnswer(val);
      });
    });

    // Lily pads - tapping pad directly also submits that number if available
    const pads = this.container.querySelectorAll('.lily-pad-item');
    pads.forEach(pad => {
      pad.addEventListener('click', () => {
        const val = parseInt(pad.dataset.num, 10);
        this.submitAnswer(val);
      });
    });
  }

  submitAnswer(val) {
    const q = this.currentProblem;
    const cards = this.container.querySelectorAll('.frog-choice-card');
    const hintBox = this.container.querySelector('#frogHintBox');
    const matchingCard = this.container.querySelector(`#card_${val}`);

    if (val === q.answer) {
      // CORRECT ANSWER!
      sound.playCorrect();
      if (matchingCard) matchingCard.classList.add('choice-correct');
      cards.forEach(c => c.disabled = true);

      if (this.wrongTries === 0) {
        this.correctCount++;
        this.firstTryCount++;
      }
      this.onStarEarned();

      // Jump frog to answer destination if not already there
      const finalDest = (q.type === 'JUMP_FORWARD' || q.type === 'JUMP_BACK') ? q.answer : q.target;
      this.updateFrogPosition(finalDest, true);

      const destPad = this.container.querySelector(`#pad_${finalDest}`);
      if (destPad) destPad.classList.add('pad-glowing');

      // Encouragement praise
      const praises = ['Giỏi quá!', 'Chính xác!', 'Ếch nhảy thật xa!', 'Bé đếm siêu đấy!', 'Hoan hô!'];
      const praise = praises[Math.floor(Math.random() * praises.length)];
      sound.speakVietnamese(praise);

      setTimeout(() => {
        this.nextQuestion();
      }, 1400);

    } else {
      // WRONG ANSWER
      this.wrongTries++;
      if (matchingCard) {
        matchingCard.classList.add('choice-dimmed');
        matchingCard.disabled = true;
      }

      // Sai lần 1: Đưa ếch nhẹ nhàng về start, nói "Thử lại nhé!", KHÔNG có âm buồn
      if (this.wrongTries === 1) {
        this.updateFrogPosition(q.start, true);
        sound.speakVietnamese('Thử lại nhé!');
      }
      // Sai lần 2: Ếch tự nhảy chậm từng bước minh họa, tô màu các đài đã qua, đọc từng số
      else if (this.wrongTries === 2) {
        if (hintBox) {
          hintBox.style.display = 'block';
          hintBox.innerHTML = `
            <span style="font-size: 22px;">💡</span>
            <span>Gợi ý: Hãy quan sát chú ếch nhảy chậm từng bước nhé!</span>
          `;
        }
        this.performAnimatedJumpSeries(q.amount, q.unit, (q.type === 'JUMP_FORWARD' || q.type === 'FIND_STEPS') ? 1 : -1);
      }
      // Sai lần 3: Hiện đáp án kèm lời giải thích ngắn, thẻ đúng nhấp nháy
      else if (this.wrongTries >= 3) {
        cards.forEach(c => {
          if (parseInt(c.dataset.val, 10) === q.answer) {
            c.classList.add('choice-pulsing');
            c.disabled = false;
          }
        });

        let explanation = '';
        if (q.type === 'JUMP_FORWARD') {
          explanation = `Ếch ở ${q.start}, nhảy thêm ${q.amount} bước. Vậy ${q.start} cộng ${q.amount} bằng ${q.answer}.`;
        } else if (q.type === 'JUMP_BACK') {
          explanation = `Ếch ở ${q.start}, nhảy lùi ${q.amount} bước. Vậy ${q.start} trừ ${q.amount} bằng ${q.answer}.`;
        } else {
          explanation = `Từ ${q.start} đến ${q.target} cần ${q.answer} bước nhảy.`;
        }

        if (hintBox) {
          hintBox.innerHTML = `
            <span style="font-size: 22px;">🎯</span>
            <span>${explanation} Bé bấm vào số <b>${q.answer}</b> nhé!</span>
          `;
        }
        sound.speakVietnamese(explanation);
      }
    }
  }

  // Helper: jump series step-by-step
  performAnimatedJumpSeries(steps, unit, direction) {
    this.isJumping = true;
    this.updateFrogPosition(this.currentProblem.start, false);

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex >= steps) {
        clearInterval(interval);
        this.isJumping = false;
        return;
      }

      stepIndex++;
      const nextNum = this.currentFrogPos + direction * unit;
      sound.playBoing();

      const bubble = this.container.querySelector('#frogBubble');
      if (bubble) {
        bubble.style.display = 'block';
        bubble.textContent = stepIndex;
      }

      this.updateFrogPosition(nextNum, true);

      // Highlight passed pad
      const pad = this.container.querySelector(`#pad_${nextNum}`);
      if (pad) pad.classList.add('pad-passed');

      setTimeout(() => {
        sound.playPondSplash();
        sound.speakVietnameseNumber(nextNum);
      }, 400);

    }, 850);
  }
}
