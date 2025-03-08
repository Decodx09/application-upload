require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL!");
  }
});

app.post("/add-user", (req, res) => {
  const { first_name } = req.body;
  if (!first_name) return res.status(400).send("First name is required!");

  db.query("INSERT INTO users (first_name) VALUES (?)", [first_name], (err) => {
    if (err) return res.status(500).send(err.message);
    res.send("User added successfully!");
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
