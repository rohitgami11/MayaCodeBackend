const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  location: {
    type: String
  },
  userType: {
    type: String,
    enum: ['Refugee', 'Helper', 'Other'],
    required: true
  },
  languages: [{
    type: String
  }],
  profileImage: {
    type: String
  },
  createdStories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  createdHelpPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  createdAskPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  stats: {
    storiesCount: { type: Number, default: 0 },
    helpPostsCount: { type: Number, default: 0 },
    askPostsCount: { type: Number, default: 0 },
    completedHelps: { type: Number, default: 0 },
    receivedHelps: { type: Number, default: 0 }
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Drop the userId index if it exists
userProfileSchema.index({ userId: 1 }, { unique: true, sparse: true });
userProfileSchema.index({ phone: 1 }, { unique: true });

module.exports = mongoose.model('UserProfile', userProfileSchema); 