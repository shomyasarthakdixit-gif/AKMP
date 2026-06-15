import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BookOpen, FolderOpen, Users, MessageSquare, TrendingUp, Clock, Star } from 'lucide-react';

const INDIGO = '#6366F1';
const CYAN   = '#06B6D4';
const ORANGE = '#F97316';
const GRAD = 'linear-gradient(135deg, #6366F1 0%, #60A5FA 100%)';

function useCounter(end, duration = 1400) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!end || end === '...') { setCount(end); return; }
    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration]);
  return count;
}

const STAT_CONFIGS = [
  { key: 'courses',    title: 'Total Courses',  desc: 'Courses in the portal',  icon: BookOpen,     primary: INDIGO, grad: 'rgba(79,70,229,0.6)' },
  { key: 'categories',title: 'Categories',      desc: 'Knowledge domains',       icon: FolderOpen,   primary: CYAN,   grad: 'rgba(6,182,212,0.6)' },
  { key: 'users',      title: 'Team Members',   desc: 'Registered accounts',     icon: Users,        primary: '#10B981', grad: 'rgba(16,185,129,0.6)' },
  { key: 'reviews',    title: 'Total Reviews',  desc: 'Community feedback',      icon: MessageSquare,primary: ORANGE, grad: 'rgba(249,115,22,0.6)' },
];

