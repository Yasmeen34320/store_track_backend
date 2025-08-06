const mongoose = require("mongoose");

const purchaseDebtSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  totalDue: { type: Number, default: 0 },
  history: [
    {
      type: { type: String, enum: ["buy", "pay"] },
      amount: Number,
      date: { type: Date, default: Date.now },
      note: String,
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // ✅ added userId
    }
  ]
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("PurchaseDebt", purchaseDebtSchema);
