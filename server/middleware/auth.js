// A simple check to see if the user is authenticated.
const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).send('Not authenticated');
    }
  };
  
  module.exports = { ensureAuth };