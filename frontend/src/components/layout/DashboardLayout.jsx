import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import Footer from './Footer';

export default function DashboardLayout({ children, activeTab, setActiveTab, title }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", background: 'hsl(var(--background))' }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-col flex-1 overflow-hidden relative">
        <TopNavbar toggleSidebar={toggleSidebar} title={title} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto relative">
          {/* Ambient gradient blobs — Nebula palette, visible only in dark mode */}
          <div className="pointer-events-none fixed top-16 right-1/4 w-[600px] h-[600px] rounded-full opacity-0 dark:opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #5B4BFF 0%, transparent 70%)', filter: 'blur(90px)', zIndex: 0 }} />
          <div className="pointer-events-none fixed bottom-20 left-1/4 w-[480px] h-[480px] rounded-full opacity-0 dark:opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #00BFA6 0%, transparent 70%)', filter: 'blur(90px)', zIndex: 0 }} />
          <div className="pointer-events-none fixed top-1/2 right-16 w-[320px] h-[320px] rounded-full opacity-0 dark:opacity-[0.03]"
            style={{ background: 'radial-gradient(circle, #FF7A59 0%, transparent 70%)', filter: 'blur(70px)', zIndex: 0 }} />

          {/* Content */}
          <div className="relative z-10 container mx-auto p-5 md:p-7 min-h-[calc(100vh-4rem-5rem)] page-enter">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
