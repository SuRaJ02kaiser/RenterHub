const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (roles) => (req, res, next) => {
try {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Invalid or missing token" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!roles.includes(decoded.role)) {
      return res.status(403).json({ error: "Access denied" });
  }

  req.user = decoded;
  next();
} catch (err) {
  return res.status(401).json({ error: "Unauthorized, please login" });
}

};

module.exports = authMiddleware;
