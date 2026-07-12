import { useState, useEffect, useRef } from "react";
import "./Landing.css";
import logo from "../assets/logo.png";
import { CircuitBackground } from "@/components/ui/circuit-background";
import { BorderGlow } from "@/components/ui/border-glow";
import ThemeToggle from "@/components/ui/ThemeToggle";
import InfiniteCarousel from "@/components/ui/InfiniteCarousel";

// ── Carousel data ────────────────────────────────────────────────
const CAROUSEL_ITEMS = [
  {
    id: 1,
    label: 'SPEED',
    title: '5–10 mins',
    subtitle: 'Avg. processing time',
    description: 'From submission to barangay review — faster than any walk-in queue.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 2,
    label: 'SECURITY',
    title: 'Secure',
    subtitle: 'Encrypted & verified',
    description: 'Your personal data and documents are end-to-end encrypted at all times.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 11 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 3,
    label: 'MOBILE',
    title: 'Mobile-ready',
    subtitle: 'Works on any device',
    description: 'Fully responsive web app — access from your phone, tablet, or desktop.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <line x1="12" x2="12.01" y1="18" y2="18" />
      </svg>
    ),
  },
  {
    id: 4,
    label: 'LOCAL',
    title: 'Local-first',
    subtitle: 'Built for the community',
    description: 'Tailored for barangay governance — every feature designed for residents.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 5,
    label: 'PAPERLESS',
    title: 'Zero paper',
    subtitle: 'Fully digital workflow',
    description: 'Request, pay, and receive documents without a single physical form.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 6,
    label: 'TRACKING',
    title: 'Live tracking',
    subtitle: 'Know your request status',
    description: 'Get real-time status updates from submission through barangay approval.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 7,
    label: 'SUPPORT',
    title: '24 / 7 access',
    subtitle: 'Always available online',
    description: 'Submit requests any time of day — no need to wait for office hours.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
        <path d="M2 20h20" />
        <path d="M14 12v.01" />
      </svg>
    ),
  },
  {
    id: 8,
    label: 'COMMUNITY',
    title: 'Announcements',
    subtitle: 'Stay in the loop',
    description: 'Barangay news, health alerts, and events delivered directly to you.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 11 18-5v12L3 13v-2z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    ),
  },
];

// Reusable CountUp Animation Component with start trigger and delayed anim
function CountUp({ end, duration = 2000, suffix = "", prefix = "", format = false, start = false, delay = 800 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }

    let timeoutId = setTimeout(() => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * end);
        setCount(current);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [start, end, duration, delay]);

  const formatNumber = (num) => {
    if (format) {
      return num.toLocaleString();
    }
    return num;
  };

  return (
    <span>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

// Reusable Scroll Intersection Observer Wrapper Component
function ScrollAnimateSection({ children, className = "", id, tagName = "section", onInView }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (onInView) {
          onInView(entry.isIntersecting);
        }
      },
      { threshold: 0.05 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [onInView]);

  const Tag = tagName;

  return (
    <Tag 
      id={id} 
      ref={ref} 
      className={`${className} ${inView ? 'in-view' : ''}`}
    >
      {children}
    </Tag>
  );
}


