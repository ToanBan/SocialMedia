const jwt = require('jsonwebtoken');

const AuthMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'secretkey123456789');
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.json({ error: 'Token expired' });
        } else {
            return res.json({ error: 'Token is not valid' });
        }
    }
};

module.exports = AuthMiddleware;
