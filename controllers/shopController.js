const Shop = require('../models/shop');

// Create one
const createShop = async (req, res) => {
  try {
    const shop = await Shop.create(req.body);
    res.status(201).json({data:shop});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all
const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json({data:shops});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one
const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({data:shop});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shop) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({data:shop});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete one
const deleteShop = async (req, res) => {
  try {
    const result = await Shop.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete many
const deleteManyShops = async (req, res) => {
  try {
    const { ids } = req.body;
    const result = await Shop.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Insert multiple shops
const insertManyShops = async (req, res) => {
  try {
    const shops = req.body;
    if (!Array.isArray(shops)) {
      return res.status(400).json({ message: "Expected an array of shops" });
    }
    const insertedShops = await Shop.insertMany(shops);
    res.status(201).json({data:insertedShops});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  deleteManyShops,
  insertManyShops,
};
