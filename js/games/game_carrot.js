import { sound } from '../audio.js';
import { DIFFICULTY_LEVELS } from '../data.js';

export class GameCarrot {
  constructor(container, onComplete, onStarEarned, semester = 1, difficulty = 'medium') {
    this.container = container;
    this.onComplete = onComplete;
    this.onStarEarned = onStarEarned;
    this.semester = semester;
    this.difficulty = difficulty;
    this.messageHandler = null;

    this.start();
  }

  start() {
    this.render();
  }

  cleanup() {
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
      this.messageHandler = null;
    }
  }

  render() {
    const diffInfo = DIFFICULTY_LEVELS[this.difficulty] || DIFFICULTY_LEVELS.medium;

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">⬅️ Trở về</button>
          <div class="game-title-badge">
            <h2>🥕 Thỏ Gom Cà Rốt</h2>
            <span class="game-diff-badge diff-${this.difficulty}">
              ${diffInfo.icon} ${diffInfo.name}
            </span>
          </div>
        </div>
        <div class="game-extra-actions">
          <a href="carrot-harvester.html?diff=${this.difficulty}" target="_blank" class="adv-btn-pill" title="Mở toàn màn hình trong tab mới">
            ⛶ Mở Tab Riêng
          </a>
        </div>
      </div>

      <div class="embedded-game-frame-wrap">
        <iframe
          src="carrot-harvester.html?diff=${this.difficulty}"
          class="embedded-game-iframe"
          title="Thỏ Gom Cà Rốt"
          allow="autoplay"
        ></iframe>
      </div>
    `;

    document.getElementById('gameExitBtn')?.addEventListener('click', () => {
      sound.playClick();
      this.cleanup();
      window.dispatchEvent(new CustomEvent('app:return-home'));
    });

    this.cleanup();
    this.messageHandler = (event) => {
      if (!event.data || typeof event.data !== 'object') return;
      if (event.data.type === 'MATH_STAR_EARNED') {
        if (typeof this.onStarEarned === 'function') {
          this.onStarEarned();
        }
      } else if (event.data.type === 'GAME_COMPLETE') {
        if (typeof this.onComplete === 'function') {
          this.onComplete(event.data.correct || 5, event.data.total || 5);
        }
      } else if (event.data.type === 'EXIT_GAME') {
        sound.playClick();
        this.cleanup();
        window.dispatchEvent(new CustomEvent('app:return-home'));
      }
    };
    window.addEventListener('message', this.messageHandler);
  }
}
