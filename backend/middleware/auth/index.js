const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ message: 'Access token not provided' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        
        // Attach user to the request object
        req.user = {
            id: decoded.id,
            email: decoded.email
        };
        
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Access token expired' });
        }
        
        res.status(401).json({ message: 'Invalid access token' });
    }
};


module.exports = authMiddleware;