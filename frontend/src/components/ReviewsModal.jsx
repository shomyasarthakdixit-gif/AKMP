import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Trash2 } from 'lucide-react';

export default function ReviewsModal({ isOpen, onClose, courseId, courseTitle }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  // Usually userId would be in token or localstorage, but we might not have it. Let's use username as unique ID for simplicity if we don't have userId.
  const userId = localStorage.getItem('userId') || username; 
  const isAdmin = role === 'ROLE_ADMIN';

  useEffect(() => {
    if (isOpen && courseId) {
      fetchReviews();
      setNewReview({ rating: 5, comment: '' });
      setError('');
    }
  }, [isOpen, courseId]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/nosql/reviews/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:8000/api/v1/nosql/reviews', {
        courseId,
        userId,
        username,
        rating: newReview.rating,
        comment: newReview.comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/nosql/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Reviews for {courseTitle}</DialogTitle>
          <DialogDescription>Read what others think or leave your own review.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
          {reviews.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm italic">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="bg-muted/50 p-3 rounded-lg border border-border/50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{review.username}</p>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  {isAdmin && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(review._id)}>
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-foreground/90">{review.comment}</p>
                <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4 mt-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex items-center gap-4">
              <Label htmlFor="rating" className="shrink-0">Your Rating</Label>
              <select 
                id="rating"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={newReview.rating}
                onChange={e => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                required
              >
                {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="comment">Comment</Label>
              <textarea 
                id="comment"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                placeholder="Share your experience..."
                value={newReview.comment}
                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">Submit Review</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
