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

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/entries', require('./routes/entryRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Handle SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/index.html'));
});

app.listen(config.SERVER.PORT, config.SERVER.HOST, () => {
    console.log(`Server running on ${config.SERVER.HOST}:${config.SERVER.PORT}`);
}); 