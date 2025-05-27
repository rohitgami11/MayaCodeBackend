const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
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
  bio: String,
  
  // Content tracking
  createdStories: [String],
  createdHelpPosts: [String],
  createdAskPosts: [String],
  
  // Interaction tracking
  likedPosts: [String],
  savedPosts: [String],
  following: [String],
  followers: [String],
  
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
  },

  // Additional profile fields
  interests: [String],
  skills: [String],
  availability: {
    isAvailable: {
      type: Boolean,
      default: false
    },
    schedule: {
      days: [String],
      timeSlots: [String]
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  badges: [String],
  lastActive: Date,
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    emailUpdates: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserProfile', userProfileSchema); 