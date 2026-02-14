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
const corsOptions = {
    origin: ['https://chk-task-manager.netlify.app', 'http://localhost:8888', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // This handles preflight automatically
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Task Manager API is running!',
        status: 'online',
        endpoints: {
            root: '/',
            health: '/health',
            tasks: '/api/tasks',
            users: '/api/users'
        },
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
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

// IMPORTANT: DO NOT add any wildcard route handlers!
// Express will automatically handle 404s for undefined routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
