require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const config = require('./config/config');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/entries', require('./routes/entryRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/test', require('./routes/testRoute'));

// Serve HTML files
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dashboard.html'));
});

app.get('/entries', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/entries.html'));
});

app.get('/reports', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/reports.html'));
});

// Default route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = config.SERVER.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 