  GNU nano 8.6                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       server-starter.js
// ============================================================================
// SECURE LOGIN SYSTEM - STARTER CODE
// ============================================================================
// Your task: Complete the TODO sections to build a secure authentication system
//
// What you'll learn:
// - How to hash passwords securely with bcrypt
// - How to store users in MongoDB
// - How to validate user credentials
// - How to build signup and login endpoints
// ============================================================================

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ============================================================================
// STEP 1: Connect to MongoDB Database
// ============================================================================
mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connect to MongoDB")).catch((err) => console.error("MongoDB connection error", err));


// ============================================================================
// STEP 2: Define User Schema (Database Structure)
// ============================================================================
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema); 

// ============================================================================
// STEP 3: SIGNUP ROUTE - Create New User
// ============================================================================
// Endpoint: POST /signup
// Body: { "username": "tanay", "password": "hello123" }
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({error: "username and pass req"});
    }
    
    const existing = await User.findOne({ username });

    if (existing) {
      return res.status(400).json({error: "user already exists"});
    }
   
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    res.status(201).json({ message: "User created succesfully" });

  } catch (error) {
    // Error handling is provided for you
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================================
// STEP 4: LOGIN ROUTE - Authenticate User
// ============================================================================
// Endpoint: POST /login
// Body: { "username": "tanay", "password": "hello123" }
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username and pass are required" });
    }
    
    const user = await User.findOne ({ username });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    // TODO: Compare provided password with hashed password in database
    // - Use bcrypt.compare(password, user.password)
    // - Store result in a variable called 'valid'
    // - This returns true if passwords match, false otherwise
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({ message: "Login successful!" });

  } catch (error) {
    // Error handling is provided for you
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================================
// STEP 5: Start the Server
// ============================================================================
// TODO: Get port from environment variable or use 3000 as default
// Hint: Use process.env.PORT || 3000
const PORT = process.env.PORT || 3000;

   app.listen(PORT, ()=> {
     console.log(`Server running on http://localhost:${PORT}`);
   });

// ============================================================================
// TESTING YOUR CODE
// ============================================================================
// Once you complete all TODOs:
// 1. Run: npm start
// 2. Open test.html in your browser
// 3. Try signing up a new user
// 4. Try logging in with correct password (should succeed)
// 5. Try logging in with wrong password (should fail)
// ============================================================================

// ============================================================================
// SECURITY QUIZ (Answer these to check your understanding)
// ============================================================================
// Q1: Why do we hash passwords instead of storing them in plain text?
// A: To protect user passwords in case the database gets compromised / encryption

// Q2: Can you reverse a bcrypt hash to get the original password?
// A: No, cannot be reversed.

// Q3: What does the number 10 in bcrypt.hash(password, 10) mean?
// A: salt rounds. higher = slower but more secure

// Q4: Why do we use bcrypt.compare() instead of comparing strings directly?
// A: bc bcrypt hashes are unique and compare() does it securely

// Q5: What happens if two users have the same password?
// A: differnet hashes b/c bcrypt adds random salt
// ============================================================================
