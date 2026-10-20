import { GAMES_INFO, BADGES, ROBOT_CHEERS, ISLAND_STATIONS, DIFFICULTY_LEVELS, getCurrentDifficulty, setDifficulty } from './data.js';
import { sound } from './audio.js';
import { confetti } from './confetti.js';

// Curriculum games
import { GameCount } from './games/game_count.js';
import { GameCompare } from './games/game_compare.js';
import { GameNumberHouse } from './games/game_numberhouse.js';
import { GameMath } from './games/game_math.js';
import { GameShapes } from './games/game_shapes.js';
import { GameMeasure } from './games/game_measure.js';
import { GameClock } from './games/game_clock.js';
import { GameBrick } from './games/game_brick.js';
import { GameRacing } from './games/game_racing.js';
import { GameBubbles } from './games/game_bubbles.js';
import { GameFishing } from './games/game_fishing.js';
import { GameCarrot } from './games/game_carrot.js';
import { GameBubbleCannon } from './games/game_bubble_cannon.js';

// Adventure Island components
import { AdventureMap } from './map.js';
import { WardrobeModal } from './wardrobe.js';
import { ParentZone } from './parent_zone.js';
import { GameAdvCount } from './games/game_adv_count.js';
import { GameAdvFruit } from './games/game_adv_fruit.js';
import { GameAdvBalloons } from './games/game_adv_balloons.js';
import { GameAdvCompare } from './games/game_adv_compare.js';
import { GameFrog } from './games/game_frog.js';

class App {
  constructor() {
    this.stars = parseInt(localStorage.getItem('math_stars') || '0', 10);
    this.unlockedBadges = JSON.parse(localStorage.getItem('math_badges') || '[]');
    this.mode = localStorage.getItem('adv_app_mode') || 'adventure'; // 'adventure' or 'curriculum'
    this.currentSemester = 'all'; // 'all', 1, 2
    this.currentGame = null;
    this.currentGameId = null;

    this.mainContent = document.getElementById('mainContent');
    this.starDisplay = document.getElementById('starCount');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.badgeBtn = document.getElementById('badgeBtn');
    this.modalOverlay = document.getElementById('modalOverlay');
    this.modalBody = document.getElementById('modalBody');
    this.modalCloseBtn = document.getElementById('modalCloseBtn');

    this.wardrobeModal = new WardrobeModal(this.modalOverlay, this.modalBody, () => {
      if (this.mode === 'adventure') this.renderAdventureMap();
    });

    this.parentZone = new ParentZone(
      this.modalOverlay,
      this.modalBody,
      () => {
        this.stars = 0;
        this.updateStarUI();
        if (this.mode === 'adventure') this.renderAdventureMap();
      },
      (newDiff) => {
        this.updateDifficultyUI();
        const diffInfo = DIFFICULTY_LEVELS[newDiff];
        this.showToast(`Đã chuyển cấp độ: ${diffInfo.name} ${diffInfo.icon}`);
        if (this.currentGame && this.currentGameId) {
          this.launchGame(this.currentGameId);
        }
      }
    );
  }

  init() {
    this.updateStarUI();
    this.updateDifficultyUI();
    this.bindDifficultyPicker();
    this.renderMain();
    this.bindGlobalEvents();
    confetti.init();

    window.addEventListener('app:return-home', () => {
      this.currentGame = null;
      this.currentGameId = null;
      this.renderMain();
    });
  }

