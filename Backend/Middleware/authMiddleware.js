const jwt = require('jsonwebtoken');

// Protects a route: requires a valid "Authorization: Bearer <token>" header.
// On success, attaches the decoded token payload to req.user.
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: "Not authorized, no token provided" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email, iat, exp }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: "Not authorized, token invalid or expired" });
    }
};

module.exports = { protect };