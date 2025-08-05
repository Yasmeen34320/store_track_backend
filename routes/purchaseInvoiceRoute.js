const express = require("express");
const router = express.Router();
const purchaseInvoiceController = require("../controllers/purchaseInvoiceController");

router.post("/many", purchaseInvoiceController.insertManyInvoices); // insert multiple
router.post("/", purchaseInvoiceController.createInvoice);
router.get("/", purchaseInvoiceController.getAllInvoices);
router.get("/:id", purchaseInvoiceController.getInvoiceById);
router.put("/:id", purchaseInvoiceController.updateInvoice);
router.delete("/:id", purchaseInvoiceController.deleteInvoice);

module.exports = router;