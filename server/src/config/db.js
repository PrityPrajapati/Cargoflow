const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/projectv');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        console.warn('Backend is continuing to run but database services may be unavailable.');
        // For Render: do not exit process so service stays up to serve health checks
    }
};

module.exports = connectDB;
