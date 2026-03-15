const mongoose = require('mongoose');
const Application = require('./models/Application');
const express = require('express')
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
const app = express()

app.listen(8080, () => {
    console.log('Server running on port 8080')
})


