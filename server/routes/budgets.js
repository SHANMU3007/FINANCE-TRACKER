// server/routes/budgets.js
const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController');

// All budget routes are protected
router.get('/', ensureAuth, getBudgets);
router.post('/', ensureAuth, addBudget);
router.put('/:id', ensureAuth, updateBudget);
router.delete('/:id', ensureAuth, deleteBudget);

module.exports = router;