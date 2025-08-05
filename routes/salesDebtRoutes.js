const express = require("express");
const router = express.Router();
const salesDebtController = require("../controllers/salesDebtController");

router.post("/", salesDebtController.createOrUpdateDebt);
router.get("/", salesDebtController.getAllDebts);
router.get("/:shopId", salesDebtController.getDebtByShopId);

module.exports = router;
