const express = require('express');
const router = express.Router();
const controller = require('../controllers/supplierController');

router.post('/', controller.createSupplier);
router.get('/', controller.getAllSuppliers);
router.get('/:id', controller.getSupplierById);
router.put('/:id', controller.updateSupplier);
router.delete('/:id', controller.deleteSupplier);
router.post('/delete-many', controller.deleteManySuppliers);
router.post('/bulk', controller.insertManySuppliers);

module.exports = router;
