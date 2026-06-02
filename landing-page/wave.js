/* ============================================================
   Omega AI — Hero wave engines
   Two interchangeable background animations behind one API:
     OmegaWave.Canvas  — lightweight 2D perspective node-grid
     OmegaWave.Three   — WebGL 3D point-cloud wave (Three.js)
   Common interface: new Engine(canvas, opts); .start(); .stop();
                      .setOptions(opts); .resize();
   Options: { intensity:0..100, speed, colorA, colorB, pointer:true }
   Both pause on hidden tab / reduced-motion and cap DPR.
   ============================================================ */
(function () {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function hexToRgb(h) {
    const m = h.replace("#", "");
    const n = parseInt(m.length === 3 ? m.split("").map((c) => c + c).join("") : m, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

  /* ---------- Canvas 2D perspective wave ---------- */
  class CanvasWave {
    constructor(canvas, opts) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.opts = Object.assign({ intensity: 30, speed: 1, colorA: "#0513ed", colorB: "#36e6ff", pointer: true }, opts);
      this.cols = 58; this.rows = 32;
      this.t = 0; this.raf = null; this.running = false;
      this.px = 0.5; this.py = 0.5; this.tpx = 0.5; this.tpy = 0.5;
      this._onMove = (e) => {
        const r = this.canvas.getBoundingClientRect();
        this.tpx = (e.clientX - r.left) / r.width;
        this.tpy = (e.clientY - r.top) / r.height;
      };
      this.resize();
    }
    setOptions(o) { Object.assign(this.opts, o); }
    resize() {
      const r = this.canvas.getBoundingClientRect();
      this.w = Math.max(1, r.width); this.h = Math.max(1, r.height);
      this.canvas.width = this.w * DPR; this.canvas.height = this.h * DPR;
      this.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    start() {
      if (this.running) return;
      this.running = true;
      if (this.opts.pointer) window.addEventListener("pointermove", this._onMove, { passive: true });
      // Buffer size depends on resolved layout — observe the canvas box so the
      // first real layout pass (and any later change) sets the buffer correctly.
      this._ro = new ResizeObserver(() => { this.resize(); this.draw(); });
      this._ro.observe(this.canvas);
      const loop = () => {
        if (!this.running) return;
        this.raf = requestAnimationFrame(loop);
        if (document.hidden) return;
        this.draw();
      };
      this.draw(); // first frame even if reduced-motion
      if (!REDUCED) loop();
    }
    stop() {
      this.running = false;
      if (this.raf) cancelAnimationFrame(this.raf);
      if (this._ro) { this._ro.disconnect(); this._ro = null; }
      window.removeEventListener("pointermove", this._onMove);
    }
    draw() {
      const { ctx, w, h, cols, rows } = this;
      const amp = (this.opts.intensity / 100) * 120 + 30;
      const spd = this.opts.speed * (REDUCED ? 0 : 1);
      this.t += 0.006 * spd;
      this.px += (this.tpx - this.px) * 0.05;
      this.py += (this.tpy - this.py) * 0.05;
      const cA = hexToRgb(this.opts.colorA), cB = hexToRgb(this.opts.colorB);
      ctx.clearRect(0, 0, w, h);

      const horizon = h * 0.26;
      const centerX = w * (0.5 + (this.px - 0.5) * 0.06);
      // Two slow-drifting ripple sources give the field a web / neural feel.
      const r1u = 0.62 + Math.sin(this.t * 0.42) * 0.22, r1v = 0.55 + Math.cos(this.t * 0.33) * 0.18;
      const r2u = 0.30 + Math.cos(this.t * 0.27) * 0.20, r2v = 0.80 + Math.sin(this.t * 0.31) * 0.12;
      const pts = [];
      for (let j = 0; j < rows; j++) {
        const v = j / (rows - 1);                 // 0 far → 1 near
        const persp = 0.16 + v * v * 1.15;        // near rows wider & taller
        const baseY = horizon + Math.pow(v, 1.32) * (h - horizon) * 1.08;
        const rowSpread = w * (0.34 + persp * 0.64);
        const row = [];
        for (let i = 0; i < cols; i++) {
          const u = i / (cols - 1);
          const d1 = Math.hypot(u - r1u, (v - r1v) * 1.4);
          const d2 = Math.hypot(u - r2u, (v - r2v) * 1.4);
          const wave =
            Math.sin(u * 3.4 + this.t * 1.2) * Math.cos(v * 3.0 - this.t * 0.8) * 0.85 + // big rolling swell
            Math.sin(d1 * 13.0 - this.t * 2.3) * 0.55 +                                  // ripple source 1
            Math.cos(d2 * 16.0 - this.t * 1.8) * 0.40 +                                  // ripple source 2
            Math.sin((u * 1.7 - v * 2.3) * 3.0 + this.t * 0.9) * 0.28;                   // cross weave
          const wobble = Math.sin(v * 5.0 + this.t * 1.1 + u * 2.0) * 0.5;               // organic horizontal sway
          const x = centerX + (u - 0.5) * 2 * rowSpread + wobble * amp * persp * 0.35;
          const y = baseY - wave * amp * persp;
          row.push([x, y, v, (wave + 2.0) / 4.0]);
        }
        pts.push(row);
      }

      // horizontal lines
      ctx.lineWidth = 1;
      for (let j = 0; j < rows; j++) {
        const row = pts[j], v = row[0][2];
        const col = mix(cA, cB, Math.min(1, v * 1.15));
        ctx.beginPath();
        for (let i = 0; i < cols; i++) { const p = row[i]; i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
        ctx.strokeStyle = rgba(col, 0.10 + v * 0.42);
        ctx.stroke();
      }
      // depth lines
      for (let i = 0; i < cols; i += 1) {
        ctx.beginPath();
        for (let j = 0; j < rows; j++) { const p = pts[j][i]; j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
        ctx.strokeStyle = rgba(mix(cA, cB, 0.4), 0.07);
        ctx.stroke();
      }
      // nodes (skip far rows for perf/clarity)
      for (let j = 4; j < rows; j++) {
        const row = pts[j], v = row[0][2];
        for (let i = 0; i < cols; i++) {
          if ((i + j) % 2) continue;
          const p = row[i];
          const hgt = p[3];
          const col = mix(cA, cB, Math.min(1, hgt * 1.2));
          const r = (0.6 + v * 2.0) * (0.7 + hgt * 0.95);
          const a = (0.18 + v * 0.62) * (0.55 + hgt * 0.8);
          if (hgt > 0.6 && v > 0.4) { ctx.shadowBlur = 10; ctx.shadowColor = rgba(cB, 0.7); }
          else ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(p[0], p[1], r, 0, 6.2832);
          ctx.fillStyle = rgba(col, Math.min(0.95, a));
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
    }
  }

  /* ---------- Three.js 3D point-cloud wave ---------- */
  class ThreeWave {
    constructor(canvas, opts) {
      this.canvas = canvas;
      this.opts = Object.assign({ intensity: 30, speed: 1, colorA: "#0513ed", colorB: "#36e6ff", pointer: true }, opts);
      this.t = 0; this.raf = null; this.running = false; this.ready = false;
      this.tpx = 0; this.tpy = 0; this.px = 0; this.py = 0;
      this._onMove = (e) => {
        const r = this.canvas.getBoundingClientRect();
        this.tpx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        this.tpy = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
    }
    setOptions(o) { Object.assign(this.opts, o); this._applyColors && this._applyColors(); }
    _init() {
      const T = window.THREE;
      this.renderer = new T.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
      this.renderer.setPixelRatio(DPR);
      this.scene = new T.Scene();
      this.camera = new T.PerspectiveCamera(55, 1, 0.1, 100);
      this.camera.position.set(0, 4.2, 9);
      this.camera.lookAt(0, -1.2, -2);

      const SEG = 96, SIZE = 34;
      const geo = new T.PlaneGeometry(SIZE, SIZE, SEG, SEG);
      geo.rotateX(-Math.PI / 2);
      this.geo = geo; this.seg = SEG;
      this.base = Float32Array.from(geo.attributes.position.array);
      const colors = new Float32Array(geo.attributes.position.count * 3);
      geo.setAttribute("color", new T.BufferAttribute(colors, 3));
      this._applyColors = () => {
        const cA = hexToRgb(this.opts.colorA).map((c) => c / 255);
        const cB = hexToRgb(this.opts.colorB).map((c) => c / 255);
        const pos = geo.attributes.position.array;
        for (let k = 0; k < geo.attributes.position.count; k++) {
          const z = pos[k * 3 + 2]; // depth
          const t = Math.min(1, Math.max(0, (z + SIZE / 2) / SIZE));
          colors[k * 3] = cA[0] + (cB[0] - cA[0]) * t;
          colors[k * 3 + 1] = cA[1] + (cB[1] - cA[1]) * t;
          colors[k * 3 + 2] = cA[2] + (cB[2] - cA[2]) * t;
        }
        geo.attributes.color.needsUpdate = true;
      };
      this._applyColors();

      const mat = new T.PointsMaterial({ size: 0.075, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false, blending: T.AdditiveBlending });
      this.points = new T.Points(geo, mat);
      this.scene.add(this.points);
      this.ready = true;
      this.resize();
    }
    resize() {
      if (!this.ready) return;
      const r = this.canvas.getBoundingClientRect();
      this.renderer.setSize(r.width, r.height, false);
      this.camera.aspect = r.width / Math.max(1, r.height);
      this.camera.updateProjectionMatrix();
    }
    start() {
      if (this.running) return;
      if (!window.THREE) { console.warn("Three.js not loaded"); return; }
      if (!this.ready) this._init();
      this.running = true;
      if (this.opts.pointer) window.addEventListener("pointermove", this._onMove, { passive: true });
      this._ro = new ResizeObserver(() => { this.resize(); this.draw(); });
      this._ro.observe(this.canvas);
      const loop = () => {
        if (!this.running) return;
        this.raf = requestAnimationFrame(loop);
        if (document.hidden) return;
        this.draw();
      };
      this.draw();
      if (!REDUCED) loop();
    }
    stop() {
      this.running = false;
      if (this.raf) cancelAnimationFrame(this.raf);
      if (this._ro) { this._ro.disconnect(); this._ro = null; }
      window.removeEventListener("pointermove", this._onMove);
    }
    draw() {
      if (!this.ready) return;
      const amp = (this.opts.intensity / 100) * 2.6 + 0.5;
      this.t += 0.01 * this.opts.speed * (REDUCED ? 0 : 1);
      const pos = this.geo.attributes.position.array, base = this.base;
      const rcx = Math.sin(this.t * 0.4) * 6, rcz = Math.cos(this.t * 0.3) * 6;
      for (let k = 0; k < pos.length; k += 3) {
        const x = base[k], z = base[k + 2];
        const d = Math.hypot(x - rcx, z - rcz);
        pos[k + 1] =
          (Math.sin(x * 0.28 + this.t * 1.3) * Math.cos(z * 0.30 - this.t * 0.8) * 0.7 +
           Math.sin(d * 0.7 - this.t * 2.0) * 0.5 +
           Math.sin((x + z) * 0.22 + this.t) * 0.35) * amp;
      }
      this.geo.attributes.position.needsUpdate = true;
      this.px += (this.tpx - this.px) * 0.04; this.py += (this.tpy - this.py) * 0.04;
      this.camera.position.x = this.px * 1.6;
      this.camera.position.y = 4.2 - this.py * 0.8;
      this.camera.lookAt(0, -1.2, -2);
      this.renderer.render(this.scene, this.camera);
    }
  }

  window.OmegaWave = { Canvas: CanvasWave, Three: ThreeWave, REDUCED };
})();
