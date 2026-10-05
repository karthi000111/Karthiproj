const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const { createApp } = require('./src/app');

const app = createApp();
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is required. Copy Backend/.env.example to Backend/.env and configure it.');
    process.exitCode = 1;
  } else {
    mongoose.connect(uri)
      .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
          console.log(`Note2Flash backend connected to MongoDB and listening on port ${PORT}`);
        });
      })
      .catch(error => {
        console.error('Could not connect to MongoDB:', error.message);
        process.exitCode = 1;
      });
  }
}

module.exports = app;
