const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  itemId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  orderValue: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  addressOrTableId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending'
  },
  discountOrPromoCode: {
    type: String
  },
  // QR Code Placeholder, contents might depend on the libraries or services we use to generate the QR codes.
  qrCode: {
    type: String
  },
  userId: String,
  placedOn: Date,
  name: String,
  number: String,
  email: String,
  address: String,
  totalProducts: Number,
  totalPrice: Number,
  method: String
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
