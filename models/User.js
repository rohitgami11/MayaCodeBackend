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
  age: Number,
  location: String,
  userType: {
    type: String,
    enum: ['Refugee', 'Helper', 'Other'],
    required: true
  },
  languages: [String],
  profileImage: String,
  
  // Content tracking
  createdStories: [String],
  createdHelpPosts: [String],
  createdAskPosts: [String],
  
  // Activity statistics
  stats: {
    storiesCount: {
      type: Number,
      default: 0
    },
    helpPostsCount: {
      type: Number,
      default: 0
    },
    askPostsCount: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    },
    totalComments: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    },
    completedHelps: {
      type: Number,
      default: 0
    },
    receivedHelps: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

module.exports = mongoose.model('UserProfile', userProfileSchema); 