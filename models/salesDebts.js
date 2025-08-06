const mongoose = require("mongoose");

const salesDebtSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  totalDue: { type: Number, default: 0 },
  history: [
    {
      type: { type: String, enum: ["buy", "pay", "return"] },
      // pay so the amount he i need to pay is reduced ,, buy so that the amount += is ol==plus --> the return woud be as pay so it will reduce the amount
      amount: Number,
      date: { type: Date, default: Date.now },
      note: String,
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    }
  ]
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("SalesDebt", salesDebtSchema);
