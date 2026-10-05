const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema(
  {
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true},
    title: {type: String, required: true, trim: true, maxlength: 100},
    description: {type: String, trim: true, maxlength: 300, default: ''},
  },
  {timestamps: true},
);

module.exports = mongoose.models.Deck || mongoose.model('Deck', deckSchema);