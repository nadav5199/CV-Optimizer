const mongoose = require('mongoose');
const Application = require('./models/Application');
const express = require('express')
const cors = require('cors')
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
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

app.post('/apply', async (req, res) => {
    const { companyName, description, title } = req.body;
    try {
        const application = new Application({
            companyName,
            description,
            title,
        });
        await application.save();
        res.status(201).json(application);
    } catch (error) {
        console.error('Error saving application:', error);
        res.status(400).json({ error: error.message });
    }
})

app.get('/view',async (req, res) => {
    const applications = await Application.find()
    res.json(applications)
})

app.listen(8080, () => {
    console.log('Server running on port 8080')
})


