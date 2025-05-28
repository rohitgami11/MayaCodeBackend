const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('📝 Connection Details:', {
      uri: process.env.MONGODB_URI ? 'Connection string exists' : 'No connection string found',
      cluster: process.env.MONGODB_URI?.includes('Cluster0') ? 'Cluster0' : 'Unknown cluster'
    });
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connection Details:', {
      host: conn.connection.host,
      name: conn.connection.name,
      port: conn.connection.port,
      user: conn.connection.user,
      cluster: process.env.MONGODB_URI?.includes('Cluster0') ? 'Cluster0' : 'Unknown cluster'
    });

    // Handle indexes after connection
    const db = mongoose.connection.db;
    try {
      const collection = db.collection('userprofiles');
      const indexes = await collection.indexes();
      console.log('📊 Current indexes:', indexes);

      // Drop userId index if it exists
      if (indexes.some(index => index.name === 'userId_1')) {
        console.log('🗑️ Dropping userId_1 index...');
        await collection.dropIndex('userId_1');
        console.log('✅ userId_1 index dropped successfully');
      }

      // Create phone index if it doesn't exist
      if (!indexes.some(index => index.name === 'phone_1')) {
        console.log('📱 Creating phone_1 index...');
        await collection.createIndex({ phone: 1 }, { unique: true });
        console.log('✅ phone_1 index created successfully');
      }
    } catch (indexError) {
      console.error('❌ Index operation error:', indexError);
    }

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 