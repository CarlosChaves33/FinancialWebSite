const express = require('express');
const router = express.Router();

// Placeholder routes for now
router.get('/', (req, res) => {
    res.json({ message: 'Get reports' });
});

module.exports = router; 