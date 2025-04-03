const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.updateRole = async (req, res) => {
    try {
        const { userType } = req.body;
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.redirect('/login');
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.redirect('/login');
        }
        
        user.userType = userType;
        await user.save();
        
        if (userType === 'donor') {
            return res.redirect('/donor/dashboard');
        } else if (userType === 'recipient') {
            return res.redirect('/recipient/dashboard');
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        console.error('Update role error:', error);
        res.redirect('/login');
    }
};