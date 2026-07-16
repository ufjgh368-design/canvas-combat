export class AudioSystem {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
    this.last = new Map();
    this.bgmTimer = null;
    this.bgmGain = null;
    this.pendingTheme = null;
    this.duckTimer = null;
    this.step = 0;
    this.musicFailed = false;
    this.music = new Audio('assets/audio/canvas-combat.mp3');
    this.music.loop = true;
    this.music.preload = 'auto';
    this.music.addEventListener('error', () => {
      this.musicFailed = true;
      if (this.pendingTheme && this.ctx && !this.bgmTimer) this.startSynth(this.pendingTheme);
    });
  }

  unlock() {
    if (!this.ctx) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (Context) {
        this.ctx = new Context();
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.value = this.bgmLevel();
        this.bgmGain.connect(this.ctx.destination);
      }
    }
    this.ctx?.resume();
    if (this.pendingTheme && this.music.paused && !this.bgmTimer) this.startBgm(this.pendingTheme);
  }

  bgmLevel() {
    return Math.max(.0001, this.settings.masterVolume * this.settings.bgmVolume * .08);
  }

  musicLevel() {
    return Math.min(1, Math.max(0, this.settings.masterVolume * this.settings.bgmVolume * .72));
  }

  startBgm(theme = 'renaissance') {
    this.pendingTheme = theme;
    this.stopBgm(false);
    if (!this.settings.bgmEnabled) return;
    if (!this.musicFailed) {
      this.music.volume = this.musicLevel();
      this.music.play().catch(() => {});
      return;
    }
    this.startSynth(theme);
  }

  startSynth(theme) {
    if (!this.ctx || !this.settings.bgmEnabled || this.bgmTimer) return;
    const scales = {
      renaissance: [261, 329, 392, 523], baroque: [220, 277, 330, 440],
      romantic: [196, 247, 294, 392], impressionist: [293, 349, 440, 523],
      postimpressionist: [246, 311, 370, 493], modern: [220, 261, 329, 415],
      surreal: [185, 233, 311, 370], boss: [146, 220, 293, 349],
    }[theme] || [220, 277, 330, 440];
    this.step = 0;
    const play = () => {
      if (!this.ctx || !this.settings.bgmEnabled) return;
      const oscillator = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      oscillator.type = theme === 'modern' || theme === 'surreal' ? 'triangle' : 'sine';
      oscillator.frequency.value = scales[this.step++ % scales.length];
      gain.gain.setValueAtTime(.001, now);
      gain.gain.exponentialRampToValueAtTime(.12, now + .04);
      gain.gain.exponentialRampToValueAtTime(.001, now + .55);
      oscillator.connect(gain).connect(this.bgmGain);
      oscillator.start(now);
      oscillator.stop(now + .6);
    };
    play();
    this.bgmTimer = setInterval(play, 650);
  }

  stopBgm(clearPending = true) {
    if (this.bgmTimer) clearInterval(this.bgmTimer);
    this.bgmTimer = null;
    this.music.pause();
    this.music.currentTime = 0;
    if (clearPending) this.pendingTheme = null;
  }

  duck(ms = 1800) {
    clearTimeout(this.duckTimer);
    if (!this.music.paused) this.music.volume = this.musicLevel() * .25;
    if (this.bgmGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.setTargetAtTime(this.bgmLevel() * .25, now, .05);
    }
    this.duckTimer = setTimeout(() => {
      if (!this.music.paused) this.music.volume = this.musicLevel();
      if (this.bgmGain && this.ctx) this.bgmGain.gain.setTargetAtTime(this.bgmLevel(), this.ctx.currentTime, .12);
    }, ms);
  }

  tone(name = 'select') {
    if (!this.ctx || !this.settings.sfxEnabled) return;
    const now = performance.now();
    if (now - (this.last.get(name) || 0) < 90) return;
    this.last.set(name, now);
    const spec = {
      select: [520, .06], turn: [660, .12], correct: [780, .16], wrong: [180, .2],
      hit: [110, .08], ultimate: [880, .42], warning: [240, .18], ko: [90, .5], unlock: [1040, .5],
    }[name] || [440, .1];
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    oscillator.type = name === 'hit' ? 'sawtooth' : 'sine';
    oscillator.frequency.setValueAtTime(spec[0], this.ctx.currentTime);
    gain.gain.setValueAtTime(.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(.001, this.settings.masterVolume * this.settings.sfxVolume * .16), this.ctx.currentTime + .01);
    gain.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + spec[1]);
    oscillator.connect(gain).connect(this.ctx.destination);
    oscillator.start();
    oscillator.stop(this.ctx.currentTime + spec[1] + .02);
  }
}
