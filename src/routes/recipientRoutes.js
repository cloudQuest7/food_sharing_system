const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Donation = require('../models/Donation');

// Middleware to check if user is authenticated and is a recipient
const isRecipient = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.userType !== 'recipient') {
            return res.redirect('/section');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.redirect('/login');
    }
};

// Available donations page
router.get('/available-donations', isRecipient, async (req, res) => {
    try {
        // Get donations that are pending and in the recipient's location
        const availableDonations = await Donation.find({
            status: 'pending',
            pickupLocation: req.user.location
        }).sort({ createdAt: -1 });

        res.render('recipient/available_donations', {
            title: 'Available Donations - ShareBites',
            user: req.user,
            availableDonations
        });
    } catch (error) {
        console.error('Error fetching available donations:', error);
        res.status(500).render('error', {
            message: 'Error loading available donations'
        });
    }
});

// Request a donation
router.post('/api/donations/:id/request', isRecipient, async (req, res) => {
    try {
        const donationId = req.params.id;
        const recipientId = req.user._id;

        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        if (donation.status !== 'pending') {
            return res.status(400).json({ message: 'Donation is no longer available' });
        }

        // Update donation status and add recipient
        donation.status = 'accepted';
        donation.recipient = recipientId;
        await donation.save();

        // Award points to donor
        const donor = await User.findById(donation.donor);
        donor.points += 10; // 10 points for accepted donation
        await donor.save();

        res.json({ message: 'Donation requested successfully' });
    } catch (error) {
        console.error('Error requesting donation:', error);
        res.status(500).json({ message: 'Error requesting donation' });
    }
});

// My requests page
router.get('/my-requests', isRecipient, async (req, res) => {
    try {
        const myRequests = await Donation.find({
            recipient: req.user._id
        }).sort({ createdAt: -1 });

        res.render('recipient/my_requests', {
            title: 'My Requests - ShareBites',
            user: req.user,
            requests: myRequests
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).render('error', {
            message: 'Error loading requests'
        });
    }
});

module.exports = router;