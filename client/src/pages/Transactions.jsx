// client/src/pages/Transactions.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: '',
    notes: '',
  });
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    searchQuery: '',
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await axios.get(`http://localhost:5000/api/transactions?${queryParams}`);
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/transactions', formData);
      setTransactions([res.data, ...transactions]);
      setFormData({ amount: '', type: 'expense', category: '', date: '', notes: '' });
      fetchTransactions();
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  if (loading) {
    return <div className="transactions-loading">Loading transactions...</div>;
  }

  return (
    <div className="transactions-page-container">
      <div className="form-container classic-form-container">
        <h2 className="form-header">Add New Transaction</h2>
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label>Amount</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" />
          </div>
          <button type="submit" className="submit-btn classic-submit-btn">Add Transaction</button>
        </form>
      </div>

      <div className="list-container classic-list-container">
        <h2 className="list-header">All Transactions</h2>
        <div className="filter-bar">
          <div className="filter-group">
            <label>Type</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Search Notes</label>
            <input type="text" name="searchQuery" value={filters.searchQuery} onChange={handleFilterChange} placeholder="Search transactions..." />
          </div>
          <button onClick={fetchTransactions} className="filter-btn classic-filter-btn">Apply Filters</button>
        </div>

        {transactions.length > 0 ? (
          <ul className="transactions-list">
            {transactions.map(t => (
              <li key={t._id} className="transaction-card classic-transaction-card">
                <div className="card-header">
                  <span className={`card-amount ${t.type}`}>{t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}</span>
                  <button onClick={() => handleDelete(t._id)} className="delete-btn classic-delete-btn">Delete</button>
                </div>
                <div className="card-body">
                  <p><strong>Category:</strong> {t.category}</p>
                  <p><strong>Date:</strong> {new Date(t.date).toLocaleDateString()}</p>
                  {t.notes && <p><strong>Notes:</strong> {t.notes}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;