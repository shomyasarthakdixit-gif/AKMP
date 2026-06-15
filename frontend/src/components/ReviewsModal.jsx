import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Star, Trash2, MessageCircle, Send, AlertCircle } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #6366F1 0%, #60A5FA 100%)';
const INDIGO = '#6366F1';

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="group" aria-label="Rating">
      {[1,2,3,4,5].map(star => (
        <button key={star} type="button" onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}>
          <Star size={22}
            fill={(hovered || value) >= star ? '#F59E0B' : 'none'}
            stroke={(hovered || value) >= star ? '#F59E0B' : '#CBD5E1'}
            className="transition-all duration-100" />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsModal({ isOpen, onClose, courseId, courseTitle }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const token    = sessionStorage.getItem('token');
  const role     = sessionStorage.getItem('role');
  const username = sessionStorage.getItem('username');
  const userId   = sessionStorage.getItem('userId') || username;
  const isAdmin  = role === 'ROLE_ADMIN';

  useEffect(() => {
    if (isOpen && courseId) { fetchReviews(); setNewReview({ rating: 5, comment: '' }); setError(''); }
  }, [isOpen, courseId]);

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/nosql/reviews/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
      setReviews(res.data);
    } catch (err) { console.error('Failed to fetch reviews:', err); }
    finally { setIsLoadingReviews(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/nosql/reviews`, { courseId, userId, username, rating: newReview.rating, comment: newReview.comment }, { headers: { Authorization: `Bearer ${token}` } });
      setNewReview({ rating: 5, comment: '' }); fetchReviews();
    } catch (err) { setError(err.response?.data?.error || 'Failed to submit review. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/nosql/reviews/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchReviews();
    } catch (err) { console.error('Failed to delete review:', err); }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] flex flex-col rounded-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#E5E7EB] dark:border-[#334155]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(79,70,229,0.1)' }}>
              <MessageCircle size={18} style={{ color: INDIGO }} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-[#111827] dark:text-foreground leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>Reviews</DialogTitle>
              <DialogDescription className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">{courseTitle}</DialogDescription>
            </div>
            {avgRating && (
              <div className="ml-auto shrink-0 text-right">
                <p className="text-2xl font-bold text-[#111827] dark:text-foreground mono leading-none">{avgRating}</p>
                <div className="flex justify-end mt-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= Math.round(avgRating) ? '#F59E0B' : 'none'} stroke={s <= Math.round(avgRating) ? '#F59E0B' : '#CBD5E1'} />)}
                </div>
                <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] mt-0.5">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {isLoadingReviews ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[#E5E7EB] dark:border-[#334155] p-4 space-y-3">
                <div className="flex justify-between"><div className="space-y-2"><div className="skeleton h-4 w-20 rounded" /><div className="skeleton h-3 w-24 rounded" /></div><div className="skeleton h-7 w-7 rounded-lg" /></div>
                <div className="skeleton h-3 w-full rounded" /><div className="skeleton h-3 w-2/3 rounded" />
              </div>
            ))
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center" role="status">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(245,158,11,0.08)' }}>
                <Star size={24} className="text-amber-400/60" />
              </div>
              <p className="font-semibold text-sm text-[#111827] dark:text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>No reviews yet</p>
              <p className="text-xs text-[#6B7280] mt-1">Be the first to share your experience!</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="rounded-xl border border-[#E5E7EB] dark:border-[#334155] bg-[#FAFAFB] dark:bg-[#1E293B]/50 p-4 space-y-2 hover:border-[#CBD5E1] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: GRAD }}>
                      {review.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111827] dark:text-foreground leading-tight">{review.username}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= review.rating ? '#F59E0B' : 'none'} stroke={s <= review.rating ? '#F59E0B' : '#CBD5E1'} />)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] mono">{new Date(review.createdAt).toLocaleDateString()}</span>
                    {isAdmin && (
                      <button onClick={() => handleDelete(review._id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Delete review"><Trash2 size={13} /></button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[#475569] dark:text-muted-foreground leading-relaxed">{review.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Submit form */}
        <div className="px-6 pb-6 pt-4 border-t border-[#E5E7EB] dark:border-[#334155]">
          <p className="text-xs font-semibold text-[#111827] dark:text-foreground mb-3">Leave a Review</p>
          {error && (
            <div className="mb-3 p-3 rounded-xl flex items-center gap-2 text-xs font-medium"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626' }}
              role="alert">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Your Rating</Label>
              <StarRating value={newReview.rating} onChange={rating => setNewReview({ ...newReview, rating })} />
            </div>
            <textarea
              className="w-full min-h-[72px] rounded-xl border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3 py-2 text-sm text-[#111827] dark:text-foreground placeholder:text-[#6B7280] dark:text-[#94A3B8] focus:outline-none focus:ring-2 focus:border-indigo-500 resize-none transition-all"
              placeholder="Share your experience with this course�"
              value={newReview.comment} onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
              required aria-label="Review comment" />
            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ background: GRAD }}>
              {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={14} /> Submit Review</>}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}



