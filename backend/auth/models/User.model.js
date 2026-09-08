const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },  
  password: {
    type: String,
    required: true
  },
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  role: {
    type: String,
    default: 'admin'
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String
  },
  phoneNumber: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;