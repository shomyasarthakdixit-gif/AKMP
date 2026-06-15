import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  BookOpen, FolderOpen, Users, MessageSquare,
  TrendingUp, Clock, Star, ArrowRight, Sparkles, Activity
} from 'lucide-react';

const PRIMARY = '#5B4BFF';
const TEAL    = '#00BFA6';
const CORAL   = '#FF7A59';
const AMBER   = '#F59E0B';
const EMERALD = '#22C55E';
const GRAD    = 'linear-gradient(135deg, #5B4BFF 0%, #00BFA6 100%)';

/* ── Animated counter ── */
function useCounter(end, duration = 1400, active = true) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!active || !end || end === '...') { setCount(end); return; }
    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration, active]);
  return count;
}

/* ── Stat Card ── */
const STAT_CONFIGS = [
  { key: 'courses',    title: 'Total Courses',   desc: 'Courses in the portal',   icon: BookOpen,      color: PRIMARY,  grad: 'linear-gradient(135deg,#5B4BFF,#8B7CFF)' },
  { key: 'categories', title: 'Categories',      desc: 'Knowledge domains',        icon: FolderOpen,    color: TEAL,     grad: 'linear-gradient(135deg,#00BFA6,#2DD4BF)' },
  { key: 'users',      title: 'Team Members',    desc: 'Registered accounts',      icon: Users,         color: EMERALD,  grad: 'linear-gradient(135deg,#22C55E,#4ADE80)' },
  { key: 'reviews',    title: 'Total Reviews',   desc: 'Community feedback',       icon: MessageSquare, color: CORAL,    grad: 'linear-gradient(135deg,#FF7A59,#FF8A65)' },
];

function StatCard({ title, value, icon: Icon, color, grad, desc, delay }) {
  const count = useCounter(typeof value === 'number' ? value : 0, 1200);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-card border border-[#F1F5F9] dark:border-white/[0.06] p-6 cursor-default"
      style={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        animationDelay: `${delay}ms`,
        transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 16px 40px ${color}20, 0 4px 12px rgba(0,0,0,0.08)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
      }}
      role="region" aria-label={`${title}: ${value}`}>

      {/* Glow layer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at top right, ${color}12 0%, transparent 70%)` }} />

      {/* Top row */}
      <div className="flex items-start justify-between mb-5">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ background: grad }}>
          <Icon size={20} className="text-white" />
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(34,197,94,0.1)', color: '#16A34A', border: '1px solid rgba(34,197,94,0.2)' }}>
          <Activity size={10} />Live
        </span>
      </div>

      {/* Numbers */}
      <div className="space-y-1">
        <p className="text-4xl font-bold tracking-tight mono" style={{ color }}>
          {typeof value === 'number' ? count : value}
        </p>
        <p className="text-sm font-semibold text-[#0F172A] dark:text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</p>
        <p className="text-xs text-[#94A3B8]">{desc}</p>
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: grad }} />
    </div>
  );
}

