const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register - ShareBites'
    });
});

router.post('/register', authController.register);

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login - ShareBites',
        registered: req.query.registered === 'true'
    });
});

router.post('/login', authController.login);

// Logout route
router.get('/logout', (req, res) => {
    // Clear the user session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/');
        }
        // Clear cookies if any
        res.clearCookie('connect.sid');
        
        // Redirect to the login page
        res.redirect('/login');
    });
});

module.exports = router;