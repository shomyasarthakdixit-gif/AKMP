const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/akmp';

mongoose.connect(uri)
  .then(() => mongoose.connection.db.dropCollection('users'))
  .then(() => {
    console.log('Collection dropped successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.log('Error or collection does not exist:', err.message);
    process.exit(0);
  });
