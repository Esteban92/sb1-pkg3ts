import express from 'express';
import Review from '../models/Review.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a new review
router.post('/', auth, async (req, res) => {
  try {
    const { reviewed, rating, comment } = req.body;
    const review = new Review({
      reviewer: req.user._id,
      reviewed,
      rating,
      comment
    });
    await review.save();

    // Update user's average rating
    const reviews = await Review.find({ reviewed });
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(reviewed, { $set: { rating: avgRating } });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get reviews for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewed: req.params.userId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;