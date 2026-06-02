// Omega AI landing — shared lib: Icon, data, hooks, wave manager
const { useState, useEffect, useRef, useCallback } = React;

function Icon({ name, size = 22, strokeWidth = 2 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '<i data-lucide="' + name + '"></i>';
    window.lucide.createIcons({ attrs: { width: size, height: size, "stroke-width": strokeWidth } });
  }, [name, size, strokeWidth]);
  return <span className="lucide-wrap" style={{ display: "inline-flex" }} ref={ref} aria-hidden="true" />;
}

const NAV_ITEMS = [
  { label: "Our Services", href: "#services", id: "services" },
  { label: "About Us", href: "#about", id: "about" },
  { label: "Contact", href: "#contact", id: "contact" },
  { label: "Infrastructure", href: "#insights", id: "insights" }
];

const FEATURES = [
  { title: "Revolutionary Technology", body: "AI-assisted orchestration that turns distributed compute into an easier access layer for advanced workloads.", icon: "zap" },
  { title: "Scalable & Adaptable", body: "A flexible platform direction for research teams, enterprises, and AI builders with changing compute demand.", icon: "layers" },
  { title: "Sustainable Performance", body: "Designed around more efficient use of available compute capacity instead of defaulting to heavy centralised expansion.", icon: "leaf" },
  { title: "Cost-Efficient Innovation", body: "A lower-overhead path to high-performance infrastructure for teams pushing model, science, and simulation work.", icon: "trending-down" }
];

const METRICS = [
  { value: "AI", label: "training and inference workloads" },
  { value: "HPC", label: "scientific and research compute" },
  { value: "Sovereign", label: "distributed infrastructure model" }
];

const ASSETS = {
  iconWhite: "../assets/logos/omega-icon-white.svg",
  iconNavy: "../assets/logos/omega-icon-navy.png",
  iconBlue: "../assets/logos/omega-icon-blue.svg",
  lockupWhite: "../assets/logos/omega-lockup-white.svg",
  lockupBlue: "../assets/logos/omega-lockup-blue.svg",
  serverRack: "../assets/images/server-rack-square.jpg",
  operator: "../assets/images/operator-datacenter.jpg",
  aiInterface: "../assets/images/ai-interface.jpg",
  technician: "../assets/images/technician-rack-square.jpg"
};

// Nav frosts after scrolling past a threshold
function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

// Reveal on scroll + pointer glow on interactive cards
function useReveal() {
  useEffect(() => {
    const reveal = [...document.querySelectorAll("[data-reveal]")];
    const hard = (n) => { n.classList.add("is-visible"); n.style.transition = "none"; n.style.opacity = "1"; n.style.transform = "none"; };
    if (document.visibilityState === "hidden" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal.forEach(hard); 
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
      }, { threshold: 0.16 });
      reveal.forEach((n) => io.observe(n));
      var t = setTimeout(() => document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(hard), 1600);
    }
    const cards = [...document.querySelectorAll(".feature-card")];
    const move = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", (e.clientX - r.left) + "px");
      e.currentTarget.style.setProperty("--my", (e.clientY - r.top) + "px");
    };
    cards.forEach((c) => c.addEventListener("pointermove", move));
    return () => { cards.forEach((c) => c.removeEventListener("pointermove", move)); if (t) clearTimeout(t); };
  }, []);
}

function useActiveSection(setActive) {
  useEffect(() => {
    const secs = NAV_ITEMS.map((i) => document.querySelector(i.href)).filter(Boolean);
    if (!secs.length) return;
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (vis && vis.target.id) setActive(vis.target.id);
    }, { rootMargin: "-40% 0px -55% 0px", threshold: [0.1, 0.3, 0.6] });
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [setActive]);
}

// Manages the hero wave engine; swaps Canvas <-> Three on demand
function useWave(canvasRef, tweaks) {
  const engineRef = useRef(null);
  const techRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.OmegaWave) return;
    const opts = { intensity: tweaks.intensity, speed: tweaks.speed, colorA: tweaks.colorA, colorB: tweaks.colorB, pointer: tweaks.pointer };
    if (techRef.current !== tweaks.technique) {
      if (engineRef.current) engineRef.current.stop();
      let engine = null;
      if (tweaks.technique === "three") {
        try {
          engine = new window.OmegaWave.Three(canvas, opts);
          engine.start();
          if (!engine.ready) throw new Error("WebGL unavailable");
        } catch (err) {
          console.warn("3D wave unavailable, falling back to Canvas:", err && err.message);
          if (engine) { try { engine.stop(); } catch (e) {} }
          engine = new window.OmegaWave.Canvas(canvas, opts);
          engine.start();
        }
      } else {
        engine = new window.OmegaWave.Canvas(canvas, opts);
        engine.start();
      }
      engineRef.current = engine;
      techRef.current = tweaks.technique;
    } else if (engineRef.current) {
      engineRef.current.setOptions(opts);
    }
  }, [tweaks.technique, tweaks.intensity, tweaks.speed, tweaks.colorA, tweaks.colorB, tweaks.pointer]);

  useEffect(() => {
    const onResize = () => engineRef.current && engineRef.current.resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  useEffect(() => () => { if (engineRef.current) engineRef.current.stop(); }, []);
}

// A standalone subtle canvas wave (infrastructure section)
function useAmbientWave(canvasRef, colorA, colorB) {
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !window.OmegaWave) return;
    const eng = new window.OmegaWave.Canvas(c, { intensity: 24, speed: 0.7, colorA, colorB, pointer: false });
    eng.start();
    const onResize = () => eng.resize();
    window.addEventListener("resize", onResize);
    return () => { eng.stop(); window.removeEventListener("resize", onResize); };
  }, [colorA, colorB]);
}

Object.assign(window, { Icon, NAV_ITEMS, FEATURES, METRICS, ASSETS, useScrolled, useReveal, useActiveSection, useWave, useAmbientWave });
