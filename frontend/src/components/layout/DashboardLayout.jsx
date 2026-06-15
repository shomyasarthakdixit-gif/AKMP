import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import Footer from './Footer';

export default function DashboardLayout({ children, activeTab, setActiveTab, title }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-[#FAFAFB] dark:bg-[#0F172A] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-col flex-1 overflow-hidden relative">
        <TopNavbar toggleSidebar={toggleSidebar} title={title} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto relative bg-[#F8FAFC] dark:bg-[#0F172A]">
          {/* Ambient gradient blobs — subtle in dark, invisible in light */}
          <div className="pointer-events-none fixed top-10 right-1/4 w-[500px] h-[500px] rounded-full opacity-0 dark:opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }} />
          <div className="pointer-events-none fixed bottom-20 left-1/3 w-[400px] h-[400px] rounded-full opacity-0 dark:opacity-[0.05]"
            style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }} />

          <div className="relative z-10 container mx-auto p-6 md:p-8 min-h-[calc(100vh-4rem-5rem)] page-enter">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

