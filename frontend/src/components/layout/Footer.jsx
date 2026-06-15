const GRAD = 'linear-gradient(135deg, #5B4BFF 0%, #00BFA6 100%)';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="shrink-0 mt-auto"
      style={{
        borderTop: '1px solid rgba(15,23,42,0.07)',
        background: 'rgba(248,250,252,0.8)',
        backdropFilter: 'blur(12px)',
      }}>
      <div className="dark:hidden" style={{ borderTop: '1px solid rgba(15,23,42,0.07)', background: 'rgba(248,250,252,0.8)' }} />
      <style>{`.dark footer { border-top: 1px solid rgba(255,255,255,0.06) !important; background: rgba(17,24,39,0.8) !important; }`}</style>
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-sm" style={{ background: GRAD }}>A</div>
          <span className="text-xs text-[#94A3B8]">
            © {year} AKMP · Accessible Knowledge Management Portal
          </span>
        </div>
        <div className="flex items-center gap-5 text-xs font-medium text-[#94A3B8]">
          <a href="#" className="hover:text-[#5B4BFF] dark:hover:text-[#8B7CFF] transition-colors duration-200">Privacy Policy</a>
          <a href="#" className="hover:text-[#5B4BFF] dark:hover:text-[#8B7CFF] transition-colors duration-200">Terms of Service</a>
          <a href="mailto:support@akmp.com" className="hover:text-[#5B4BFF] dark:hover:text-[#8B7CFF] transition-colors duration-200">Support</a>
        </div>
      </div>
    </footer>
  );
}
