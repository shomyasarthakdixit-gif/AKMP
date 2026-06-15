import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Users, Shield, Zap, BookOpen, FolderOpen, MessageSquare,
  Eye, Keyboard, Type, Contrast, Moon, Activity, ChevronDown,
  ArrowRight, Sparkles, CheckCircle2, Star, Quote, BarChart2,
  Clock, Globe, Award, Layers
} from 'lucide-react';

/* ── Constants ─────────────────────────────────────────────── */
const PRIMARY  = '#5B4BFF';
const TEAL     = '#00BFA6';
const CORAL    = '#FF7A59';
const GRAD     = 'linear-gradient(135deg, #5B4BFF 0%, #00BFA6 100%)';
const GRAD_FULL = 'linear-gradient(135deg, #5B4BFF 0%, #00BFA6 50%, #FF7A59 100%)';

/* ── Animated Counter ── */
function useCounter(end, duration = 1800, shouldStart = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!shouldStart || !end || typeof end !== 'number') return;
    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * end));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration, shouldStart]);
  return count;
}

/* ── Intersection Observer hook ── */
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── Feature Card ── */
const features = [
  { icon: Brain,     label: 'AI-Powered Learning',    desc: 'Smart recommendations and personalized insights for every learner.',          color: PRIMARY, bg: 'rgba(91,75,255,0.08)',  border: 'rgba(91,75,255,0.18)' },
  { icon: Users,     label: 'Team Collaboration',     desc: 'Connect educators and learners seamlessly in shared knowledge spaces.',         color: TEAL,    bg: 'rgba(0,191,166,0.08)',  border: 'rgba(0,191,166,0.18)' },
  { icon: Shield,    label: 'Role-Based Access',       desc: 'Secure, tiered permissions for admins, members, and standard users.',          color: CORAL,   bg: 'rgba(255,122,89,0.08)', border: 'rgba(255,122,89,0.18)' },
  { icon: Zap,       label: 'Real-time Analytics',    desc: 'Live dashboards with counters, charts, and activity feeds.',                    color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' },
  { icon: BookOpen,  label: 'Rich Course Library',    desc: 'Create, manage, and explore an ever-growing library of course materials.',     color: '#22C55E', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.18)' },
  { icon: Layers,    label: 'Category Domains',       desc: 'Organise knowledge into structured domains for effortless discovery.',          color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.18)' },
];

/* ── Statistics ── */
function StatCounter({ value, suffix = '', label, color, inView }) {
  const count = useCounter(value, 1800, inView);
  return (
    <div className="text-center group">
      <div className="text-5xl font-bold mb-2 font-heading tabular-nums"
        style={{ background: color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {count}{suffix}
      </div>
      <p className="text-sm text-[#475569] dark:text-[#CBD5E1] font-medium">{label}</p>
    </div>
  );
}

const stats = [
  { value: 500,  suffix: '+', label: 'Knowledge Articles',  color: GRAD },
  { value: 1200, suffix: '+', label: 'Active Users',         color: `linear-gradient(135deg, ${TEAL}, #2DD4BF)` },
  { value: 98,   suffix: '%', label: 'Accessibility Score',  color: `linear-gradient(135deg, ${CORAL}, #FF8A65)` },
  { value: 40,   suffix: '+', label: 'Content Categories',   color: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
];

/* ── Accessibility Features ── */
const a11yFeatures = [
  { icon: Eye,       label: 'Screen Reader Support',   desc: 'Full ARIA landmarks and live regions', color: PRIMARY },
  { icon: Keyboard,  label: 'Keyboard Navigation',     desc: 'Tab-complete flow, skip links, focus traps', color: TEAL },
  { icon: Contrast,  label: 'High Contrast Mode',      desc: 'WCAG 2.1 AA contrast throughout', color: CORAL },
  { icon: Type,      label: 'Font Scaling',             desc: 'Atkinson Hyperlegible mode + scaling', color: '#F59E0B' },
  { icon: Moon,      label: 'Dark Mode',                desc: 'Nebula Intelligence dark theme', color: '#8B5CF6' },
  { icon: Activity,  label: 'Reduced Motion',           desc: 'Respects prefers-reduced-motion', color: '#22C55E' },
];

/* ── Timeline Steps ── */
const timeline = [
  { step: '01', title: 'Sign Up & Configure',      desc: 'Create your account, choose your role, and personalise your dashboard settings.', icon: Users,    color: PRIMARY },
  { step: '02', title: 'Build Knowledge Domains',  desc: 'Admins and members create structured categories to organise all content.',          icon: FolderOpen, color: TEAL },
  { step: '03', title: 'Publish Rich Courses',     desc: 'Upload, curate, and publish course materials with rich metadata and thumbnails.',   icon: BookOpen, color: CORAL },
  { step: '04', title: 'Collaborate & Review',     desc: 'Team members review, rate, and discuss courses — building a learning community.',    icon: MessageSquare, color: '#F59E0B' },
  { step: '05', title: 'Track Analytics',          desc: 'Monitor progress, engagement, and growth via your real-time analytics dashboard.',   icon: BarChart2, color: '#8B5CF6' },
];

/* ── Testimonials ── */
const testimonials = [
  { name: 'Priya Sharma',   role: 'Learning & Development Lead',  org: 'TechCorp India',     avatar: 'P', color: PRIMARY, rating: 5, quote: 'AKMP transformed how our team shares knowledge. The accessibility features are genuinely world-class — not an afterthought.' },
  { name: 'James Okonkwo',  role: 'Senior Software Engineer',     org: 'DataFlow Systems',   avatar: 'J', color: TEAL,    rating: 5, quote: 'The role-based access and analytics dashboard give us exactly the visibility we need. Clean, fast, and beautifully designed.' },
  { name: 'Elif Yıldız',    role: 'EdTech Product Manager',       org: 'LearnBridge GmbH',   avatar: 'E', color: CORAL,   rating: 5, quote: 'I\'ve used five LMS platforms. AKMP is the first that actually looks premium AND prioritises accessibility from the ground up.' },
];

/* ── FAQ ── */
const faqs = [
  { q: 'Who can use AKMP?',                    a: 'AKMP supports three roles: Admin (full platform control), Member (content creation and management), and User (read and review content). Any organisation can deploy it.' },
  { q: 'Is AKMP fully accessible?',            a: 'Yes. AKMP is designed to WCAG 2.1 AA standards — screen reader support, keyboard navigation, high contrast ratios, reduced motion, and scalable fonts with Atkinson Hyperlegible.' },
  { q: 'What technologies power AKMP?',        a: 'The frontend uses React + Vite + TailwindCSS. The backend is a multi-service architecture with Spring Boot (auth/SQL), Node.js, and FastAPI (NoSQL/reviews), backed by PostgreSQL and MongoDB.' },
  { q: 'Can I use AKMP for my team right now?', a: 'AKMP is currently in active development as a portfolio/hackathon project. The full stack is functional locally — clone the repo, run the services, and explore all features.' },
  { q: 'Is dark mode available?',              a: 'Absolutely. AKMP ships with the Nebula Intelligence dark theme — a futuristic, elegant palette designed for long sessions with premium contrast ratios.' },
];

/* ── Hero Illustration SVG ── */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      className="w-full max-w-lg animate-float-slow">
      {/* Background shapes */}
      <rect x="40" y="40" width="400" height="320" rx="24" fill="rgba(91,75,255,0.06)" />
      {/* Main card */}
      <rect x="60" y="60" width="360" height="260" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(91,75,255,0.2)" strokeWidth="1" />
      {/* Header bar */}
      <rect x="60" y="60" width="360" height="50" rx="16" fill="rgba(91,75,255,0.15)" />
      <rect x="60" y="90" width="360" height="20" fill="rgba(91,75,255,0.15)" />
      {/* Dots */}
      <circle cx="85" cy="85" r="6" fill="#FF7A59" />
      <circle cx="103" cy="85" r="6" fill="#F59E0B" />
      <circle cx="121" cy="85" r="6" fill="#22C55E" />
      {/* Title bar in card */}
      <rect x="80" y="128" width="200" height="10" rx="5" fill="rgba(91,75,255,0.4)" />
      <rect x="80" y="148" width="140" height="8" rx="4" fill="rgba(255,255,255,0.2)" />
      {/* Mini cards row */}
      <rect x="80" y="175" width="95" height="60" rx="10" fill="rgba(91,75,255,0.12)" stroke="rgba(91,75,255,0.2)" strokeWidth="1" />
      <rect x="185" y="175" width="95" height="60" rx="10" fill="rgba(0,191,166,0.12)" stroke="rgba(0,191,166,0.2)" strokeWidth="1" />
      <rect x="290" y="175" width="95" height="60" rx="10" fill="rgba(255,122,89,0.12)" stroke="rgba(255,122,89,0.2)" strokeWidth="1" />
      {/* Numbers in mini cards */}
      <text x="127" y="202" textAnchor="middle" fill="#5B4BFF" fontSize="18" fontWeight="700" fontFamily="JetBrains Mono">42</text>
      <text x="127" y="218" textAnchor="middle" fill="rgba(91,75,255,0.6)" fontSize="8" fontFamily="Inter">Courses</text>
      <text x="232" y="202" textAnchor="middle" fill="#00BFA6" fontSize="18" fontWeight="700" fontFamily="JetBrains Mono">8</text>
      <text x="232" y="218" textAnchor="middle" fill="rgba(0,191,166,0.6)" fontSize="8" fontFamily="Inter">Categories</text>
      <text x="337" y="202" textAnchor="middle" fill="#FF7A59" fontSize="18" fontWeight="700" fontFamily="JetBrains Mono">128</text>
      <text x="337" y="218" textAnchor="middle" fill="rgba(255,122,89,0.6)" fontSize="8" fontFamily="Inter">Users</text>
      {/* Chart bars */}
      <rect x="80" y="270" width="16" height="25" rx="4" fill="rgba(91,75,255,0.5)" />
      <rect x="100" y="260" width="16" height="35" rx="4" fill="rgba(91,75,255,0.6)" />
      <rect x="120" y="252" width="16" height="43" rx="4" fill="rgba(91,75,255,0.8)" />
      <rect x="140" y="255" width="16" height="40" rx="4" fill="rgba(91,75,255,0.7)" />
      <rect x="160" y="248" width="16" height="47" rx="4" fill="#5B4BFF" />
      {/* Avatar cluster */}
      <circle cx="310" cy="285" r="16" fill="rgba(91,75,255,0.3)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <circle cx="332" cy="285" r="16" fill="rgba(0,191,166,0.3)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <circle cx="354" cy="285" r="16" fill="rgba(255,122,89,0.3)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <text x="310" y="290" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">P</text>
      <text x="332" y="290" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">J</text>
      <text x="354" y="290" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">E</text>
      {/* Floating badge */}
      <rect x="310" y="115" width="110" height="36" rx="18" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.3)" strokeWidth="1" className="animate-float-medium" />
      <circle cx="330" cy="133" r="6" fill="#22C55E" />
      <text x="343" y="137" fill="#22C55E" fontSize="9" fontWeight="600" fontFamily="Inter">98% Accessible</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LANDING PAGE COMPONENT
   ══════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [statsRef, statsInView] = useInView(0.3);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen gradient-mesh overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className="sticky top-0 z-50 glass border-b border-white/20 dark:border-white/10"
        role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg"
              style={{ background: GRAD }}>A</div>
            <div>
              <span className="text-base font-bold text-[#0F172A] dark:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>AKMP</span>
              <p className="text-[10px] text-[#475569] dark:text-[#CBD5E1] hidden sm:block leading-none">Knowledge Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" id="nav-signin-btn"
              className="px-4 py-2 text-sm font-semibold text-[#5B4BFF] dark:text-[#8B7CFF] hover:bg-[#5B4BFF]/8 rounded-xl transition-all duration-200">
              Sign in
            </Link>
            <Link to="/signup" id="nav-signup-btn"
              className="btn-primary h-9 px-5 text-sm shine-on-hover">
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-8 pb-20" aria-label="Hero">
        {/* Background orbs */}
        <div className="orb w-[600px] h-[600px] top-[-200px] left-[-200px]"
          style={{ background: 'radial-gradient(circle, rgba(91,75,255,0.18) 0%, transparent 70%)', animation: 'floatSlow 12s ease-in-out infinite' }} />
        <div className="orb w-[500px] h-[500px] bottom-[-150px] right-[-100px]"
          style={{ background: 'radial-gradient(circle, rgba(0,191,166,0.14) 0%, transparent 70%)', animation: 'floatMedium 9s ease-in-out infinite' }} />
        <div className="orb w-[300px] h-[300px] top-1/3 left-1/3"
          style={{ background: 'radial-gradient(circle, rgba(255,122,89,0.10) 0%, transparent 70%)', animation: 'floatFast 6s ease-in-out infinite' }} />
        {/* Grid */}
        <div className="absolute inset-0 grid-bg-light dark:grid-bg opacity-60 pointer-events-none" />
        {/* Decorative rings */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-[#5B4BFF]/10 pointer-events-none" style={{ animation: 'floatSlow 15s ease-in-out infinite' }} />
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full border border-[#00BFA6]/10 pointer-events-none" style={{ animation: 'floatMedium 11s ease-in-out infinite 2s' }} />

        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Content */}
            <div className="order-2 lg:order-1">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ background: 'rgba(91,75,255,0.1)', border: '1px solid rgba(91,75,255,0.25)', color: PRIMARY, transitionDelay: '0ms' }}>
                <Sparkles size={14} /> AI-Powered · Accessible · Enterprise-Ready
              </div>

              {/* Heading — slide in left */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateX(0)' : 'translateX(-60px)',
                  transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1) 150ms',
                }}>
                Manage Your{' '}
                <span className="gradient-text">Knowledge</span>
                {' '}Intelligently
              </h1>

              {/* Subtitle — fade up */}
              <p className="text-lg text-[#475569] dark:text-[#CBD5E1] leading-relaxed mb-8 max-w-xl"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1) 300ms',
                }}>
                A centralised, AI-powered platform to organise, share, and discover knowledge across your enterprise — built with accessibility at its core.
              </p>

              {/* CTA buttons — fade up */}
              <div className="flex flex-wrap gap-4"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1) 450ms',
                }}>
                <Link to="/signup" id="hero-get-started-btn" className="btn-primary text-base px-8 py-4 shine-on-hover">
                  Get Started Free <ArrowRight size={16} />
                </Link>
                <Link to="/login" id="hero-signin-btn" className="btn-secondary text-base px-8 py-4">
                  Sign In →
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-10 flex flex-wrap items-center gap-6"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transition: 'opacity 0.6s ease 600ms',
                }}>
                <div className="flex -space-x-2">
                  {['P','J','E','R','K'].map((l,i) => (
                    <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white dark:border-[#070B14]"
                      style={{ background: [GRAD,'linear-gradient(135deg,#00BFA6,#2DD4BF)','linear-gradient(135deg,#FF7A59,#FF8A65)','linear-gradient(135deg,#F59E0B,#FBBF24)','linear-gradient(135deg,#22C55E,#4ADE80)'][i] }}>
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[#475569] dark:text-[#CBD5E1]">
                  <span className="font-bold text-[#0F172A] dark:text-white">1,200+</span> learners trust AKMP
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#F59E0B" stroke="none" />)}
                  <span className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] ml-1">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Right — Illustration */}
            <div className="order-1 lg:order-2 flex justify-center"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1) 250ms',
              }}>
              <div className="relative">
                {/* Glow behind illustration */}
                <div className="absolute inset-0 rounded-3xl" style={{
                  background: 'radial-gradient(ellipse at center, rgba(91,75,255,0.2) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                  transform: 'scale(1.2)',
                }} />
                <HeroIllustration />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
          style={{ animation: 'bounceSoft 2s ease-in-out infinite' }}>
          <p className="text-xs text-[#475569] dark:text-[#CBD5E1]">Scroll to explore</p>
          <ChevronDown size={16} className="text-[#475569] dark:text-[#CBD5E1]" />
        </div>
      </section>

      {/* ═══════════════════════ FEATURES ═══════════════════════ */}
      <section className="py-24 px-6" aria-label="Features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-badge mb-4 inline-flex">
              <Zap size={12} /> Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold section-heading mb-4">
              Everything Your Team Needs
            </h2>
            <p className="text-lg text-[#475569] dark:text-[#CBD5E1] max-w-2xl mx-auto">
              A complete knowledge management ecosystem with AI insights, secure access control, and beautiful analytics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, label, desc, color, bg, border }, i) => (
              <div key={label} id={`feature-card-${i}`}
                className="feature-card group"
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="feature-icon w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#0F172A] dark:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</h3>
                <p className="text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">{desc}</p>
                <div className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ STATISTICS ═══════════════════════ */}
      <section className="py-20 px-6 relative overflow-hidden" ref={statsRef} aria-label="Statistics">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(91,75,255,0.06) 0%, rgba(0,191,166,0.04) 50%, rgba(255,122,89,0.04) 100%)' }} />
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-12 md:p-16">
            <div className="text-center mb-12">
              <div className="section-badge mb-4 inline-flex">
                <BarChart2 size={12} /> Platform Metrics
              </div>
              <h2 className="text-3xl md:text-4xl font-bold section-heading">
                Trusted at Scale
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s) => (
                <StatCounter key={s.label} {...s} inView={statsInView} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ ACCESSIBILITY SHOWCASE ═══════════════════════ */}
      <section className="py-24 px-6" aria-label="Accessibility features">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-badge mb-4 inline-flex">
                <Eye size={12} /> Accessibility First
              </div>
              <h2 className="text-4xl md:text-5xl font-bold section-heading mb-6">
                Built for <span className="gradient-text">Everyone</span>
              </h2>
              <p className="text-lg text-[#475569] dark:text-[#CBD5E1] leading-relaxed mb-8">
                Accessibility isn't a feature — it's our foundation. AKMP is designed to WCAG 2.1 AA standards, ensuring every user, regardless of ability, has a first-class experience.
              </p>
              <div className="space-y-4">
                {a11yFeatures.map(({ icon: Icon, label, desc, color }) => (
                  <div key={label} className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-200 hover:bg-card"
                    style={{ border: '1px solid transparent' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${color}30`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A] dark:text-white text-sm">{label}</p>
                      <p className="text-xs text-[#475569] dark:text-[#CBD5E1] mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right visual */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 rounded-3xl" style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,191,166,0.25) 0%, transparent 70%)',
                  filter: 'blur(50px)',
                }} />
                <div className="glass rounded-3xl p-8 relative z-10" style={{ animation: 'floatSlow 10s ease-in-out infinite' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GRAD }}>
                      <Award size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A] dark:text-white text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Accessibility Score</p>
                      <p className="text-xs text-[#475569] dark:text-[#CBD5E1]">WCAG 2.1 Compliance</p>
                    </div>
                  </div>
                  {/* Score bar */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-[#475569] dark:text-[#CBD5E1]">Overall Score</span>
                      <span className="text-xs font-bold text-[#00BFA6]">98 / 100</span>
                    </div>
                    <div className="h-3 bg-[#E5E7EB] dark:bg-[#1E293B] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '98%', background: 'linear-gradient(90deg, #00BFA6, #2DD4BF)' }} />
                    </div>
                  </div>
                  {/* Checklist */}
                  {['Keyboard Navigation', 'Screen Reader', 'Color Contrast', 'Focus Indicators', 'Semantic HTML', 'Reduced Motion'].map(item => (
                    <div key={item} className="flex items-center gap-3 py-2 border-b border-white/10 dark:border-white/5 last:border-0">
                      <CheckCircle2 size={14} className="text-[#00BFA6] shrink-0" />
                      <span className="text-sm text-[#475569] dark:text-[#CBD5E1]">{item}</span>
                      <span className="ml-auto text-xs font-semibold text-[#22C55E]">Pass</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TIMELINE ═══════════════════════ */}
      <section className="py-24 px-6" aria-label="How it works">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-badge mb-4 inline-flex">
              <Clock size={12} /> Workflow
            </div>
            <h2 className="text-4xl md:text-5xl font-bold section-heading mb-4">How AKMP Works</h2>
            <p className="text-lg text-[#475569] dark:text-[#CBD5E1]">
              From sign-up to building a thriving knowledge base in five steps.
            </p>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-6 bottom-6 w-px hidden sm:block"
              style={{ background: 'linear-gradient(to bottom, #5B4BFF, #00BFA6, #FF7A59)' }} />
            <div className="space-y-8">
              {timeline.map(({ step, title, desc, icon: Icon, color }, i) => (
                <div key={step} className="timeline-item group"
                  style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="timeline-dot shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="card-premium flex-1 p-6 group-hover:border-primary/30 ml-2">
                    <div className="flex items-start gap-4">
                      <span className="text-5xl font-black opacity-[0.07] leading-none select-none" style={{ color, fontFamily: "'Poppins', sans-serif" }}>{step}</span>
                      <div>
                        <h3 className="font-bold text-[#0F172A] dark:text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</h3>
                        <p className="text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
      <section className="py-24 px-6 relative overflow-hidden" aria-label="Testimonials">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(91,75,255,0.04), transparent)' }} />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-badge mb-4 inline-flex">
              <Quote size={12} /> Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold section-heading mb-4">Loved by Teams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(({ name, role, org, avatar, color, rating, quote }, i) => (
              <div key={name} id={`testimonial-card-${i}`} className="testimonial-card group relative">
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, ${color}12 0%, transparent 70%)` }} />
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(rating)].map((_, i) => <Star key={i} size={14} fill="#F59E0B" stroke="none" />)}
                </div>
                <blockquote className="text-[#475569] dark:text-[#CBD5E1] text-sm leading-relaxed mb-6 italic">
                  "{quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}>
                    {avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F172A] dark:text-white text-sm">{name}</p>
                    <p className="text-xs text-[#475569] dark:text-[#CBD5E1]">{role} · {org}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FAQ ═══════════════════════ */}
      <section className="py-24 px-6" aria-label="Frequently asked questions">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-badge mb-4 inline-flex">
              <Globe size={12} /> FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-bold section-heading mb-4">Common Questions</h2>
          </div>
          <div className="space-y-4" role="list">
            {faqs.map(({ q, a }, i) => (
              <div key={i} id={`faq-item-${i}`} className="faq-item" role="listitem">
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-[#0F172A] dark:text-white transition-colors duration-200"
                  style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.9375rem' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}>
                  <span>{q}</span>
                  <ChevronDown size={18} className="shrink-0 text-[#5B4BFF] transition-transform duration-300"
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
                <div id={`faq-answer-${i}`}
                  style={{
                    maxHeight: openFaq === i ? '300px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.35s cubic-bezier(0.22,1,0.36,1)',
                  }}>
                  <p className="px-5 pb-5 text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <section className="py-24 px-6" aria-label="Call to action">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden text-white text-center p-12 md:p-16" style={{ background: GRAD_FULL, backgroundSize: '200% 200%', animation: 'gradientShift 6s ease infinite' }}>
            {/* Overlay shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.06)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.05)', transform: 'translate(-30%, 30%)' }} />
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
                <Sparkles size={12} /> Start for free · No credit card needed
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Ready to Transform Your Knowledge?
              </h2>
              <p className="text-white/75 text-lg max-w-2xl mx-auto mb-10">
                Join 1,200+ learners and teams using AKMP to build smarter, more accessible knowledge ecosystems.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/signup" id="cta-signup-btn"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-white text-[#5B4BFF] hover:bg-white/90 transition-all duration-200 hover:-translate-y-1 shadow-xl">
                  Create Free Account <ArrowRight size={16} />
                </Link>
                <Link to="/login" id="cta-signin-btn"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white hover:bg-white/10 transition-all duration-200 border-2 border-white/30 hover:border-white/60">
                  Sign In →
                </Link>
              </div>
              {/* Tech stack */}
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {['Spring Boot', 'Node.js', 'FastAPI', 'PostgreSQL', 'MongoDB', 'React + Vite'].map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="border-t border-border py-8 px-6" role="contentinfo">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ background: GRAD }}>A</div>
            <span className="text-sm text-[#475569] dark:text-[#CBD5E1]">
              © {new Date().getFullYear()} AKMP · Accessible Knowledge Management Portal
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium text-[#94A3B8]">
            <a href="#" className="animated-underline hover:text-[#5B4BFF] dark:hover:text-[#8B7CFF] transition-colors">Privacy Policy</a>
            <a href="#" className="animated-underline hover:text-[#5B4BFF] dark:hover:text-[#8B7CFF] transition-colors">Terms of Service</a>
            <a href="mailto:support@akmp.com" className="animated-underline hover:text-[#5B4BFF] dark:hover:text-[#8B7CFF] transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
