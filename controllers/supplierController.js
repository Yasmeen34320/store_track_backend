const Supplier = require('../models/Supplier');

// Create one
const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({data:supplier});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json({data:suppliers});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({data:supplier});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplier) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({data:supplier});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete one
const deleteSupplier = async (req, res) => {
  try {
    const result = await Supplier.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete many
const deleteManySuppliers = async (req, res) => {
  try {
    const { ids } = req.body;
    const result = await Supplier.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Insert multiple suppliers
const insertManySuppliers = async (req, res) => {
  try {
    const suppliers = req.body;
    if (!Array.isArray(suppliers)) {
      return res.status(400).json({ message: "Expected an array of suppliers" });
    }
    const insertedSuppliers = await Supplier.insertMany(suppliers);
    res.status(201).json({data:insertedSuppliers});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  deleteManySuppliers,
  insertManySuppliers
};
