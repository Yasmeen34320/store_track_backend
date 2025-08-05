const express = require("express");
const router = express.Router();
const salesInvoiceController = require("../controllers/salesInvoiceController");

router.post("/many", salesInvoiceController.insertManyInvoices); // insert multiple
router.post("/", salesInvoiceController.createInvoice);
router.get("/", salesInvoiceController.getAllInvoices);
router.get("/:id", salesInvoiceController.getInvoiceById);
router.put("/:id", salesInvoiceController.updateInvoice);
router.delete("/:id", salesInvoiceController.deleteInvoice);

module.exports = router;
