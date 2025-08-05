const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

exports.register = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: "Invalid input", 
      errors: errors.array() 
    });
  }

  const { email, password } = req.body;
  
  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ 
        message: "User with this email already exists" 
      });
    }

    // Create new user
    const user = await User.create({ email, password });
    const token = generateToken(user._id);
    
    res.status(201).json({ 
      token,
      message: "User registered successfully" 
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      message: "Server error during registration" 
    });
  }
};

exports.login = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: "Invalid input", 
      errors: errors.array() 
    });
  }

  const { email, password } = req.body;
  
  try {
    // Find user and verify password
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ 
        message: "Invalid email or password" 
      });
    }

    const token = generateToken(user._id);
    res.json({ 
      token,
      message: "Login successful" 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      message: "Server error during login" 
    });
  }
};