// client/src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    navigate('/login');
  };
  
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="home-container classic-home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Master Your Money. Live Your Life.</h1>
          <p>
            Track your spending, set smart budgets, and gain full control over your financial life with our simple and powerful finance tracker.
          </p>
          {user ? (
            <button onClick={handleGoToDashboard} className="hero-cta-btn classic-hero-cta-btn">Go to Dashboard</button>
          ) : (
            <button onClick={handleGetStarted} className="hero-cta-btn classic-hero-cta-btn">Get Started</button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section classic-features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card classic-feature-card">
            <h3>📈 Smart Tracking</h3>
            <p>Automatically categorize your income and expenses to see where your money is going.</p>
          </div>
          <div className="feature-card classic-feature-card">
            <h3>💰 Budgeting Made Easy</h3>
            <p>Set personalized monthly budgets and get alerts when you're close to your limit.</p>
          </div>
          <div className="feature-card classic-feature-card">
            <h3>🔒 Secure & Private</h3>
            <p>Your financial data is protected with secure Google OAuth authentication.</p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="cta-section classic-cta-section">
        <div className="cta-content">
          <h2>Ready to get started?</h2>
          <p>Sign up now for free and take the first step towards a healthier financial future.</p>
          {user ? (
            <button onClick={handleGoToDashboard} className="cta-btn classic-cta-btn">Go to Dashboard</button>
          ) : (
            <button onClick={handleGetStarted} className="cta-btn classic-cta-btn">Sign Up Now</button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;