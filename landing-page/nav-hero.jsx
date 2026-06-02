// Omega AI landing — Nav + Hero
function Logo({ tone = "light", mark = false }) {
  return (
    <a className={`brand brand--${tone}`} href="#top" aria-label="Omega AI home">
      <img className={mark ? "brand__mark" : "brand__lockup"} src={mark ? ASSETS.iconWhite : ASSETS.lockupWhite} alt="Omega AI" />
    </a>
  );
}

function SectionMark({ tone = "blue" }) {
  return <img className="section-mark" src={tone === "white" ? ASSETS.iconWhite : ASSETS.iconBlue} alt="" aria-hidden="true" />;
}

function SiteHeader({ activeSection, onContact }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled(40);
  return (
    <header className={`nav-shell${scrolled ? " is-scrolled" : ""}`}>
      <Logo tone="light" />
      <nav className="desktop-nav" aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => (
          <a key={item.label} className={activeSection === item.id ? "is-active" : ""} href={item.href}>{item.label}</a>
        ))}
      </nav>
      <button className="nav-cta" type="button" onClick={onContact}>
        <span>Request Access</span>
        <Icon name="arrow-right" size={16} />
      </button>
      <button className="menu-button" type="button" onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
        <Icon name={menuOpen ? "x" : "menu"} size={22} />
      </button>
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <button type="button" onClick={() => { setMenuOpen(false); onContact(); }}>Request Access</button>
        </nav>
      )}
    </header>
  );
}

function Hero({ onContact, tweaks, canvasRef }) {
  useWave(canvasRef, tweaks);
  return (
    <section className="hero" id="top">
      <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hero__mesh" aria-hidden="true" />
      <div className="hero__wash" aria-hidden="true" />
      <div className="site-container hero__content">
        <div className="hero__copy" data-screen-label="Hero">
          <h1>
            <span>Democratising</span>
            <span>High Performance</span>
            <span>Computing</span>
          </h1>
          <p className="hero__lede">
            <strong>Unleash cutting-edge AI</strong> and scalable computing solutions for a sustainable future.
          </p>
          <div className="actions">
            <a className="button button--outline-light" href="#about">
              <span>Learn more</span>
            </a>
            <button className="button button--text-light" type="button" onClick={onContact}>
              <span>Get Started</span>
              <Icon name="arrow-right" size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Logo, SectionMark, SiteHeader, Hero });
