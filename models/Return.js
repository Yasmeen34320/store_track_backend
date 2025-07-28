const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
//   type: { type: String, enum: ["sale", "purchase"], required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, required: true ,ref: "Shop" }, // Shop or Supplier
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: Number,
      price: Number,
      total: Number
    }
  ],
    totalAmount: { type: Number, required: true },
  returnDate: { type: Date, default: Date.now },
  notes: String
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("Return", returnSchema);
