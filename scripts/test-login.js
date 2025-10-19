import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Available collections:');
    collections.forEach(c => console.log('   -', c.name));
    
    // Try to find user in 'users' collection
    const usersCollection = mongoose.connection.db.collection('users');
    const allUsers = await usersCollection.find({}).toArray();
    
    console.log('\n👥 Users in database:', allUsers.length);
    allUsers.forEach(user => {
      console.log('   - Username:', user.username, '| Role:', user.role);
    });
    
    const admin = await usersCollection.findOne({ username: 'nexusadmin' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      await mongoose.disconnect();
      process.exit(1);
    }
    
    console.log('📋 Admin User Details:');
    console.log('   Username:', admin.username);
    console.log('   Role:', admin.role);
    console.log('   Password hash (first 30 chars):', admin.password.substring(0, 30) + '...');
    console.log('   Hash length:', admin.password.length);
    
    // Test password comparison
    const testPassword = 'NexusAdmin4321!';
    console.log('\n🔐 Testing password:', testPassword);
    
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log('   Result:', isMatch ? '✅ MATCH' : '❌ NO MATCH');
    
    if (!isMatch) {
      console.log('\n💡 Trying to hash the test password and compare:');
      const testHash = await bcrypt.hash(testPassword, 10);
      console.log('   Test hash:', testHash.substring(0, 30) + '...');
      console.log('   Stored hash:', admin.password.substring(0, 30) + '...');
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testLogin();