function StatCard({ title, value, icon: Icon, primary, desc, delay }) {
  const count = useCounter(typeof value === 'number' ? value : 0, 1200);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-6 shadow-sm card-hover"
      style={{ animationDelay: `${delay}ms` }} role="region" aria-label={`${title}: ${value}`}>
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${primary} 0%, transparent 70%)`, filter: 'blur(24px)' }} />
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl" style={{ background: `${primary}18` }}>
          <Icon size={20} style={{ color: primary }} />
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          <TrendingUp size={10} />Live
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-[#111827] dark:text-foreground tracking-tight mono">{typeof value === 'number' ? count : value}</p>
        <p className="text-sm font-semibold text-[#111827] dark:text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>{title}</p>
        <p className="text-xs text-[#374151] dark:text-[#6B7280] dark:text-[#94A3B8]">{desc}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-6 space-y-4">
      <div className="flex justify-between"><div className="skeleton w-10 h-10 rounded-xl" /><div className="skeleton w-14 h-5 rounded-full" /></div>
      <div className="skeleton w-16 h-8 rounded-lg" />
      <div className="skeleton w-24 h-4 rounded" />
      <div className="skeleton w-32 h-3 rounded" />
    </div>
  );
}

function CourseRow({ course, idx }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] dark:border-[#334155] bg-[#FAFAFB] dark:bg-[#0F172A] hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B] hover:border-[#A5B4FC] dark:hover:border-[#475569] hover:shadow-sm transition-all duration-200 group" role="listitem">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(6,182,212,0.1))' }}>
          {course.thumbnailUrl
            ? <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
            : <BookOpen size={18} style={{ color: INDIGO }} />}
          <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[#6366F1] text-white text-[9px] font-bold flex items-center justify-center">{idx + 1}</span>
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-sm text-[#111827] dark:text-foreground truncate max-w-[200px] group-hover:text-indigo-600 transition-colors">{course.title}</h4>
          <p className="text-xs text-[#374151] dark:text-[#6B7280] dark:text-[#94A3B8] truncate max-w-[200px]">{course.description}</p>
        </div>
      </div>
      <div className="text-right hidden sm:block shrink-0">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(79,70,229,0.08)', color: INDIGO, border: '1px solid rgba(79,70,229,0.15)' }}>
          {course.category?.name || 'Uncategorized'}
        </span>
        <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] dark:text-muted-foreground mt-1">by {course.author?.username || 'Unknown'}</p>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const username = sessionStorage.getItem('username') || 'User';
  const role     = sessionStorage.getItem('role') || 'ROLE_USER';
  const token    = sessionStorage.getItem('token');
  const [statsData, setStatsData] = useState({ courses: 0, categories: 0, users: 0, reviews: 0, recentCourses: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const [courseRes, catRes, userRes, reviewRes] = await Promise.all([
          axios.get('http://localhost:8002/api/v1/sql/courses',    { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8002/api/v1/sql/categories', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8002/api/v1/auth/users',     { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8002/api/v1/nosql/reviews/stats/total', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { totalReviews: 0 } })),
        ]);
        const courses = courseRes.data || [];
        const recent = [...courses].sort((a, b) => b.id - a.id).slice(0, 5);
        setStatsData({ courses: courses.length, categories: (catRes.data||[]).length, users: (userRes.data||[]).length, reviews: reviewRes.data?.totalReviews || 0, recentCourses: recent });
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    })();
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-white bg-gradient-to-br from-indigo-500 to-cyan-500 dark:from-[#0F172A] dark:via-[#1e1b4b] dark:to-[#0c1a3a] shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 animate-float-slow pointer-events-none"
          style={{ background: `radial-gradient(circle, ${INDIGO} 0%, transparent 70%)`, transform: 'translate(20%, -20%)' }} />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full opacity-15 animate-float-medium pointer-events-none"
          style={{ background: `radial-gradient(circle, ${CYAN} 0%, transparent 70%)`, transform: 'translateY(30%)' }} />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${ORANGE} 0%, transparent 70%)` }} />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
              style={{ background: 'rgba(79,70,229,0.25)', border: '1px solid rgba(79,70,229,0.4)', color: '#A5B4FC' }}>
              <Star size={11} />
              {role.replace('ROLE_', '')} Account
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              Hello, <span className="gradient-text">{username}</span> 👋
            </h2>
            <p className="text-white/55 max-w-lg">
              {isLoading ? 'Loading your dashboard…' : `You have ${statsData.courses} courses and ${statsData.categories} categories in your knowledge base.`}
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {[['Courses', statsData.courses], ['Reviews', statsData.reviews]].map(([label, val]) => (
              <div key={label} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-2xl font-bold text-white mono">{isLoading ? '–' : val}</p>
                <p className="text-xs text-white/45 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : STAT_CONFIGS.map((cfg, i) => <StatCard key={cfg.key} {...cfg} value={statsData[cfg.key]} delay={i * 80} />)}
      </div>

      {/* Recent Courses */}
      <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2">
            <Clock size={16} style={{ color: INDIGO }} />
            <h3 className="text-base font-bold text-[#111827] dark:text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>Recent Courses</h3>
          </div>
          <span className="text-xs text-[#6B7280]">Last {statsData.recentCourses.length} added</span>
        </div>
        <div className="p-4 space-y-2" role="list" aria-label="Recent courses">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl">
                  <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2"><div className="skeleton h-4 w-48 rounded" /><div className="skeleton h-3 w-64 rounded" /></div>
                  <div className="skeleton h-6 w-24 rounded-full" />
                </div>
              ))
            : statsData.recentCourses.length > 0
              ? statsData.recentCourses.map((course, idx) => <CourseRow key={course.id} course={course} idx={idx} />)
              : (
                <div className="flex flex-col items-center py-14 text-center" role="status">
                  <svg width="120" height="100" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="mb-4 opacity-40">
                    <rect x="30" y="30" width="140" height="100" rx="12" fill="#E2E8F0"/>
                    <rect x="50" y="50" width="100" height="12" rx="6" fill="#CBD5E1"/>
                    <rect x="50" y="72" width="80" height="10" rx="5" fill="#E2E8F0"/>
                    <rect x="50" y="90" width="60" height="10" rx="5" fill="#E2E8F0"/>
                    <circle cx="160" cy="40" r="20" fill="#4F46E5" opacity="0.15"/>
                    <path d="M154 40l4 4 8-8" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                  </svg>
                  <h4 className="font-semibold text-[#111827] dark:text-foreground mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>No courses yet</h4>
                  <p className="text-sm text-[#6B7280] max-w-sm">No courses have been added. Ask an admin to create some!</p>
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
}



