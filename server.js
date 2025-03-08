const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
    host: 'your-rds-endpoint',
    user: 'your-username',
    password: 'your-password',
    database: 'shivansh'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL!');
    }
});

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// **Serve static files (HTML, CSS, JS)**
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { first_name } = req.body;

    if (!first_name) {
        return res.status(400).send('First name is required');
    }

    db.query('INSERT INTO users (first_name) VALUES (?)', [first_name], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving to database');
        } else {
            res.send('Name added successfully!');
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
