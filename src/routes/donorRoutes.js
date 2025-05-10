const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Donation = require('../models/Donation');

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
        
        res.render('donor/requests', { 
            user: req.user,
            title: 'Donation Requests - ShareBites'
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).send('Error fetching requests');
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

// Donation page route
router.get('/donation', isDonor, async (req, res) => {
    try {
        console.log('Rendering donation page for user:', req.user.name);
        
        // Get user's donations
        const donations = await Donation.find({ donor: req.user._id })
            .sort({ createdAt: -1 });

        // Get user with points
        const user = await User.findById(req.user._id);

        res.render('donor/donation', {
            title: 'My Donations - ShareBites',
            user: user,
            donations: donations,
            userPoints: user.points || 0
        });
    } catch (error) {
        console.error('Donation page error:', error);
        res.status(500).render('error', {
            message: 'Error loading donations'
        });
    }
});

// Submit donation route
router.post('/submit-donation', isDonor, async (req, res) => {
    try {
        console.log('Processing donation submission from user:', req.user.name);
        console.log('Donation data:', req.body);
        
        // In a real app, you would save the donation to the database here
        // For demo purposes, we're just sending a success response
        
        res.status(200).json({
            success: true,
            message: 'Donation submitted successfully'
        });
    } catch (error) {
        console.error('Donation submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting donation'
        });
    }
});

// Post Food page route
router.get('/post-food', isDonor, async (req, res) => {
    try {
        console.log('Rendering post food page for user:', req.user.name);
        res.render('donor/post_food', {
            title: 'Post Food - ShareBites',
            user: req.user
        });
    } catch (error) {
        console.error('Post food page error:', error);
        res.status(500).render('error', {
            message: 'Error loading post food page'
        });
    }
});

// Create donation route
router.post('/create-donation', isDonor, async (req, res) => {
    try {
        const { foodType, quantity, expiryDate, pickupLocation, description } = req.body;
        
        // Create new donation
        const donation = await Donation.create({
            donor: req.user._id,
            foodType,
            quantity,
            expiryDate,
            pickupLocation,
            description,
            status: 'pending'
        });

        console.log('New donation created:', donation);
        res.redirect('/donor/donation');
    } catch (error) {
        console.error('Error creating donation:', error);
        res.status(500).render('error', {
            message: 'Error creating donation'
        });
    }
});

// Create donation page route
router.get('/create-donation', isDonor, async (req, res) => {
    try {
        res.render('donor/create_donation', {
            title: 'Create Donation - ShareBites',
            user: req.user
        });
    } catch (error) {
        console.error('Error loading create donation page:', error);
        res.status(500).render('error', {
            message: 'Error loading create donation page'
        });
    }
});

// Route to mark a donation as completed
router.post('/api/donations/:id/complete', isDonor, async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        
        if (donation.donor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        if (donation.status !== 'accepted') {
            return res.status(400).json({ message: 'Donation must be accepted first' });
        }
        
        // Update donation status
        donation.status = 'completed';
        await donation.save();
        
        // Award points to the donor
        const donor = await User.findById(req.user._id);
        donor.points += 100; // Award 100 points for completing a donation
        await donor.save();
        
        res.json({ message: 'Donation marked as completed', points: donor.points });
    } catch (error) {
        console.error('Error completing donation:', error);
        res.status(500).json({ message: 'Error completing donation' });
    }
});

module.exports = router;