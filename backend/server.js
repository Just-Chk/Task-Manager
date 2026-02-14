const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

const app = express();

// Check if MONGODB_URI is defined
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env file');
    process.exit(1);
}

// Middleware
app.use(cors({
    origin: ['http://localhost:5000', 'https://your-frontend.netlify.app'], // Add your Netlify URL after deployment
    credentials: true
}));
app.use(express.json());

// Serve frontend only in development - in production, frontend is on Netlify
if (process.env.NODE_ENV !== 'production') {
    app.use(express.static(path.join(__dirname, '../frontend')));
    
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/login.html'));
    });

    app.get('/dashboard', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
    });
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});