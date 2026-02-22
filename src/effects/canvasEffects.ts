// 12 crisp canvas effects for March 8 greeting card — no blur, SVG-style shapes

type StopFn = () => void;
type EffectFn = (ctx: CanvasRenderingContext2D, w: number, h: number) => StopFn;

const COLORS: [number, number, number][] = [
  [236, 72, 153], [244, 114, 182], [251, 146, 60],
  [167, 139, 250], [252, 211, 77], [248, 113, 113],
  [253, 164, 175], [196, 181, 253], [249, 168, 212],
  [252, 165, 165],
];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// ─── Shape Helpers ───

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  const s = size;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(0, 0, -s * 0.5, 0, -s * 0.5, s * 0.3);
  ctx.bezierCurveTo(-s * 0.5, s * 0.6, 0, s * 0.8, 0, s);
  ctx.bezierCurveTo(0, s * 0.8, s * 0.5, s * 0.6, s * 0.5, s * 0.3);
  ctx.bezierCurveTo(s * 0.5, 0, 0, 0, 0, s * 0.3);
  ctx.fill();
  ctx.restore();
}

function drawPetal(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.3, size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: [number, number, number], opacity: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = rgba(color, opacity);
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 / 5) * i);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.35, size * 0.15, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = rgba([250, 204, 21], opacity);
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 4) * i - Math.PI / 2;
    const r = i % 2 === 0 ? size : size * 0.3;
    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTulip(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: [number, number, number], opacity: number) {
  ctx.save();
  ctx.translate(x, y);
  // Stem
  ctx.strokeStyle = rgba([34, 139, 34], opacity * 0.8);
  ctx.lineWidth = size * 0.08;
  ctx.beginPath();
  ctx.moveTo(0, size * 0.4);
  ctx.lineTo(0, size);
  ctx.stroke();
  // Bud
  ctx.fillStyle = rgba(color, opacity);
  ctx.beginPath();
  ctx.ellipse(-size * 0.15, size * 0.2, size * 0.15, size * 0.35, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(size * 0.15, size * 0.2, size * 0.15, size * 0.35, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, size * 0.15, size * 0.12, size * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawDaisy(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, opacity: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = rgba([255, 255, 255], opacity);
  ctx.strokeStyle = rgba([220, 200, 210], opacity * 0.5);
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 / 6) * i);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.4, size * 0.12, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = rgba([250, 204, 21], opacity);
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ─── 12 Effects ───

// 1. BouquetReveal
function bouquetReveal(ctx: CanvasRenderingContext2D, w: number, h: number): StopFn {
  const stems = Array.from({ length: 7 }, (_, i) => ({
    x: w / 2 + (i - 3) * 30,
    startY: h * 0.85,
    endY: h * 0.35 + rand(-20, 20),
    color: pick(COLORS),
    delay: i * 150,
    openPhase: 0,
  }));
  const sparkles = Array.from({ length: 40 }, () => ({
    x: w / 2 + rand(-120, 120), y: h * 0.35 + rand(-40, 40),
    size: rand(2, 5), phase: rand(0, Math.PI * 2), color: pick(COLORS),
  }));
  let id: number;
  const start = performance.now();
  const dur = 5000;
  const animate = (now: number) => {
    const elapsed = now - start;
    if (elapsed > dur) { ctx.clearRect(0, 0, w, h); return; }
    ctx.clearRect(0, 0, w, h);
    const fade = elapsed > dur - 800 ? (dur - elapsed) / 800 : 1;
    for (const s of stems) {
      const t = Math.max(0, Math.min(1, (elapsed - s.delay) / 1500));
      const curY = s.startY + (s.endY - s.startY) * t;
      ctx.strokeStyle = rgba([34, 139, 34], 0.7 * fade);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(s.x, s.startY);
      ctx.lineTo(s.x, curY);
      ctx.stroke();
      if (t > 0.6) {
        const open = Math.min(1, (t - 0.6) / 0.4);
        const sz = 18 * open;
        drawTulip(ctx, s.x, curY - sz * 0.5, sz, s.color, fade);
      }
    }
    if (elapsed > 1500) {
      const sp = Math.min(1, (elapsed - 1500) / 1000);
      for (const sk of sparkles) {
        const twinkle = (Math.sin(elapsed * 0.003 + sk.phase) + 1) / 2;
        ctx.fillStyle = rgba(sk.color, twinkle * sp * fade * 0.7);
        drawStar(ctx, sk.x, sk.y, sk.size * sp);
      }
    }
    id = requestAnimationFrame(animate);
  };
  id = requestAnimationFrame(animate);
  return () => { cancelAnimationFrame(id); ctx.clearRect(0, 0, w, h); };
}

// 2. PetalRain (3-layer parallax)
function petalRain(ctx: CanvasRenderingContext2D, w: number, h: number): StopFn {
  const layers = [
    { count: 30, speedMul: 0.5, sizeMul: 0.6, opacity: 0.4 },
    { count: 40, speedMul: 1.0, sizeMul: 1.0, opacity: 0.6 },
    { count: 30, speedMul: 1.8, sizeMul: 1.4, opacity: 0.8 },
  ];
  const particles = layers.flatMap(l =>
    Array.from({ length: l.count }, () => ({
      x: rand(0, w), y: rand(-h, 0),
      speed: rand(1, 3) * l.speedMul, size: rand(8, 14) * l.sizeMul,
      rot: rand(0, Math.PI * 2), rotSpeed: rand(-0.03, 0.03),
      color: pick(COLORS), drift: rand(0.3, 1.5), driftPhase: rand(0, Math.PI * 2),
      opacity: l.opacity,
    }))
  );
  let id: number;
  const start = performance.now();
  const dur = 5000;
  const animate = (now: number) => {
    const elapsed = now - start;
    if (elapsed > dur) { ctx.clearRect(0, 0, w, h); return; }
    ctx.clearRect(0, 0, w, h);
    const fade = elapsed > dur - 1000 ? (dur - elapsed) / 1000 : 1;
    for (const p of particles) {
      p.y += p.speed;
      p.x += Math.sin(elapsed * 0.001 + p.driftPhase) * p.drift * 0.5;
      p.rot += p.rotSpeed;
      ctx.fillStyle = rgba(p.color, p.opacity * fade);
      drawPetal(ctx, p.x, p.y, p.size, p.rot);
      if (p.y > h + 20) { p.y = -20; p.x = rand(0, w); }
    }
    id = requestAnimationFrame(animate);
  };
  id = requestAnimationFrame(animate);
  return () => { cancelAnimationFrame(id); ctx.clearRect(0, 0, w, h); };
}

// 3. HeartBurst
function heartBurst(ctx: CanvasRenderingContext2D, w: number, h: number): StopFn {
  const particles = Array.from({ length: 90 }, () => ({
    x: w / 2, y: h / 2,
    vx: rand(-9, 9), vy: rand(-14, -3),
    size: rand(8, 20), color: pick(COLORS), opacity: 1,
  }));
  let id: number;
  const start = performance.now();
  const dur = 4000;
  const animate = (now: number) => {
    const elapsed = now - start;
    if (elapsed > dur) { ctx.clearRect(0, 0, w, h); return; }
    ctx.clearRect(0, 0, w, h);
    const progress = elapsed / dur;
    for (const p of particles) {
      p.x += p.vx; p.vy += 0.18; p.y += p.vy;
      p.opacity = Math.max(0, 1 - progress * 1.3);
      ctx.fillStyle = rgba(p.color, p.opacity);
      drawHeart(ctx, p.x, p.y, p.size);
    }
    id = requestAnimationFrame(animate);
  };
  id = requestAnimationFrame(animate);
  return () => { cancelAnimationFrame(id); ctx.clearRect(0, 0, w, h); };
}

// 4. FloralConfetti
function floralConfetti(ctx: CanvasRenderingContext2D, w: number, h: number): StopFn {
  const particles = Array.from({ length: 120 }, () => ({
    x: w / 2 + rand(-100, 100), y: h * 0.7,
    vx: rand(-6, 6), vy: rand(-15, -7),
    size: rand(6, 14), rot: rand(0, Math.PI * 2), rotSpeed: rand(-0.1, 0.1),
    color: pick(COLORS), isHeart: Math.random() > 0.5,
  }));
  let id: number;
  const start = performance.now();
  const dur = 4500;
  const animate = (now: number) => {
    const elapsed = now - start;
    if (elapsed > dur) { ctx.clearRect(0, 0, w, h); return; }
    ctx.clearRect(0, 0, w, h);
    const progress = elapsed / dur;
    for (const p of particles) {
      p.vy += 0.13; p.x += p.vx; p.y += p.vy; p.rot += p.rotSpeed;
      const opacity = Math.max(0, 1 - progress * 1.2);
      ctx.fillStyle = rgba(p.color, opacity);
      if (p.isHeart) drawHeart(ctx, p.x, p.y, p.size);
      else drawPetal(ctx, p.x, p.y, p.size, p.rot);
    }
    id = requestAnimationFrame(animate);
  };
  id = requestAnimationFrame(animate);
  return () => { cancelAnimationFrame(id); ctx.clearRect(0, 0, w, h); };
}

// 5. BloomFrame
function bloomFrame(ctx: CanvasRenderingContext2D, w: number, h: number): StopFn {
  const cx = w / 2, cy = h / 2;
  const rx = Math.min(w * 0.4, 200), ry = Math.min(h * 0.3, 160);
  const count = 50;
  const flowers = Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 / count) * i;
    return {
      tx: cx + Math.cos(angle) * rx,
      ty: cy + Math.sin(angle) * ry,
      size: rand(8, 14), color: pick(COLORS), delay: i * 60,
    };
  });
  let id: number;
  const start = performance.now();
  const dur = 4500;
  const animate = (now: number) => {
    const elapsed = now - start;
    if (elapsed > dur) { ctx.clearRect(0, 0, w, h); return; }
    ctx.clearRect(0, 0, w, h);
    const fade = elapsed > dur - 1000 ? (dur - elapsed) / 1000 : 1;
    for (const f of flowers) {
      const t = Math.max(0, Math.min(1, (elapsed - f.delay) / 1200));
      const eased = 1 - Math.pow(1 - t, 3);
      drawFlower(ctx, f.tx, f.ty, f.size * eased, f.color, fade * 0.8 * eased);
    }
    id = requestAnimationFrame(animate);
  };
  id = requestAnimationFrame(animate);
  return () => { cancelAnimationFrame(id); ctx.clearRect(0, 0, w, h); };
}

