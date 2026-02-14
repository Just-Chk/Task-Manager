const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Apply auth middleware to all task routes
router.use(auth);

// Get all tasks for user
router.get('/', async (req, res) => 
{
    try 
    {
        console.log('Getting tasks for user:', req.userId);
        
        const { category, sortBy = 'createdAt', order = 'desc' } = req.query;
        const query = { userId: req.userId };
        
        if (category && category !== 'All' && category !== 'all') 
        {
            query.category = category;
        }
        
        const sortOrder = order === 'desc' ? -1 : 1;
        const tasks = await Task.find(query).sort({ [sortBy]: sortOrder });
        
        console.log(`Found ${tasks.length} tasks for user ${req.userId}`);
        res.json(tasks);
    } 
    
    catch (error) 
    {
        console.error('Error getting tasks:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create task
router.post('/', async (req, res) => 
{
    try 
    {
        console.log('Creating task for user:', req.userId);
        console.log('Task data:', req.body);
        
        const { title, category } = req.body;
        
        if (!title) 
        {
            return res.status(400).json({ message: 'Task title is required' });
        }
        
        const task = new Task
        ({
            title,
            category: category || 'Personal',
            userId: req.userId
        });
        
        await task.save();
        console.log('Task created:', task._id);
        res.status(201).json(task);
    } 
    
    catch (error) 
    {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update task
router.put('/:id', async (req, res) => 
{
    try 
    {
        console.log('Updating task:', req.params.id, 'for user:', req.userId);
        
        const { title, category, completed } = req.body;
        
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        if (title !== undefined) task.title = title;
        if (category !== undefined) task.category = category;
        if (completed !== undefined) task.completed = completed;
        
        await task.save();
        console.log('Task updated:', task._id);
        res.json(task);
    } 
    
    catch (error) 
    {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => 
{
    try 
    {
        console.log('Deleting task:', req.params.id, 'for user:', req.userId);
        
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!task) 
        {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        console.log('Task deleted:', req.params.id);
        res.json({ message: 'Task deleted' });
    } 
    
    catch (error) 
    {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;