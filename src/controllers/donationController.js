const User = require('../models/User');
const Donation = require('../models/Donation');

// Create a new donation
exports.createDonation = async (req, res) => {
    try {
        const { foodType, quantity, expiryDate, pickupLocation, description } = req.body;
        const donorId = req.user._id; // Assuming user is attached to req by auth middleware

        const donation = await Donation.create({
            donor: donorId,
            foodType,
            quantity,
            expiryDate,
            pickupLocation,
            description,
            status: 'pending'
        });

        res.redirect('/donor/donation');
    } catch (error) {
        console.error('Error creating donation:', error);
        res.status(500).render('error', {
            message: 'Error creating donation'
        });
    }
};

// Accept a donation
exports.acceptDonation = async (req, res) => {
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

        // Update donation status
        donation.status = 'accepted';
        donation.recipient = recipientId;
        await donation.save();

        // Award points to donor (10 points per donation)
        const donor = await User.findById(donation.donor);
        donor.points += 10;
        await donor.save();

        res.redirect('/recipient/available-donations');
    } catch (error) {
        console.error('Error accepting donation:', error);
        res.status(500).json({ message: 'Error accepting donation' });
    }
};

// Mark donation as completed
exports.completeDonation = async (req, res) => {
    try {
        const donationId = req.params.id;

        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        if (donation.status !== 'accepted') {
            return res.status(400).json({ message: 'Donation must be accepted first' });
        }

        donation.status = 'completed';
        await donation.save();

        // Additional points for completed donation (optional)
        const donor = await User.findById(donation.donor);
        donor.points += 5; // Extra 5 points for completed donation
        await donor.save();

        res.redirect('/donor/donation');
    } catch (error) {
        console.error('Error completing donation:', error);
        res.status(500).json({ message: 'Error completing donation' });
    }
};

// Get donor's donations with points
exports.getDonorDonations = async (req, res) => {
    try {
        const donorId = req.user._id;
        const user = await User.findById(donorId);
        const donations = await Donation.find({ donor: donorId })
            .sort({ createdAt: -1 });

        res.render('donor/donation', {
            donations,
            userPoints: user.points,
            title: 'My Donations'
        });
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).render('error', {
            message: 'Error fetching donations'
        });
    }
}; 