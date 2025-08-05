// controllers/purchaseDebtController.js
const PurchaseDebt = require("../models/PurchaseDebt");

exports.createOrUpdateDebt = async (req, res) => {
  try {
    const { supplierId, amount, type, note } = req.body;

    let debt = await PurchaseDebt.findOne({ supplierId });

    if (!debt) {
      debt = new PurchaseDebt({
        supplierId,
        totalDue: type === "buy" ? amount : -amount,
        history: [{ type, amount, note }]
      });
    } else {
      if (type === "buy") debt.totalDue += amount;
      else debt.totalDue -= amount;
      debt.history.push({ type, amount, note });
    }

    await debt.save();
    res.status(200).json(debt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDebts = async (req, res) => {
  try {
    const debts = await PurchaseDebt.find().populate("supplierId", "name");
    res.status(200).json(debts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDebtBySupplierId = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const debt = await PurchaseDebt.findOne({ supplierId }).populate("supplierId", "name");
    res.status(200).json(debt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
