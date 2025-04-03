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

module.exports = router;