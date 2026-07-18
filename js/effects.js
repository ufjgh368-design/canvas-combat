import { ARTIST_MAP } from '../data/artists.js';
import { STAGES } from '../data/stages.js';

export class BattleRenderer {
  constructor(canvas, settings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.settings = settings;
    this.fighters = [];
    this.stage = 'baroque';
    this.particles = [];
    this.running = false;
    this.hit = null;
    this.bossFx = null;
    this.time = 0;
    this.images = new Map();
    this.background = null;
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
    this.background = this.loadImage((STAGES[stage] || STAGES.baroque).image);
    this.particles = [];
    this.bossFx = null;
    // The battle screen is hidden while the renderer is constructed. Measure it
    // again after the screen becomes visible so images are not drawn to a 1px canvas.
    this.fit();
    requestAnimationFrame(() => this.fit());
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

  bossStyle() {
    const artist = ARTIST_MAP[this.fighters[1]?.artistId];
    return artist?.bossVariant || {
      animation: 'counterpoint-orbit',
      colors: ['#e7c46a', '#ef315d', '#65f5ee'],
      phaseNames: ['序奏甦醒', '樂章暴走', '終極交響'],
    };
  }

  bossTransition(phase) {
    const style = this.bossStyle();
    const color = style.colors?.[(phase - 1) % style.colors.length] || '#e7c46a';
    this.bossFx = { type: 'phase', phase, style, start: performance.now(), duration: 1700 };
    this.burst(this.w * .75, this.h * .5, color, phase === 3 ? 130 : 85);
  }

  bossShieldBreak() {
    const style = this.bossStyle();
    const color = style.colors?.[1] || '#52e5e0';
    this.bossFx = { type: 'shield', phase: 0, style, start: performance.now(), duration: 1050 };
    this.burst(this.w * .75, this.h * .52, color, 110);
  }

  bossDefeat() {
    const style = this.bossStyle();
    const color = style.colors?.[2] || style.colors?.[0] || '#e7c46a';
    this.bossFx = { type: 'defeat', phase: 3, style, start: performance.now(), duration: 1600 };
    this.burst(this.w * .75, this.h * .5, color, 180);
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
    const stage = STAGES[this.stage] || STAGES.baroque;
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
    const pulse = 1 + Math.sin(this.time / 260) * .025;
    c.scale(pulse, pulse);
    c.fillStyle = '#05070c';
    c.strokeStyle = artist.color;
    c.lineWidth = 4;
    // 指揮家輪廓：頭、燕尾服、抬起的指揮棒與音符徽章。
    c.beginPath();
    c.arc(0, -105, 27, 0, Math.PI * 2);
    c.moveTo(-26, -78);
    c.quadraticCurveTo(-60, -20, -45, 0);
    c.lineTo(52, 0);
    c.quadraticCurveTo(54, -28, 26, -78);
    c.closePath();
    c.fill();
    c.stroke();
    c.beginPath();
    c.moveTo(18, -66);
    c.lineTo(70, -132);
    c.stroke();
    c.fillStyle = artist.color;
    c.beginPath();
    c.arc(-12, -48, 11, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#fff8df';
    c.font = '700 16px Georgia';
    c.textAlign = 'center';
    c.fillText('♪', -12, -42);
    c.scale(index === 1 ? -1 : 1, 1);
    c.font = '700 14px system-ui';
    c.fillText(artist.nameZh.slice(0, 2), 0, 22);
    c.restore();
  }

  drawBossBackdrop() {
    if (!this.bossFx) return;
    const c = this.ctx;
    const p = Math.min(1, (performance.now() - this.bossFx.start) / this.bossFx.duration);
    if (this.bossFx.type === 'phase') {
      const style = this.bossFx.style || this.bossStyle();
      const colors = style.colors?.length ? style.colors : ['#e7c46a', '#ef315d', '#65f5ee'];
      const motif = style.animation || 'frame-fold';
      c.save();
      c.translate(this.w * .75, this.h * .48);
      c.lineWidth = 5;
      c.globalAlpha = Math.sin(p * Math.PI);
      const count = this.bossFx.phase === 3 ? 12 : 8;
      for (let ring = 0; ring < count; ring += 1) {
        const color = colors[ring % colors.length];
        const angle = (Math.PI * 2 * ring) / count + p * (ring % 2 ? -2 : 2);
        c.strokeStyle = color;
        c.fillStyle = color;
        if (motif === 'floral-vortex') {
          c.save(); c.rotate(angle); c.beginPath(); c.ellipse(0, -55 - ring * 8, 18 + ring, 42, 0, 0, Math.PI * 2); c.stroke(); c.restore();
        } else if (motif === 'color-vortex') {
          c.beginPath(); c.arc(0, 0, 45 + ring * 14, angle, angle + Math.PI * .7); c.stroke();
        } else if (motif === 'light-bloom') {
          c.globalAlpha = Math.sin(p * Math.PI) * (.18 + (ring % 3) * .12);
          c.beginPath(); c.arc(Math.cos(angle) * (55 + ring * 9), Math.sin(angle) * (35 + ring * 6), 18 + ring * 2, 0, Math.PI * 2); c.fill();
        } else if (motif === 'symbol-bloom') {
          c.save(); c.rotate(angle); c.strokeRect(-18 - ring * 3, -58 - ring * 10, 36 + ring * 6, 36 + ring * 6); c.restore();
        } else if (motif === 'anxiety-wave') {
          c.beginPath();
          for (let x = -170; x <= 170; x += 10) c.lineTo(x, Math.sin(x * .045 + p * 12 + ring) * (16 + ring * 3) + (ring - count / 2) * 7);
          c.stroke();
        } else if (motif === 'cutout-dance') {
          c.save(); c.rotate(angle); c.beginPath(); c.ellipse(0, -48 - ring * 10, 13 + ring, 34 + ring * 2, .5, 0, Math.PI * 2); c.fill(); c.restore();
        } else if (motif === 'drip-storm') {
          const x = -150 + (ring / Math.max(1, count - 1)) * 300;
          c.lineWidth = 3 + (ring % 4) * 2; c.beginPath(); c.moveTo(x, -150); c.bezierCurveTo(x + 35, -60, x - 30, 25, x + Math.sin(p * 9 + ring) * 35, 170); c.stroke();
          c.beginPath(); c.arc(x + Math.sin(ring) * 25, 120 - ring * 8, 5 + ring % 4, 0, Math.PI * 2); c.fill();
        } else {
          c.save(); c.rotate(angle * .35); c.strokeRect(-65 - ring * 12, -100 - ring * 12, 130 + ring * 24, 200 + ring * 24); c.restore();
        }
      }
      c.restore();
    }
  }

  drawBossOverlay() {
    if (!this.bossFx) return;
    const c = this.ctx;
    const p = Math.min(1, (performance.now() - this.bossFx.start) / this.bossFx.duration);
    const pulse = Math.sin(p * Math.PI);
    const style = this.bossFx.style || this.bossStyle();
    const colors = style.colors?.length ? style.colors : ['#e7c46a', '#ef315d', '#65f5ee'];
    if (this.bossFx.type === 'phase') {
      c.save();
      c.globalAlpha = this.settings.reducedFlash ? .1 : pulse * .25;
      c.fillStyle = colors[(this.bossFx.phase - 1) % colors.length];
      c.fillRect(0, 0, this.w, this.h);
      c.restore();
      c.fillStyle = '#f7e7b2';
      c.textAlign = 'center';
      c.font = `900 ${Math.max(24, this.w * .045)}px Georgia`;
      c.fillText(style.phaseNames?.[this.bossFx.phase - 1] || `BOSS PHASE ${this.bossFx.phase}`, this.w / 2, this.h * .24);
    } else if (this.bossFx.type === 'shield') {
      c.strokeStyle = colors[1] || colors[0];
      c.lineWidth = 8;
      c.globalAlpha = 1 - p;
      c.beginPath();
      c.arc(this.w * .75, this.h * .52, 40 + p * 150, 0, Math.PI * 2);
      c.stroke();
      c.globalAlpha = 1;
    } else if (this.bossFx.type === 'defeat') {
      c.save();
      c.globalAlpha = pulse * .28;
      c.fillStyle = colors[2] || colors[0];
      c.fillRect(0, 0, this.w, this.h);
      c.restore();
      c.fillStyle = '#fff1bd';
      c.textAlign = 'center';
      c.font = `900 ${Math.max(28, this.w * .05)}px Georgia`;
      c.fillText('MAESTRO FINALE', this.w / 2, this.h * .3);
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
