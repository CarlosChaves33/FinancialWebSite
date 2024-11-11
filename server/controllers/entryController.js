const Entry = require('../models/Entry');

// @desc    Get user entries
// @route   GET /api/entries
// @access  Private
const getEntries = async (req, res) => {
    try {
        const entries = await Entry.find({ user: req.user.id });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new entry
// @route   POST /api/entries
// @access  Private
const createEntry = async (req, res) => {
    try {
        const { type, amount, category, description, date } = req.body;

        if (!type || !amount || !category || !description) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const entry = await Entry.create({
            user: req.user.id,
            type,
            amount,
            category,
            description,
            date: date || Date.now()
        });

        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update entry
// @route   PUT /api/entries/:id
// @access  Private
const updateEntry = async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Check if user owns entry
        if (entry.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedEntry = await Entry.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedEntry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete entry
// @route   DELETE /api/entries/:id
// @access  Private
const deleteEntry = async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Check if user owns entry
        if (entry.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await entry.deleteOne();
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEntries,
    createEntry,
    updateEntry,
    deleteEntry
}; 