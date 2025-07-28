const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
   name:{type: String, required: true},
    barcode: { type: String, required: true, unique: true },
    costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
    quantityInStock: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, default: 0 }, // Maximum discount allowed on this item
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Item', itemSchema);
