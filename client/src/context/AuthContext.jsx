// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/user');
        setUser(res.data);
      } catch (err) {
        setUser(null);
        console.error('Error fetching user:', err.message);
      } finally {
        setLoading(false); // This ensures loading is always false at the end of the call
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.get('http://localhost:5000/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err.message);
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