const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, searchQuery } = req.query;
    const filter = { user: req.user.id };

    // Add filters to the query if they are present
    if (type) {
      filter.type = type;
    }
    if (category) {
      filter.category = category;
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }
    if (searchQuery) {
      filter.notes = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addTransaction = async (req, res) => {
  const { amount, type, category, date, notes } = req.body;
  try {
    const newTransaction = new Transaction({
      user: req.user.id,
      amount,
      type,
      category,
      date,
      notes,
    });
    const transaction = await newTransaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }
    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }
    await transaction.remove();
    res.status(200).json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};