// 6. SparkleOrbit
function sparkleOrbit(ctx: CanvasRenderingContext2D, w: number, h: number): StopFn {
  const cx = w / 2, cy = h / 2;
  const sparks = Array.from({ length: 50 }, () => ({
    angle: rand(0, Math.PI * 2),
    radius: rand(80, 200),
    speed: rand(0.015, 0.04) * (Math.random() > 0.5 ? 1 : -1),
    size: rand(2, 6), color: pick(COLORS),
  }));
  let id: number;
  const start = performance.now();
  const dur = 4000;
  const animate = (now: number) => {
    const elapsed = now - start;
    if (elapsed > dur) { ctx.clearRect(0, 0, w, h); return; }
    ctx.clearRect(0, 0, w, h);
    const fade = elapsed > dur - 800 ? (dur - elapsed) / 800 : Math.min(1, elapsed / 400);
    for (const s of sparks) {
      s.angle += s.speed;
      const x = cx + Math.cos(s.angle) * s.radius;
      const y = cy + Math.sin(s.angle) * s.radius * 0.7;
      const twinkle = (Math.sin(elapsed * 0.004 + s.angle * 3) + 1) / 2;
      ctx.fillStyle = rgba(s.color, twinkle * fade * 0.9);
      drawStar(ctx, x, y, s.size * (0.5 + twinkle * 0.5));
    }
    id = requestAnimationFrame(animate);
  };
  id = requestAnimationFrame(animate);
  return () => { cancelAnimationFrame(id); ctx.clearRect(0, 0, w, h); };
}

