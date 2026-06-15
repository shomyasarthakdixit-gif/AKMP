import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Edit2, Trash2, Mail, Search, Users } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #5B4BFF 0%, #00BFA6 100%)';

const roleMeta = {
  ROLE_ADMIN:  {
    label: 'Admin',  class: 'badge-admin',  grad: 'linear-gradient(135deg,#5B4BFF,#8B7CFF)',
    bannerGrad: 'linear-gradient(135deg, #1a1040, #2d1b69)', glowColor: 'rgba(91,75,255,0.3)',
  },
  ROLE_MEMBER: {
    label: 'Member', class: 'badge-member', grad: 'linear-gradient(135deg,#00BFA6,#2DD4BF)',
    bannerGrad: 'linear-gradient(135deg, #001a17, #003d35)', glowColor: 'rgba(0,191,166,0.3)',
  },
  ROLE_USER:   {
    label: 'User',   class: 'badge-user',   grad: 'linear-gradient(135deg,#FF7A59,#FF8A65)',
    bannerGrad: 'linear-gradient(135deg, #1a0a05, #3d1a0d)', glowColor: 'rgba(255,122,89,0.3)',
  },
};

export default function UserManager() {
  const [users,       setUsers]       = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: '', email: '', password: '' });
  const [isLoading,   setIsLoading]   = useState(true);
  const [search,      setSearch]      = useState('');
  const token    = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('role');

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/users`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openEditModal = (user) => {
    setCurrentUser({ id: user.id, username: user.username, email: user.email, password: user.password || '' });
    setIsModalOpen(true);
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchUsers();
    } catch (err) { console.error(err); }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/users/${currentUser.id}`, currentUser, { headers: { Authorization: `Bearer ${token}` } });
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>Users</h2>
          <p className="text-sm text-[#94A3B8] mt-0.5">
            {isLoading ? 'Loading…' : `${users.length} registered account${users.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input type="text" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-card border border-[#F1F5F9] dark:border-white/[0.06] rounded-2xl focus:outline-none focus:ring-2 focus:border-[#5B4BFF] transition-all shadow-sm"
          aria-label="Search users" />
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#F1F5F9] dark:border-white/[0.06] bg-white dark:bg-card overflow-hidden">
              <div className="skeleton h-16 w-full" />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="skeleton w-12 h-12 rounded-full -mt-8" />
                  <div className="space-y-2 flex-1 mt-2">
                    <div className="skeleton h-4 w-24 rounded" />
                    <div className="skeleton h-3 w-16 rounded-full" />
                  </div>
                </div>
                <div className="skeleton h-3 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center" role="status">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(0,191,166,0.08)', border: '1px dashed rgba(0,191,166,0.2)' }}>
            <Users size={32} style={{ color: '#00BFA6', opacity: 0.5 }} />
          </div>
          <h3 className="font-semibold text-[#0F172A] dark:text-foreground mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {search ? 'No matching users' : 'No users found'}
          </h3>
          <p className="text-sm text-[#94A3B8]">{search ? `No results for "${search}".` : 'No users registered yet.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(u => {
            const meta = roleMeta[u.role] || roleMeta.ROLE_USER;
            return (
              <div key={u.id}
                className="group flex flex-col rounded-2xl border border-[#F1F5F9] dark:border-white/[0.06] bg-white dark:bg-card overflow-hidden"
                style={{
                  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 16px 40px ${meta.glowColor}, 0 4px 12px rgba(0,0,0,0.06)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)';
                }}>

                {/* Role-colored banner */}
                <div className="h-16 relative" style={{ background: meta.bannerGrad }}>
                  <div className="absolute inset-0 grid-bg opacity-40" />
                  <div className="absolute top-2 right-2 w-16 h-16 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${meta.glowColor} 0%, transparent 70%)`, filter: 'blur(10px)' }} />
                </div>

                <div className="flex-1 px-5 pb-5">
                  {/* Avatar */}
                  <div className="relative z-10 -mt-6 mb-3">
                    <div className="relative inline-block">
                      {/* Gradient ring */}
                      <div className="absolute inset-0 rounded-full p-0.5" style={{ background: meta.grad, borderRadius: '50%' }} />
                      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white border-2 border-white dark:border-card m-0.5`}
                        style={{ background: meta.grad }}>
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-bold text-[#0F172A] dark:text-foreground truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{u.username}</h3>
                    <span className={`mt-1.5 inline-flex ${meta.class}`}>{meta.label}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                    <Mail size={12} aria-hidden="true" />
                    <span className="truncate">{u.email}</span>
                  </div>
                </div>

                {userRole === 'ROLE_ADMIN' && (
                  <div className="px-5 pb-5 flex gap-2 border-t border-[#F1F5F9] dark:border-white/[0.06] pt-4">
                    <button onClick={() => openEditModal(u)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-semibold text-[#64748B] bg-[#F8FAFC] dark:bg-white/[0.06] hover:bg-[#EEF2FF] dark:hover:bg-white/10 transition-all"
                      aria-label={`Edit ${u.username}`}>
                      <Edit2 size={12} /> Edit
                    </button>
                    <button onClick={() => handleDelete(u.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-all"
                      aria-label={`Delete ${u.username}`}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl border-[#F1F5F9] dark:border-white/[0.08]">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Poppins', sans-serif" }}>Edit User</DialogTitle>
            <DialogDescription>Update this user's account details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-username" className="text-sm font-semibold">Username</Label>
              <Input id="edit-username" value={currentUser.username}
                onChange={e => setCurrentUser({ ...currentUser, username: e.target.value })} required className="h-11 rounded-2xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email" className="text-sm font-semibold">Email</Label>
              <Input id="edit-email" type="email" value={currentUser.email}
                onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })} required className="h-11 rounded-2xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-password" className="text-sm font-semibold">New Password</Label>
              <Input id="edit-password" type="text" value={currentUser.password}
                onChange={e => setCurrentUser({ ...currentUser, password: e.target.value })} required
                placeholder="Enter new password" className="h-11 rounded-2xl" />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
              <button type="submit" className="flex-1 sm:flex-none h-10 px-6 rounded-xl text-sm font-semibold text-white shine-on-hover btn-glow"
                style={{ background: GRAD }}>Save Changes</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

