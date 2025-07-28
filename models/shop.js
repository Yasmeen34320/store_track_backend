const mongoose = require("mongoose");


// clients
const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phones: [{ type: String }], 
  address: String,
//   totalDue: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("Shop", shopSchema);
