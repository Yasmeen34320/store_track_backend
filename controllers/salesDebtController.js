const SalesDebt = require("../models/salesDebts");

exports.createOrUpdateDebt = async (req, res) => {
  try {
     const { shopId, type, amount, note } = req.body;
    const userId = req.user?._id || req.body.userId; // fallback if not using middleware

    const existing = await SalesDebt.findOne({ shopId });

    const historyEntry = { type, amount, note, userId };

    if (existing) {
      let totalDue = existing.totalDue;
      if (type === "buy") totalDue += amount;
      else if (type === "pay") totalDue -= amount;
      else if (type === "return") totalDue -= amount;

      existing.totalDue = totalDue;
      existing.history.push(historyEntry);
      await existing.save();

      return res.status(200).json({data:existing});
    } else {
      const debt = await SalesDebt.create({
        shopId,
        totalDue: type === "buy" ? amount : 0,
        history: [historyEntry]
      });
      return res.status(201).json({data:debt});
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllDebts = async (req, res) => {
  try {
const debts = await SalesDebt.find()
      .populate("shopId")
      .populate("history.userId", "name email"); // adjust fields as needed
    res.status(200).json({data:debts});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDebtByShopId = async (req, res) => {
  try {
 const debt = await SalesDebt.findOne({ shopId: req.params.shopId })
      .populate("shopId")
      .populate("history.userId", "name email");
          if (!debt) return res.status(404).json({ message: "No debt found for this shop" });
    res.status(200).json({data:debt});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
