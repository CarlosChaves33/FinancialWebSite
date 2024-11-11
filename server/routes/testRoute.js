const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/test', async (req, res) => {
    try {
        // Check MongoDB connection state
        const dbState = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        res.json({ 
            message: 'Test route working!',
            database: states[dbState],
            mongodbUri: process.env.MONGO_URI ? 'MongoDB URI is set' : 'MongoDB URI is missing',
            environment: process.env.NODE_ENV
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
        });
    }
});

module.exports = router; 