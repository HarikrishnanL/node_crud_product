// const express = require('express');
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' ,required:true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required:true},
    quantity: { type: Number, default: 1, required: true }
});

module.exports = mongoose.model('Order', orderSchema);
