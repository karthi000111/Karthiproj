const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true},
    deckId: {type: String, default: 'java'},
    subject: {type: String, required: true, trim: true},
    question: {type: String, required: true, trim: true},
    answer: {type: String, required: true, trim: true},
    difficulty: {type: String, default: 'Medium', trim: true},
  },
  {timestamps: true},
);

module.exports = mongoose.models.Flashcard || mongoose.model('Flashcard', flashcardSchema);