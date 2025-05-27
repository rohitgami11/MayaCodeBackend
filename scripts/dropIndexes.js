const mongoose = require('mongoose');
require('dotenv').config();

async function dropIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`Checking indexes for collection: ${collectionName}`);
      
      const indexes = await db.collection(collectionName).indexes();
      console.log('Current indexes:', indexes);
      
      // Drop userId index if it exists
      if (indexes.some(index => index.name === 'userId_1')) {
        console.log(`Dropping userId index from ${collectionName}`);
        await db.collection(collectionName).dropIndex('userId_1');
        console.log('Index dropped successfully');
      }
    }

    console.log('Index cleanup completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

dropIndexes(); 