const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "unilib-react-secret";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Ban chua dang nhap." });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token khong hop le hoac da het han." });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Ban khong co quyen thuc hien thao tac nay." });
    }
    return next();
  };
}

module.exports = {
  SECRET,
  authMiddleware,
  requireRole
};
