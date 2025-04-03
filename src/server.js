require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

// Connect to MongoDB
connectDB();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable CSP temporarily for development
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const authController = require('./controllers/authController');

// Auth routes
app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register - ShareBites',
        error: null
    });
});

app.post('/register', authController.register);

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login - ShareBites',
        error: null,
        registered: req.query.registered === 'true'
    });
});

app.post('/login', authController.login);

// Section route
app.get('/section', (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            console.log('No token found');
            return res.redirect('/login');
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log('Invalid token');
                return res.redirect('/login');
            }
            
            console.log('Rendering section page');
            res.render('section', {
                title: 'Choose Your Role - ShareBites'
            });
        });
    } catch (error) {
        console.error('Section route error:', error);
        res.redirect('/login');
    }
});

// Landing page route
app.get('/', (req, res) => {
    try {
        res.render('landing', {
            title: 'FoodShare - Share More, Waste Less'
        });
    } catch (err) {
        console.error('Rendering error:', err);
        res.status(500).send('Error rendering page');
    }
});

// Add this before your other error handlers
app.use((req, res, next) => {
    console.log('404 - Not Found:', req.originalUrl);
    res.status(404).render('404', {
        title: '404 - Not Found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).render('error', {
        title: 'Error',
        message: err.message || 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));