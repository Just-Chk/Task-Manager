const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => 
{
    const token = req.header('x-auth-token');
    
    console.log('Auth middleware - Token received:', token ? 'Yes' : 'No');
    
    if (!token) 
    {
        console.log('Auth middleware - No token provided');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    try 
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        console.log('Auth middleware - Token verified for user:', decoded.userId);
        req.userId = decoded.userId;
        next();
    } 
    
    catch (error) 
    {
        console.log('Auth middleware - Token invalid:', error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};