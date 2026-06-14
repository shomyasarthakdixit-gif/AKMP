import { NavLink } from 'react-router-dom';
import { Home, FolderOpen, FileText, Users, Settings, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar, activeTab, setActiveTab }) {
  const role = localStorage.getItem('role') || 'ROLE_USER';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, show: true },
    { id: 'courses', label: 'Courses', icon: FileText, show: true },
    { id: 'categories', label: 'Categories', icon: FolderOpen, show: role === 'ROLE_ADMIN' || role === 'ROLE_MEMBER' },
    { id: 'users', label: 'Users', icon: Users, show: role === 'ROLE_ADMIN' },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings, show: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 dark:bg-slate-950 text-slate-300 border-r border-slate-800 transition-all duration-300 ease-in-out ${isOpen ? 'w-72' : 'w-20'} md:relative md:flex`}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        {isOpen && (
          <div className="flex items-center gap-2 font-bold text-lg text-white truncate overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg">A</div>
            <span>Access Portal</span>
          </div>
        )}
        {!isOpen && (
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold mx-auto shadow-lg">A</div>
        )}
        <button 
          onClick={toggleSidebar} 
          className="text-slate-400 hover:text-white hidden md:block ml-auto transition-colors"
        >
          {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 overflow-y-auto overflow-x-hidden flex flex-col gap-1 px-3">
        {menuItems.filter(item => item.show).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
        {bottomItems.filter(item => item.show).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'settings') {
                  alert('Work in progress!');
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200 mt-2"
        >
          <LogOut size={20} />
          {isOpen && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
}
