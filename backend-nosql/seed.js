const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/akmp';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  role: String,
  password: { type: String, select: false } // Just for reference
});

const User = mongoose.model('User', userSchema);

const usersToInsert = [
  { username: 'syamala', email: 'syamala@akmp.com', role: 'ROLE_USER', password: '45sya54' },
  { username: 'admin', email: 'admin@akmp.com', role: 'ROLE_ADMIN', password: 'admin4321' },
  { username: 'sarthak', email: 'sarthak@akmp.com', role: 'ROLE_USER', password: '12sar21' },
  { username: 'member', email: 'member@akmp.com', role: 'ROLE_MEMBER', password: '78mem87' },
  { username: 'shambhavi', email: 'shambhavi@akmp.com', role: 'ROLE_USER', password: '77mahi77' }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing
    await User.deleteMany({});
    
    // Insert new
    await User.insertMany(usersToInsert);
    console.log('Successfully seeded 5 users into MongoDB!');
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding DB:', err);
    mongoose.connection.close();
  }
}

seedDB();
