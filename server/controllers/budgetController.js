// server/controllers/budgetController.js
const Budget = require('../models/Budget');

// @desc Get all budgets for a user
// @route GET /api/budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Add a new budget
// @route POST /api/budgets
exports.addBudget = async (req, res) => {
  const { category, amount, month } = req.body;
  try {
    const newBudget = new Budget({
      user: req.user.id,
      category,
      amount,
      month,
    });
    const budget = await newBudget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Update a budget
// @route PUT /api/budgets/:id
exports.updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id);
    if (!budget || budget.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Budget not found or unauthorized' });
    }
    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Delete a budget
// @route DELETE /api/budgets/:id
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget || budget.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Budget not found or unauthorized' });
    }
    await budget.remove();
    res.status(200).json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};