// 7. DaisyFall
function daisyFall(ctx: CanvasRenderingContext2D, w: number, h: number): StopFn {
  const daisies = Array.from({ length: 35 }, () => ({
    x: rand(0, w), y: rand(-h * 0.5, 0),
    speed: rand(1, 3), size: rand(10, 22),
    rot: rand(0, Math.PI * 2), rotSpeed: rand(-0.025, 0.025),
  }));
  let id: number;
  const start = performance.now();
  const dur = 5000;
  const animate = (now: number) => {
    const elapsed = now - start;
    if (elapsed > dur) { ctx.clearRect(0, 0, w, h); return; }
    ctx.clearRect(0, 0, w, h);
    const fade = elapsed > dur - 1000 ? (dur - elapsed) / 1000 : 1;
    for (const d of daisies) {
      d.y += d.speed;
      d.x += Math.sin(elapsed * 0.001 + d.rot) * 0.5;
      d.rot += d.rotSpeed;
      drawDaisy(ctx, d.x, d.y, d.size, d.rot, fade * 0.85);
      if (d.y > h + 30) { d.y = -30; d.x = rand(0, w); }
    }
    id = requestAnimationFrame(animate);
  };
  id = requestAnimationFrame(animate);
  return () => { cancelAnimationFrame(id); ctx.clearRect(0, 0, w, h); };
}

