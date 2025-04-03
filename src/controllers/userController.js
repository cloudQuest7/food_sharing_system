const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.updateRole = async (req, res) => {
    try {
        const { userType } = req.body;
        const token = req.cookies.jwt;

        if (!token) {
            return res.redirect('/login');
        }

        // Verify token and get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Update user role
        await User.findByIdAndUpdate(decoded.userId, { userType });

        // Redirect based on role
        if (userType === 'donor') {
            res.redirect('/donor/dashboard');
        } else {
            res.redirect('/recipient/dashboard');
        }
    } catch (error) {
        console.error('Role update error:', error);
        res.redirect('/section');
    }
};