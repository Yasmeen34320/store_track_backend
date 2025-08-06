const Item = require("../models/items");

// Get all items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({ data:items, message: "Items fetched successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get one item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ data:item });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Insert one item
const createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json({ data: newItem, message: "Item created" });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern) {
  const field = Object.keys(err.keyPattern)[0]; // e.g., 'barcode', 'email', etc.
  return res.status(400).json({ message: `Duplicate ${field}` });
}
    res.status(400).json({ message: err.message });
  }
};

// Insert many items
const insertManyItems = async (req, res) => {
  try {
    const insertedItems = await Item.insertMany(req.body);
    res.status(201).json({ data: insertedItems, message: "Items inserted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update item by ID
const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ data: updatedItem, message: "Item updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete one item
const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete many items
const deleteManyItems = async (req, res) => {
  try {
    const { ids } = req.body; // expects { ids: [id1, id2, ...] }
    if (!Array.isArray(ids)) return res.status(400).json({ message: "Invalid IDs format" });

    const result = await Item.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ deletedCount: result.deletedCount, message: "Items deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  insertManyItems,
  updateItem,
  deleteItem,
  deleteManyItems,
};
