const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/CV-Optimizer';

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
}

connect();
