import { useState, useEffect } from 'react';
import { Search, Moon, Sun, Bell, Menu } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #6366F1 0%, #60A5FA 100%)';

const roleBadgeMap = {
  ROLE_ADMIN:  { bg: '#EEF2FF', color: '#4F46E5', label: 'Admin' },
  ROLE_MEMBER: { bg: '#EFF6FF', color: '#2563EB', label: 'Member' },
  ROLE_USER:   { bg: '#FFF7ED', color: '#C2410C', label: 'User' },
};

export default function TopNavbar({ toggleSidebar, title = 'Dashboard', setActiveTab }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const username = sessionStorage.getItem('username') || 'User';
  const role     = sessionStorage.getItem('role') || 'ROLE_USER';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const badgeStyle = roleBadgeMap[role] || roleBadgeMap.ROLE_USER;

  return (
    <header
      className="h-16 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0
        border-b border-[#E5E7EB] dark:border-[#334155]
        bg-white/95 dark:bg-[#1E293B]/95
        backdrop-blur-xl shadow-sm"
      role="banner"
    >
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-[#6B7280] hover:text-[#111827] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors"
          onClick={toggleSidebar} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>

        {/* Page title */}
        <div>
          <h1 className="text-lg font-bold text-[#111827] dark:text-white leading-tight"
            style={{ fontFamily: "'Sora', sans-serif" }}>{title}</h1>
          <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex relative items-center group cursor-pointer"
          onClick={() => alert('Search coming soon!')} role="search">
          <Search className="absolute left-3 w-4 h-4 text-[#6B7280] group-hover:text-[#6366F1] dark:group-hover:text-[#A5B4FC] transition-colors" aria-hidden="true" />
          <input type="text" placeholder="Search courses, categories…" readOnly
            className="pl-9 pr-4 py-2 text-sm rounded-xl w-52 cursor-pointer
              bg-[#FAFAFB] dark:bg-[#0F172A]
              border border-[#E5E7EB] dark:border-[#334155]
              text-[#6B7280] dark:text-[#94A3B8]
              hover:bg-[#EEF2FF] dark:hover:bg-[#1E293B]
              hover:border-[#A5B4FC] dark:hover:border-[#475569]
              transition-all focus:outline-none"
            aria-label="Search (coming soon)" />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-medium text-[#6B7280] dark:text-[#94A3B8]
            bg-white dark:bg-[#1E293B]
            border border-[#E5E7EB] dark:border-[#334155]
            rounded mono">⌘K</kbd>
        </div>

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="p-2 rounded-xl transition-all active:scale-95
            text-[#6B7280] dark:text-[#94A3B8]
            hover:text-[#4F46E5] dark:hover:text-[#A5B4FC]
            hover:bg-[#EEF2FF] dark:hover:bg-[#334155]"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-xl transition-all active:scale-95 relative
            text-[#6B7280] dark:text-[#94A3B8]
            hover:text-[#4F46E5] dark:hover:text-[#A5B4FC]
            hover:bg-[#EEF2FF] dark:hover:bg-[#334155]"
          aria-label="Notifications (coming soon)" onClick={() => alert('Notifications coming soon!')}>
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white dark:border-[#1E293B] bg-[#6366F1] animate-pulse"
            aria-hidden="true" />
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab && setActiveTab('profile')}
          className="flex items-center gap-2.5 pl-3 ml-1 p-1 rounded-lg
            border-l border-[#E5E7EB] dark:border-[#334155]
            hover:opacity-80 transition-opacity"
          aria-label="Go to profile">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md"
            style={{ background: GRAD }}>
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-[#111827] dark:text-white leading-tight">{username}</p>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: badgeStyle.bg, color: badgeStyle.color }}>
              {badgeStyle.label}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
