
// // --- controllers/expenseController.js ---
// const Expense = require("../models/Expense");

// exports.createExpense = async (req, res) => {
//   try {
//     const expense = new Expense(req.body);
//     await expense.save();
//     res.status(201).json({data:expense});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getAllExpenses = async (req, res) => {
//   try {
//     const expenses = await Expense.find();
//     res.status(200).json({data:expenses});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getExpenseById = async (req, res) => {
//   try {
//     const expense = await Expense.findById(req.params.id);
//     if (!expense) return res.status(404).json({ message: "Expense not found" });
//     res.status(200).json(expense);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.updateExpense = async (req, res) => {
//   try {
//     const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!expense) return res.status(404).json({ message: "Expense not found" });
//     res.status(200).json({data:expense});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.deleteExpense = async (req, res) => {
//   try {
//     const expense = await Expense.findByIdAndDelete(req.params.id);
//     if (!expense) return res.status(404).json({ message: "Expense not found" });
//     res.status(200).json({ message: "Expense deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

