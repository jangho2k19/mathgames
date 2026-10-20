/**
 * ============================================================================
 * THỎ GOM CÀ RỐT - MAIN CONTROLLER & ENTRY POINT
 * Xử lý sự kiện chuột, cảm ứng, co giãn màn hình và điều khiển giao diện UI
 * ============================================================================
 */

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const audioManager = new AudioManager();
  const game = new CarrotGame(canvas, audioManager);

  // ---------------- TÍNH TOÁN TỌA ĐỘ CHUỘT / CẢM ỨNG CHUẨN XÁC ----------------
  function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  // Sự kiện bấm chọn (Chuột & Cảm ứng)
  function onPointerDown(e) {
    audioManager.initAudioContext();
    const pos = getCanvasCoordinates(e);
    game.handlePointerDown(pos.x, pos.y);
  }

  function onPointerMove(e) {
    const pos = getCanvasCoordinates(e);
    game.handlePointerMove(pos.x, pos.y);
  }

  canvas.addEventListener('mousedown', onPointerDown);
  canvas.addEventListener('mousemove', onPointerMove);

  // Hỗ trợ màn hình cảm ứng (iPad, điện thoại, màn hình tương tác thông minh)
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    onPointerDown(e);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    onPointerMove(e);
  }, { passive: false });

  // ---------------- GẮN SỰ KIỆN CHO CÁC NÚT BẤM GIAO DIỆN (UI BUTTONS) ----------------

  // 1. Nút Bật/Tắt âm thanh hiệu ứng (SFX)
  const btnSound = document.getElementById('btn-sound');
  if (btnSound) {
    btnSound.addEventListener('click', () => {
      const enabled = audioManager.toggleSound();
      btnSound.querySelector('.btn-icon').textContent = enabled ? '🔊' : '🔇';
      audioManager.playClick();
    });
  }

  // 2. Nút Bật/Tắt nhạc nền vui nhộn (BGM)
  const btnMusic = document.getElementById('btn-music');
  if (btnMusic) {
    btnMusic.addEventListener('click', () => {
      audioManager.initAudioContext();
      const enabled = audioManager.toggleMusic();
      btnMusic.querySelector('.btn-icon').textContent = enabled ? '🎶' : '🎵';
      btnMusic.style.borderColor = enabled ? 'var(--primary-orange)' : '';
      audioManager.playClick();
    });
  }

  // 3. Nút nghe Bác Gấu đọc yêu cầu (TTS)
  const btnSpeak = document.getElementById('btn-speak');
  if (btnSpeak) {
    btnSpeak.addEventListener('click', () => {
      audioManager.initAudioContext();
      audioManager.playClick();
      game.speakMission();
    });
  }

  // 4. Bấm vào Bác Gấu hoặc bảng gỗ cũng đọc lại yêu cầu
  const missionBoard = document.getElementById('mission-board');
  if (missionBoard) {
    missionBoard.addEventListener('click', (e) => {
      if (e.target !== btnSpeak && !btnSpeak.contains(e.target)) {
        audioManager.initAudioContext();
        audioManager.playClick();
        game.speakMission();
      }
    });
  }

  // 5. Nút Chọn lại (Hủy luống đang chọn dở)
  const btnResetTurn = document.getElementById('btn-reset-turn');
  if (btnResetTurn) {
    btnResetTurn.addEventListener('click', () => {
      game.resetCurrentTurn();
    });
  }

  // 6. Modal Hướng dẫn cách chơi
  const btnHelp = document.getElementById('btn-help');
  const helpModal = document.getElementById('help-modal');
  const btnCloseHelp = document.getElementById('btn-close-help');
  const btnStartPlaying = document.getElementById('btn-start-playing');

  if (btnHelp && helpModal) {
    btnHelp.addEventListener('click', () => {
      audioManager.playClick();
      helpModal.classList.remove('hidden');
    });
  }

  if (btnCloseHelp && helpModal) {
    btnCloseHelp.addEventListener('click', () => {
      audioManager.playClick();
      helpModal.classList.add('hidden');
    });
  }

  if (btnStartPlaying && helpModal) {
    btnStartPlaying.addEventListener('click', () => {
      audioManager.initAudioContext();
      audioManager.playClick();
      helpModal.classList.add('hidden');
    });
  }

  // 7. Nút Toàn màn hình (Fullscreen)
  const btnFullscreen = document.getElementById('btn-fullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      audioManager.playClick();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn('Lỗi bật toàn màn hình:', err);
        });
      } else {
        document.exitFullscreen().catch(err => {
          console.warn('Lỗi thoát toàn màn hình:', err);
        });
      }
    });
  }

  // 8. Nút Chơi lại từ đầu khi chiến thắng
  const btnPlayAgain = document.getElementById('btn-play-again');
  if (btnPlayAgain) {
    btnPlayAgain.addEventListener('click', () => {
      audioManager.playClick();
      game.restartGame();
    });
  }

  // Mở khóa AudioContext khi người dùng tương tác lần đầu
  const unlockAudio = () => {
    audioManager.initAudioContext();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  // ---------------- VÒNG LẶP CHÍNH CỦA GAME (ANIMATION LOOP) ----------------
  let lastTime = performance.now();

  function gameLoop(currentTime) {
    const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;

    game.update(dt);
    game.render();

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
});
