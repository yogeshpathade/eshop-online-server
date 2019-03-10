const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    brand: {
        type: String,
        unique: true,
        required: true,
    },
    sizeRange: String,
    price: String,
    batchId: Number,
    stock: Number,
    manufacturingYear: String,
});

module.exports = mongoose.model('Product', productSchema);
