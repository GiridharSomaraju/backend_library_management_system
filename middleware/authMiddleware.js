const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader === undefined) {
    res.status(401).send('Invalid JWT token');
  } else {
    const jwtToken = authHeader.split(' ')[1];
    jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, async (err, payload) => {
      if (err) {
        res.status(401).send('Invalid JWT token');
      } else {
        req.id = payload.id;
        req.role = payload.role;
        next();
      }
    });
  }
};

const authorizeRole = (availableRoles) => {
  return (req, res, next) => {
    if (!availableRoles.includes(req.role)) {
      return res.status(403).send({
        error: "Access denied.You don't have permission for this role",
      });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRole };
