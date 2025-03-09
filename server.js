const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', (req, res) => {
    const { first_name } = req.body;
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (!first_name) {
        return res.status(400).json({ error: 'First name is required' });
    }

    db.query('INSERT INTO users (first_name) VALUES (?)', [first_name], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error saving to database' });
        } else {
            console.log(`Received name: ${first_name} from IP: ${clientIp}`);
            res.json({ message: 'Name added successfully!', ip: clientIp });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
