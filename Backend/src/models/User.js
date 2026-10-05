const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true, maxlength: 100},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    passwordHash: {type: String, required: true, select: false},
    gender: {type: String, default: 'Other'},
    course: {type: String, default: 'Computer Science'},
    notificationsEnabled: {type: Boolean, default: true},
  },
  {timestamps: true},
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);