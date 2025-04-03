const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated and is a donor
const isDonor = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.userType !== 'donor') {
            return res.redirect('/section');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.redirect('/login');
    }
};

// Donor dashboard route
router.get('/dashboard', isDonor, async (req, res) => {
    try {
        console.log('Rendering donor dashboard for user:', req.user.name);
        console.log('Views directory:', req.app.get('views')); // Debug log
        res.render('donor/donor_dashboard', {
            title: 'Donor Dashboard - ShareBites',
            user: req.user
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('error', {
            message: 'Error loading dashboard'
        });
    }
});

// Request page route
router.get('/requests', isDonor, async (req, res) => {
    try {
        console.log('Rendering requests page for user:', req.user.name);
        res.render('donor/request', {
            title: 'View Requests - ShareBites',
            user: req.user
        });
    } catch (error) {
        console.error('Request page error:', error);
        res.status(500).render('error', {
            message: 'Error loading requests'
        });
    }
});

// Profile page route
router.get('/profile', isDonor, async (req, res) => {
    try {
        console.log('Rendering profile page for user:', req.user.name);
        res.render('donor/profile', {
            title: 'Profile Settings - ShareBites',
            user: req.user
        });
    } catch (error) {
        console.error('Profile page error:', error);
        res.status(500).render('error', {
            message: 'Error loading profile'
        });
    }
});

module.exports = router;