const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authorizationHeaderValue = req.headers["authorization"];
    if (!authorizationHeaderValue || !authorizationHeaderValue.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access Denied" });
    }

    const token = authorizationHeaderValue.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access Denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Role-based access control
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch (err) {
      console.log("Token validation error:", err);
      return res.status(401).json({ error: "Invalid Token" });
    }
  };
};

module.exports = authMiddleware;
