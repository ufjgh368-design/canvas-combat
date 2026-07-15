import { ARTIST_MAP } from '../data/artists.js';
import { STAGES } from '../data/stages.js';

export class BattleRenderer {
  constructor(canvas, settings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.settings = settings;
    this.fighters = [];
    this.stage = 'renaissance';
    this.particles = [];
    this.running = false;
    this.hit = null;
    this.bossFx = null;
    this.time = 0;
    this.images = new Map();
    this.background = this.loadImage('assets/ui/main-visual-background.png');
    this.resize = () => this.fit();
    addEventListener('resize', this.resize);
    this.fit();
  }

  loadImage(src) {
    if (!src) return null;
    if (this.images.has(src)) return this.images.get(src);
    const record = { image: new Image(), ready: false, failed: false };
    record.image.onload = () => { record.ready = true; };
    record.image.onerror = () => { record.failed = true; };
    record.image.src = src;
    this.images.set(src, record);
    return record;
  }

  fit() {
    const d = Math.min(devicePixelRatio || 1, 2);
    const r = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.max(1, r.width * d);
    this.canvas.height = Math.max(1, r.height * d);
    this.ctx.setTransform(d, 0, 0, d, 0, 0);
    this.w = r.width;
    this.h = r.height;
  }

  setBattle(fighters, stage) {
    this.fighters = fighters;
    this.stage = stage;
    this.particles = [];
    this.bossFx = null;
    for (const fighter of fighters) {
      const artist = ARTIST_MAP[fighter.artistId];
      [artist.portrait, artist.battleSprite, artist.ultimateSprite, artist.koSprite]
        .forEach((src) => this.loadImage(src));
    }
    if (!this.running) {
      this.running = true;
      requestAnimationFrame((t) => this.frame(t));
    }
  }

  attack(side, move, onImpact) {
    const duration = move.id === 'ultimate' ? 1900 : move.id === 'heavy' ? 850 : 550;
    this.hit = { side, move, start: performance.now(), duration, impacted: false, onImpact };
  }

  bossTransition(phase) {
    this.bossFx = { type: 'phase', phase, start: performance.now(), duration: 1700 };
    this.burst(this.w * .75, this.h * .5, phase === 3 ? '#ef315d' : '#e7c46a', phase === 3 ? 130 : 85);
  }

  bossShieldBreak() {
    this.bossFx = { type: 'shield', phase: 0, start: performance.now(), duration: 1050 };
    this.burst(this.w * .75, this.h * .52, '#52e5e0', 110);
  }

  bossDefeat() {
    this.bossFx = { type: 'defeat', phase: 3, start: performance.now(), duration: 1600 };
    this.burst(this.w * .75, this.h * .5, '#e7c46a', 180);
  }

  burst(x, y, color, count = 24) {
    const scale = this.settings.effectLevel === 'full' ? 1 : this.settings.effectLevel === 'simple' ? .45 : 0;
    for (let i = 0; i < count * scale; i += 1) {
      this.particles.push({
        x, y,
        vx: (Math.random() - .5) * 9,
        vy: (Math.random() - .7) * 8,
        life: 1,
        color,
        size: 2 + Math.random() * 6,
        spin: (Math.random() - .5) * .2,
      });
    }
  }

  frame(t) {
    if (!this.running) return;
    this.time = t;
    this.draw();
    requestAnimationFrame((n) => this.frame(n));
  }

  drawCover(record) {
    if (!record?.ready) return false;
    const image = record.image;
    const scale = Math.max(this.w / image.naturalWidth, this.h / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    this.ctx.drawImage(image, (this.w - width) / 2, (this.h - height) / 2, width, height);
    return true;
  }

  draw() {
    const c = this.ctx;
    const w = this.w;
    const h = this.h;
    const stage = STAGES[this.stage] || STAGES.renaissance;
    if (!this.drawCover(this.background)) {
      const gradient = c.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, stage.colors[0]);
      gradient.addColorStop(.62, stage.colors[1]);
      gradient.addColorStop(1, stage.colors[2]);
      c.fillStyle = gradient;
      c.fillRect(0, 0, w, h);
    }
    c.fillStyle = `${stage.colors[0]}66`;
    c.fillRect(0, 0, w, h);
    c.fillStyle = '#0007';
    c.fillRect(0, h * .76, w, h * .24);
    c.fillStyle = '#ffffffcc';
    c.font = '12px Georgia';
    c.fillText(stage.name, 16, 24);

    this.drawBossBackdrop();
    const progress = this.hit ? Math.min(1, (performance.now() - this.hit.start) / this.hit.duration) : 0;
    this.fighters.forEach((fighter, index) => this.drawFighter(fighter, index, progress));

    if (this.hit) {
      const impact = this.hit.move.id === 'ultimate' ? .72 : .55;
      if (progress >= impact && !this.hit.impacted) {
        this.hit.impacted = true;
        const side = this.hit.side;
        const x = side === 0 ? w * .73 : w * .27;
        this.burst(x, h * .58, ARTIST_MAP[this.fighters[side].artistId]?.color || '#fff', this.hit.move.id === 'ultimate' ? 90 : 38);
        this.hit.onImpact?.();
      }
      if (progress >= 1) this.hit = null;
    }

    this.drawParticles();
    this.drawBossOverlay();
  }

