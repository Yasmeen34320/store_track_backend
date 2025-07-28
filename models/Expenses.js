const mongoose = require("mongoose");
// المصاريف
const expenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
},  {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("Expense", expenseSchema);