require('dotenv').config();
const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate tokens
const generateTokens = (user) => {
    const payload = { id: user.id, email: user.email };

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {  });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
};

// REGISTER
exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);

        if (result.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = 'INSERT INTO users (email, password) VALUES ($1, $2)';
        await db.query(insertQuery, [email, hashedPassword]);

        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            user: { id: user.id, email: user.email }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await db.query(query, [decoded.id]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Token refreshed successfully',
            accessToken , 
            user: { id: user.id, email: user.email }
        });

    } catch (err) {
        console.error('Refresh token error:', err);
        res.clearCookie('refreshToken');

        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Refresh token expired' });
        }

        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

// LOGOUT
exports.logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};
