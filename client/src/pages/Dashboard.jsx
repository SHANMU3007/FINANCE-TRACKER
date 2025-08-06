// client/src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import './Dashboard.css';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#FFD700', '#F44336', '#9C27B0', '#00BCD4', '#FF5722', '#CDDC39', '#673AB7', '#FF9800', '#03A9F4', '#4CAF50'];

const publicData = {
  totalIncome: 12500,
  totalExpenses: 7800,
  currentBalance: 4700,
  transactions: [
    { _id: '1', category: 'Salary', type: 'income', amount: 5000, date: '2024-07-01T00:00:00Z' },
    { _id: '2', category: 'Rent', type: 'expense', amount: 1500, date: '2024-07-05T00:00:00Z' },
    { _id: '3', category: 'Groceries', type: 'expense', amount: 500, date: '2024-08-03T00:00:00Z' },
    { _id: '4', category: 'Freelance', type: 'income', amount: 2500, date: '2024-08-10T00:00:00Z' },
    { _id: '5', category: 'Utilities', type: 'expense', amount: 200, date: '2024-07-20T00:00:00Z' },
  ],
};

const PublicDashboard = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login');
  };

  const publicExpenseData = publicData.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const formattedPublicExpenseData = Object.keys(publicExpenseData).map(key => ({
    name: key,
    value: publicExpenseData[key],
  }));

  const publicMonthlyData = publicData.transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { name: month, income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      acc[month].income += t.amount;
    } else {
      acc[month].expense += t.amount;
    }
    return acc;
  }, {});

  const formattedPublicMonthlyData = Object.values(publicMonthlyData).sort((a, b) => new Date(a.name) - new Date(b.name));

  return (
    <div className="dashboard-container">
      <div className="public-dashboard-header-container">
        <h1 className="dashboard-header">Welcome to Finance Tracker!</h1>
        <button onClick={handleSignInClick} className="public-signin-btn">Sign In</button>
      </div>
      <p>Sign in to see your personalized dashboard.</p>
      
      <div className="summary-cards">
        <div className="summary-card classic-summary-card">
          <h3>Example Income</h3>
          <p className="income-card-text">${publicData.totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-card classic-summary-card">
          <h3>Example Expenses</h3>
          <p className="expenses-card-text">${publicData.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="summary-card classic-summary-card">
          <h3>Example Balance</h3>
          <p className="balance-card-text">${publicData.currentBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="chart-and-transactions">
        <div className="chart-container classic-chart-container">
          <h2>Expense Breakdown (Example)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={formattedPublicExpenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {formattedPublicExpenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="recent-transactions-container classic-recent-container">
          <h2>Recent Transactions (Example)</h2>
          <ul className="transaction-list">
            {publicData.transactions.map(t => (
              <li key={t._id} className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-category">{t.category}</span>
                  <span className={`transaction-amount ${t.type}`}>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</span>
                </div>
                <small className="transaction-date">{new Date(t.date).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="chart-container classic-chart-container" style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
        <h2>Monthly Income/Expense Trend (Example)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedPublicMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="income" fill="#4CAF50" name="Income" />
            <Bar dataKey="expense" fill="#F44336" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PrivateDashboard = ({ user, transactions, privateLoading }) => {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const currentBalance = totalIncome - totalExpenses;

  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const formattedExpenseData = Object.keys(expenseData).map(key => ({
    name: key,
    value: expenseData[key],
  }));

  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { name: month, income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      acc[month].income += t.amount;
    } else {
      acc[month].expense += t.amount;
    }
    return acc;
  }, {});

  const formattedMonthlyData = Object.values(monthlyData).sort((a, b) => new Date(a.name) - new Date(b.name));

  if (privateLoading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Welcome, <span className="dashboard-username">{user?.displayName}</span>!</h1>

      <div className="summary-cards">
        <div className="summary-card classic-summary-card">
          <div className="summary-icon">💸</div>
          <div className="summary-content">
            <h3>Total Income</h3>
            <p className="income-card-text">${totalIncome.toFixed(2)}</p>
          </div>
        </div>
        <div className="summary-card classic-summary-card">
          <div className="summary-icon">💳</div>
          <div className="summary-content">
            <h3>Total Expenses</h3>
            <p className="expenses-card-text">${totalExpenses.toFixed(2)}</p>
          </div>
        </div>
        <div className="summary-card classic-summary-card">
          <div className="summary-icon">⚖️</div>
          <div className="summary-content">
            <h3>Current Balance</h3>
            <p className="balance-card-text">${currentBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="chart-and-transactions">
        <div className="chart-container classic-chart-container">
          <h2>Expense Breakdown</h2>
          {formattedExpenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={formattedExpenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {formattedExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-placeholder">No expense data to display.</div>
          )}
        </div>

        <div className="recent-transactions-container classic-recent-container">
          <h2>Recent Transactions</h2>
          {transactions.length > 0 ? (
            <ul className="transaction-list">
              {transactions.slice(0, 5).map(t => (
                <li key={t._id} className="transaction-item">
                  <div className="transaction-info">
                    <span className="transaction-category">{t.category}</span>
                    <span className={`transaction-amount ${t.type}`}>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</span>
                  </div>
                  <small className="transaction-date">{new Date(t.date).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent transactions found.</p>
          )}
        </div>
      </div>

      <div className="chart-container classic-chart-container" style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
        <h2>Monthly Income/Expense Trend</h2>
        {formattedMonthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="income" fill="#4CAF50" name="Income" />
              <Bar dataKey="expense" fill="#F44336" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-placeholder">No monthly trend data to display.</div>
        )}
      </div>
    </div>
  );
};


function Dashboard() {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [privateLoading, setPrivateLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setPrivateLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setPrivateLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    } else {
      setPrivateLoading(false);
    }
  }, [user, fetchTransactions]);

  if (loading || (user && privateLoading)) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  if (!user) {
    return <PublicDashboard />;
  }

  return <PrivateDashboard user={user} transactions={transactions} privateLoading={privateLoading} />;
}

export default Dashboard;