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
app.use(cors());
app.use(express.json());

// Root route - THIS IS IMPORTANT FOR RENDER
app.get('/', (req, res) => {
    res.json({ 
        message: 'Task Manager API is running!',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is healthy' });
});

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

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        message: 'Route not found', 
        path: req.originalUrl,
        availableEndpoints: ['/', '/health', '/api/tasks', '/api/users']
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
