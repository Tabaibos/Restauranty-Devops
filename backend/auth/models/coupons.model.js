const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        required: true,
    },
    start: {
        type: String,
        required: true,
    },
    end: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true
    }
);

const Item = mongoose.model('Coupons', itemSchema);

module.exports = Item;
