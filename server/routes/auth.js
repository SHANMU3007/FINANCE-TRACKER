// D:\finance-tracker\server\routes\auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// A simple check to see if Google OAuth is configured
const checkGoogleAuth = (req, res, next) => {
  if (passport._strategy('google')) {
    next();
  } else {
    res.status(500).json({ message: "Google OAuth not configured" });
  }
};

// @desc Auth with Google
// @route GET /api/auth/google
router.get('/google', checkGoogleAuth, passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc Google auth callback
// @route GET /api/auth/google/callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/' }),
  (req, res) => {
    // Successful authentication, redirect to the dashboard
    res.redirect('http://localhost:5173/dashboard'); 
  }
);

// @desc Logout user
// @route GET /api/auth/logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('http://localhost:5173/');
  });
});

// @desc Get current user
// @route GET /api/auth/user
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

module.exports = router;