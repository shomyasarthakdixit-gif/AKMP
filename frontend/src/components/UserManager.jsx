import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Edit2, Trash2, Mail, Search, Users } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #6366F1 0%, #60A5FA 100%)';

const roleMeta = {
  ROLE_ADMIN:  { label: 'Admin',  class: 'badge-admin',  avatar: 'from-indigo-500 to-indigo-700' },
  ROLE_MEMBER: { label: 'Member', class: 'badge-member', avatar: 'from-cyan-500 to-cyan-700' },
  ROLE_USER:   { label: 'User',   class: 'badge-user',   avatar: 'from-orange-500 to-orange-700' },
};

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const token    = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('role');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8002/api/v1/auth/users', { headers: { Authorization: `Bearer ${token}` } });
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
      await axios.delete(`http://localhost:8002/api/v1/auth/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchUsers();
    } catch (err) { console.error(err); }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8002/api/v1/auth/users/${currentUser.id}`, currentUser, { headers: { Authorization: `Bearer ${token}` } });
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111827] dark:text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>Users</h2>
          <p className="text-sm text-[#374151] dark:text-[#6B7280] dark:text-[#94A3B8] mt-0.5">
            {isLoading ? 'Loading…' : `${users.length} registered account${users.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#94A3B8]" />
        <input type="text" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-xl focus:outline-none focus:ring-2 focus:border-indigo-500 transition-all shadow-sm"
          aria-label="Search users" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 space-y-4">
              <div className="flex items-center gap-3"><div className="skeleton w-12 h-12 rounded-full" /><div className="space-y-2 flex-1"><div className="skeleton h-4 w-24 rounded" /><div className="skeleton h-3 w-16 rounded-full" /></div></div>
              <div className="skeleton h-3 w-full rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center" role="status">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(6,182,212,0.08)' }}>
            <Users size={28} style={{ color: '#06B6D4' }} />
          </div>
          <h3 className="font-semibold text-[#111827] dark:text-foreground mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
            {search ? 'No matching users' : 'No users found'}
          </h3>
          <p className="text-sm text-[#6B7280]">{search ? `No results for "${search}".` : 'No users registered yet.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(u => {
            const meta = roleMeta[u.role] || roleMeta.ROLE_USER;
            return (
              <div key={u.id} className="group flex flex-col rounded-2xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] card-hover overflow-hidden">
                <div className="h-16 relative" style={{ background: 'linear-gradient(135deg, #0F172A, #1e1b4b)' }}>
                  <div className="absolute inset-0 opacity-[0.06]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                </div>
                <div className="flex-1 px-5 pb-5">
                  <div className="relative z-10 -mt-6 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg border-2 border-white dark:border-card bg-gradient-to-br ${meta.avatar}`}>
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="mb-3">
                    <h3 className="font-bold text-[#111827] dark:text-foreground truncate" style={{ fontFamily: "'Sora', sans-serif" }}>{u.username}</h3>
                    <span className={`mt-1 ${meta.class}`}>{meta.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <Mail size={12} aria-hidden="true" /><span className="truncate">{u.email}</span>
                  </div>
                </div>
                {userRole === 'ROLE_ADMIN' && (
                  <div className="px-5 pb-5 flex gap-2 border-t border-[#E5E7EB] dark:border-[#334155] pt-4">
                    <button onClick={() => openEditModal(u)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium text-[#6B7280] bg-[#F8FAFC] dark:bg-[#334155] hover:bg-[#E2E8F0] transition-colors"
                      aria-label={`Edit ${u.username}`}>
                      <Edit2 size={12} /> Edit
                    </button>
                    <button onClick={() => handleDelete(u.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-colors"
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Sora', sans-serif" }}>Edit User</DialogTitle>
            <DialogDescription>Update this user's account details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5"><Label htmlFor="edit-username" className="text-sm font-semibold">Username</Label>
              <Input id="edit-username" value={currentUser.username} onChange={e => setCurrentUser({ ...currentUser, username: e.target.value })} required className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><Label htmlFor="edit-email" className="text-sm font-semibold">Email</Label>
              <Input id="edit-email" type="email" value={currentUser.email} onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })} required className="h-11 rounded-xl" /></div>
            <div className="space-y-1.5"><Label htmlFor="edit-password" className="text-sm font-semibold">New Password</Label>
              <Input id="edit-password" type="text" value={currentUser.password} onChange={e => setCurrentUser({ ...currentUser, password: e.target.value })} required placeholder="Enter new password" className="h-11 rounded-xl" /></div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
              <button type="submit" className="flex-1 sm:flex-none h-10 px-6 rounded-xl text-sm font-semibold text-white" style={{ background: GRAD }}>Save Changes</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


