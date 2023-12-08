const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

const db = mysql.createConnection({
  host: "localhost",
  user: "lifecycles",
  password: "password",
  database: "tomato",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL");
});

// route to Register a new user
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Check if the user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error registering user" });
    } else if (results.length > 0) {
      res.status(400).json({ error: "User already exists" });
    } else {
      const user = { email, password };

      db.query("INSERT INTO users SET ?", user, (err, result) => {
        if (err) {
          res.status(500).json({ error: "Error registering user" });
        } else {
          res.status(200).json({ message: "User registered successfully" });
        }
      });
    }
  });
});

// route to login a user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error authenticating user" });
    } else if (results.length === 0) {
      res.status(401).json({ error: "Incorrect email or password" });
    } else {
      const user = {
        id: results[0].id,
        email: results[0].email,
      };
      res.status(200).json({ message: "Login successful", user: user });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
