const UserProfile = require('../models/User');

// Get user profile by phone number
exports.getUserProfile = async (req, res) => {
  try {
    const { phone } = req.params;
    console.log('🔍 Get Profile - Request:', {
      phone,
      params: req.params,
      query: req.query,
      body: req.body
    });
    
    const profile = await UserProfile.findOne({ phone });
    console.log('🔍 Get Profile - Database Result:', profile);
    
    if (!profile) {
      console.log('❌ Get Profile - Profile not found for phone:', phone);
      return res.status(404).json({ message: 'User profile not found' });
    }
    console.log('✅ Get Profile - Success:', profile);
    res.json(profile);
  } catch (error) {
    console.error('❌ Get Profile - Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new user profile
exports.createUserProfile = async (req, res) => {
  try {
    console.log('📝 Create Profile - Full Request Object:', {
      params: req.params,
      body: req.body,
      headers: req.headers,
      query: req.query,
      method: req.method,
      url: req.url,
      originalUrl: req.originalUrl
    });

    const { phone, userId, ...userData } = req.body;
    console.log('📝 Create Profile - Extracted Data:', {
      phone,
      userId,
      userData,
      body: req.body
    });

    // Check if user already exists
    const existingUser = await UserProfile.findOne({ phone });
    console.log('📝 Create Profile - Existing User Check:', existingUser);

    if (existingUser) {
      console.log('❌ Create Profile - User already exists:', phone);
      return res.status(400).json({ message: 'User profile already exists' });
    }

    // Create new user profile
    const newProfile = new UserProfile({
      phone,
      userId,
      ...userData,
      lastActive: new Date()
    });

    console.log('📝 Create Profile - New Profile Object:', {
      newProfile: newProfile.toObject(),
      validationState: newProfile.validateSync()
    });

    const savedProfile = await newProfile.save();
    console.log('✅ Create Profile - Success:', {
      id: savedProfile._id,
      phone: savedProfile.phone,
      userId: savedProfile.userId,
      name: savedProfile.name
    });
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('❌ Create Profile - Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      errors: error.errors
    });
    res.status(400).json({ 
      message: error.message,
      details: error.errors || {}
    });
  }
};

// Update user profile (only if exists)
exports.updateUserProfile = async (req, res) => {
  try {
    const { phone } = req.params;
    const { userId, ...updates } = req.body;
    console.log('🔄 Update Profile - Request Details:', {
      phone,
      userId,
      updates,
      params: req.params,
      body: req.body,
      headers: req.headers
    });

    // First check if user exists
    const existingUser = await UserProfile.findOne({ phone });
    console.log('🔄 Update Profile - Existing User Check:', {
      found: !!existingUser,
      userId: existingUser?.userId,
      phone: existingUser?.phone
    });

    if (!existingUser) {
      console.log('❌ Update Profile - User not found:', phone);
      return res.status(404).json({ 
        message: 'User profile not found. Please create a profile first.',
        details: { phone }
      });
    }

    // Update the profile
    console.log('🔄 Update Profile - Attempting Update:', {
      filter: { phone },
      updates: { 
        ...updates,
        lastActive: new Date()
      }
    });

    const profile = await UserProfile.findOneAndUpdate(
      { phone },
      { 
        ...updates,
        lastActive: new Date()
      },
      { 
        new: true,
        runValidators: true
      }
    );

    console.log('✅ Update Profile - Success:', {
      userId: profile.userId,
      phone: profile.phone,
      updatedFields: Object.keys(updates)
    });

    res.json(profile);
  } catch (error) {
    console.error('❌ Update Profile - Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(400).json({ 
      message: error.message,
      details: error.errors || {}
    });
  }
};

// Delete user profile
exports.deleteUserProfile = async (req, res) => {
  try {
    const { phone } = req.params;
    console.log('🗑️ Delete Profile - Request:', {
      phone,
      params: req.params
    });

    const profile = await UserProfile.findOneAndDelete({ phone });
    console.log('🗑️ Delete Profile - Result:', profile);

    if (!profile) {
      console.log('❌ Delete Profile - Profile not found:', phone);
      return res.status(404).json({ message: 'User profile not found' });
    }
    console.log('✅ Delete Profile - Success');
    res.json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error('❌ Delete Profile - Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user stats
exports.updateUserStats = async (req, res) => {
  try {
    const { phone } = req.params;
    const { stats } = req.body;
    console.log('📊 Update Stats - Request:', {
      phone,
      stats,
      params: req.params,
      body: req.body
    });

    // First check if user exists
    const existingUser = await UserProfile.findOne({ phone });
    console.log('📊 Update Stats - Existing User Check:', existingUser);

    if (!existingUser) {
      console.log('❌ Update Stats - User not found:', phone);
      return res.status(404).json({ message: 'User profile not found. Please create a profile first.' });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { phone },
      { $set: { stats } },
      { new: true, runValidators: true }
    );
    console.log('✅ Update Stats - Success:', profile);

    res.json(profile);
  } catch (error) {
    console.error('❌ Update Stats - Error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Add post to user's created posts
exports.addCreatedPost = async (req, res) => {
  try {
    const { phone } = req.params;
    const { postId, postType } = req.body;
    console.log('📝 Add Post - Request:', {
      phone,
      postId,
      postType,
      params: req.params,
      body: req.body
    });

    // First check if user exists
    const existingUser = await UserProfile.findOne({ phone });
    console.log('📝 Add Post - Existing User Check:', existingUser);

    if (!existingUser) {
      console.log('❌ Add Post - User not found:', phone);
      return res.status(404).json({ message: 'User profile not found. Please create a profile first.' });
    }

    const updateField = {
      'Offer Help': 'createdHelpPosts',
      'Ask for Help': 'createdAskPosts',
      'Story': 'createdStories'
    }[postType];

    if (!updateField) {
      console.log('❌ Add Post - Invalid post type:', postType);
      return res.status(400).json({ message: 'Invalid post type' });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { phone },
      { $push: { [updateField]: postId } },
      { new: true }
    );
    console.log('✅ Add Post - Success:', profile);

    res.json(profile);
  } catch (error) {
    console.error('❌ Add Post - Error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get user preferences
exports.getPreferences = async (req, res) => {
  try {
    const { phone } = req.params;
    console.log('🔍 Get Preferences - Request:', {
      phone,
      params: req.params
    });

    const user = await UserProfile.findOne({ phone });
    console.log('🔍 Get Preferences - User Check:', user);

    if (!user) {
      console.log('❌ Get Preferences - User not found:', phone);
      return res.status(404).json({ message: 'User profile not found' });
    }

    console.log('✅ Get Preferences - Success:', user.preferences);
    res.json(user.preferences);
  } catch (error) {
    console.error('❌ Get Preferences - Error:', error);
    res.status(500).json({ message: 'Error getting preferences', error: error.message });
  }
};

// Update user preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { phone } = req.params;
    const { preferences } = req.body;
    console.log('⚙️ Update Preferences - Request:', {
      phone,
      preferences,
      params: req.params,
      body: req.body
    });

    // First check if user exists
    const existingUser = await UserProfile.findOne({ phone });
    console.log('⚙️ Update Preferences - Existing User Check:', existingUser);

    if (!existingUser) {
      console.log('❌ Update Preferences - User not found:', phone);
      return res.status(404).json({ message: 'User profile not found. Please create a profile first.' });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { phone },
      { $set: { preferences } },
      { new: true, runValidators: true }
    );
    console.log('✅ Update Preferences - Success:', profile);

    res.json(profile);
  } catch (error) {
    console.error('❌ Update Preferences - Error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    console.log('👥 Get All Users - Request received');
    
    const users = await UserProfile.find({})
      .select('-__v') // Exclude version key
      .sort({ createdAt: -1 }); // Sort by creation date, newest first
    
    console.log('✅ Get All Users - Success:', { count: users.length });
    res.json(users);
  } catch (error) {
    console.error('❌ Get All Users - Error:', error);
    res.status(500).json({ message: error.message });
  }
}; 