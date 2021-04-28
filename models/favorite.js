const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  campsites: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite',
      },
    ],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
