const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Offer Help', 'Ask for Help', 'Story'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  location: String,
  tags: [String],
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  expiresAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema); 