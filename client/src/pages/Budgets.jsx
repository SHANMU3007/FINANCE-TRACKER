import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Budgets.css';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: '',
  });

  const fetchBudgets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/budgets');
      setBudgets(res.data);
    } catch (err) {
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/budgets', formData);
      setFormData({ category: '', amount: '', month: '' });
      fetchBudgets();
    } catch (err) {
      console.error('Error adding budget:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      console.error('Error deleting budget:', err);
    }
  };

  if (loading) {
    return <div className="budgets-loading">Loading budgets...</div>;
  }

  return (
    <div className="budgets-page-container">
      <div className="budgets-form-container modern-budgets-form-container">
        <h2 className="budgets-header">Set a New Budget</h2>
        <form onSubmit={handleSubmit} className="budgets-form">
          <div className="budgets-form-group">
            <label>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
          </div>
          <div className="budgets-form-group">
            <label>Amount</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
          </div>
          <div className="budgets-form-group">
            <label>Month</label>
            <input type="month" name="month" value={formData.month} onChange={handleChange} required />
          </div>
          <button type="submit" className="budgets-submit-btn">Set Budget</button>
        </form>
      </div>

      <div className="budgets-list-container modern-budgets-list-container">
        <h2 className="budgets-header">Current Budgets</h2>
        {budgets.length > 0 ? (
          <ul className="budgets-list">
            {budgets.map(b => (
              <li key={b._id} className="budget-card modern-budget-card">
                <div className="budget-info">
                  <p><strong>Category:</strong> {b.category}</p>
                  <p><strong>Amount:</strong> ${b.amount.toFixed(2)}</p>
                  <p><strong>Month:</strong> {b.month}</p>
                </div>
                <button onClick={() => handleDelete(b._id)} className="budget-delete-btn">Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No budgets set.</p>
        )}
      </div>
    </div>
  );
};

export default Budgets;
