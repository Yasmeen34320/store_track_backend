const mongoose = require("mongoose");

/// فواتير البيع
const salesInvoiceSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" }, // to get shop name
    clientName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: Number,
      price: Number, // should update in the original item
      total: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // Discount on the total amount
  paymentType: { type: String, enum: ["cash", "credit"] },
  amountPaid: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  invoiceDate: { type: Date, default: Date.now },
  notes: String
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("SalesInvoice", salesInvoiceSchema);
