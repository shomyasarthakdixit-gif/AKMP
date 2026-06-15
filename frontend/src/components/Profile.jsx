import React from 'react';
import { Mail, Shield, Star, Clock, CheckCircle2 } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #5B4BFF 0%, #00BFA6 100%)';

const roleMeta = {
  ROLE_ADMIN:  {
    label: 'Administrator', color: '#5B4BFF', bg: 'rgba(91,75,255,0.1)', border: 'rgba(91,75,255,0.25)',
    grad: 'linear-gradient(135deg,#5B4BFF,#8B7CFF)', bannerGrad: 'linear-gradient(135deg, #070B14 0%, #1a1040 50%, #0a1628 100%)',
    glowColor: 'rgba(91,75,255,0.4)',
  },
  ROLE_MEMBER: {
    label: 'Member',        color: '#00BFA6', bg: 'rgba(0,191,166,0.1)', border: 'rgba(0,191,166,0.25)',
    grad: 'linear-gradient(135deg,#00BFA6,#2DD4BF)', bannerGrad: 'linear-gradient(135deg, #070B14 0%, #001a17 50%, #003d35 100%)',
    glowColor: 'rgba(0,191,166,0.4)',
  },
  ROLE_USER:   {
    label: 'User',          color: '#FF7A59', bg: 'rgba(255,122,89,0.1)', border: 'rgba(255,122,89,0.25)',
    grad: 'linear-gradient(135deg,#FF7A59,#FF8A65)', bannerGrad: 'linear-gradient(135deg, #070B14 0%, #1a0a05 50%, #3d1a0d 100%)',
    glowColor: 'rgba(255,122,89,0.4)',
  },
};

export default function Profile() {
  const username = sessionStorage.getItem('username') || 'Unknown User';
  const email    = sessionStorage.getItem('email')    || 'No email set';
  const role     = sessionStorage.getItem('role')     || 'ROLE_USER';
  const meta     = roleMeta[role] || roleMeta.ROLE_USER;

  return (
    <div className="max-w-2xl mx-auto mt-4 page-enter space-y-6" aria-label="Your profile">

      {/* Main profile card */}
      <div className="rounded-3xl border border-[#F1F5F9] dark:border-white/[0.06] bg-white dark:bg-card overflow-hidden"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>

        {/* Banner */}
        <div className="h-36 relative" style={{ background: meta.bannerGrad }}>
          {/* Animated orbs */}
          <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${meta.glowColor} 0%, transparent 70%)`, filter: 'blur(30px)', animation: 'floatSlow 10s ease-in-out infinite' }} />
          <div className="absolute bottom-[-20px] left-1/3 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,191,166,0.25) 0%, transparent 70%)', filter: 'blur(25px)', animation: 'floatMedium 7s ease-in-out infinite' }} />
          {/* Grid */}
          <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
          {/* Decorative ring */}
          <div className="absolute top-4 left-4 w-20 h-20 rounded-full pointer-events-none"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>

        <div className="px-7 pb-7">
          {/* Avatar + badge row */}
          <div className="-mt-12 mb-5 flex items-end justify-between">
            {/* Avatar with gradient ring */}
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl" style={{ background: meta.grad, borderRadius: '1rem', padding: '3px' }} />
              <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-2xl border-4 border-white dark:border-card m-[3px]"
                style={{ background: meta.grad }}
                aria-label={`Avatar for ${username}`}>
                {username.charAt(0).toUpperCase()}
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-card"
                style={{ background: '#22C55E' }} />
            </div>

            {/* Role badge */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border shadow-sm"
              style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}>
              <Shield size={14} aria-hidden="true" />
              {meta.label}
            </span>
          </div>

          {/* Name & email */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>{username}</h2>
            <div className="flex items-center gap-2 mt-1.5 text-sm text-[#94A3B8]">
              <Mail size={14} aria-hidden="true" />
              <span>{email}</span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col p-4 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#F1F5F9] dark:border-white/[0.06]">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8] mb-1.5">Account Role</span>
              <span className="text-sm font-bold text-[#0F172A] dark:text-foreground">{meta.label}</span>
            </div>
            <div className="flex flex-col p-4 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#F1F5F9] dark:border-white/[0.06]">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8] mb-1.5">Status</span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-[#22C55E]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" style={{ animation: 'glowPulse 2s ease-in-out infinite' }} />
                Active
              </span>
            </div>
            <div className="flex flex-col p-4 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#F1F5F9] dark:border-white/[0.06]">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8] mb-1.5">Member Since</span>
              <span className="text-sm font-bold text-[#0F172A] dark:text-foreground">2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* AKMP membership card */}
      <div className="rounded-2xl border border-[#F1F5F9] dark:border-white/[0.06] bg-white dark:bg-card p-5 flex items-center gap-4"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-lg shrink-0"
          style={{ background: GRAD }}>A</div>
        <div className="flex-1">
          <p className="font-bold text-[#0F172A] dark:text-foreground text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>AKMP Member</p>
          <p className="text-xs text-[#94A3B8]">Accessible Knowledge Management Portal</p>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#F59E0B" stroke="none" />)}
        </div>
      </div>

      {/* Capabilities card */}
      <div className="rounded-2xl border border-[#F1F5F9] dark:border-white/[0.06] bg-white dark:bg-card p-6"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
        <h3 className="font-bold text-[#0F172A] dark:text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Account Capabilities</h3>
        <div className="space-y-3">
          {([
            ['View all courses and materials', true],
            ['Post and manage reviews', true],
            ['Create and edit categories', role === 'ROLE_ADMIN' || role === 'ROLE_MEMBER'],
            ['Create and edit courses', role === 'ROLE_ADMIN' || role === 'ROLE_MEMBER'],
            ['Manage all users', role === 'ROLE_ADMIN'],
            ['Full platform administration', role === 'ROLE_ADMIN'],
          ]).map(([cap, allowed]) => (
            <div key={cap} className="flex items-center gap-3">
              <CheckCircle2 size={16} style={{ color: allowed ? '#22C55E' : '#E5E7EB', flexShrink: 0 }} />
              <span className={`text-sm ${allowed ? 'text-[#0F172A] dark:text-foreground' : 'text-[#CBD5E1] dark:text-[#334155] line-through'}`}>{cap}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
