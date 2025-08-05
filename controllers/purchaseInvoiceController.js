// controllers/purchaseInvoiceController.js
const mongoose = require("mongoose");
const PurchaseInvoice = require("../models/PurchaseInvoice");
const PurchaseDebt = require("../models/PurchaseDebt");
const Item = require("../models/Item");

exports.createInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const invoiceData = req.body;

    // Create invoice
    const invoice = new PurchaseInvoice(invoiceData);
    await invoice.save({ session });

    // Update cost prices in items
    for (const item of invoice.items) {
      await Item.findByIdAndUpdate(
        item.itemId,
        { $set: { costPrice: item.costPrice } },
        { session }
      );
    }

    // Update PurchaseDebt
    let debt = await PurchaseDebt.findOne({ supplierId: invoice.supplierId });
    const remaining = invoice.remainingAmount;
    if (!debt) {
      debt = new PurchaseDebt({
        supplierId: invoice.supplierId,
        totalDue: remaining,
        history: [{ type: "buy", amount: remaining, note: `${invoice.notes} for the invoice id ${invoice.id}` }]
      });
    } else {
      debt.totalDue += remaining;
      debt.history.push({ type: "buy", amount: remaining, note: `${invoice.notes} for the invoice id ${invoice.id}` });
    }
    await debt.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({date:invoice});
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

exports.insertManyInvoices = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const invoices = req.body.data;
    const inserted = [];

    for (const invoiceData of invoices) {
      const invoice = new PurchaseInvoice(invoiceData);
      await invoice.save({ session });
      inserted.push(invoice);

      // Update items
      for (const item of invoice.items) {
        await Item.findByIdAndUpdate(
          item.itemId,
          { $set: { costPrice: item.costPrice } },
          { session }
        );
      }

      // Update or create debt
      let debt = await PurchaseDebt.findOne({ supplierId: invoice.supplierId });
      if (!debt) {
        debt = new PurchaseDebt({
          supplierId: invoice.supplierId,
          totalDue: invoice.remainingAmount,
          history: [{ type: "buy", amount: invoice.remainingAmount, note: `${invoice.notes} for the invoice id ${invoice.id}` }]
        });
      } else {
        debt.totalDue += invoice.remainingAmount;
        debt.history.push({ type: "buy", amount: invoice.remainingAmount, note: `${invoice.notes} for the invoice id ${invoice.id}`});
      }
      await debt.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({data:inserted});
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await PurchaseInvoice.find();
    res.status(200).json({date:invoices});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await PurchaseInvoice.findById(req.params.id);
    res.status(200).json({data:invoice});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const oldInvoice = await PurchaseInvoice.findById(req.params.id).session(session);
    if (!oldInvoice) throw new Error("Invoice not found");

    // Revert stock changes and debt
    // for (const item of oldInvoice.items) {
    //   await Item.findByIdAndUpdate(item.itemId, {
    //     $inc: { quantityInStock: -item.quantity },
    //   }, { session });
    // }

    const oldDebt = await PurchaseDebt.findOne({ supplierId: oldInvoice.supplierId }).session(session);
    if (oldDebt) {
      oldDebt.totalDue -= oldInvoice.remainingAmount;
      oldDebt.history.push({
        type: "pay",
        amount: oldInvoice.remainingAmount,
        note: `Revert: ${oldInvoice._id}`,
      });
      await oldDebt.save({ session });
    }

    const updatedInvoice = await PurchaseInvoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      session,
    });

    // Apply new changes
    for (const item of req.body.items) {
      await Item.findByIdAndUpdate(item.itemId, {
        $set: { costPrice: item.costPrice },
        $inc: { quantity: item.quantity },
      }, { session });
    }

    const newDebt = await PurchaseDebt.findOne({ supplierId: req.body.supplierId }).session(session);
    if (newDebt) {
      newDebt.totalDue += req.body.remainingAmount;
      newDebt.history.push({
        type: "buy",
        amount: req.body.remainingAmount,
        note: `Update: ${updatedInvoice._id}`,
      });
      await newDebt.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    res.status(200).json(updatedInvoice);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const invoice = await PurchaseInvoice.findById(req.params.id).session(session);
    if (!invoice) throw new Error("Invoice not found");

    // Revert stock
    for (const item of invoice.items) {
      await Item.findByIdAndUpdate(item.itemId, {
        $inc: { quantity: -item.quantity },
      }, { session });
    }

    // Adjust debt
    const debt = await PurchaseDebt.findOne({ supplierId: invoice.supplierId }).session(session);
    if (debt) {
      debt.totalDue -= invoice.remainingAmount;
      debt.history.push({
        type: "pay",
        amount: invoice.remainingAmount,
        note: `Deleted invoice ${invoice._id}`,
      });
      await debt.save({ session });
    }

    await PurchaseInvoice.findByIdAndDelete(req.params.id, { session });

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