  drawFighter(fighter, index, progress) {
    const c = this.ctx;
    const artist = ARTIST_MAP[fighter.artistId];
    const baseX = index === 0 ? this.w * .25 : this.w * .75;
    const groundY = this.h * .8;
    const attacking = this.hit?.side === index;
    const lunge = attacking ? Math.sin(Math.min(progress, 1) * Math.PI) * (index === 0 ? this.w * .22 : -this.w * .22) : 0;
    const x = baseX + lunge;

    if (fighter.isActiveTurn) {
      c.strokeStyle = artist.color;
      c.lineWidth = 4;
      c.globalAlpha = .58 + .25 * Math.sin(this.time / 180);
      c.beginPath();
      c.ellipse(x, groundY + 5, 70, 17, 0, 0, Math.PI * 2);
      c.stroke();
      c.globalAlpha = 1;
    }

    let source = artist.portrait;
    if (attacking) source = this.hit.move.id === 'ultimate' ? artist.ultimateSprite : artist.battleSprite;
    else if (fighter.hp <= 0) source = artist.koSprite;
    const record = this.loadImage(source);

    if (attacking && this.settings.effectLevel === 'full') {
      for (let trail = 3; trail > 0; trail -= 1) {
        c.save();
        c.globalAlpha = .08 * trail;
        this.drawSprite(record, x - lunge * trail * .12, groundY, index, this.hit.move.id === 'ultimate' ? 1.12 : 1);
        c.restore();
      }
    }
    if (record?.ready) this.drawSprite(record, x, groundY, index, this.hit?.move.id === 'ultimate' && attacking ? 1.12 : 1);
    else this.drawFallback(artist, x, groundY, index);
  }

  drawSprite(record, x, groundY, index, boost = 1) {
    const c = this.ctx;
    const image = record.image;
    const maxHeight = this.h * .7 * boost;
    const maxWidth = this.w * .34 * boost;
    const scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    c.save();
    c.translate(x, groundY);
    if (index === 1) c.scale(-1, 1);
    c.drawImage(image, -width / 2, -height, width, height);
    c.restore();
  }

  drawFallback(artist, x, groundY, index) {
    const c = this.ctx;
    c.save();
    c.translate(x, groundY);
    if (index === 1) c.scale(-1, 1);
    c.fillStyle = '#05070c';
    c.strokeStyle = artist.color;
    c.lineWidth = 4;
    c.beginPath();
    c.arc(0, -105, 27, 0, Math.PI * 2);
    c.moveTo(-26, -78);
    c.quadraticCurveTo(-60, -20, -45, 0);
    c.lineTo(52, 0);
    c.quadraticCurveTo(54, -28, 26, -78);
    c.closePath();
    c.fill();
    c.stroke();
    c.restore();
  }

  drawBossBackdrop() {
    if (!this.bossFx) return;
    const c = this.ctx;
    const p = Math.min(1, (performance.now() - this.bossFx.start) / this.bossFx.duration);
    if (this.bossFx.type === 'phase') {
      c.save();
      c.translate(this.w * .75, this.h * .48);
      c.strokeStyle = this.bossFx.phase === 3 ? '#ef315d' : '#e7c46a';
      c.lineWidth = 5;
      c.globalAlpha = Math.sin(p * Math.PI);
      for (let ring = 0; ring < (this.bossFx.phase === 3 ? 6 : 4); ring += 1) {
        c.rotate(.22 + p * .08);
        c.strokeRect(-65 - ring * 18, -100 - ring * 18, 130 + ring * 36, 200 + ring * 36);
      }
      c.restore();
    }
  }

  drawBossOverlay() {
    if (!this.bossFx) return;
    const c = this.ctx;
    const p = Math.min(1, (performance.now() - this.bossFx.start) / this.bossFx.duration);
    const pulse = Math.sin(p * Math.PI);
    if (this.bossFx.type === 'phase') {
      c.fillStyle = this.settings.reducedFlash ? '#120b2066' : `${this.bossFx.phase === 3 ? '#7a0d3d' : '#8c6722'}${Math.round(pulse * 95).toString(16).padStart(2, '0')}`;
      c.fillRect(0, 0, this.w, this.h);
      c.fillStyle = '#f7e7b2';
      c.textAlign = 'center';
      c.font = `900 ${Math.max(24, this.w * .045)}px Georgia`;
      c.fillText(`BOSS PHASE ${this.bossFx.phase}`, this.w / 2, this.h * .24);
    } else if (this.bossFx.type === 'shield') {
      c.strokeStyle = '#65f5ee';
      c.lineWidth = 8;
      c.globalAlpha = 1 - p;
      c.beginPath();
      c.arc(this.w * .75, this.h * .52, 40 + p * 150, 0, Math.PI * 2);
      c.stroke();
      c.globalAlpha = 1;
    } else if (this.bossFx.type === 'defeat') {
      c.fillStyle = `rgba(231,196,106,${pulse * .28})`;
      c.fillRect(0, 0, this.w, this.h);
      c.fillStyle = '#fff1bd';
      c.textAlign = 'center';
      c.font = `900 ${Math.max(28, this.w * .05)}px Georgia`;
      c.fillText('MASTERPIECE BREAK', this.w / 2, this.h * .3);
    }
    if (p >= 1) this.bossFx = null;
  }

  drawParticles() {
    const c = this.ctx;
    this.particles = this.particles.filter((particle) => particle.life > 0);
    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += .16;
      particle.life -= .025;
      c.save();
      c.translate(particle.x, particle.y);
      c.rotate(particle.spin * (1 - particle.life) * 20);
      c.globalAlpha = particle.life;
      c.fillStyle = particle.color;
      c.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * .55);
      c.restore();
    }
    c.globalAlpha = 1;
  }

  destroy() {
    this.running = false;
    removeEventListener('resize', this.resize);
  }
}

