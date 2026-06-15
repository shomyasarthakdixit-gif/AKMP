import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, FolderOpen, Search } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #6366F1 0%, #60A5FA 100%)';
const INDIGO = '#6366F1';

const PALETTE = [
  { bg: 'rgba(79,70,229,0.08)',   border: 'rgba(79,70,229,0.2)',  icon: '#4F46E5' },
  { bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.2)',  icon: '#06B6D4' },
  { bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.2)', icon: '#F97316' },
  { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)', icon: '#10B981' },
  { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)', icon: '#F59E0B' },
  { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)',  icon: '#EF4444' },
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
      const res = await axios.get('http://localhost:8002/api/v1/sql/categories', { headers: { Authorization: `Bearer ${token}` } });
      setCategories(res.data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreateModal = () => { setCurrentCat({ name: '', description: '' }); setIsEditing(false); setIsModalOpen(true); };
  const openEditModal = (cat) => { setCurrentCat({ ...cat }); setIsEditing(true); setIsModalOpen(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`http://localhost:8002/api/v1/sql/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8002/api/v1/sql/categories/${currentCat.id}`, currentCat, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('http://localhost:8002/api/v1/sql/categories', currentCat, { headers: { Authorization: `Bearer ${token}` } });
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111827] dark:text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>Categories</h2>
          <p className="text-sm text-[#374151] dark:text-[#6B7280] dark:text-[#94A3B8] mt-0.5">
            {isLoading ? 'Loading…' : `${categories.length} knowledge domain${categories.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={openCreateModal}
          className="shine-on-hover flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold text-white transition-all btn-glow"
          style={{ background: GRAD }} aria-label="Create new category">
          <Plus size={16} />
          New Category
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#94A3B8]" aria-hidden="true" />
        <input type="text" placeholder="Search categories…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-xl focus:outline-none focus:ring-2 focus:border-indigo-500 transition-all shadow-sm"
          style={{ '--tw-ring-color': 'rgba(79,70,229,0.2)' }}
          aria-label="Search categories" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 space-y-3">
              <div className="skeleton w-10 h-10 rounded-xl" /><div className="skeleton h-5 w-32 rounded" />
              <div className="skeleton h-3 w-full rounded" /><div className="skeleton h-3 w-3/4 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center" role="status">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(79,70,229,0.08)' }}>
            <FolderOpen size={28} style={{ color: INDIGO }} />
          </div>
          <h3 className="font-semibold text-[#111827] dark:text-foreground mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
            {search ? 'No matching categories' : 'No categories yet'}
          </h3>
          <p className="text-sm text-[#6B7280] max-w-xs">{search ? `No results for "${search}".` : 'Click "New Category" to add your first knowledge domain.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((cat, idx) => {
            const color = PALETTE[idx % PALETTE.length];
            return (
              <div key={cat.id}
                className="group flex flex-col rounded-2xl border bg-white dark:bg-[#1E293B] card-hover overflow-hidden"
                style={{ borderColor: color.border, background: `linear-gradient(145deg, ${color.bg}, rgba(255,255,255,0))` }}>
                <div className="flex-1 p-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: color.bg, border: `1px solid ${color.border}` }}>
                    <FolderOpen size={18} style={{ color: color.icon }} />
                  </div>
                  <h3 className="font-bold text-[#111827] dark:text-foreground mb-1 truncate" style={{ fontFamily: "'Sora', sans-serif" }}>{cat.name}</h3>
                  <p className="text-sm text-[#374151] dark:text-[#6B7280] dark:text-[#94A3B8] line-clamp-2 min-h-[2.5rem]">{cat.description}</p>
                </div>
                <div className="px-5 pb-5 flex gap-2">
                  <button onClick={() => openEditModal(cat)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium text-[#6B7280] bg-[#F8FAFC] dark:bg-[#334155] hover:bg-[#E2E8F0] transition-colors"
                    aria-label={`Edit ${cat.name}`}>
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(cat.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-colors"
                    aria-label={`Delete ${cat.name}`}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[460px] rounded-2xl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Sora', sans-serif" }}>{isEditing ? 'Edit Category' : 'New Category'}</DialogTitle>
            <DialogDescription>{isEditing ? 'Update the details of this category.' : 'Add a new knowledge domain to organise content.'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name" className="text-sm font-semibold">Category Name</Label>
              <Input id="cat-name" value={currentCat.name} onChange={e => setCurrentCat({ ...currentCat, name: e.target.value })} required placeholder="e.g. Web Development" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc" className="text-sm font-semibold">Description</Label>
              <textarea id="cat-desc"
                className="flex min-h-[100px] w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-indigo-500 resize-none transition-all"
                value={currentCat.description} onChange={e => setCurrentCat({ ...currentCat, description: e.target.value })}
                required placeholder="Describe what belongs in this category…" />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
              <button type="submit" className="flex-1 sm:flex-none h-10 px-6 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: GRAD }}>
                {isEditing ? 'Save Changes' : 'Create Category'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


