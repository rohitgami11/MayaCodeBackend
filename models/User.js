const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
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
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
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

module.exports = mongoose.model('UserProfile', userProfileSchema); 