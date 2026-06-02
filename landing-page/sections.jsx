// Omega AI landing — body sections + modal
function ContextStrip() {
  return (
    <section className="context-strip" aria-label="Omega AI positioning">
      <div className="site-container context-strip__inner">
        <strong>High Performance Computing</strong>
        <span>Decentralised. Scalable. Sustainable.</span>
        <div className="context-strip__line" />
        <img src={ASSETS.iconBlue} alt="" aria-hidden="true" />
      </div>
    </section>
  );
}

function AboutSection({ onContact }) {
  return (
    <section className="page-section about" id="about">
      <div className="site-container about__grid">
        <div className="section-copy" data-reveal data-screen-label="About">
          <img className="section-lockup" src={ASSETS.lockupBlue} alt="Omega AI" />
          <p className="eyebrow">About us</p>
          <h2>Transforming how high performance computing powers innovation.</h2>
          <p>
            Omega AI combines artificial intelligence with a pioneering decentralised computing
            system — enabling breakthrough performance, better scalability, and a more accessible
            path to serious compute.
          </p>
          <button className="text-action" type="button" onClick={onContact}>
            <Icon name="arrow-right" size={18} />
            <span>Contact us</span>
          </button>
        </div>
        <div className="about__visual" data-reveal>
          <img src={ASSETS.serverRack} alt="Server rack with illuminated compute nodes" />
          <span className="float-chip"><span className="dot" />Live compute fabric</span>
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection({ onContact }) {
  return (
    <section className="page-section why" id="services">
      <div className="why__bg" aria-hidden="true" />
      <div className="why__veil" aria-hidden="true" />
      <div className="site-container why__inner">
        <div className="why__header" data-reveal data-screen-label="Services">
          <p className="eyebrow">Our services</p>
          <h2 className="knockout-img">Why choose Omega AI?</h2>
        </div>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <article className="feature-card" key={f.title} data-reveal>
              <span className="feature-card__icon"><Icon name={f.icon} size={22} /></span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
        <div className="center-action">
          <button className="button button--primary" type="button" onClick={onContact}>
            <span>Contact us</span>
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function InfrastructureSection({ tweaks }) {
  const ref = useRef(null);
  useAmbientWave(ref, tweaks.colorA, tweaks.colorB);
  return (
    <section className="infrastructure" id="insights" data-screen-label="Infrastructure">
      <canvas className="infrastructure__canvas" ref={ref} aria-hidden="true" />
      <div className="site-container infrastructure__grid">
        <div className="infrastructure__copy" data-reveal>
          <SectionMark tone="white" />
          <p className="eyebrow eyebrow--light">Infrastructure</p>
          <h2>Decentralised compute, engineered for tomorrow.</h2>
          <p>
            Omega AI is not another generic cloud. It is a technical platform direction for
            organisations that need adaptive compute, reliable orchestration, and a lower-overhead
            path to AI and scientific workloads.
          </p>
        </div>
        <div className="metric-row" aria-label="Omega AI workload focus">
          {METRICS.map((m) => (
            <div className="metric" key={m.value} data-reveal>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ onContact }) {
  return (
    <section className="final-cta" id="contact">
      <div className="site-container">
        <div className="cta-panel" data-reveal data-screen-label="CTA">
          <div className="cta-panel__copy">
            <SectionMark tone="white" />
            <h2>Join the future of computing.</h2>
            <p>
              Discover how Omega AI is democratising access to high-performance computing and
              helping innovators move from limited capacity to scalable infrastructure.
            </p>
            <strong>Empowering innovation, sustainably.</strong>
            <div className="actions">
              <button className="button button--primary" type="button" onClick={onContact}>
                <span>Get Started</span>
                <Icon name="arrow-right" size={18} />
              </button>
              <a className="button button--outline" href="#about" style={{ background: "rgba(255,255,255,0.06)", borderColor: "var(--glass-line)", color: "#fff" }}>
                <span>Learn more</span>
              </a>
            </div>
          </div>
          <div className="cta-panel__image">
            <img src={ASSETS.aiInterface} alt="AI interface on a transparent screen" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onContact }) {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer__inner">
        <div>
          <Logo tone="light" />
          <p><strong>High Performance Computing</strong><span>Decentralised. Scalable. Sustainable.</span></p>
        </div>
        <div className="footer-contact">
          <div className="social-links" aria-label="Social links">
            <a href="https://www.instagram.com/" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://www.facebook.com/" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3l.5-3H14V4.2c0-.8.3-1.4 1.5-1.4H18V.2C17.6.1 16.4 0 15.2 0 12.6 0 11 1.6 11 4v2H8v3h3v9h3V9z"/></svg>
            </a>
            <a href="https://www.linkedin.com/" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.5 8h4V24h-4V8zM8 8h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4 0 4.75 2.65 4.75 6.1V24h-4v-7c0-1.67-.03-3.8-2.32-3.8-2.32 0-2.68 1.8-2.68 3.68V24H8V8z"/></svg>
            </a>
          </div>
          <address>
            <button type="button" onClick={onContact}>Phone 0432 942 956</button>
            <a href="mailto:welcome@theomega.ai">welcome@theomega.ai</a>
          </address>
        </div>
      </div>
    </footer>
  );
}

function ContactModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", organisation: "", workload: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const update = (e) => setForm((c) => ({ ...c, [e.target.name]: e.target.value }));
  function submit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "Sending request..." });
    setTimeout(() => setStatus({ state: "success", message: "Request received. The Omega AI team will be in touch." }), 700);
  }
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title" onMouseDown={(e) => e.stopPropagation()}>
        <div className="contact-modal__header">
          <div>
            <p className="eyebrow">Pilot intake</p>
            <h2 id="contact-title">Start a compute conversation</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close contact form"><Icon name="x" size={22} /></button>
        </div>
        <form className="lead-form" onSubmit={submit}>
          <label><span>Name</span><input name="name" value={form.name} onChange={update} required /></label>
          <label><span>Email</span><input name="email" type="email" value={form.email} onChange={update} required /></label>
          <label><span>Organisation</span><input name="organisation" value={form.organisation} onChange={update} /></label>
          <label><span>Workload</span><textarea name="workload" value={form.workload} onChange={update} rows="3" placeholder="AI training, inference, scientific modelling, or other compute needs" /></label>
          {status.message && <p className={`form-status form-status--${status.state}`} role="status">{status.message}</p>}
          <button className="button button--primary form-submit" type="submit" disabled={status.state === "loading"}>
            <span>{status.state === "loading" ? "Sending" : "Send request"}</span>
            <Icon name="send" size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, { ContextStrip, AboutSection, WhyChooseSection, InfrastructureSection, FinalCta, Footer, ContactModal });
