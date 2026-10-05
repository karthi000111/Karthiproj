const mongoose = require('mongoose');

const studyStateSchema = new mongoose.Schema(
  {
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    cardId: {type: String, required: true},
    level: {type: Number, min: 0, max: 5, default: 0},
    reviews: {type: Number, min: 0, default: 0},
    lastReviewed: {type: Date, default: null},
    completed: {type: Boolean, default: false},
    favourite: {type: Boolean, default: false},
  },
  {timestamps: true},
);

studyStateSchema.index({ownerId: 1, cardId: 1}, {unique: true});

module.exports = mongoose.models.StudyState || mongoose.model('StudyState', studyStateSchema);