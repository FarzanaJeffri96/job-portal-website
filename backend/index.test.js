// app.test.js

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import the app from the main file
const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type']
}));

app.get('/test', (req, res) => {
    res.send('Backend is working');
});

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

beforeAll(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    // Clear the test database and close the connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('API Endpoints', () => {
    it('should respond with a message from /test endpoint', async () => {
        const response = await request(app).get('/test');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Backend is working');
    });

    it('should save contact info and respond with success', async () => {
        const response = await request(app)
            .put('/api/contacts')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                subject: 'Test Subject',
                message: 'Test Message'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Contact saved successfully!');
    });

    it('should return 400 for missing fields', async () => {
        const response = await request(app)
            .put('/api/contacts')
            .send({
                name: 'John Doe'
                // Missing other fields
            });
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('All fields are required.');
    });
});
