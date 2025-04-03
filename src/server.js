require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

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
const userRoutes = require('./routes/auth');

// Use routes
app.use('/api/users', userRoutes);

// Auth routes
app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register - FoodShare'
    });
});

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login - FoodShare'
    });
});

app.use('/api/auth', require('./routes/auth'));

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

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: '404 - Page Not Found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Error',
        message: 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});