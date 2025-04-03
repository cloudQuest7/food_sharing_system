const express = require('express');
const router = express.Router();

// Mock middleware for demonstration purposes
function isAuthenticated(req, res, next) {
    // In a real app, this would check session/JWT
    if (req.session && req.session.userId) {
        return next();
    }
    // For demo purposes, proceed anyway
    next();
}

// GET: Recipient Dashboard
router.get('/dashboard', isAuthenticated, (req, res) => {
    try {
        // Sample user data for demonstration
        const user = {
            _id: req.session?.userId || 'recipient123',
            name: req.session?.userName || 'Jane Smith',
            email: 'jane@example.com',
            role: 'recipient',
            location: '123 Main St, Anytown'
        };

        res.render('recipient/recipient_dashboard', { 
            user,
            pageTitle: 'Dashboard',
            requestCount: 0
        });
    } catch (error) {
        console.error('Error rendering recipient dashboard:', error);
        res.status(500).render('error', { message: 'Failed to load dashboard' });
    }
});

// GET: Browse Available Food
router.get('/browse', isAuthenticated, (req, res) => {
    try {
        // Get all available donations from localStorage (in a real app, from DB)
        // This would come from the donors' posted food
        const user = {
            _id: req.session?.userId || 'recipient123',
            name: req.session?.userName || 'Jane Smith',
            role: 'recipient'
        };

        // Here we would fetch available food from the database
        // For now, we'll use the sample data in the EJS template
        
        res.render('recipient/browse', { 
            user,
            pageTitle: 'Browse Food',
            availableDonations: [] // In the actual implementation this would have real data
        });
    } catch (error) {
        console.error('Error loading available food:', error);
        res.status(500).render('error', { message: 'Failed to load available food' });
    }
});

// GET: My Requests (View all requests made by this recipient)
router.get('/my-requests', isAuthenticated, (req, res) => {
    try {
        const user = {
            _id: req.session?.userId || 'recipient123',
            name: req.session?.userName || 'Jane Smith',
            role: 'recipient'
        };

        // For now we'll use the sample data in the EJS template
        // In a real implementation, we'd fetch from DB
        
        res.render('recipient/my-requests', { 
            user,
            pageTitle: 'My Requests',
            requestSubmitted: req.query.submitted === 'true'
        });
    } catch (error) {
        console.error('Error loading recipient requests:', error);
        res.status(500).render('error', { message: 'Failed to load your requests' });
    }
});

// GET: Make a request for a specific food item
router.get('/request/:foodId', isAuthenticated, (req, res) => {
    try {
        const { foodId } = req.params;
        const user = {
            _id: req.session?.userId || 'recipient123',
            name: req.session?.userName || 'Jane Smith',
            role: 'recipient'
        };

        // In a real app, we would fetch the food item details
        // based on the foodId parameter
        
        res.render('recipient/request', { 
            user,
            foodId,
            pageTitle: 'Request Food'
        });
    } catch (error) {
        console.error('Error loading request form:', error);
        res.status(500).render('error', { message: 'Failed to load request form' });
    }
});

// POST: Submit a food request
router.post('/submit-request', isAuthenticated, (req, res) => {
    try {
        const { foodId, quantity, pickupTime, notes } = req.body;
        
        // In a real app, we would save this request to the database
        // and notify the donor
        
        console.log('Food request submitted:', {
            foodId,
            quantity,
            pickupTime,
            notes,
            recipientId: req.session?.userId || 'recipient123',
            recipientName: req.session?.userName || 'Jane Smith'
        });
        
        // Redirect to my-requests page with a success parameter
        res.redirect('/recipient/my-requests?submitted=true');
    } catch (error) {
        console.error('Error submitting food request:', error);
        res.status(500).render('error', { message: 'Failed to submit your request' });
    }
});

// GET: View recipient profile
router.get('/profile', isAuthenticated, (req, res) => {
    try {
        const user = {
            _id: req.session?.userId || 'recipient123',
            name: req.session?.userName || 'Jane Smith',
            email: 'jane@example.com',
            phone: '555-123-4567',
            role: 'recipient',
            location: '123 Main St, Anytown',
            joinDate: new Date('2023-06-15')
        };
        
        res.render('recipient/profile', { 
            user,
            pageTitle: 'My Profile'
        });
    } catch (error) {
        console.error('Error loading profile:', error);
        res.status(500).render('error', { message: 'Failed to load profile' });
    }
});

module.exports = router;