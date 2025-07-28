const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phones: [{ type: String }], 
  address: String,
//   totalDue: { type: Number, default: 0 },
},{
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("Supplier", supplierSchema);