// 8. TulipPop
function tulipPop(ctx: CanvasRenderingContext2D, w: number, h: number): StopFn {
  const tulips = Array.from({ length: 12 }, (_, i) => ({
    x: w * 0.15 + (w * 0.7 / 11) * i,
    baseY: h + 20,
    peakY: h * 0.3 + rand(-40, 40),
    size: rand(18, 30),
    color: pick(COLORS),
    delay: rand(0, 800),
  }));
  let id: number;
  const start = performance.now();
  const dur = 4000;
  const animate = (now: number) => {
    const elapsed = now - start;
    if (elapsed > dur) { ctx.clearRect(0, 0, w, h); return; }
    ctx.clearRect(0, 0, w, h);
    for (const t of tulips) {
      const te = Math.max(0, elapsed - t.delay);
      const progress = te / (dur - t.delay);
      if (progress <= 0 || progress >= 1) continue;
      // Spring up then fade
      let y: number;
      if (progress < 0.3) {
        const p = progress / 0.3;
        const eased = 1 - Math.pow(1 - p, 3);
        y = t.baseY + (t.peakY - t.baseY) * eased;
      } else {
        y = t.peakY;
      }
      const opacity = progress > 0.7 ? Math.max(0, 1 - (progress - 0.7) / 0.3) : Math.min(1, progress * 5);
      // Draw stem
      ctx.strokeStyle = rgba([34, 139, 34], opacity * 0.7);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(t.x, t.baseY);
      ctx.lineTo(t.x, y);
      ctx.stroke();
      drawTulip(ctx, t.x, y - t.size * 0.3, t.size, t.color, opacity);
    }
    id = requestAnimationFrame(animate);
  };
  id = requestAnimationFrame(animate);
  return () => { cancelAnimationFrame(id); ctx.clearRect(0, 0, w, h); };
}

