const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  foodType: { type: String, required: true },
  quantity: { type: String, required: true },
  timeCooked: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  address: { type: String },
  image: { type: String, required: true }, // Base64 image
  status: { 
    type: String, 
    enum: ['Pending', 'Donated', 'Claimed'], 
    default: 'Pending' 
  },
  claimerName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
