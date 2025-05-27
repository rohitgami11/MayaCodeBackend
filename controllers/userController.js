const UserProfile = require('../models/User');

// Get user profile by phone
exports.getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    console.log('🔍 Get User - Request:', { phone });

    const user = await UserProfile.findOne({ phone });
    if (!user) {
      console.log('❌ Get User - User not found:', phone);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Get User - Success:', user);
    res.json(user);
  } catch (error) {
    console.error('❌ Get User - Error:', error);
    res.status(500).json({ message: 'Error getting user profile', error: error.message });
  }
};

// Create or update user profile
exports.createOrUpdateUser = async (req, res) => {
  try {
    console.log('⚙️ Create/Update User - Starting process');
    const { phone } = req.params;
    console.log('⚙️ Create/Update User - Phone:', phone);
    
    // Get values from request body
    const updates = {
      name: req.body.name,
      userType: req.body.userType,
      age: req.body.age,
      location: req.body.location,
      languages: req.body.languages || [],
      profileImage: req.body.profileImage,
      lastActive: new Date()
    };
    
    console.log('⚙️ Create/Update User - Request body:', req.body);
    console.log('⚙️ Create/Update User - Updates:', updates);
    
    // Validate required fields
    if (!updates.name || !updates.userType) {
      console.log('❌ Create/Update User - Missing required fields:', {
        hasName: !!updates.name,
        hasUserType: !!updates.userType,
        body: req.body
      });
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['name', 'userType']
      });
    }

    // Clean up updates
    console.log('⚙️ Create/Update User - Cleaning updates');
    const cleanedUpdates = {
      phone, // Add phone to the updates
      name: updates.name,
      age: updates.age,
      location: updates.location,
      userType: updates.userType,
      languages: updates.languages,
      profileImage: updates.profileImage,
      lastActive: new Date()
    };

    // Remove undefined values
    Object.keys(cleanedUpdates).forEach(key => 
      cleanedUpdates[key] === undefined && delete cleanedUpdates[key]
    );
    console.log('⚙️ Create/Update User - Final updates:', cleanedUpdates);

    console.log('⚙️ Create/Update User - Attempting database operation');
    const user = await UserProfile.findOneAndUpdate(
      { phone },
      { $set: cleanedUpdates },
      { 
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    console.log('✅ Create/Update User - Success:', user);
    res.json(user);
  } catch (error) {
    console.error('❌ Create/Update User - Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Error creating/updating user profile', 
      error: error.message 
    });
  }
};

// Delete user profile
exports.deleteUser = async (req, res) => {
  try {
    const { phone } = req.params;
    console.log('🗑️ Delete User - Request:', { phone });

    const user = await UserProfile.findOneAndDelete({ phone });
    if (!user) {
      console.log('❌ Delete User - User not found:', phone);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Delete User - Success:', user);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Delete User - Error:', error);
    res.status(500).json({ message: 'Error deleting user profile', error: error.message });
  }
};

// Update user stats
exports.updateUserStats = async (req, res) => {
  try {
    const { phone } = req.params;
    const { stats } = req.body;
    console.log('📊 Update Stats - Request:', { phone, stats });

    const user = await UserProfile.findOneAndUpdate(
      { phone },
      { $set: { stats } },
      { new: true, runValidators: true }
    );

    if (!user) {
      console.log('❌ Update Stats - User not found:', phone);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Update Stats - Success:', user);
    res.json(user);
  } catch (error) {
    console.error('❌ Update Stats - Error:', error);
    res.status(500).json({ message: 'Error updating user stats', error: error.message });
  }
};

// Add created post
exports.addCreatedPost = async (req, res) => {
  try {
    const { phone } = req.params;
    const { postId, postType } = req.body;
    console.log('📝 Add Post - Request:', { phone, postId, postType });

    if (!postId || !postType) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['postId', 'postType']
      });
    }

    const updateField = {
      'Offer Help': 'createdHelpPosts',
      'Ask for Help': 'createdAskPosts',
      'Story': 'createdStories'
    }[postType];

    if (!updateField) {
      return res.status(400).json({ 
        message: 'Invalid post type',
        validTypes: ['Offer Help', 'Ask for Help', 'Story']
      });
    }

    const user = await UserProfile.findOneAndUpdate(
      { phone },
      { 
        $addToSet: { [updateField]: postId },
        $inc: { [`stats.${updateField.replace('created', '').toLowerCase()}Count`]: 1 }
      },
      { new: true }
    );

    if (!user) {
      console.log('❌ Add Post - User not found:', phone);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Add Post - Success:', user);
    res.json(user);
  } catch (error) {
    console.error('❌ Add Post - Error:', error);
    res.status(500).json({ message: 'Error adding created post', error: error.message });
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