import { Home, FolderOpen, FileText, Users, Settings, LogOut, PanelLeftClose, PanelLeftOpen, LayoutDashboard } from 'lucide-react';

const PRIMARY = '#5B4BFF';
const TEAL    = '#00BFA6';
const CORAL   = '#FF7A59';
const GRAD    = 'linear-gradient(135deg, #5B4BFF 0%, #00BFA6 100%)';

const roleBadge = {
  ROLE_ADMIN:  { bg: 'rgba(91,75,255,0.12)',  color: '#8B7CFF',  darkColor: '#8B7CFF',  label: 'Admin',  grad: 'linear-gradient(135deg,#5B4BFF,#8B7CFF)' },
  ROLE_MEMBER: { bg: 'rgba(0,191,166,0.12)',   color: '#00BFA6',  darkColor: '#2DD4BF',  label: 'Member', grad: 'linear-gradient(135deg,#00BFA6,#2DD4BF)' },
  ROLE_USER:   { bg: 'rgba(255,122,89,0.12)',  color: '#FF7A59',  darkColor: '#FF8A65',  label: 'User',   grad: 'linear-gradient(135deg,#FF7A59,#FF8A65)' },
};

export default function Sidebar({ isOpen, toggleSidebar, activeTab, setActiveTab }) {
  const role     = sessionStorage.getItem('role') || 'ROLE_USER';
  const username = sessionStorage.getItem('username') || 'User';
  const badge    = roleBadge[role] || roleBadge.ROLE_USER;

  const menuItems = [
    { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard, show: true,
      iconColor: PRIMARY, iconBg: 'rgba(91,75,255,0.12)' },
    { id: 'courses',    label: 'Courses',     icon: FileText,        show: true,
      iconColor: TEAL,    iconBg: 'rgba(0,191,166,0.12)' },
    { id: 'categories', label: 'Categories',  icon: FolderOpen,      show: role === 'ROLE_ADMIN' || role === 'ROLE_MEMBER',
      iconColor: CORAL,   iconBg: 'rgba(255,122,89,0.12)' },
    { id: 'users',      label: 'Users',       icon: Users,           show: role === 'ROLE_ADMIN',
      iconColor: '#F59E0B', iconBg: 'rgba(245,158,11,0.12)' },
  ];

  const handleLogout = () => {
    ['token','username','email','role'].forEach(k => sessionStorage.removeItem(k));
    window.location.href = '/login';
  };

  return (
    <aside
      className={`flex flex-col shrink-0 h-screen transition-all duration-300 ease-in-out relative z-20
        bg-white dark:bg-[#111827]
        border-r border-[#F1F5F9] dark:border-[rgba(255,255,255,0.06)]
        ${isOpen ? 'w-64' : 'w-[72px]'}`}
      style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.06)' }}
      aria-label="Sidebar navigation">

      {/* Header */}
      <div className={`flex items-center h-16 px-4 shrink-0 border-b border-[#F1F5F9] dark:border-[rgba(255,255,255,0.06)] ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-md"
              style={{ background: GRAD }}>A</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-[#0F172A] dark:text-white truncate leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>AKMP</p>
              <p className="text-[10px] text-[#94A3B8] truncate">Knowledge Portal</p>
            </div>
          </div>
        )}
        {!isOpen && (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-md" style={{ background: GRAD }}>A</div>
        )}
        <button onClick={toggleSidebar}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-white/8 transition-all shrink-0"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
          {isOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
        </button>
      </div>

      {/* User badge */}
      {isOpen && (
        <div className="mx-3 mt-4 mb-2 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#F1F5F9] dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md"
              style={{ background: badge.grad }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate leading-tight">{username}</p>
              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
                style={{ background: badge.bg, color: badge.color }}>
                {badge.label}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Collapsed avatar */}
      {!isOpen && (
        <div className="flex justify-center mt-4 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md"
            style={{ background: badge.grad }}>
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden flex flex-col gap-1 px-2" aria-label="Main navigation">
        {isOpen && (
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] dark:text-[#475569] mb-1 px-2">Menu</p>
        )}
        {menuItems.filter(item => item.show).map(item => {
          const Icon    = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              title={!isOpen ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left group
                ${isActive
                  ? 'text-white shadow-lg'
                  : 'text-[#64748B] dark:text-[#64748B] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-white/[0.05]'
                }`}
              style={isActive ? { background: GRAD, boxShadow: '0 4px 16px rgba(91,75,255,0.35)' } : {}}>
              {/* Icon container */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200
                ${isActive ? 'bg-white/20' : 'group-hover:scale-110'}`}
                style={!isActive ? { background: item.iconBg } : {}}>
                <Icon size={16} style={{ color: isActive ? 'white' : item.iconColor }} />
              </div>
              {isOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
              {isActive && isOpen && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-2 border-t border-[#F1F5F9] dark:border-white/[0.06] space-y-1">
        <button
          onClick={() => setActiveTab('profile')}
          title={!isOpen ? 'Settings & Profile' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left text-[#64748B] dark:text-[#64748B] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-white/[0.05] group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#F1F5F9] dark:bg-white/[0.06] group-hover:scale-110 transition-transform duration-200">
            <Settings size={16} className="text-[#94A3B8]" />
          </div>
          {isOpen && <span className="text-sm font-medium">Settings</span>}
        </button>

        <button onClick={handleLogout}
          title={!isOpen ? 'Log out' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 group"
          aria-label="Log out">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-red-50 dark:bg-red-900/20 group-hover:scale-110 transition-transform duration-200">
            <LogOut size={16} className="text-red-400" />
          </div>
          {isOpen && <span className="text-sm font-medium">Log out</span>}
        </button>
      </div>
    </aside>
  );
}
