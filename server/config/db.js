const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        if (error.message.includes('bad auth')) {
            console.error('Please check your MongoDB username and password in .env file');
        }
        process.exit(1);
    }
};

module.exports = connectDB; 