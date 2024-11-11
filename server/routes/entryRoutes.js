const express = require('express');
const router = express.Router();
const {
    getEntries,
    createEntry,
    updateEntry,
    deleteEntry
} = require('../controllers/entryController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

router.route('/')
    .get(getEntries)
    .post(createEntry);

router.route('/:id')
    .put(updateEntry)
    .delete(deleteEntry);

module.exports = router; 