export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [heroActive, setHeroActive] = useState(false);
  const [whyUsInView, setWhyUsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    
    // Animate Hero Section on mount
    const timer = setTimeout(() => setHeroActive(true), 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <CircuitBackground className="landing-wrapper" opacity={0.08} animated={true}>
      <header className={`landing-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo">
          <img src={logo} alt="ServiLine" className="nav-logo-icon" />
          <span className="nav-logo-text">ServiLine</span>
        </div>

        <div className="nav-links-pill">
          <a href="#services">Services</a>
          <a href="#why-us">Why Us</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <ThemeToggle />
          <a href="/login" className="nav-login">Sign In</a>
          <a href="/register" className="btn-primary btn-sm">Get Started →</a>
        </div>
      </header>

      <main className="landing-main">
        {/* HERO */}
        <section className={`hero-section ${heroActive ? "in-view" : ""}`}>
          <div className="hero-badge">
            <span className="badge-icon">⬡</span> Welcome to ServiLine
          </div>
          <h1 className="hero-heading">
            Barangay services,<br />
            <span className="hero-italic">designed for the</span><br />
            <span className="hero-italic">digital age.</span>
          </h1>
          <p className="hero-subtext">
            Request certificates, file reports, and stay connected to Barangay<br />
            <span className="text-emerald">24/7, without the lines.</span>
          </p>

          <div className="hero-btn-group">
            <a href="/register" className="btn-primary">Get Started →</a>
            <a href="#services" className="btn-secondary">Explore Services</a>
          </div>

          <div className="hero-trusted">
            <div className="avatar-group">
              <div className="avatar"></div>
              <div className="avatar"></div>
              <div className="avatar"></div>
              <div className="avatar"></div>
            </div>
            <span className="trusted-text">Trusted by <strong>4,200+</strong> residents</span>
          </div>

          {/* ── Infinite Carousel (replaces static stats-grid) ── */}
          <div className="hero-carousel-wrapper">
            <InfiniteCarousel items={CAROUSEL_ITEMS} speed={0.7} />
          </div>
        </section>

        {/* SERVICES */}
        <ScrollAnimateSection id="services" className="services-section">
          <div className="section-label">SERVICES</div>
          <h2 className="section-title">Everything residents need, in<br />one calm place.</h2>
          <p className="section-desc">
            Three core flows — certificates, reports, and announcements — engineered to remove friction<br />from local governance.
          </p>

          <div className="services-grid">
            {/* Certs */}
            <BorderGlow className="service-card" borderRadius={16}>
              <div className="service-card-header">
                <div className="service-icon">
                  <svg className="landing-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" x2="8" y1="13" y2="13" />
                    <line x1="16" x2="8" y1="17" y2="17" />
                    <line x1="10" x2="8" y1="9" y2="9" />
                  </svg>
                </div>
                <div className="service-badge">CERTIFICATES</div>
              </div>
              <h3 className="service-name">Request a Certificate</h3>
              <p className="service-text">Submit, pay, and track barangay-issued documents from anywhere.</p>
              <ul className="service-list">
                <li><span className="check">✓</span> Barangay Clearance</li>
                <li><span className="check">✓</span> Residency Certificate</li>
                <li><span className="check">✓</span> Indigency Certificate</li>
                <li><span className="check">✓</span> Good Moral Character</li>
                <li><span className="check">✓</span> Business Clearance</li>
              </ul>
              <a href="/login" className="service-link">Request now →</a>
            </BorderGlow>

            {/* Reports */}
            <BorderGlow className="service-card" borderRadius={16}>
              <div className="service-card-header">
                <div className="service-icon">
                  <svg className="landing-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="m9 15 2 2 4-4" />
                  </svg>
                </div>
                <div className="service-badge">REPORTS</div>
              </div>
              <h3 className="service-name">File a Report</h3>
              <p className="service-text">Raise incidents, safety issues, and community concerns securely.</p>
              <ul className="service-list">
                <li><span className="check">✓</span> Incident Reports</li>
                <li><span className="check">✓</span> Public Safety Issues</li>
                <li><span className="check">✓</span> Environmental Concerns</li>
                <li><span className="check">✓</span> Community Problems</li>
              </ul>
              <div className="service-tag">Reviewed within 24 hours</div>
              <a href="/login" className="service-link">Submit a report →</a>
            </BorderGlow>

            {/* Announcements */}
            <BorderGlow className="service-card" borderRadius={16}>
              <div className="service-card-header">
                <div className="service-icon">
                  <svg className="landing-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 11 18-5v12L3 13v-2z" />
                    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                  </svg>
                </div>
                <div className="service-badge">ANNOUNCEMENTS</div>
              </div>
              <h3 className="service-name">Stay in the Loop</h3>
              <p className="service-text">Real-time announcements, events, and emergency notices.</p>
              <ul className="service-list">
                <li><span className="check">✓</span> Official Announcements</li>
                <li><span className="check">✓</span> Community Events</li>
                <li><span className="check">✓</span> Health & Safety Alerts</li>
                <li><span className="check">✓</span> Emergency Notices</li>
              </ul>
              <div className="service-tag">Push & email alerts</div>
              <a href="/login" className="service-link">View updates →</a>
            </BorderGlow>
          </div>
        </ScrollAnimateSection>

        {/* HOW IT WORKS */}
        <ScrollAnimateSection id="how-it-works" className="how-it-works-section">
          <div className="section-label">HOW IT WORKS</div>
          <h2 className="section-title">From submission to release in<br />four steps.</h2>
          <p className="section-desc">A workflow tested with barangay staff, designed for residents of every age.</p>

          <div className="steps-grid">
            <BorderGlow className="step-card" borderRadius={12}>
              <div className="step-num">01</div>
              <h4>Create your account</h4>
              <p>Sign up once with your name, address, and a valid email.</p>
            </BorderGlow>
            <BorderGlow className="step-card" borderRadius={12}>
              <div className="step-num">02</div>
              <h4>Submit a request</h4>
              <p>Pick a service, fill the short form, and attach any documents.</p>
            </BorderGlow>
            <BorderGlow className="step-card" borderRadius={12}>
              <div className="step-num">03</div>
              <h4>Track in real-time</h4>
              <p>Watch status updates from submission to release — no calls needed.</p>
            </BorderGlow>
            <BorderGlow className="step-card" borderRadius={12}>
              <div className="step-num">04</div>
              <h4>Pick up or download</h4>
              <p>Claim your document at the hall or receive it digitally.</p>
            </BorderGlow>
          </div>
        </ScrollAnimateSection>

        {/* WHY US */}
        <ScrollAnimateSection id="why-us" className="why-us-section" onInView={setWhyUsInView}>
          <div className="why-us-content">
            <div className="why-us-text">
              <div className="section-label">WHY SERVILINE</div>
              <h2 className="why-title">Built for residents.<br />Trusted by the barangay.</h2>
              <p className="why-desc">We replaced clipboards and long queues with a secure, audited workflow. Every request is logged, signed, and traceable — from your kitchen table to the barangay captain's desk.</p>
              <ul className="why-list">
                <li><span className="check">✓</span> End-to-end encrypted record storage</li>
                <li><span className="check">✓</span> Verified by the Office of Barangay</li>
                <li><span className="check">✓</span> Built-in audit trail for every request</li>
                <li><span className="check">✓</span> Accessible UI — large text, Tagalog & English</li>
              </ul>
            </div>
            <BorderGlow className="why-us-stats" borderRadius={16}>
              <div className="stats-row">
                <div className="stat-col">
                  <div className="stat-val">
                    <CountUp end={4287} format={true} start={whyUsInView} delay={800} />
                  </div>
                  <div className="stat-lbl">Active residents</div>
                </div>
                <div className="stat-col">
                  <div className="stat-val">
                    <CountUp end={12940} format={true} start={whyUsInView} delay={800} />
                  </div>
                  <div className="stat-lbl">Requests served</div>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill">92% satisfaction</div>
              </div>
              <ul className="stat-breakdown">
                <li>
                  <span className="dot dot-cert"></span> Certificates - <CountUp end={6210} format={true} start={whyUsInView} delay={800} />
                </li>
                <li>
                  <span className="dot dot-rep"></span> Reports - <CountUp end={4108} format={true} start={whyUsInView} delay={800} />
                </li>
                <li>
                  <span className="dot dot-ann"></span> Announcements - <CountUp end={2622} format={true} start={whyUsInView} delay={800} />
                </li>
              </ul>
            </BorderGlow>
          </div>
          {/* Testimonial preview */}
          <div className="testimonial-grid">
            <BorderGlow className="test-card" borderRadius={12}>
              <p>"A game-changer for working residents."</p>
              <div className="test-user">
                <div className="test-av av-1"></div>
                <div className="test-info">
                  <div className="test-name">Marites D.</div>
                  <div className="test-role">Resident</div>
                </div>
              </div>
            </BorderGlow>
            <BorderGlow className="test-card" borderRadius={12}>
              <p>"Got my clearance in two minutes."</p>
              <div className="test-user">
                <div className="test-av av-2"></div>
                <div className="test-info">
                  <div className="test-name">Junmar P.</div>
                  <div className="test-role">Small business owner</div>
                </div>
              </div>
            </BorderGlow>
            <BorderGlow className="test-card" borderRadius={12}>
              <p>"Simple, clear, and accessible."</p>
              <div className="test-user">
                <div className="test-av av-3"></div>
                <div className="test-info">
                  <div className="test-name">Hon. Rosalie M.</div>
                  <div className="test-role">Barangay Kagawad</div>
                </div>
              </div>
            </BorderGlow>
          </div>
        </ScrollAnimateSection>

        {/* MOBILE APK DOWNLOAD CTA */}
        <ScrollAnimateSection className="cta-section">
          <BorderGlow className="cta-glass" borderRadius={24}>
            <div className="download-badge">Android Application</div>
            <h2 className="cta-title">Take Barangay Services on the Go</h2>
            <p className="cta-desc">Download our official Android app to request certificates and file reports directly from your mobile phone.</p>
            <div className="cta-actions">
              <a href="/serviline.apk" download="ServiLine.apk" className="btn-primary" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={logo} alt="Logo" style={{ width: '24px', height: '24px', borderRadius: '50%' }} /> Download APK
              </a>
            </div>
          </BorderGlow>
        </ScrollAnimateSection>
      </main>

      <ScrollAnimateSection tagName="footer" id="contact" className="landing-footer">
        <div className="footer-cols">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logo} alt="ServiLine" className="nav-logo-icon" />
              <span>ServiLine</span>
            </div>
            <p className="footer-desc">The official digital service portal of Barangay — making local governance simple, fast, and accessible.</p>
          </div>
          <div className="footer-col">
            <h4>SERVICES</h4>
            <a href="#">Certificates</a>
            <a href="#">File a Report</a>
            <a href="#">Announcements</a>
          </div>
          <div className="footer-col">
            <h4>OFFICE</h4>
            <p>Barangay Hall<br />City, Philippines<br />Mon-Fri · 8am-5pm</p>
          </div>
          <div className="footer-col">
            <h4>CONNECT</h4>
            <p>hello@serviline.ph<br />+63 (32) 000-0000</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Barangay · ServiLine</span>
          <span>Built for the residents</span>
        </div>
      </ScrollAnimateSection>
    </CircuitBackground>
  );
}