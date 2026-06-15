export default function Footer() {
  const currentYear = new Date().getFullYear();
  const GRAD = 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #06B6D4 100%)';
  return (
    <footer className="border-t border-[#E2E8F0] dark:border-[#334155]
      bg-white/80 dark:bg-[#1E293B]/80
      backdrop-blur-sm py-5 mt-auto shrink-0">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
            style={{ background: GRAD }}>A</div>
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            © {currentYear} AKMP · Accessible Knowledge Management Portal
          </span>
        </div>
        <div className="flex items-center gap-5 text-xs font-medium text-[#94A3B8]">
          <a href="#" className="hover:text-[#4F46E5] dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#4F46E5] dark:hover:text-indigo-400 transition-colors">Terms of Service</a>
          <a href="mailto:support@akmp.com" className="hover:text-[#4F46E5] dark:hover:text-indigo-400 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}

