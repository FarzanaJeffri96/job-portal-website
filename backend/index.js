const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://admin:admin@cluster0.itd9d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Middleware
app.use(bodyParser.json());
// CORS Configuration
app.use(cors({
    origin: '*', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type']
}));
app.get('/test', (req, res) => {
    res.send('Backend is working');
});

// POST endpoint to save contact info
app.put('/api/contacts', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const contact = new Contact({ name, email, subject, message });
        await contact.save();
        res.status(200).send({ message: 'Contact saved successfully!' });
    } catch (err) {
        console.error('Error saving contact:', err);
        res.status(500).send('Server error.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
