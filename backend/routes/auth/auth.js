const express = require('express');
const router = express.Router();

const { login , register, refreshToken} =  require('../../controllers/authControllers');


// POST /api/auth/login

router.post('/login', login);

// POST /api/auth/register
router.post('/register', register);

router.get('/refresh', refreshToken);

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
