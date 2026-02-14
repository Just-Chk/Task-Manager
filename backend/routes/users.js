const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => 
{
    try 
    {
        const { username, email, password } = req.body;
        
        // Validate input
        if (!username || !email || !password) 
        {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Check if user exists
        const existingUser = await User.findOne
        ({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) 
        {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const user = new User
        ({
            username,
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        // Generate token
        const token = jwt.sign
        (
            { userId: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '7d' }
        );
        
        res.status(201).json
        ({
            token,
            userId: user._id,
            username: user.username
        });
        
    } 
    
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => 
{
    try 
    {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) 
        {
            return res.status(400).json({ message: 'Email and password required' });
        }
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) 
        {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) 
        {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Generate token
        const token = jwt.sign
        (
            { userId: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '7d' }
        );
        
        res.json
        ({
            token,
            userId: user._id,
            username: user.username
        });
        
    } 
    
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;