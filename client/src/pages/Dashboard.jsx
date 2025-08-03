import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // You would calculate these values based on your transactions state
  const totalIncome = 0;
  const totalExpenses = 0;
  const currentBalance = 0;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Welcome, {user?.displayName}!</h1>

      <div className="summary-cards">
        <div className="summary-card income-card">
          <h3>Total Income</h3>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-card expenses-card">
          <h3>Total Expenses</h3>
          <p>${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="summary-card balance-card">
          <h3>Current Balance</h3>
          <p>${currentBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="chart-and-transactions">
        <div className="chart-container">
          <h2>Expense Breakdown</h2>
          <div className="chart-placeholder">
            Pie Chart of Expenses
          </div>
        </div>

        <div className="recent-transactions-container">
          <h2>Recent Transactions</h2>
          {transactions.length > 0 ? (
            <ul className="transaction-list">
              {transactions.slice(0, 5).map(t => (
                <li key={t._id} className="transaction-item">
                  <div className="transaction-info">
                    <span>{t.category}</span>
                    <span className={`transaction-amount ${t.type}`}>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</span>
                  </div>
                  <small>{new Date(t.date).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;