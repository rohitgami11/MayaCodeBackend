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
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 