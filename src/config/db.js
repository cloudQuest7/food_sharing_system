const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        // Drop existing indexes to clean up any problematic ones
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.dropIndexes();
        }
        
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;