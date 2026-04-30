const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Application = require('./models/Application');
const MainCv = require('./models/MainCv');
const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const multer = require('multer');

const uri = 'mongodb://localhost:27017/CV-Optimizer';

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    }
});
const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => cb(null, file.mimetype === 'application/pdf')
});

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
}

connect();
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR, {
    setHeaders: (res) => res.setHeader('Content-Disposition', 'attachment'),
}));

app.post('/apply', upload.single('cv'), async (req, res) => {
    const { companyName, link, title } = req.body;
    try {
        const cvUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        const application = new Application({ companyName, link, title, cvUrl });
        await application.save();
        res.status(201).json(application);

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
});

app.get('/view', async (req, res) => {
    const applications = await Application.find();
    res.json(applications);
});

app.get('/view/:id', async (req, res) => {
    const application = await Application.findById(req.params.id);
    res.json(application);
});

app.delete('/view/:id/delete', async (req, res) => {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (application?.cvUrl) {
        const filePath = path.join(UPLOADS_DIR, path.basename(application.cvUrl));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    return res.status(200).json({ message: 'Deleted Successfully' });
});

app.post('/main-cv', upload.single('cv'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });
    try {
        const existing = await MainCv.findOne();
        if (existing?.cvUrl) {
            const oldPath = path.join(UPLOADS_DIR, path.basename(existing.cvUrl));
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        const cvUrl = `/uploads/${req.file.filename}`;
        if (existing) {
            existing.cvUrl = cvUrl;
            existing.updatedAt = new Date();
            await existing.save();
            return res.json(existing);
        }
        const mainCv = new MainCv({ cvUrl });
        await mainCv.save();
        res.status(201).json(mainCv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/main-cv', async (_req, res) => {
    const mainCv = await MainCv.findOne();
    res.json(mainCv ?? null);
});


app.listen(8080, () => {
    console.log('Server running on port 8080');
});
