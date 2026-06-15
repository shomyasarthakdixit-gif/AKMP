const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/akmp';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB (Atlas/Local)'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Review Schema
const reviewSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// CRUD Routes for Reviews

// 1. Get all reviews for a specific course
app.get('/api/reviews/:courseId', async (req, res) => {
  try {
    const reviews = await Review.find({ courseId: req.params.courseId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// 2. Get total number of reviews across all courses (for Dashboard)
app.get('/api/reviews/stats/total', async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    res.json({ totalReviews });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch total reviews count' });
  }
});

// 3. Add a new review
app.post('/api/reviews', async (req, res) => {
  try {
    const { courseId, userId, username, rating, comment } = req.body;
    
    // Check if user already reviewed this course
    const existingReview = await Review.findOne({ courseId, userId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this course.' });
    }

    const newReview = new Review({ courseId, userId, username, rating, comment });
    await newReview.save();
    
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// 4. Update a review (Optional/Bonus)
app.put('/api/reviews/:id', async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id, 
      { rating: req.body.rating, comment: req.body.comment }, 
      { new: true }
    );
    if (!updatedReview) return res.status(404).json({ error: 'Review not found' });
    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// 5. Delete a review
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Node.js/MongoDB Backend running on http://localhost:${PORT}`);
});
