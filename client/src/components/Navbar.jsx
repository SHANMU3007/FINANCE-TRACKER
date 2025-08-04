import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar modern-navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">💸</span> Finance Tracker
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
        <Link to="/transactions" className="navbar-link">Transactions</Link>
        <Link to="/budgets" className="navbar-link">Budgets</Link>
        <button onClick={handleLogout} className="navbar-button">Sign Out</button>
      </div>
    </nav>
  );
};

export default Navbar;
