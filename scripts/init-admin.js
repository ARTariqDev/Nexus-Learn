/**
 * Script to initialize the admin user
 * Run with: node scripts/init-admin.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

// User Schema (duplicated here to avoid import issues)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function initializeAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI?.substring(0, 30) + '...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'nexuslearn', // Use the same database name as the app
      maxPoolSize: 10
    });
    console.log('✅ Connected to MongoDB (database: nexuslearn)');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: 'nexusadmin' });
    
    if (existingAdmin) {
      console.log('\nℹ️  Admin user already exists');
      console.log('   Username:', existingAdmin.username);
      console.log('   Role:', existingAdmin.role);
      console.log('   Active:', existingAdmin.isActive);
      console.log('   Created:', existingAdmin.createdAt);
      
      // Update if needed
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated user role to admin');
      }
      
      if (!existingAdmin.isActive) {
        existingAdmin.isActive = true;
        await existingAdmin.save();
        console.log('✅ Activated admin user');
      }
    } else {
      // Create new admin user
      console.log('\n📝 Creating admin user...');
      const adminUser = new User({
        username: 'nexusadmin',
        password: 'NexusAdmin4321!',
        role: 'admin',
        isActive: true
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('\n🔐 Admin Credentials:');
      console.log('   Username: NexusAdmin');
      console.log('   Password: NexusAdmin4321!');
      console.log('   Role: admin');
    }
    
    console.log('\n🎉 Admin initialization complete!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('   Duplicate key error - admin might already exist with different case');
    }
    console.error('\n💡 Troubleshooting:');
    console.error('   - Check that MONGODB_URI is set in .env.local');
    console.error('   - Verify MongoDB credentials are correct');
    console.error('   - Ensure network connectivity to MongoDB Atlas');
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

initializeAdmin();
