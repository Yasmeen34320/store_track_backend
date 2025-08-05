const express = require("express");
const router = express.Router();
const purchaseDebtController = require("../controllers/purchaseDebtController");

router.post("/", purchaseDebtController.createOrUpdateDebt);
router.get("/", purchaseDebtController.getAllDebts);
router.get("/:supplierId", purchaseDebtController.getDebtBySupplierId);

module.exports = router;