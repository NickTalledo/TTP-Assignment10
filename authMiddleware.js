const jwt = require("jsonwebtoken");

// Middleware to check for a valid session cookie
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, "My5up3rS3cur3R@nd0mK3y!", (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        req.userId = decodedToken.userId;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { requireAuth };
