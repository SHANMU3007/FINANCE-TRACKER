const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

// All transaction routes are protected
router.get('/', ensureAuth, getTransactions);
router.post('/', ensureAuth, addTransaction);
router.put('/:id', ensureAuth, updateTransaction);
router.delete('/:id', ensureAuth, deleteTransaction);

module.exports = router;