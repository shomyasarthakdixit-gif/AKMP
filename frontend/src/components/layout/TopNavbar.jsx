import { useState, useEffect } from 'react';
import { Search, Moon, Sun, Bell, User, Menu } from 'lucide-react';

export default function TopNavbar({ toggleSidebar, title = 'Dashboard', setActiveTab }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const username = localStorage.getItem('username') || 'User';

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="h-16 px-6 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-muted-foreground hover:text-primary transition-colors" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex relative group" onClick={() => alert("Work in progress!")}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors group-focus-within:text-primary cursor-pointer" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-2 text-sm bg-muted/50 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all w-64 focus:bg-background hover:bg-muted cursor-pointer"
            readOnly
          />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all active:scale-95">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button onClick={() => alert("Work in progress!")} className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all active:scale-95 relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card animate-pulse"></span>
          </button>
          
          <button 
            onClick={() => setActiveTab && setActiveTab('profile')}
            className="flex items-center gap-2 pl-3 ml-1 border-l border-border hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 text-primary-foreground flex items-center justify-center shadow-md transform hover:scale-105 transition-transform">
              <User size={16} />
            </div>
            <span className="text-sm font-medium hidden sm:block hover:text-primary transition-colors">{username}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
