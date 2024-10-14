import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all messages for a user
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }]
    }).populate('sender', 'name').populate('recipient', 'name').sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get chat history with a specific user
router.get('/chat/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    }).populate('sender', 'name').populate('recipient', 'name').sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a new message
router.post('/', auth, async (req, res) => {
  const message = new Message({
    sender: req.user._id,
    recipient: req.body.recipient,
    content: req.body.content
  });

  try {
    const newMessage = await message.save();
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name')
      .populate('recipient', 'name');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(req.body.recipient).emit('newMessage', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users for chat list
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }, 'name');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;