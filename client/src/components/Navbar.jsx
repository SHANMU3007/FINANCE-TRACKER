// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const loggedOutNavbar = (
    <nav className="classic-navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">💸</span> Finance Tracker
        </Link>
      </div>
      <div className="navbar-right">
        {location.pathname !== '/login' && (
          <Link to="/login" className="navbar-link">Sign In</Link>
        )}
      </div>
    </nav>
  );

  const loggedInNavbar = (
    <nav className="classic-navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">💸</span> Finance Tracker
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
        <Link to="/transactions" className="navbar-link">Transactions</Link>
        <Link to="/budgets" className="navbar-link">Budgets</Link>
        <button onClick={handleLogout} className="navbar-button classic-logout-btn">Sign Out</button>
      </div>
    </nav>
  );

  return user ? loggedInNavbar : loggedOutNavbar;
};

export default Navbar;