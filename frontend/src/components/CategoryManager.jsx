import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCat, setCurrentCat] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem('token');

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/sql/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setCurrentCat({ name: '', description: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setCurrentCat({ ...cat });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/sql/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/api/v1/sql/categories/${currentCat.id}`, currentCat, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:8000/api/v1/sql/categories', currentCat, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Manage the knowledge categories in the portal.</p>
        </div>
        <Button onClick={openCreateModal} className="w-full sm:w-auto flex items-center gap-2">
          <Plus size={16} /> New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-lg border border-border">
            No categories found. Click "New Category" to create one.
          </div>
        ) : (
          categories.map(cat => (
            <Card key={cat.id} className="flex flex-col h-full hover:shadow-md transition-shadow group">
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1">{cat.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                  {cat.description}
                </CardDescription>
              </CardHeader>
              <div className="flex-1" />
              <CardFooter className="pt-3 border-t border-border flex justify-between gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-muted-foreground hover:text-foreground" onClick={() => openEditModal(cat)}>
                  <Edit2 size={14} className="mr-2" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={() => handleDelete(cat.id)}>
                  <Trash2 size={14} className="mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Category' : 'Create Category'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the details of the category.' : 'Add a new category to organize knowledge.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                value={currentCat.name} 
                onChange={e => setCurrentCat({ ...currentCat, name: e.target.value })} 
                required 
                placeholder="e.g. Engineering"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                value={currentCat.description} 
                onChange={e => setCurrentCat({ ...currentCat, description: e.target.value })} 
                required
                placeholder="Describe what belongs in this category..."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Create Category'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
