import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Filter, Clock, Tag, MessageCircle } from 'lucide-react';
import ReviewsModal from './ReviewsModal';

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({ 
    title: '', description: '', price: 0, duration: '', thumbnailUrl: '', category: { id: '' }, author: { id: '' } 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [selectedCourseForReviews, setSelectedCourseForReviews] = useState(null);

  const openReviews = (course) => {
    setSelectedCourseForReviews(course);
    setIsReviewsOpen(true);
  };
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isAdmin = role === 'ROLE_ADMIN';

  const fetchData = async () => {
    try {
      const [courseRes, catRes, userRes] = await Promise.all([
        axios.get('http://localhost:8000/api/v1/sql/courses', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8000/api/v1/sql/categories', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8000/api/v1/auth/users', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setCourses(courseRes.data);
      setCategories(catRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setCurrentCourse({ 
      title: '', description: '', price: 0, duration: '', thumbnailUrl: '', 
      category: { id: categories[0]?.id || '' }, 
      author: { id: users[0]?.id || '' } 
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setCurrentCourse({ 
      id: course.id,
      title: course.title, 
      description: course.description, 
      price: course.price,
      duration: course.duration,
      thumbnailUrl: course.thumbnailUrl,
      category: { id: course.category?.id || '' }, 
      author: { id: course.author?.id || '' } 
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/sql/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/api/v1/sql/courses/${currentCourse.id}`, currentCourse, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:8000/api/v1/sql/courses', currentCourse, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCourses = filterCategory ? courses.filter(c => c.category?.id == filterCategory) : courses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">Browse and manage learning courses.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <select 
              className="flex h-10 w-full sm:w-48 pl-9 pr-3 rounded-md border border-input bg-background py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {isAdmin && (
            <Button onClick={openCreateModal} className="flex items-center gap-2 w-full sm:w-auto">
              <Plus size={16} /> New Course
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-lg border border-border">
            No courses found matching the criteria.
          </div>
        ) : (
          filteredCourses.map(course => (
            <Card key={course.id} className="flex flex-col group hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 transition-all duration-300 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              <div className="h-40 w-full overflow-hidden bg-muted relative">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-muted-foreground">No Image</div>
                )}
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-bold text-primary shadow-sm border border-border/50">
                  ${course.price?.toFixed(2) || '0.00'}
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                    <Tag size={12} /> {course.category?.name || 'Uncategorized'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={12} /> {course.duration || 'N/A'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-3">
                <p className="text-sm text-foreground/80 line-clamp-2">
                  {course.description}
                </p>
                <div className="mt-3 text-xs text-muted-foreground">
                  Instructor: <span className="font-medium text-foreground/90">{course.author?.username || 'Unknown'}</span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-3 border-t border-border flex flex-col gap-2 bg-muted/20">
                <Button variant="outline" size="sm" className="w-full text-primary hover:bg-primary/10" onClick={() => openReviews(course)}>
                  <MessageCircle size={14} className="mr-2" /> Reviews
                </Button>
                {isAdmin && (
                  <div className="flex w-full justify-between gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-muted-foreground hover:text-foreground" onClick={() => openEditModal(course)}>
                      <Edit2 size={14} className="mr-2" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={() => handleDelete(course.id)}>
                      <Trash2 size={14} className="mr-2" /> Delete
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {isAdmin && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Course' : 'Create Course'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update the details of the course.' : 'Add a new course to the platform.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input 
                  id="title"
                  value={currentCourse.title} 
                  onChange={e => setCurrentCourse({ ...currentCourse, title: e.target.value })} 
                  required 
                  placeholder="e.g. Master React JS 2026"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select 
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={currentCourse.category.id} 
                    onChange={e => setCurrentCourse({ ...currentCourse, category: { id: e.target.value } })} 
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Instructor</Label>
                  <select 
                    id="author"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={currentCourse.author.id} 
                    onChange={e => setCurrentCourse({ ...currentCourse, author: { id: e.target.value } })} 
                    required
                  >
                    <option value="" disabled>Select Instructor</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentCourse.price} 
                    onChange={e => setCurrentCourse({ ...currentCourse, price: parseFloat(e.target.value) || 0 })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input 
                    id="duration"
                    value={currentCourse.duration} 
                    onChange={e => setCurrentCourse({ ...currentCourse, duration: e.target.value })} 
                    required 
                    placeholder="e.g. 15 Hours"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input 
                  id="thumbnailUrl"
                  value={currentCourse.thumbnailUrl} 
                  onChange={e => setCurrentCourse({ ...currentCourse, thumbnailUrl: e.target.value })} 
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>
                <textarea 
                  id="description"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  value={currentCourse.description} 
                  onChange={e => setCurrentCourse({ ...currentCourse, description: e.target.value })} 
                  required
                  placeholder="What will students learn?"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">{isEditing ? 'Save Changes' : 'Create Course'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <ReviewsModal 
        isOpen={isReviewsOpen} 
        onClose={() => setIsReviewsOpen(false)} 
        courseId={selectedCourseForReviews?.id} 
        courseTitle={selectedCourseForReviews?.title} 
      />
    </div>
  );
}
