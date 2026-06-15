import { Home, FolderOpen, FileText, Users, Settings, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #6366F1 0%, #60A5FA 100%)';

export default function Sidebar({ isOpen, toggleSidebar, activeTab, setActiveTab }) {
  const role     = sessionStorage.getItem('role') || 'ROLE_USER';
  const username = sessionStorage.getItem('username') || 'User';

  const roleBadge = {
    ROLE_ADMIN:  { bg: '#EEF2FF', color: '#4F46E5', darkBg: 'rgba(99,102,241,0.2)', darkColor: '#A5B4FC', label: 'Admin' },
    ROLE_MEMBER: { bg: '#EFF6FF', color: '#2563EB', darkBg: 'rgba(34,211,238,0.2)', darkColor: '#67E8F9', label: 'Member' },
    ROLE_USER:   { bg: '#FFF7ED', color: '#C2410C', darkBg: 'rgba(249,115,22,0.2)', darkColor: '#FDBA74', label: 'User' },
  };
  const badge = roleBadge[role] || roleBadge.ROLE_USER;

  const menuItems = [
    { id: 'dashboard',  label: 'Dashboard',  icon: Home,       show: true },
    { id: 'courses',    label: 'Courses',     icon: FileText,   show: true },
    { id: 'categories', label: 'Categories',  icon: FolderOpen, show: role === 'ROLE_ADMIN' || role === 'ROLE_MEMBER' },
    { id: 'users',      label: 'Users',       icon: Users,      show: role === 'ROLE_ADMIN' },
  ];

  const handleLogout = () => {
    ['token','username','email','role'].forEach(k => sessionStorage.removeItem(k));
    window.location.href = '/login';
  };

  return (
    <aside
      className={`flex flex-col shrink-0 h-screen transition-all duration-300 ease-in-out border-r border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] ${isOpen ? 'w-64' : 'w-[72px]'}`}
      aria-label="Sidebar navigation"
    >
      {/* Header */}
      <div className={`flex items-center h-16 px-4 border-b border-[#E5E7EB] dark:border-[#334155] shrink-0 ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white shrink-0" style={{ background: GRAD }}>A</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-[#111827] dark:text-white truncate leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>AKMP</p>
              <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] truncate">Knowledge Portal</p>
            </div>
          </div>
        )}
        {!isOpen && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white" style={{ background: GRAD }}>A</div>
        )}
        <button onClick={toggleSidebar}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-md text-[#6B7280] hover:text-[#111827] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-all shrink-0"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
          {isOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      </div>

      {/* User badge */}
      {isOpen && (
        <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-[#FAFAFB] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: GRAD }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-[#111827] dark:text-white truncate">{username}</p>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: badge.bg, color: badge.color }}>
                {badge.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden flex flex-col gap-0.5 px-2" aria-label="Main navigation">
        {isOpen && <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280] dark:text-[#475569] mb-1 px-2">Menu</p>}
        {menuItems.filter(item => item.show).map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}>
              <Icon size={18} className={`shrink-0 transition-colors ${isActive ? 'text-[#4F46E5] dark:text-[#A5B4FC]' : 'text-[#6B7280] dark:text-[#64748B]'}`} />
              {isOpen && <span className="text-sm truncate">{item.label}</span>}
              {isActive && isOpen && <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0 bg-[#6366F1]" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-[#E5E7EB] dark:border-[#334155] space-y-0.5">
        <button onClick={() => alert('Settings coming soon!')}
          className="sidebar-item w-full">
          <Settings size={18} className="shrink-0 text-[#6B7280] dark:text-[#64748B]" />
          {isOpen && <span className="text-sm">Settings</span>}
        </button>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-900/20"
          aria-label="Log out">
          <LogOut size={18} className="shrink-0" />
          {isOpen && <span className="text-sm font-medium">Log out</span>}
        </button>
      </div>
    </aside>
  );
}
