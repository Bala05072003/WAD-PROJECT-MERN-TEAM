// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const User = require('./models/user');

const app = express();  
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Simple user fetch route for dashboard
// GET /api/users/:id
app.get('/api/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stepunity';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error', err);
});
