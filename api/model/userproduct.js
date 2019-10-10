const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    product_id: mongoose.Schema.Types.ObjectId,
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Product', productSchema);