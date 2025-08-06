import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="login-loading">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="login-page-container">
      <div className="google-login-card">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" alt="Google Logo" className="google-logo"/>
        <h1>Sign in to Finance Tracker</h1>
        <p>Using your Google Account</p>
        <button onClick={handleGoogleLogin} className="google-signin-btn">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;