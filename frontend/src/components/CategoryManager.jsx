import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, FolderOpen, Search, ArrowRight } from 'lucide-react';

const GRAD    = 'linear-gradient(135deg, #5B4BFF 0%, #00BFA6 100%)';
const PRIMARY = '#5B4BFF';

const PALETTE = [
  { bg: 'rgba(91,75,255,0.08)',   border: 'rgba(91,75,255,0.2)',   icon: '#5B4BFF', grad: 'linear-gradient(135deg,#5B4BFF,#8B7CFF)' },
  { bg: 'rgba(0,191,166,0.08)',   border: 'rgba(0,191,166,0.2)',   icon: '#00BFA6', grad: 'linear-gradient(135deg,#00BFA6,#2DD4BF)' },
  { bg: 'rgba(255,122,89,0.08)',  border: 'rgba(255,122,89,0.2)',  icon: '#FF7A59', grad: 'linear-gradient(135deg,#FF7A59,#FF8A65)' },
  { bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)',   icon: '#22C55E', grad: 'linear-gradient(135deg,#22C55E,#4ADE80)' },
  { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  icon: '#F59E0B', grad: 'linear-gradient(135deg,#F59E0B,#FBBF24)' },
  { bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.2)',  icon: '#8B5CF6', grad: 'linear-gradient(135deg,#8B5CF6,#A78BFA)' },
];

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCat, setCurrentCat] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const token = sessionStorage.getItem('token');

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/sql/categories`, { headers: { Authorization: `Bearer ${token}` } });
      setCategories(res.data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreateModal = () => { setCurrentCat({ name: '', description: '' }); setIsEditing(false); setIsModalOpen(true); };
  const openEditModal   = (cat) => { setCurrentCat({ ...cat }); setIsEditing(true); setIsModalOpen(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/sql/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/sql/categories/${currentCat.id}`, currentCat, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/sql/categories`, currentCat, { headers: { Authorization: `Bearer ${token}` } });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>Categories</h2>
          <p className="text-sm text-[#94A3B8] mt-0.5">
            {isLoading ? 'Loading…' : `${categories.length} knowledge domain${categories.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={openCreateModal} id="add-category-btn"
          className="shine-on-hover flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold text-white transition-all btn-glow"
          style={{ background: GRAD }} aria-label="Create new category">
          <Plus size={16} /> New Category
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" aria-hidden="true" />
        <input type="text" placeholder="Search categories…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-card border border-[#F1F5F9] dark:border-white/[0.06] rounded-2xl focus:outline-none focus:ring-2 focus:border-[#5B4BFF] transition-all shadow-sm"
          style={{ '--tw-ring-color': 'rgba(91,75,255,0.15)' }}
          aria-label="Search categories" />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#F1F5F9] dark:border-white/[0.06] bg-white dark:bg-card p-5 space-y-3">
              <div className="skeleton w-11 h-11 rounded-2xl" />
              <div className="skeleton h-5 w-32 rounded" />
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-3/4 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center" role="status">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(91,75,255,0.08)', border: '1px dashed rgba(91,75,255,0.2)' }}>
            <FolderOpen size={32} style={{ color: PRIMARY, opacity: 0.5 }} />
          </div>
          <h3 className="font-semibold text-[#0F172A] dark:text-foreground mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {search ? 'No matching categories' : 'No categories yet'}
          </h3>
          <p className="text-sm text-[#94A3B8] max-w-xs">
            {search ? `No results for "${search}".` : 'Click "New Category" to add your first knowledge domain.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((cat, idx) => {
            const color = PALETTE[idx % PALETTE.length];
            return (
              <div key={cat.id}
                className="group flex flex-col rounded-2xl bg-white dark:bg-card border overflow-hidden cursor-default"
                style={{
                  borderColor: color.border,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 36px ${color.icon}20, 0 4px 12px rgba(0,0,0,0.06)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)';
                }}>
                {/* Gradient top accent bar */}
                <div className="h-1 w-full" style={{ background: color.grad }} />

                <div className="flex-1 p-5">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
                    style={{ background: color.grad }}>
                    <FolderOpen size={18} className="text-white" />
                  </div>
                  <h3 className="font-bold text-[#0F172A] dark:text-foreground mb-1.5 truncate group-hover:text-opacity-80 transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>{cat.name}</h3>
                  <p className="text-sm text-[#94A3B8] line-clamp-2 min-h-[2.5rem] leading-relaxed">{cat.description}</p>
                </div>

                <div className="px-5 pb-5 flex gap-2">
                  <button onClick={() => openEditModal(cat)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-semibold transition-all duration-200"
                    style={{ background: color.bg, color: color.icon, border: `1px solid ${color.border}` }}
                    aria-label={`Edit ${cat.name}`}>
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(cat.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-all duration-200 border border-red-100 dark:border-red-900/30"
                    aria-label={`Delete ${cat.name}`}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[460px] rounded-3xl border-[#F1F5F9] dark:border-white/[0.08]">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Poppins', sans-serif" }}>{isEditing ? 'Edit Category' : 'New Category'}</DialogTitle>
            <DialogDescription>{isEditing ? 'Update the details of this category.' : 'Add a new knowledge domain to organise content.'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name" className="text-sm font-semibold">Category Name</Label>
              <Input id="cat-name" value={currentCat.name}
                onChange={e => setCurrentCat({ ...currentCat, name: e.target.value })}
                required placeholder="e.g. Web Development" className="h-11 rounded-2xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc" className="text-sm font-semibold">Description</Label>
              <textarea id="cat-desc"
                className="flex min-h-[100px] w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-[#5B4BFF] resize-none transition-all"
                value={currentCat.description}
                onChange={e => setCurrentCat({ ...currentCat, description: e.target.value })}
                required placeholder="Describe what belongs in this category…" />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
              <button type="submit" className="flex-1 sm:flex-none h-10 px-6 rounded-xl text-sm font-semibold text-white shine-on-hover transition-all btn-glow"
                style={{ background: GRAD }}>
                {isEditing ? 'Save Changes' : 'Create Category'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