/* ── Skeleton ── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#F1F5F9] dark:border-white/[0.06] bg-white dark:bg-card p-6 space-y-4">
      <div className="flex justify-between">
        <div className="skeleton w-11 h-11 rounded-2xl" />
        <div className="skeleton w-14 h-6 rounded-full" />
      </div>
      <div className="skeleton w-16 h-9 rounded-lg" />
      <div className="skeleton w-24 h-4 rounded" />
      <div className="skeleton w-32 h-3 rounded" />
    </div>
  );
}

/* ── Course Row ── */
function CourseRow({ course, idx }) {
  const colors = [PRIMARY, TEAL, CORAL, AMBER, EMERALD];
  const color  = colors[idx % colors.length];
  return (
    <div className="group flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-[rgba(91,75,255,0.15)] hover:bg-[#F8FAFC] dark:hover:bg-white/[0.03] transition-all duration-200"
      role="listitem">
      <div className="flex items-center gap-3.5">
        {/* Thumbnail */}
        <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${color}18, ${color}08)`, border: `1px solid ${color}20` }}>
          {course.thumbnailUrl
            ? <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
            : <BookOpen size={18} style={{ color }} />}
          <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-sm"
            style={{ background: color }}>{idx + 1}</span>
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-sm text-[#0F172A] dark:text-foreground truncate max-w-[200px] group-hover:text-[#5B4BFF] dark:group-hover:text-[#8B7CFF] transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}>{course.title}</h4>
          <p className="text-xs text-[#94A3B8] truncate max-w-[200px]">{course.description}</p>
        </div>
      </div>
      <div className="text-right hidden sm:block shrink-0">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: `${color}12`, color, border: `1px solid ${color}20` }}>
          {course.category?.name || 'Uncategorized'}
        </span>
        <p className="text-[11px] text-[#94A3B8] mt-1">by {course.author?.username || 'Unknown'}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD OVERVIEW
   ═══════════════════════════════════════════════════════════════ */
export default function DashboardOverview() {
  const username = sessionStorage.getItem('username') || 'User';
  const role     = sessionStorage.getItem('role')     || 'ROLE_USER';
  const token    = sessionStorage.getItem('token');
  const [statsData, setStatsData] = useState({ courses: 0, categories: 0, users: 0, reviews: 0, recentCourses: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBannerVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const [courseRes, catRes, userRes, reviewRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/sql/courses`,    { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/sql/categories`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/users`,     { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/nosql/reviews/stats/total`, { headers: { Authorization: `Bearer ${token}` } })
                .catch(() => ({ data: { totalReviews: 0 } })),
        ]);
        const courses = courseRes.data || [];
        const recent  = [...courses].sort((a, b) => b.id - a.id).slice(0, 5);
        setStatsData({
          courses:    courses.length,
          categories: (catRes.data  || []).length,
          users:      (userRes.data || []).length,
          reviews:    reviewRes.data?.totalReviews || 0,
          recentCourses: recent,
        });
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    })();
  }, [token]);

  const roleLabel = role.replace('ROLE_', '');

  return (
    <div className="space-y-8">

      {/* ══ WELCOME BANNER ══ */}
      <div className="relative overflow-hidden rounded-3xl text-white"
        style={{ background: 'linear-gradient(135deg, #070B14 0%, #1a1040 45%, #0a1a28 100%)', minHeight: '200px' }}>

        {/* Animated orbs */}
        <div className="absolute top-[-60px] right-[-60px] w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(91,75,255,0.35) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'floatSlow 10s ease-in-out infinite' }} />
        <div className="absolute bottom-[-80px] left-1/3 w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,191,166,0.25) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'floatMedium 8s ease-in-out infinite' }} />
        <div className="absolute top-1/2 right-1/4 w-[180px] h-[180px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,122,89,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />

        {/* Decorative ring */}
        <div className="absolute top-4 right-4 w-32 h-32 rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(91,75,255,0.2)', animation: 'floatFast 8s ease-in-out infinite' }} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 md:p-10">
          {/* Left content */}
          <div>
            {/* Role badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{
                background: 'rgba(91,75,255,0.25)', border: '1px solid rgba(139,124,255,0.4)', color: '#8B7CFF',
                opacity: bannerVisible ? 1 : 0, transform: bannerVisible ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
              }}>
              <Star size={11} /> {roleLabel} Account
            </div>

            {/* Animated heading — slide in left */}
            <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
              style={{
                fontFamily: "'Poppins', sans-serif",
                opacity: bannerVisible ? 1 : 0,
                transform: bannerVisible ? 'translateX(0)' : 'translateX(-50px)',
                transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1) 100ms',
              }}>
              Hello,{' '}
              <span style={{ background: 'linear-gradient(135deg, #8B7CFF, #2DD4BF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {username}
              </span>{' '}
              👋
            </h2>

            {/* Subtitle — fade up */}
            <p className="text-white/55 max-w-lg"
              style={{
                opacity: bannerVisible ? 1 : 0,
                transform: bannerVisible ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1) 250ms',
              }}>
              {isLoading
                ? 'Loading your knowledge dashboard…'
                : `You have ${statsData.courses} courses and ${statsData.categories} categories in your knowledge base.`}
            </p>

            {/* Quick action button */}
            <div style={{
              opacity: bannerVisible ? 1 : 0,
              transform: bannerVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1) 380ms',
            }}>
              <button className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shine-on-hover transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Sparkles size={14} /> Explore Knowledge <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right — mini stat pills */}
          <div className="flex items-center gap-4 shrink-0"
            style={{
              opacity: bannerVisible ? 1 : 0,
              transform: bannerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1) 450ms',
            }}>
            {[
              { label: 'Courses',    val: statsData.courses,    color: '#8B7CFF' },
              { label: 'Reviews',    val: statsData.reviews,    color: '#2DD4BF' },
            ].map(({ label, val, color }) => (
              <div key={label} className="text-center p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <p className="text-3xl font-bold mono" style={{ color }}>{isLoading ? '–' : val}</p>
                <p className="text-xs text-white/45 mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ STAT CARDS ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : STAT_CONFIGS.map((cfg, i) => (
              <StatCard key={cfg.key} {...cfg} value={statsData[cfg.key]} delay={i * 80} />
            ))}
      </div>

      {/* ══ RECENT COURSES ══ */}
      <div className="rounded-2xl border border-[#F1F5F9] dark:border-white/[0.06] bg-white dark:bg-card overflow-hidden"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9] dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: GRAD }}>
              <Clock size={15} className="text-white" />
            </div>
            <h3 className="text-base font-semibold text-[#0F172A] dark:text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Recent Courses
            </h3>
          </div>
          <span className="text-xs text-[#94A3B8] font-medium bg-[#F8FAFC] dark:bg-white/[0.04] px-3 py-1.5 rounded-full border border-[#F1F5F9] dark:border-white/[0.06]">
            Last {statsData.recentCourses.length} added
          </span>
        </div>

        {/* Body */}
        <div className="p-4 space-y-1" role="list" aria-label="Recent courses">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3.5 p-4 rounded-2xl">
                  <div className="skeleton w-11 h-11 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-48 rounded" />
                    <div className="skeleton h-3 w-64 rounded" />
                  </div>
                  <div className="skeleton h-6 w-24 rounded-full" />
                </div>
              ))
            : statsData.recentCourses.length > 0
              ? statsData.recentCourses.map((course, idx) => (
                  <CourseRow key={course.id} course={course} idx={idx} />
                ))
              : (
                <div className="flex flex-col items-center py-16 text-center" role="status">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
                    style={{ background: 'rgba(91,75,255,0.08)', border: '1px dashed rgba(91,75,255,0.2)' }}>
                    <BookOpen size={32} style={{ color: PRIMARY, opacity: 0.5 }} />
                  </div>
                  <h4 className="font-semibold text-[#0F172A] dark:text-foreground mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>No courses yet</h4>
                  <p className="text-sm text-[#94A3B8] max-w-xs">No courses have been added. Ask an admin to create some to get started!</p>
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
}