// 9. RibbonSweep
function ribbonSweep(ctx: CanvasRenderingContext2D, w: number, h: number): StopFn {
  const trail: { x: number; y: number; size: number; rot: number; color: [number, number, number]; born: number }[] = [];
  let id: number;
  const start = performance.now();
  const dur = 4000;
  const animate = (now: number) => {
    const elapsed = now - start;
    if (elapsed > dur) { ctx.clearRect(0, 0, w, h); return; }
    ctx.clearRect(0, 0, w, h);
    const progress = elapsed / dur;
    // Ribbon position: diagonal sweep
    const rx = progress * (w + 200) - 100;
    const ry = progress * h * 0.6 + h * 0.2 + Math.sin(progress * Math.PI * 4) * 40;
    // Ribbon line
    ctx.strokeStyle = rgba([253, 164, 175], 0.5);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(rx - 60, ry - 20);
    ctx.quadraticCurveTo(rx, ry + 15, rx + 60, ry - 20);
    ctx.stroke();
    // Drop petals
    if (elapsed % 50 < 17 && trail.length < 200) {
      trail.push({
        x: rx + rand(-30, 30), y: ry + rand(-20, 20),
        size: rand(6, 12), rot: rand(0, Math.PI * 2),
        color: pick(COLORS), born: elapsed,
      });
    }
    for (const p of trail) {
      const age = (elapsed - p.born) / 2000;
      if (age > 1) continue;
      p.y += 0.3;
      ctx.fillStyle = rgba(p.color, (1 - age) * 0.7);
      drawPetal(ctx, p.x, p.y, p.size, p.rot);
    }
    id = requestAnimationFrame(animate);
  };
  id = requestAnimationFrame(animate);
  return () => { cancelAnimationFrame(id); ctx.clearRect(0, 0, w, h); };
}

// 10. ShineWipe
function shineWipe(ctx: CanvasRenderingContext2D, w: number, h: number): StopFn {
  let id: number;
  const start = performance.now();
  const dur = 2500;
  const animate = (now: number) => {
    const elapsed = now - start;
    if (elapsed > dur) { ctx.clearRect(0, 0, w, h); return; }
    ctx.clearRect(0, 0, w, h);
    const progress = elapsed / dur;
    const shineX = progress * (w + 300) - 150;
    const grad = ctx.createLinearGradient(shineX - 80, 0, shineX + 80, 0);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.15)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.25)');
    grad.addColorStop(0.6, 'rgba(255,255,255,0.15)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    id = requestAnimationFrame(animate);
  };
  id = requestAnimationFrame(animate);
  return () => { cancelAnimationFrame(id); ctx.clearRect(0, 0, w, h); };
}

// 11. HeartPulse
function heartPulse(ctx: CanvasRenderingContext2D, w: number, h: number): StopFn {
  const cx = w / 2, cy = h / 2;
  let id: number;
  const start = performance.now();
  const dur = 4000;
  let shatterParts: { x: number; y: number; vx: number; vy: number; size: number; color: [number, number, number] }[] = [];
  let shattered = false;
  const animate = (now: number) => {
    const elapsed = now - start;
    if (elapsed > dur) { ctx.clearRect(0, 0, w, h); return; }
    ctx.clearRect(0, 0, w, h);
    if (elapsed < 2000) {
      const scale = 1 + Math.sin(elapsed / 500 * Math.PI) * 0.25;
      const size = 55 * scale;
      ctx.fillStyle = rgba([236, 72, 153], 0.85);
      drawHeart(ctx, cx, cy - size / 2, size);
    } else {
      if (!shattered) {
        shattered = true;
        shatterParts = Array.from({ length: 80 }, () => ({
          x: cx + rand(-25, 25), y: cy + rand(-15, 15),
          vx: rand(-8, 8), vy: rand(-10, 3),
          size: rand(4, 12), color: pick(COLORS),
        }));
      }
      const p2 = (elapsed - 2000) / 2000;
      for (const p of shatterParts) {
        p.x += p.vx; p.vy += 0.2; p.y += p.vy;
        const opacity = Math.max(0, 1 - p2 * 1.5);
        ctx.fillStyle = rgba(p.color, opacity);
        drawHeart(ctx, p.x, p.y, p.size);
      }
    }
    id = requestAnimationFrame(animate);
  };
  id = requestAnimationFrame(animate);
  return () => { cancelAnimationFrame(id); ctx.clearRect(0, 0, w, h); };
}

