const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  image: [{
    type: String
  }],
  views: {
    type: Number,
    default: 0
  },
  ordered: {
    type: Number,
    default: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  dietaryInformation: [{
    type: String
  }]
},
  {
    timestamps: true
  }
);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
