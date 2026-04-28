require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const mongoose = require('mongoose');
const Application = require('./models/Application');
const express = require('express')
const cors = require('cors')
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const uri = 'mongodb://localhost:27017/CV-Optimizer';
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'raw', folder: 'cv-optimizer' },
            (error, result) => { if (error) return reject(error); resolve(result); }
        );
        stream.end(buffer);
    });
}

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
    const { companyName, link, title } = req.body;
    try {
        let cvUrl;
        if (req.file?.buffer) {
            const result = await uploadToCloudinary(req.file.buffer);
            cvUrl = result.secure_url;
        }
        const application = new Application({
            companyName,
            link,
            title,
            cvUrl,
        });
        await application.save();
        res.status(201).json(application);

        // Fetch job content in the background after responding
        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(link, { waitUntil: 'networkidle2', timeout: 15000 });
            const html = await page.content();
            await browser.close();

            const $ = cheerio.load(html);
            $('script, style, nav, header, footer').remove();
            const text = $('body').text().replace(/\s+/g, ' ').trim();
            console.log(`Job content fetched for "${title}" at ${link}:\n`, text.slice(0, 500));
        } catch (fetchError) {
            console.error('Failed to fetch job content:', fetchError.message);
        }
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


