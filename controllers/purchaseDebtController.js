// controllers/purchaseDebtController.js
const PurchaseDebt = require("../models/purchaseDebts");

exports.createOrUpdateDebt = async (req, res) => {
  try {
   const { supplierId, amount, type, note } = req.body;
    const userId = req.user?._id || req.body.userId;


    const historyEntry = { type, amount, note, userId };
    let debt = await PurchaseDebt.findOne({ supplierId });

    if (!debt) {
      debt = new PurchaseDebt({
        supplierId,
        totalDue: type === "buy" ? amount : -amount,
        history: [historyEntry]
      });
    } else {
      if (type === "buy") debt.totalDue += amount;
      else debt.totalDue -= amount;
      debt.history.push(historyEntry);
    }

    await debt.save();
    res.status(200).json(debt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDebts = async (req, res) => {
  try {
  const debts = await PurchaseDebt.find()
      .populate("supplierId", "name")
      .populate("history.userId", "name email");
          res.status(200).json({data:debts});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDebtBySupplierId = async (req, res) => {
  try {
    const { supplierId } = req.params;
  const debt = await PurchaseDebt.findOne({ supplierId })
      .populate("supplierId", "name")
      .populate("history.userId", "name email");
          res.status(200).json({data:debt});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
