import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import Footer from './Footer';

export default function DashboardLayout({ children, activeTab, setActiveTab, title }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <TopNavbar toggleSidebar={toggleSidebar} title={title} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto bg-background/50 relative">
          {/* Animated Ambient Background */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse pointer-events-none z-0"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-700 pointer-events-none z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none z-0" />
          
          <div className="container mx-auto p-6 md:p-8 min-h-[calc(100vh-4rem-5rem)] relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
