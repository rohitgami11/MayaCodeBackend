const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

const postSchema = new mongoose.Schema({
  userId: {
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
  likes: {
    type: Number,
    default: 0
  },
  comments: [commentSchema],
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