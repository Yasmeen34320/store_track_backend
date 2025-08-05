const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

// Get all items
router.get("/", itemController.getAllItems);

// Get item by ID
router.get("/:id", itemController.getItemById);

// Create one item
router.post("/", itemController.createItem);

// Insert many items
router.post("/bulk", itemController.insertManyItems);

// Update item
router.put("/:id", itemController.updateItem);

// Delete one item
router.delete("/:id", itemController.deleteItem);

// Delete many items
router.post("/delete-many", itemController.deleteManyItems);

module.exports = router;
