const mongoose = require("mongoose");

const salesDebtSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  totalDue: { type: Number, default: 0 },
  history: [
    {
      type: { type: String, enum: ["buy", "pay", "return"] },
      amount: Number,
      date: { type: Date, default: Date.now },
      note: String
    }
  ]
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("SalesDebt", salesDebtSchema);
