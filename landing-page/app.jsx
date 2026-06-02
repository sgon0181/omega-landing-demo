// Omega AI landing — app shell + tweaks
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "technique": "canvas",
  "intensity": 38,
  "speed": 1,
  "colorA": "#0513ed",
  "colorB": "#36e6ff",
  "pointer": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeSection, setActiveSection] = useState("services");
  const [modalOpen, setModalOpen] = useState(false);
  const heroCanvas = useRef(null);

  useReveal();
  useActiveSection(setActiveSection);
  useEffect(() => {
    document.body.classList.toggle("modal-active", modalOpen);
    return () => document.body.classList.remove("modal-active");
  }, [modalOpen]);

  const openContact = useCallback(() => setModalOpen(true), []);

  return (
    <React.Fragment>
      <SiteHeader activeSection={activeSection} onContact={openContact} />
      <Hero onContact={openContact} tweaks={t} canvasRef={heroCanvas} />
      <main>
        <ContextStrip />
        <AboutSection onContact={openContact} />
        <WhyChooseSection onContact={openContact} />
        <InfrastructureSection tweaks={t} />
        <FinalCta onContact={openContact} />
      </main>
      <Footer onContact={openContact} />
      {modalOpen && <ContactModal onClose={() => setModalOpen(false)} />}

      <TweaksPanel>
        <TweakSection label="Background wave" />
        <TweakRadio label="Engine" value={t.technique} options={[{ value: "canvas", label: "Canvas" }, { value: "three", label: "3D / WebGL" }]} onChange={(v) => setTweak("technique", v)} />
        <TweakSlider label="Intensity" value={t.intensity} min={0} max={100} step={5} onChange={(v) => setTweak("intensity", v)} />
        <TweakSlider label="Speed" value={t.speed} min={0.2} max={2} step={0.1} unit="x" onChange={(v) => setTweak("speed", v)} />
        <TweakToggle label="Cursor reactive" value={t.pointer} onChange={(v) => setTweak("pointer", v)} />
        <TweakColor label="Deep tone" value={t.colorA} options={["#0513ed", "#02085f", "#1226ff"]} onChange={(v) => setTweak("colorA", v)} />
        <TweakColor label="Glow tone" value={t.colorB} options={["#36e6ff", "#5b8cff", "#8a7cff", "#00d4a0"]} onChange={(v) => setTweak("colorB", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
