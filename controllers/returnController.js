// const Return = require("../models/Return");
// const Item = require("../models/Item");
// const PurchaseDebt = require("../models/PurchaseDebt");
// const mongoose = require("mongoose");

// exports.createReturn = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { shopId, userId, items, totalAmount, notes } = req.body;

//     for (const item of items) {
//       await Item.findByIdAndUpdate(
//         item.itemId,
//         { $inc: { quantity: -item.quantity } },
//         { session }
//       );
//     }

//     await PurchaseDebt.findOneAndUpdate(
//       { supplierId: shopId },
//       {
//         $inc: { totalDue: -totalAmount },
//         $push: {
//           history: {
//             type: "pay",
//             amount: totalAmount,
//             note: "Return received - debt reduced"
//           }
//         }
//       },
//       { upsert: true, new: true, session }
//     );

//     const returnDoc = new Return({ shopId, userId, items, totalAmount, notes });
//     await returnDoc.save({ session });

//     await session.commitTransaction();
//     res.status(201).json(returnDoc);
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(500).json({ message: error.message });
//   } finally {
//     session.endSession();
//   }
// };

// exports.getAllReturns = async (req, res) => {
//   try {
//     const returns = await Return.find().populate("items.itemId").populate("shopId");
//     res.json(returns);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getReturnById = async (req, res) => {
//   try {
//     const returnDoc = await Return.findById(req.params.id);
//     if (!returnDoc) return res.status(404).json({ message: "Return not found" });
//     res.json(returnDoc);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.deleteReturn = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const returnDoc = await Return.findById(req.params.id).session(session);
//     if (!returnDoc) return res.status(404).json({ message: "Return not found" });

//     for (const item of returnDoc.items) {
//       await Item.findByIdAndUpdate(
//         item.itemId,
//         { $inc: { quantity: item.quantity } },
//         { session }
//       );
//     }

//     await PurchaseDebt.findOneAndUpdate(
//       { supplierId: returnDoc.shopId },
//       {
//         $inc: { totalDue: returnDoc.totalAmount },
//         $push: {
//           history: {
//             type: "buy",
//             amount: returnDoc.totalAmount,
//             note: "Return deleted - debt restored"
//           }
//         }
//       },
//       { session }
//     );

//     await returnDoc.deleteOne({ session });
//     await session.commitTransaction();
//     res.json({ message: "Return deleted and changes reverted" });
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(500).json({ message: error.message });
//   } finally {
//     session.endSession();
//   }
// };