// 12. SpringWave
function springWave(ctx: CanvasRenderingContext2D, w: number, h: number): StopFn {
  const particles = Array.from({ length: 80 }, () => ({
    baseX: rand(-50, w + 50),
    y: rand(h * 0.1, h * 0.9),
    size: rand(7, 15), rot: rand(0, Math.PI * 2),
    color: pick(COLORS), offset: rand(0, 200),
  }));
  let id: number;
  const start = performance.now();
  const dur = 4000;
  const animate = (now: number) => {
    const elapsed = now - start;
    if (elapsed > dur) { ctx.clearRect(0, 0, w, h); return; }
    ctx.clearRect(0, 0, w, h);
    const waveX = (elapsed / dur) * (w + 400) - 200;
    const fade = elapsed > dur - 800 ? (dur - elapsed) / 800 : 1;
    for (const p of particles) {
      const dist = Math.abs(p.baseX - waveX + p.offset);
      if (dist > 200) continue;
      const intensity = 1 - dist / 200;
      const x = p.baseX + Math.sin(elapsed * 0.003 + p.y * 0.01) * 10;
      ctx.fillStyle = rgba(p.color, intensity * fade * 0.75);
      drawPetal(ctx, x, p.y, p.size * intensity, p.rot + elapsed * 0.002);
    }
    id = requestAnimationFrame(animate);
  };
  id = requestAnimationFrame(animate);
  return () => { cancelAnimationFrame(id); ctx.clearRect(0, 0, w, h); };
}

// ─── Effects Registry with weights ───

const effectsList: { name: string; fn: EffectFn; weight: number }[] = [
  { name: 'bouquetReveal', fn: bouquetReveal, weight: 1 },
  { name: 'petalRain', fn: petalRain, weight: 3 },
  { name: 'heartBurst', fn: heartBurst, weight: 3 },
  { name: 'floralConfetti', fn: floralConfetti, weight: 3 },
  { name: 'bloomFrame', fn: bloomFrame, weight: 2 },
  { name: 'sparkleOrbit', fn: sparkleOrbit, weight: 3 },
  { name: 'daisyFall', fn: daisyFall, weight: 3 },
  { name: 'tulipPop', fn: tulipPop, weight: 2 },
  { name: 'ribbonSweep', fn: ribbonSweep, weight: 2 },
  { name: 'shineWipe', fn: shineWipe, weight: 3 },
  { name: 'heartPulse', fn: heartPulse, weight: 2 },
  { name: 'springWave', fn: springWave, weight: 3 },
];

// ─── Effect Manager ───

export class EffectManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private stopFn: StopFn | null = null;
  private lastIndices: number[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  private setupCanvas(): { w: number; h: number } {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w, h };
  }

  startRandom(): void {
    this.stopCurrent();
    // Weighted random, excluding recent
    const candidates = effectsList
      .map((e, i) => ({ idx: i, weight: e.weight }))
      .filter(c => !this.lastIndices.includes(c.idx));
    const totalWeight = candidates.reduce((s, c) => s + c.weight, 0);
    let r = Math.random() * totalWeight;
    let idx = candidates[0]?.idx ?? 0;
    for (const c of candidates) {
      r -= c.weight;
      if (r <= 0) { idx = c.idx; break; }
    }
    this.lastIndices.push(idx);
    if (this.lastIndices.length > 4) this.lastIndices.shift();
    const { w, h } = this.setupCanvas();
    this.stopFn = effectsList[idx].fn(this.ctx, w, h);
  }

  stopCurrent(): void {
    if (this.stopFn) { this.stopFn(); this.stopFn = null; }
  }

  cleanup(): void { this.stopCurrent(); }
}