  updateDifficultyUI() {
    const currentDiff = getCurrentDifficulty();
    const diffInfo = DIFFICULTY_LEVELS[currentDiff] || DIFFICULTY_LEVELS.medium;

    const iconEl = document.getElementById('diffBadgeIcon');
    const labelEl = document.getElementById('diffBadgeLabel');
    const btn = document.getElementById('diffPickerBtn');

    if (iconEl) iconEl.textContent = diffInfo.icon;
    if (labelEl) labelEl.textContent = diffInfo.name;
    if (btn) {
      btn.className = `diff-picker-btn diff-${currentDiff}`;
    }

    document.querySelectorAll('.diff-menu-item').forEach(item => {
      if (item.dataset.diff === currentDiff) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  bindDifficultyPicker() {
    const wrap = document.getElementById('diffPickerWrap');
    const btn = document.getElementById('diffPickerBtn');

    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playClick();
      wrap?.classList.toggle('open');
    });

    document.querySelectorAll('.diff-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.playClick();
        const diff = item.dataset.diff;
        setDifficulty(diff);
        this.updateDifficultyUI();
        wrap?.classList.remove('open');

        const diffInfo = DIFFICULTY_LEVELS[diff];
        this.showToast(`Đã chọn cấp độ: ${diffInfo.name} ${diffInfo.icon}`);

        // If game is active, restart with new difficulty
        if (this.currentGame && this.currentGameId) {
          this.launchGame(this.currentGameId);
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (wrap && !wrap.contains(e.target)) {
        wrap.classList.remove('open');
      }
    });
  }

  updateStarUI() {
    if (this.starDisplay) {
      this.starDisplay.textContent = this.stars;
    }
  }

  addStar() {
    this.stars += 1;
    localStorage.setItem('math_stars', this.stars);
    this.updateStarUI();
    this.checkBadges();

    this.showToast(ROBOT_CHEERS[Math.floor(Math.random() * ROBOT_CHEERS.length)]);
  }

  checkBadges() {
    BADGES.forEach(badge => {
      if (this.stars >= badge.reqStars && !this.unlockedBadges.includes(badge.id)) {
        this.unlockedBadges.push(badge.id);
        localStorage.setItem('math_badges', JSON.stringify(this.unlockedBadges));
        this.showBadgeUnlockedModal(badge);
      }
    });
  }

  showBadgeUnlockedModal(badge) {
    sound.playFanfare();
    confetti.fire(3000, 120);

    this.modalBody.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 12px; animation: bounceSlow 1.5s infinite;">${badge.icon}</div>
      <h2 style="font-size: 26px; color: #0284c7; margin-bottom: 8px;">CHÚC MỪNG BÉ!</h2>
      <p style="font-size: 18px; font-weight: 700; color: #334155; margin-bottom: 8px;">Bé đã mở khóa huy hiệu mới:</p>
      <div style="background: #f0fdf4; border: 2px solid #86efac; border-radius: 16px; padding: 12px; font-size: 20px; font-weight: 800; color: #15803d; margin-bottom: 16px;">
        ${badge.title}
      </div>
      <p style="font-size: 15px; color: #64748b;">${badge.desc}</p>
      <button class="play-action-btn" id="modalOkBtn" style="margin: 20px auto 0; font-size: 18px; padding: 10px 32px;">Nhận Thưởng 🌟</button>
    `;

    this.modalOverlay.classList.add('active');
    document.getElementById('modalOkBtn')?.addEventListener('click', () => {
      sound.playClick();
      this.modalOverlay.classList.remove('active');
    });
  }

  showToast(msg) {
    let toast = document.getElementById('robotToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'robotToast';
      toast.className = 'robot-feedback-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <span style="font-size: 24px;">🐱</span>
      <span style="font-weight: 800; color: #0369a1; font-size: 15px;">${msg}</span>
    `;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  renderMain() {
    if (this.mode === 'adventure') {
      this.renderAdventureMap();
    } else {
      this.renderCurriculumHome();
    }
  }

  renderAdventureMap() {
    this.currentGame = null;
    this.mainContent.innerHTML = `
      <!-- Main Mode Switcher -->
      <div class="semester-tabs" style="margin-bottom: 16px;">
        <button class="tab-btn ${this.mode === 'adventure' ? 'active' : ''}" id="tabAdvMode">
          🏝️ Đảo Toán Học Phiêu Lưu (Theo Bản Đồ)
        </button>
        <button class="tab-btn ${this.mode === 'curriculum' ? 'active' : ''}" id="tabCurrMode">
          📚 Khu Vườn SGK (14 Trò Chơi)
        </button>
      </div>

      <div id="advMapWrapper"></div>
    `;

    const wrapper = document.getElementById('advMapWrapper');
    const advMap = new AdventureMap(
      wrapper,
      (stationId) => {
        this.launchGame(stationId);
      },
      () => {
        this.wardrobeModal.open();
      },
      () => {
        this.parentZone.open();
      }
    );
    advMap.render();

    // Mode buttons
    document.getElementById('tabAdvMode')?.addEventListener('click', () => {
      sound.playClick();
      this.mode = 'adventure';
      localStorage.setItem('adv_app_mode', 'adventure');
      this.renderMain();
    });
    document.getElementById('tabCurrMode')?.addEventListener('click', () => {
      sound.playClick();
      this.mode = 'curriculum';
      localStorage.setItem('adv_app_mode', 'curriculum');
      this.renderMain();
    });
  }

  renderCurriculumHome() {
    this.currentGame = null;
    const filteredGames = this.currentSemester === 'all'
      ? GAMES_INFO
      : GAMES_INFO.filter(g => g.semester === parseInt(this.currentSemester, 10));

    this.mainContent.innerHTML = `
      <!-- Main Mode Switcher -->
      <div class="semester-tabs" style="margin-bottom: 16px;">
        <button class="tab-btn ${this.mode === 'adventure' ? 'active' : ''}" id="tabAdvMode">
          🏝️ Đảo Toán Học Phiêu Lưu (Theo Bản Đồ)
        </button>
        <button class="tab-btn ${this.mode === 'curriculum' ? 'active' : ''}" id="tabCurrMode">
          📚 Khu Vườn SGK (14 Trò Chơi)
        </button>
      </div>

      <!-- Mascot Banner -->
      <section class="mascot-banner">
        <div class="robot-avatar">
          <svg width="68" height="68" viewBox="0 0 100 100">
            <line x1="50" y1="20" x2="50" y2="8" stroke="#0284c7" stroke-width="5" stroke-linecap="round" class="antenna-wiggle"/>
            <circle cx="50" cy="8" r="6" fill="#f59e0b" class="antenna-wiggle"/>
            <rect x="18" y="20" width="64" height="52" rx="16" fill="#ffffff" stroke="#0284c7" stroke-width="4"/>
            <circle cx="36" cy="44" r="8" fill="#0284c7"/>
            <circle cx="64" cy="44" r="8" fill="#0284c7"/>
            <circle cx="38" cy="42" r="3" fill="#ffffff"/>
            <circle cx="66" cy="42" r="3" fill="#ffffff"/>
            <circle cx="28" cy="54" r="5" fill="#fca5a5" opacity="0.6"/>
            <circle cx="72" cy="54" r="5" fill="#fca5a5" opacity="0.6"/>
            <path d="M 40 56 Q 50 66 60 56" fill="none" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="robot-speech">
          <h2>Chào các bạn nhỏ lớp 1! 🤖✨</h2>
          <p>Hãy cùng Robot khám phá thế giới toán học diệu kì qua các trò chơi bám sát sách giáo khoa <b>Toán 1 (Kết nối tri thức với cuộc sống)</b> nhé!</p>
        </div>
      </section>

      <!-- Special Featured Arcade Banner -->
      <section class="special-games-banner">
        <div class="special-banner-header">
          <span class="special-badge-pill">✨ MỚI CẬP NHẬT</span>
          <h3>Trò Chơi Tương Tác Đặc Biệt</h3>
        </div>
        <div class="special-games-cards">
          <div class="special-game-item item-carrot" data-game-id="carrot" role="button" tabindex="0">
            <div class="special-item-left">
              <span class="special-item-emoji">🥕</span>
              <div>
                <h4>Thỏ Gom Cà Rốt</h4>
                <p>Cùng Bác Gấu & Thỏ Trắng rèn luyện Tách - Gộp số trong vườn</p>
              </div>
            </div>
            <div class="special-item-right">
              <span class="special-play-tag">Vào chơi ▶</span>
            </div>
          </div>
          <div class="special-game-item item-cannon" data-game-id="cannon" role="button" tabindex="0">
            <div class="special-item-left">
              <span class="special-item-emoji">🎈</span>
              <div>
                <h4>Đại Bác Bong Bóng</h4>
                <p>Xoay nòng pháo ngôi sao bắn nổ bóng bay phép tính phản xạ nhanh</p>
              </div>
            </div>
            <div class="special-item-right">
              <span class="special-play-tag">Vào chơi ▶</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Semester Tabs -->
      <div class="semester-tabs">
        <button class="tab-btn ${this.currentSemester === 'all' ? 'active' : ''}" data-sem="all">🌈 Tất Cả Trò Chơi</button>
        <button class="tab-btn ${this.currentSemester === '1' ? 'active' : ''}" data-sem="1">📘 Học Kì 1 (Tập 1: 0 - 10)</button>
        <button class="tab-btn ${this.currentSemester === '2' ? 'active' : ''}" data-sem="2">📙 Học Kì 2 (Tập 2: Đến 100)</button>
      </div>

      <!-- Games Grid -->
      <div class="games-grid">
        ${filteredGames.map(game => `
          <div class="game-card" data-game-id="${game.id}">
            <span class="game-badge-tag ${game.tagClass}">${game.tag}</span>
            <div class="game-card-header">
              <div class="game-icon-circle" style="background: ${game.bgColor};">
                ${game.icon}
              </div>
              <div class="game-title-group">
                <h3>${game.title}</h3>
                <span>${game.subtitle}</span>
              </div>
            </div>
            <p class="description">${game.desc}</p>
            <div class="game-card-footer">
              <span style="font-size: 14px; font-weight: 700; color: #0284c7;">5 Câu đố / Ván</span>
              <button class="play-action-btn">Chơi ngay ▶</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Mode switch buttons
    document.getElementById('tabAdvMode')?.addEventListener('click', () => {
      sound.playClick();
      this.mode = 'adventure';
      localStorage.setItem('adv_app_mode', 'adventure');
      this.renderMain();
    });
    document.getElementById('tabCurrMode')?.addEventListener('click', () => {
      sound.playClick();
      this.mode = 'curriculum';
      localStorage.setItem('adv_app_mode', 'curriculum');
      this.renderMain();
    });

    // Bind semester tab clicks
    this.mainContent.querySelectorAll('[data-sem]').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        this.currentSemester = btn.dataset.sem;
        this.renderCurriculumHome();
      });
    });

    // Bind special banner clicks
    this.mainContent.querySelectorAll('.special-game-item').forEach(item => {
      item.addEventListener('click', () => {
        sound.playClick();
        const gameId = item.dataset.gameId;
        this.launchGame(gameId);
      });
    });

    // Bind game card clicks
    this.mainContent.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', () => {
        sound.playClick();
        const gameId = card.dataset.gameId;
        this.launchGame(gameId);
      });
    });
  }

  launchGame(gameId) {
    this.currentGameId = gameId;
    this.mainContent.innerHTML = `<div class="game-screen" id="gameScreen"></div>`;
    const screen = document.getElementById('gameScreen');

    const onComplete = (correctCount, totalCount) => {
      this.showCompletionModal(gameId, correctCount, totalCount);
    };

    const onStarEarned = () => {
      this.addStar();
    };

    const currentDiff = getCurrentDifficulty();
    const diffInfo = DIFFICULTY_LEVELS[currentDiff] || DIFFICULTY_LEVELS.medium;
    const currentScope = diffInfo.scope;
    const semesterNum = this.currentSemester === '2' ? 2 : (this.currentSemester === '1' ? 1 : (currentDiff === 'hard' || currentDiff === 'challenge' ? 2 : 1));

    switch (gameId) {
      // Adventure Island Mini-Games
      case 'adv_count':
        this.currentGame = new GameAdvCount(screen, onComplete, onStarEarned, currentScope, currentDiff);
        break;
      case 'adv_fruit':
        this.currentGame = new GameAdvFruit(screen, onComplete, onStarEarned, currentScope, currentDiff);
        break;
      case 'adv_balloons':
        this.currentGame = new GameAdvBalloons(screen, onComplete, onStarEarned, currentScope, currentDiff);
        break;
      case 'adv_compare':
        this.currentGame = new GameAdvCompare(screen, onComplete, onStarEarned, currentScope, currentDiff);
        break;
      case 'adv_frog': {
        const frogLvl = currentDiff === 'easy' ? 1 : currentDiff === 'medium' ? 2 : 3;
        this.currentGame = new GameFrog(screen, onComplete, onStarEarned, frogLvl, currentDiff);
        break;
      }
      case 'adv_shapes':
        this.currentGame = new GameShapes(screen, onComplete, onStarEarned, semesterNum, currentDiff);
        break;

      // Curriculum Mini-Games
      case 'count':
        this.currentGame = new GameCount(screen, onComplete, onStarEarned, semesterNum, currentDiff);
        break;
      case 'compare':
        this.currentGame = new GameCompare(screen, onComplete, onStarEarned, semesterNum, currentDiff);
        break;
      case 'numberhouse':
        this.currentGame = new GameNumberHouse(screen, onComplete, onStarEarned, semesterNum, currentDiff);
        break;
      case 'math':
        this.currentGame = new GameMath(screen, onComplete, onStarEarned, semesterNum, currentDiff);
        break;
      case 'shapes':
        this.currentGame = new GameShapes(screen, onComplete, onStarEarned, semesterNum, currentDiff);
        break;
      case 'measure':
        this.currentGame = new GameMeasure(screen, onComplete, onStarEarned, 2, currentDiff);
        break;
      case 'clock':
        this.currentGame = new GameClock(screen, onComplete, onStarEarned, 2, currentDiff);
        break;
      case 'brick':
        this.currentGame = new GameBrick(screen, onComplete, onStarEarned, semesterNum, currentDiff);
        break;
      case 'racing':
        this.currentGame = new GameRacing(screen, onComplete, onStarEarned, semesterNum, currentDiff);
        break;
      case 'bubbles':
        this.currentGame = new GameBubbles(screen, onComplete, onStarEarned, semesterNum, currentDiff);
        break;
      case 'fishing':
        this.currentGame = new GameFishing(screen, onComplete, onStarEarned, semesterNum, currentDiff);
        break;
      case 'frog': {
        const lvl = currentDiff === 'easy' ? 1 : currentDiff === 'medium' ? 2 : 3;
        this.currentGame = new GameFrog(screen, onComplete, onStarEarned, lvl, currentDiff);
        break;
      }
      case 'carrot':
        this.currentGame = new GameCarrot(screen, onComplete, onStarEarned, semesterNum, currentDiff);
        break;
      case 'cannon':
        this.currentGame = new GameBubbleCannon(screen, onComplete, onStarEarned, semesterNum, currentDiff);
        break;
      default:
        this.currentGameId = null;
        this.renderMain();
        return;
    }

    // Delegated back button listener on screen container
    screen.addEventListener('click', (e) => {
      const exitBtn = e.target.closest('#gameExitBtn, #advExitBtn, .btn-back');
      if (exitBtn) {
        sound.playClick();
        this.currentGame = null;
        this.currentGameId = null;
        this.renderMain();
      }
    });

    this.currentGame.start();
  }

  showCompletionModal(gameId, correctCount, totalCount) {
    sound.playFanfare();
    confetti.fire(3000, 100);

    const isPerfect = correctCount === totalCount;

    // Record stats
    const stats = JSON.parse(localStorage.getItem('adv_learning_stats') || '{"totalQ":0,"correctFirst":0,"hintUsed":0}');
    stats.totalQ += totalCount;
    stats.correctFirst += correctCount;
    localStorage.setItem('adv_learning_stats', JSON.stringify(stats));

    // If it's an adventure station, unlock next station!
    const isAdv = gameId.startsWith('adv_');
    if (isAdv) {
      const stationStars = JSON.parse(localStorage.getItem('adv_station_stars') || '{}');
      const earnedStars = Math.max(1, Math.round((correctCount / totalCount) * 3));
      stationStars[gameId] = Math.max(stationStars[gameId] || 0, earnedStars);
      localStorage.setItem('adv_station_stars', JSON.stringify(stationStars));

      const unlocked = JSON.parse(localStorage.getItem('adv_unlocked_stations') || '["adv_count"]');
      const idx = ISLAND_STATIONS.findIndex(s => s.id === gameId);
      if (idx !== -1 && idx + 1 < ISLAND_STATIONS.length) {
        const nextStation = ISLAND_STATIONS[idx + 1];
        if (!unlocked.includes(nextStation.id)) {
          unlocked.push(nextStation.id);
          localStorage.setItem('adv_unlocked_stations', JSON.stringify(unlocked));
          localStorage.setItem('adv_current_station', nextStation.id);
        }
      }
    }

    this.modalBody.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 12px; animation: bounceSlow 1.5s infinite;">🎉</div>
      <h2 style="font-size: 26px; color: #0284c7; margin-bottom: 8px;">
        ${isPerfect ? 'HOÀN HẢO! XUẤT SẮC!' : 'HOÀN THÀNH MÀN CHƠI!'}
      </h2>
      <p style="font-size: 18px; font-weight: 700; color: #475569; margin-bottom: 16px;">
        Bé đã trả lời đúng <b>${correctCount}/${totalCount}</b> câu hỏi!
      </p>

      <div style="display: flex; justify-content: center; gap: 8px; font-size: 40px; margin-bottom: 20px;">
        ${Array.from({ length: totalCount }).map((_, i) => 
          `<span style="filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15));">${i < correctCount ? '⭐' : '⚪'}</span>`
        ).join('')}
      </div>

      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="btn-back" id="modalHomeBtn" style="font-size: 16px; padding: 10px 20px;">
          ${isAdv ? '🏝️ Về Bản Đồ' : '🏠 Về Trang Chủ'}
        </button>
        <button class="play-action-btn" id="modalReplayBtn" style="font-size: 16px; padding: 10px 24px;">🔄 Chơi Lại</button>
      </div>
    `;

    this.modalOverlay.classList.add('active');

    document.getElementById('modalHomeBtn')?.addEventListener('click', () => {
      sound.playClick();
      this.modalOverlay.classList.remove('active');
      this.renderMain();
    });

    document.getElementById('modalReplayBtn')?.addEventListener('click', () => {
      sound.playClick();
      this.modalOverlay.classList.remove('active');
      this.launchGame(gameId);
    });
  }

  showBadgesModal() {
    sound.playClick();
    this.modalBody.innerHTML = `
      <h2 style="font-size: 26px; color: #0284c7; margin-bottom: 8px;">🏆 HUY HIỆU CỦA BÉ</h2>
      <p style="font-size: 16px; color: #64748b; margin-bottom: 20px;">Tích lũy sao để mở khóa các huy hiệu danh giá nhé!</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 14px; margin-bottom: 20px;">
        ${BADGES.map(badge => {
          const unlocked = this.unlockedBadges.includes(badge.id);
          return `
            <div style="background: ${unlocked ? '#f0fdf4' : '#f8fafc'}; border: 2px solid ${unlocked ? '#86efac' : '#e2e8f0'}; border-radius: 18px; padding: 14px 8px; text-align: center; opacity: ${unlocked ? 1 : 0.55};">
              <div style="font-size: 42px; margin-bottom: 6px;">${badge.icon}</div>
              <div style="font-size: 15px; font-weight: 800; color: ${unlocked ? '#15803d' : '#64748b'};">${badge.title}</div>
              <div style="font-size: 12px; font-weight: 700; color: ${unlocked ? '#16a34a' : '#94a3b8'}; margin-top: 4px;">${badge.reqStars} ⭐</div>
            </div>
          `;
        }).join('')}
      </div>

      <button class="play-action-btn" id="modalCloseActionBtn" style="margin: 0 auto; font-size: 16px;">Đóng Lại</button>
    `;

    this.modalOverlay.classList.add('active');
    document.getElementById('modalCloseActionBtn')?.addEventListener('click', () => {
      sound.playClick();
      this.modalOverlay.classList.remove('active');
    });
  }

  bindGlobalEvents() {
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        const enabled = sound.toggleSound();
        this.soundToggleBtn.textContent = enabled ? '🔊' : '🔇';
        this.soundToggleBtn.title = enabled ? 'Tắt âm thanh' : 'Bật âm thanh';
        if (enabled) sound.playClick();
      });
    }

    if (this.badgeBtn) {
      this.badgeBtn.addEventListener('click', () => {
        this.showBadgesModal();
      });
    }

    document.getElementById('brandLogo')?.addEventListener('click', () => {
      sound.playClick();
      this.renderMain();
    });

    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => {
        sound.playClick();
        this.modalOverlay.classList.remove('active');
      });
    }

    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) {
          this.modalOverlay.classList.remove('active');
        }
      });
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
