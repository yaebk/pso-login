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

// TODO: Load environment variables from .env file
// Hint: Use dotenv.config()
// YOUR CODE HERE
dotenv.config();

// TODO: Create Express application
// Hint: Use express()
const app = express();

// TODO: Add CORS middleware (allows test.html to work)
// Hint: Use app.use(cors())
// YOUR CODE HERE

app.use(cors());
// TODO: Add middleware to parse JSON request bodies
// Hint: Use app.use(express.json())
// YOUR CODE HERE
app.use(express.json());

// ============================================================================
// STEP 1: Connect to MongoDB Database
// ============================================================================
// TODO: Connect to MongoDB using mongoose.connect()
// - Use process.env.MONGO_URI for the connection string
// - Use .then() to log success message: "✅ Connected to MongoDB"
// - Use .catch() to log error message
// YOUR CODE HERE
mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connect to MongoDB")).catch((err) => console.error("MongoDB connection error", err));


// ============================================================================
// STEP 2: Define User Schema (Database Structure)
// ============================================================================
// TODO: Create a user schema with two fields:
// - username: type String, required: true, unique: true
// - password: type String, required: true
// Hint: Use new mongoose.Schema({ ... })
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// TODO: Create a User model from the schema
// Hint: Use mongoose.model("User", userSchema)
const User = mongoose.model("User", userSchema); // YOUR CODE HERE

// ============================================================================
// STEP 3: SIGNUP ROUTE - Create New User
// ============================================================================
// Endpoint: POST /signup
// Body: { "username": "tanay", "password": "hello123" }
app.post("/signup", async (req, res) => {
  try {
    // TODO: Extract username and password from req.body
    // Hint: Use destructuring: const { username, password } = req.body
    const { username, password } = req.body;

    // TODO: Validate that username and password are provided
    // If not, return status 400 with error: { error: "Username and password are required" }
    // Hint: Use if (!username || !password) { return res.status(400).json(...) }
    // YOUR CODE HERE

    if (!username || !password) {
      return res.status(400).json({error: "username and pass req"});
    }
    // TODO: Check if user already exists in database
    // Hint: Use User.findOne({ username })
    const existing = await User.findOne({ username });

    // TODO: If user exists, return status 400 with error: { error: "User already exists" }
    // YOUR CODE HERE

    if (existing) {
      return res.status(400).json({error: "user already exists"});
    }
    // TODO: Hash the password using bcrypt
    // - Use bcrypt.hash(password, 10)
    // - Store result in a variable called 'hashed'
    // - 10 is the number of salt rounds (good balance of security vs speed)
    const hashed = await bcrypt.hash(password, 10);

    // TODO: Create a new User object with username and hashed password
    // Hint: new User({ username, password: hashed })
    const user = new User({ username, password: hashed });

    // TODO: Save the user to the database
    // Hint: Use await user.save()
    // YOUR CODE HERE
    await user.save();

    // TODO: Return status 201 with success message: { message: "User created successfully" }
    // Hint: Use res.status(201).json({ ... })
    // YOUR CODE HERE
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
    // TODO: Extract username and password from req.body
    const { username, password } = req.body;

    // TODO: Validate that username and password are provided
    // If not, return status 400 with error: { error: "Username and password are required" }
    if (!username || !password) {
      return res.status(400).json({ error: "username and pass are required" });
    }
    // TODO: Find user in database by username
    // Hint: Use User.findOne({ username })
    const user = await User.findOne ({ username });

    // TODO: If user is not found, return status 400 with error: { error: "User not found" }
    // YOUR CODE HERE
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    // TODO: Compare provided password with hashed password in database
    // - Use bcrypt.compare(password, user.password)
    // - Store result in a variable called 'valid'
    // - This returns true if passwords match, false otherwise
    const valid = await bcrypt.compare(password, user.password);

    // TODO: If passwords don't match, return status 401 with error: { error: "Invalid password" }
    // YOUR CODE HERE
    if (!valid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    // TODO: If everything is valid, return success message: { message: "Login successful!" }
    // Hint: Use res.json({ ... })
    // YOUR CODE HERE
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

// TODO: Start the server using app.listen()
// - First argument: PORT
// - Second argument: callback function that logs:
//   " ~@ Server running on http://localhost:{PORT}"
// YOUR CODE HERE
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
