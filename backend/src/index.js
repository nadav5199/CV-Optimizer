const mongoose = require('mongoose');
const Application = require('./models/Application');
const express = require('express')
const cors = require('cors')
const uri = 'mongodb://localhost:27017/CV-Optimizer';
const multer = require('multer');

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
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

app.post('/apply',upload.single('cv') ,async (req, res) => {
    const { companyName, description, title } = req.body;
    const cv = req.file?.buffer
    try {
        const application = new Application({
            companyName,
            description,
            title,
            cv,
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

app.get('/view/:id',async (req, res) => {
    const id = req.params.id;
    const application = await Application.findById(id)
    res.json(application)
})

app.delete('/view/:id/delete',  async (req, res) => {
    const id = req.params.id;
    const application = await Application.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Deleted Succefully'});
})

app.listen(8080, () => {
    console.log('Server running on port 8080')
})


