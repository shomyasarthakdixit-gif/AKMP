import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Search, BookOpen, Clock, MessageCircle } from 'lucide-react';
import ReviewsModal from './ReviewsModal';

const GRAD    = 'linear-gradient(135deg, #5B4BFF 0%, #00BFA6 100%)';
const PRIMARY = '#5B4BFF';
const TEAL    = '#00BFA6';
const CORAL   = '#FF7A59';

export default function CourseManager() {
  const [courses,    setCourses]    = useState([]);
  const [categories, setCategories] = useState([]);
  const [users,      setUsers]      = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    title: '', description: '', price: 0, duration: '', thumbnailUrl: '',
    category: { id: '' }, author: { id: '' },
  });
  const [isEditing,  setIsEditing]  = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [search,     setSearch]     = useState('');
  const [isLoading,  setIsLoading]  = useState(true);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [selectedCourseForReviews, setSelectedCourseForReviews] = useState(null);

  const token   = sessionStorage.getItem('token');
  const role    = sessionStorage.getItem('role');
  const isAdmin = role === 'ROLE_ADMIN';

  const openReviews = (course) => { setSelectedCourseForReviews(course); setIsReviewsOpen(true); };

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [courseRes, catRes, userRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/sql/courses`,    { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/sql/categories`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/users`,     { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setCourses(courseRes.data || []);
      setCategories(catRes.data || []);
      setUsers(userRes.data || []);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreateModal = () => {
    setCurrentCourse({ title: '', description: '', price: 0, duration: '', thumbnailUrl: '', category: { id: categories[0]?.id || '' }, author: { id: users[0]?.id || '' } });
    setIsEditing(false); setIsModalOpen(true);
  };
  const openEditModal = (course) => {
    setCurrentCourse({ ...course, category: { id: course.category?.id || '' }, author: { id: course.author?.id || '' } });
    setIsEditing(true); setIsModalOpen(true);
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/sql/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAll();
    } catch (err) { console.error(err); }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...currentCourse,
      category: { id: parseInt(currentCourse.category.id) },
      author:   { id: parseInt(currentCourse.author.id)   },
    };
    try {
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/sql/courses/${currentCourse.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/sql/courses`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      setIsModalOpen(false); fetchAll();
    } catch (err) { console.error(err); }
  };

  let displayed = courses;
  if (filterCategory) displayed = displayed.filter(c => String(c.category?.id) === filterCategory);
  if (search)         displayed = displayed.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || (c.description || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>Courses</h2>
          <p className="text-sm text-[#94A3B8] mt-0.5">
            {isLoading ? 'Loading…' : `${courses.length} course${courses.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
        {isAdmin && (
          <button onClick={openCreateModal} id="add-course-btn"
            className="shine-on-hover flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold text-white transition-all btn-glow"
            style={{ background: GRAD }} aria-label="Add new course">
            <Plus size={16} /> Add Course
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input type="text" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-card border border-[#F1F5F9] dark:border-white/[0.06] rounded-2xl focus:outline-none focus:ring-2 focus:border-[#5B4BFF] transition-all shadow-sm"
            aria-label="Search courses" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="py-2.5 px-4 text-sm bg-white dark:bg-card border border-[#F1F5F9] dark:border-white/[0.06] rounded-2xl focus:outline-none focus:ring-2 focus:border-[#5B4BFF] transition-all shadow-sm text-[#0F172A] dark:text-foreground"
          aria-label="Filter by category">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
        </select>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#F1F5F9] dark:border-white/[0.06] bg-white dark:bg-card overflow-hidden">
              <div className="skeleton h-44 w-full" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-5 w-3/4 rounded" />
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-2/3 rounded" />
                <div className="flex gap-2 pt-2"><div className="skeleton h-6 w-20 rounded-full" /><div className="skeleton h-6 w-16 rounded-full" /></div>
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center" role="status">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(91,75,255,0.08)', border: '1px dashed rgba(91,75,255,0.2)' }}>
            <BookOpen size={32} style={{ color: PRIMARY, opacity: 0.5 }} />
          </div>
          <h3 className="font-semibold text-[#0F172A] dark:text-foreground mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {search || filterCategory ? 'No matching courses' : 'No courses yet'}
          </h3>
          <p className="text-sm text-[#94A3B8] max-w-xs">
            {search || filterCategory ? 'Try a different search or filter.' : 'Click "Add Course" to create the first course.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map(course => (
            <article key={course.id}
              className="group flex flex-col rounded-2xl border border-[#F1F5F9] dark:border-white/[0.06] bg-white dark:bg-card overflow-hidden"
              style={{
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(91,75,255,0.12), 0 4px 12px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)';
              }}
              aria-label={course.title}>

              {/* Thumbnail */}
              <div className="relative h-44 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(91,75,255,0.08), rgba(0,191,166,0.06))' }}>
                {course.thumbnailUrl
                  ? <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  : <div className="flex items-center justify-center h-full"><BookOpen size={40} style={{ color: `${PRIMARY}4D` }} /></div>
                }
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(to top, rgba(7,11,20,0.4) 0%, transparent 60%)' }} />
                {/* Category badge */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ background: 'rgba(7,11,20,0.6)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                  {course.category?.name || 'Uncategorized'}
                </span>
                {/* Price badge */}
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-md"
                  style={{ background: GRAD }}>
                  ${course.price?.toFixed(2) || '0.00'}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 p-5 space-y-2">
                <h3 className="font-bold text-[#0F172A] dark:text-foreground line-clamp-2 leading-snug group-hover:text-[#5B4BFF] dark:group-hover:text-[#8B7CFF] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>{course.title}</h3>
                <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">{course.description}</p>
                <div className="flex items-center gap-3 pt-1">
                  <span className="flex items-center gap-1 text-xs text-[#94A3B8]"><Clock size={11} />{course.duration}</span>
                  <span className="text-[#E5E7EB] dark:text-[#334155]">·</span>
                  <span className="text-xs text-[#94A3B8] truncate">
                    by <span className="font-semibold text-[#0F172A] dark:text-foreground">{course.author?.username || 'Unknown'}</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5 pt-0 flex flex-col gap-2 border-t border-[#F1F5F9] dark:border-white/[0.06] mt-2">
                <button onClick={() => openReviews(course)}
                  className="w-full flex items-center justify-center gap-2 h-9 rounded-xl text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'rgba(0,191,166,0.08)', color: TEAL, border: '1px solid rgba(0,191,166,0.2)' }}
                  aria-label={`View reviews for ${course.title}`}>
                  <MessageCircle size={13} /> Reviews
                </button>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(course)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-semibold text-[#64748B] bg-[#F8FAFC] dark:bg-white/[0.06] hover:bg-[#EEF2FF] dark:hover:bg-white/10 transition-all"
                      aria-label={`Edit ${course.title}`}>
                      <Edit2 size={12} /> Edit
                    </button>
                    <button onClick={() => handleDelete(course.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-all"
                      aria-label={`Delete ${course.title}`}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal */}
      {isAdmin && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl border-[#F1F5F9] dark:border-white/[0.08]">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "'Poppins', sans-serif" }}>{isEditing ? 'Edit Course' : 'Add New Course'}</DialogTitle>
              <DialogDescription>{isEditing ? 'Update the course details.' : 'Fill in the details to add a new course.'}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-title" className="text-sm font-semibold">Course Title</Label>
                <Input id="c-title" value={currentCourse.title}
                  onChange={e => setCurrentCourse({ ...currentCourse, title: e.target.value })}
                  required placeholder="e.g. Master React JS 2026" className="h-11 rounded-2xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="c-category" className="text-sm font-semibold">Category</Label>
                  <select id="c-category"
                    className="flex h-11 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-[#5B4BFF]"
                    value={currentCourse.category.id} onChange={e => setCurrentCourse({ ...currentCourse, category: { id: e.target.value } })} required>
                    <option value="" disabled>Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-author" className="text-sm font-semibold">Instructor</Label>
                  <select id="c-author"
                    className="flex h-11 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-[#5B4BFF]"
                    value={currentCourse.author.id} onChange={e => setCurrentCourse({ ...currentCourse, author: { id: e.target.value } })} required>
                    <option value="" disabled>Select instructor</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="c-price" className="text-sm font-semibold">Price ($)</Label>
                  <Input id="c-price" type="number" step="0.01" min="0" value={currentCourse.price}
                    onChange={e => setCurrentCourse({ ...currentCourse, price: parseFloat(e.target.value) || 0 })}
                    required className="h-11 rounded-2xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-duration" className="text-sm font-semibold">Duration</Label>
                  <Input id="c-duration" value={currentCourse.duration}
                    onChange={e => setCurrentCourse({ ...currentCourse, duration: e.target.value })}
                    required placeholder="e.g. 15 Hours" className="h-11 rounded-2xl" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-thumb" className="text-sm font-semibold">Thumbnail URL</Label>
                <Input id="c-thumb" value={currentCourse.thumbnailUrl}
                  onChange={e => setCurrentCourse({ ...currentCourse, thumbnailUrl: e.target.value })}
                  placeholder="https://…" className="h-11 rounded-2xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-desc" className="text-sm font-semibold">Description</Label>
                <textarea id="c-desc"
                  className="flex min-h-[90px] w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-[#5B4BFF] resize-none transition-all"
                  value={currentCourse.description}
                  onChange={e => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                  required placeholder="What will students learn?" />
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
                <button type="submit" className="flex-1 sm:flex-none h-10 px-6 rounded-xl text-sm font-semibold text-white shine-on-hover btn-glow"
                  style={{ background: GRAD }}>
                  {isEditing ? 'Save Changes' : 'Create Course'}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
      <ReviewsModal isOpen={isReviewsOpen} onClose={() => setIsReviewsOpen(false)} courseId={selectedCourseForReviews?.id} courseTitle={selectedCourseForReviews?.title} />
    </div>
  );
}

