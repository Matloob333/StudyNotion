const mongoose = require('mongoose');
require('dotenv').config();

async function testMongoDBConnection() {
  console.log('🧪 Testing MongoDB Connection...');
  
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    console.log('💡 Please set MONGODB_URI in your environment variables');
    process.exit(1);
  }
  
  console.log('📡 MongoDB URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('✅ MongoDB Connection Successful!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Connection State:', mongoose.connection.readyState);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('CodeName:', error.codeName);
    
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check if your MongoDB Atlas cluster is running');
    console.log('2. Verify your username and password');
    console.log('3. Make sure your IP is whitelisted in MongoDB Atlas');
    console.log('4. Check if your database user has the correct permissions');
    console.log('5. Ensure your connection string is properly formatted');
    
    process.exit(1);
  }
}

testMongoDBConnection(); 