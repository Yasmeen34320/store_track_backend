const express = require('express');
const router = express.Router();
const controller = require('../controllers/shopController');

router.post('/', controller.createShop);
router.get('/', controller.getAllShops);
router.get('/:id', controller.getShopById);
router.put('/:id', controller.updateShop);
router.delete('/:id', controller.deleteShop);
router.post('/delete-many', controller.deleteManyShops);
router.post('/bulk', controller.insertManyShops);

module.exports = router;
