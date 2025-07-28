const mongoose = require("mongoose");

const purchaseInvoiceSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  supplierName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: Number,
      costPrice: Number, // should update in the original item
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

module.exports = mongoose.model("PurchaseInvoice", purchaseInvoiceSchema);
