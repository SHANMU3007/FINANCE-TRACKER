import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h1>Personal Finance Tracker</h1>
        <p>Your journey to financial freedom starts here.</p>
        <button onClick={handleGoogleLogin} className="google-signin-btn">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;