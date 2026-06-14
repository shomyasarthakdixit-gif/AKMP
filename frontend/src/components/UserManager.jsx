import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Edit2, Trash2, Mail, Shield } from 'lucide-react';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: '', email: '', password: '' });
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user) => {
    setCurrentUser({ id: user.id, username: user.username, email: user.email, password: user.password || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/v1/auth/users/${currentUser.id}`, currentUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage user accounts and access levels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-lg border border-border">
            No users found.
          </div>
        ) : (
          users.map(u => (
            <Card key={u.id} className="flex flex-col h-full hover:shadow-md transition-shadow group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase">
                    {u.username.charAt(0)}
                  </div>
                  <span className="truncate">{u.username}</span>
                </CardTitle>
                <div className="flex flex-col gap-1.5 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={14} />
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                      {u.role?.replace('ROLE_', '')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              {userRole === 'ROLE_ADMIN' && (
                <>
                  <div className="flex-1" />
                  <CardFooter className="pt-3 border-t border-border flex justify-between gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-muted-foreground hover:text-foreground" onClick={() => openEditModal(u)}>
                      <Edit2 size={14} className="mr-2" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={() => handleDelete(u.id)}>
                      <Trash2 size={14} className="mr-2" /> Delete
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user's account details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                value={currentUser.username} 
                onChange={e => setCurrentUser({ ...currentUser, username: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={currentUser.email} 
                onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="text"
                value={currentUser.password} 
                onChange={e => setCurrentUser({ ...currentUser, password: e.target.value })} 
                required 
                placeholder="Enter new password"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
