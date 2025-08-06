const SalesInvoice = require("../models/SalesInvoice");
const SalesDebt = require("../models/salesDebts");
const Item = require('../models/items')



// exports.createInvoice = async (req, res) => {
//   try {
//     const invoice = await SalesInvoice.create(req.body);
//     res.status(201).json({data:invoice});
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };


exports.createInvoice = async (req, res) => {
    //You start a session, which allows grouping operations together.
  const session = await SalesInvoice.startSession();

  //You begin a transaction. From now on, all .create(), .findOne(), and .save() that use this session will be part of the same transaction.
  session.startTransaction();

  try {
    const invoice = await SalesInvoice.create([req.body], { session }); 
     for (const item of invoice.items) {
          await Item.findByIdAndUpdate(
            item.itemId,
            { $set: { sellingPrice: item.sellingPrice } ,
               $inc: { quantityInStock: -item.quantity },

          },
            { session }
          );
        }
    // Auto-update sales debt if credit
    if (req.body.paymentType === "credit" && req.body.remainingAmount > 0) {
      const shopId = req.body.shopId;
      const amount = req.body.remainingAmount;

      const existing = await SalesDebt.findOne({ shopId }).session(session);

      if (existing) {
        existing.totalDue += amount;
        existing.history.push({
          type: "buy",
          amount,
          note: `Credit from invoice id ${invoice._id}`,
        });
        await existing.save({ session });
      } else {
        await SalesDebt.create([{
          shopId,
          totalDue: amount,
          history: [{
            type: "buy",
            amount,
            note: `Credit from invoice id ${invoice._id}`,
          }]
        }], { session });
      }
    }
//4️⃣ If All Goes Well, Commit
//All the changes (invoice + debt) are saved together in the database.



    await session.commitTransaction();
    session.endSession();
// Free up resources — always do this at the end.


    res.status(201).json(invoice[0]);
  } catch (err) {
//     5️⃣ If Something Fails, Abort Everything
// This rolls back all changes — like they never happened.
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


exports.insertManyInvoices = async (req, res) => {
  const session = await SalesInvoice.startSession();
  session.startTransaction();

  try {
    const invoices = await SalesInvoice.insertMany(req.body, { session });

    for (const invoice of invoices) {
      if (invoice.paymentType === "credit" && invoice.remainingAmount > 0) {
        const shopId = invoice.shopId;
        const amount = invoice.remainingAmount;

        const existingDebt = await SalesDebt.findOne({ shopId }).session(session);

        if (existingDebt) {
          existingDebt.totalDue += amount;
          existingDebt.history.push({
            type: "buy",
            amount,
            note: `Credit from invoice id ${invoice._id}`,
          });
          await existingDebt.save({ session });
        } else {
          await SalesDebt.create([{
            shopId,
            totalDue: amount,
            history: [{
              type: "buy",
              amount,
              note: `Credit from invoice id ${invoice._id}`,
            }]
          }], { session });
        }
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ data: invoices });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await SalesInvoice.find().populate("shopId userId items.itemId");
    res.status(200).json({data:invoices});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await SalesInvoice.findById(req.params.id).populate("shopId userId items.itemId");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json({data:invoice});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  const session = await SalesInvoice.startSession();
  session.startTransaction();

  try {
    const oldInvoice = await SalesInvoice.findById(req.params.id).session(session);
    if (!oldInvoice) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Invoice not found" });
    }

    const updatedInvoice = await SalesInvoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, session }
    );

    // Only if paymentType is credit
    if (updatedInvoice.paymentType === "credit") {
      const oldAmount = oldInvoice.remainingAmount || 0;
      const newAmount = updatedInvoice.remainingAmount || 0;
      const diff = newAmount - oldAmount;

      const shopId = updatedInvoice.shopId;
      const debt = await SalesDebt.findOne({ shopId }).session(session);
      if (debt) {
        debt.totalDue += diff;

        // Add a history entry (you can be more complex if you want to remove/edit the old one)
        debt.history.push({
          type: "buy",
          amount: diff,
          note: `Updated credit for invoice id ${updatedInvoice._id}`,
        });

        await debt.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ data: updatedInvoice });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};


exports.deleteInvoice = async (req, res) => {
  const session = await SalesInvoice.startSession();
  session.startTransaction();

  try {
    const invoice = await SalesInvoice.findById(req.params.id).session(session);
    if (!invoice) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Invoice not found" });
    }

    await SalesInvoice.findByIdAndDelete(req.params.id).session(session);

    if (invoice.paymentType === "credit" && invoice.remainingAmount > 0) {
      const shopId = invoice.shopId;
      const amount = invoice.remainingAmount;

      const debt = await SalesDebt.findOne({ shopId }).session(session);
      if (debt) {
        debt.totalDue -= amount;

        debt.history.push({
          type: "adjustment",
          amount: -amount,
          note: `Reversal of credit from deleted invoice id ${invoice._id}`,
        });

        await debt.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Invoice deleted and debt updated" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};
