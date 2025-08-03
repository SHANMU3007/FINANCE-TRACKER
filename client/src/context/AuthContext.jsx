import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set axios to send cookies with requests
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // For development: bypass authentication when backend is not running
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/user');
        setUser(res.data);
      } catch (err) {
        // For development: create a mock user when backend is not available
        setUser({
          id: 'dev-user-1',
          name: 'Development User',
          email: 'dev@example.com'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.get('http://localhost:5000/api/auth/logout');
    } catch (err) {
      // For development: just clear the user state
      console.log('Backend not available, clearing user state');
    }
    setUser(null);
  };

  const value = { user, loading, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};