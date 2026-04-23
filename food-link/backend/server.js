require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Donation = require('./models/Donation');

const app = express();
app.use(cors());
// Increase limit for base64 image uploads
app.use(express.json({ limit: '10mb' }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food-link';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes

// Get all donations
app.get('/api/donations', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

// Create a new donation
app.post('/api/donations', async (req, res) => {
  try {
    const newDonation = new Donation(req.body);
    const savedDonation = await newDonation.save();
    res.status(201).json(savedDonation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create donation' });
  }
});

// Update donation status
app.put('/api/donations/:id/status', async (req, res) => {
  try {
    const { status, claimerName } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    donation.status = status;
    if (claimerName) donation.claimerName = claimerName;
    
    await donation.save();
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update donation status' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
