import { useState, useEffect } from 'react';
import { Search, Moon, Sun, Bell, Menu } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #5B4BFF 0%, #00BFA6 100%)';

const roleBadgeMap = {
  ROLE_ADMIN:  { bg: 'rgba(91,75,255,0.12)',  color: '#5B4BFF',  label: 'Admin',  grad: 'linear-gradient(135deg,#5B4BFF,#8B7CFF)' },
  ROLE_MEMBER: { bg: 'rgba(0,191,166,0.12)',   color: '#00BFA6',  label: 'Member', grad: 'linear-gradient(135deg,#00BFA6,#2DD4BF)' },
  ROLE_USER:   { bg: 'rgba(255,122,89,0.12)',  color: '#FF7A59',  label: 'User',   grad: 'linear-gradient(135deg,#FF7A59,#FF8A65)' },
};

export default function TopNavbar({ toggleSidebar, title = 'Dashboard', setActiveTab }) {
  const [theme,    setTheme]    = useState(localStorage.getItem('theme') || 'dark');
  const [hoverSearch, setHoverSearch] = useState(false);
  const username = sessionStorage.getItem('username') || 'User';
  const role     = sessionStorage.getItem('role')     || 'ROLE_USER';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const badgeStyle  = roleBadgeMap[role] || roleBadgeMap.ROLE_USER;

  return (
    <header
      className="h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0"
      style={{
        background: theme === 'dark'
          ? 'rgba(17,24,39,0.92)'
          : 'rgba(248,250,252,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: theme === 'dark'
          ? '1px solid rgba(255,255,255,0.06)'
          : '1px solid rgba(15,23,42,0.07)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
      }}
      role="banner">

      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-white/8 transition-all"
          onClick={toggleSidebar} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>

        {/* Page title */}
        <div>
          <h1 className="text-base font-bold text-[#0F172A] dark:text-white leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</h1>
          <p className="text-xs text-[#94A3B8] hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Animated Search bar */}
        <div
          className="hidden md:flex relative items-center group cursor-pointer"
          onClick={() => alert('Search coming soon!')}
          role="search"
          onMouseEnter={() => setHoverSearch(true)}
          onMouseLeave={() => setHoverSearch(false)}>
          <Search size={15}
            className="absolute left-3 transition-colors duration-200 z-10"
            style={{ color: hoverSearch ? '#5B4BFF' : '#94A3B8' }}
            aria-hidden="true" />
          <input type="text" placeholder="Search courses, categories…" readOnly
            className="pl-9 pr-10 py-2 text-sm rounded-xl w-48 cursor-pointer transition-all duration-300"
            style={{
              background: hoverSearch
                ? (theme === 'dark' ? 'rgba(91,75,255,0.08)' : 'rgba(91,75,255,0.06)')
                : (theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)'),
              border: `1px solid ${hoverSearch ? 'rgba(91,75,255,0.35)' : (theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.1)')}`,
              color: theme === 'dark' ? '#94A3B8' : '#64748B',
              outline: 'none',
            }}
            aria-label="Search (coming soon)" />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-semibold rounded mono"
            style={{
              background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)',
              color: '#94A3B8',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            }}>⌘K</kbd>
        </div>

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="relative p-2 rounded-xl transition-all duration-200 overflow-hidden group"
          style={{
            background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
            border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
          }}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          <div className="transition-all duration-300 group-hover:scale-110">
            {theme === 'light'
              ? <Moon size={17} className="text-[#64748B] group-hover:text-[#5B4BFF] transition-colors" />
              : <Sun  size={17} className="text-[#94A3B8] group-hover:text-[#FBBF24] transition-colors" />
            }
          </div>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl transition-all duration-200 group"
          style={{
            background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
            border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
          }}
          aria-label="Notifications (coming soon)"
          onClick={() => alert('Notifications coming soon!')}>
          <Bell size={17} className="text-[#94A3B8] group-hover:text-[#5B4BFF] dark:group-hover:text-[#8B7CFF] transition-colors duration-200 group-hover:scale-110 transform" />
          {/* Animated dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
            style={{
              background: '#5B4BFF',
              borderColor: theme === 'dark' ? '#111827' : '#F8FAFC',
              animation: 'glowPulse 2s ease-in-out infinite',
            }}
            aria-hidden="true" />
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab && setActiveTab('profile')}
          className="flex items-center gap-2.5 pl-3 ml-1 p-1 rounded-xl transition-all duration-200 group hover:bg-[#F8FAFC] dark:hover:bg-white/[0.05]"
          style={{ borderLeft: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'}` }}
          aria-label="Go to profile">
          {/* Avatar with gradient ring */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full p-0.5" style={{ background: GRAD, borderRadius: '50%' }} />
            <div className="relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white m-0.5"
              style={{ background: badgeStyle.grad }}>
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-[#0F172A] dark:text-white leading-tight group-hover:text-[#5B4BFF] dark:group-hover:text-[#8B7CFF] transition-colors">{username}</p>
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
