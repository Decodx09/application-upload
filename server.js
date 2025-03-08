const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL!');
    }
});

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
