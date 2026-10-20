/**
 * ============================================================================
 * THỎ GOM CÀ RỐT - AUDIO MANAGER (ÂM THANH & GIỌNG ĐỌC TTS TIẾNG VIỆT)
 * Tự tổng hợp âm thanh bằng Web Audio API & Web Speech API không cần file ngoài
 * ============================================================================
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.musicEnabled = false; // Mặc định tắt để tránh tự động phát gây khó chịu
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.currentStep = 0;
    this.synth = window.speechSynthesis || null;
    this.vietnameseVoice = null;

    this.initAudioContext();
    this.findVietnameseVoice();

    // Lắng nghe sự kiện nạp giọng đọc của trình duyệt
    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.findVietnameseVoice();
    }
  }

  // Khởi tạo AudioContext sau tương tác người dùng
  initAudioContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Tìm giọng đọc tiếng Việt chuẩn
  findVietnameseVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    this.vietnameseVoice = voices.find(v => v.lang === 'vi-VN' || v.lang === 'vi_VN' || v.lang.startsWith('vi')) || null;
  }

  // Đọc thông báo tiếng Việt qua Web Speech API
  speak(text, onEndCallback = null) {
    if (!this.soundEnabled || !this.synth) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      this.synth.cancel(); // Hủy câu đang đọc dở trước đó
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Tốc độ vừa phải cho trẻ lớp 1
      utterance.pitch = 1.15; // Giọng tươi vui, ấm áp
      if (this.vietnameseVoice) {
        utterance.voice = this.vietnameseVoice;
        utterance.lang = 'vi-VN';
      } else {
        utterance.lang = 'vi-VN';
      }

      if (onEndCallback) {
        utterance.onend = onEndCallback;
        utterance.onerror = onEndCallback;
      }

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      if (onEndCallback) onEndCallback();
    }
  }

  // ---------------- HIỆU ỨNG ÂM THANH TỔNG HỢP (SFX) ----------------

  // Tiếng bấm nút gỗ vui nhộn
  playClick() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Tiếng thỏ nhảy tưng tưng (Spring hop)
  playHop() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Tiếng nhổ cà rốt (Pop / Plop ngọt ngào)
  playPop() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.16);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.17);
  }

  // Tiếng chuông chúc mừng đúng (Ding-ding fanfare rộn rã)
  playSuccess() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major triad rực rỡ)
    const now = this.ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + index * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.46);
    });
  }

  // Tiếng ngôi sao phát sáng (Sparkle chime)
  playStar() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.linearRampToValueAtTime(2400, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // Tiếng nhắc nhở nhẹ nhàng khi chọn chưa đúng (Wobble boing mềm mại, không gây sợ)
  playWrong() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.15);
    osc.frequency.linearRampToValueAtTime(200, now + 0.35);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Tiếng kèn chiến thắng kết thúc game (Victory fanfare)
  playVictory() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.ctx) return;

    // Giai điệu: C4 - E4 - G4 - C5 - E5 - G5 rộn ràng
    const melody = [
      { f: 261.63, d: 0.15 },
      { f: 329.63, d: 0.15 },
      { f: 392.00, d: 0.15 },
      { f: 523.25, d: 0.25 },
      { f: 659.25, d: 0.25 },
      { f: 783.99, d: 0.6 }
    ];

    let t = this.ctx.currentTime;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.d + 0.05);

      t += note.d * 0.85;
    });
  }

  // ---------------- NHẠC NỀN HOẠT HÌNH NÔNG TRẠI (BGM SYNTHESIZER) ----------------
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    return this.musicEnabled;
  }

  startMusic() {
    if (!this.musicEnabled || this.isPlayingMusic) return;
    this.initAudioContext();
    this.isPlayingMusic = true;
    this.currentStep = 0;

    // Vòng hợp âm vui tươi nông trại: C - G - Am - F
    const chords = [
      [261.63, 329.63, 392.00], // C major
      [196.00, 246.94, 293.66], // G major
      [220.00, 261.63, 329.63], // A minor
      [174.61, 220.00, 261.63]  // F major
    ];

    const stepDuration = 550; // ms per beat

    const playChordBeat = () => {
      if (!this.isPlayingMusic || !this.ctx) return;
      const now = this.ctx.currentTime;
      const chord = chords[Math.floor(this.currentStep / 2) % chords.length];

      // Âm bass ấm áp
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(chord[0] / 2, now);
      bassGain.gain.setValueAtTime(0.05, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.46);

      // Nốt chuông nhẹ
      const noteFreq = chord[this.currentStep % chord.length];
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(noteFreq * 2, now);
      bellGain.gain.setValueAtTime(0.035, now);
      bellGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.35);
      bellOsc.connect(bellGain);
      bellGain.connect(this.ctx.destination);
      bellOsc.start(now);
      bellOsc.stop(now + 0.36);

      this.currentStep++;
      this.musicTimer = setTimeout(playChordBeat, stepDuration);
    };

    playChordBeat();
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (!this.soundEnabled && this.synth) {
      this.synth.cancel();
    }
    return this.soundEnabled;
  }
}
