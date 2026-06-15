import React from 'react';
import { Mail, Shield } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #6366F1 0%, #60A5FA 100%)';

const roleMeta = {
  ROLE_ADMIN:  { label: 'Administrator', color: '#4F46E5', bg: 'rgba(79,70,229,0.1)',  border: 'rgba(79,70,229,0.25)', gradient: 'from-indigo-500 to-indigo-700' },
  ROLE_MEMBER: { label: 'Member',        color: '#0891B2', bg: 'rgba(6,182,212,0.1)',  border: 'rgba(6,182,212,0.25)',  gradient: 'from-cyan-500 to-cyan-700' },
  ROLE_USER:   { label: 'User',          color: '#C2410C', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)', gradient: 'from-orange-500 to-orange-700' },
};

export default function Profile() {
  const username = sessionStorage.getItem('username') || 'Unknown User';
  const email    = sessionStorage.getItem('email')    || 'No email set';
  const role     = sessionStorage.getItem('role')     || 'ROLE_USER';
  const meta     = roleMeta[role] || roleMeta.ROLE_USER;

  return (
    <div className="max-w-xl mx-auto mt-4 page-enter" aria-label="Your profile">
      <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-28 relative" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1e1b4b 50%, #0c1a3a 100%)' }}>
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="absolute top-2 right-8 w-20 h-20 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-1/3 w-24 h-24 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }} />
        </div>

        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-white dark:border-card bg-gradient-to-br ${meta.gradient}`}
              aria-label={`Avatar for ${username}`}>
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border"
              style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}>
              <Shield size={12} aria-hidden="true" />
              {meta.label}
            </span>
          </div>

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-[#111827] dark:text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>{username}</h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-[#374151] dark:text-[#6B7280] dark:text-[#94A3B8]">
              <Mail size={14} aria-hidden="true" />
              <span>{email}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col p-4 rounded-xl border border-[#E5E7EB] dark:border-[#334155] bg-[#FAFAFB] dark:bg-[#1E293B]/50">
              <span className="text-xs text-[#6B7280] mb-1">Account Role</span>
              <span className="text-sm font-bold text-[#111827] dark:text-foreground">{meta.label}</span>
            </div>
            <div className="flex flex-col p-4 rounded-xl border border-[#E5E7EB] dark:border-[#334155] bg-[#FAFAFB] dark:bg-[#1E293B]/50">
              <span className="text-xs text-[#6B7280] mb-1">Status</span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />Active
              </span>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(79,70,229,0.04)', border: '1px solid rgba(79,70,229,0.12)' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white" style={{ background: GRAD }}>A</div>
              <div>
                <p className="text-xs font-semibold text-[#111827] dark:text-foreground">AKMP Member</p>
                <p className="text-[10px] text-[#6B7280]">Accessible Knowledge Management Portal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


