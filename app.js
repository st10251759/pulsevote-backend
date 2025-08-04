const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
 
dotenv.config();
 
const app = express();
 
// Middleware
app.use(helmet());
app.use(cors({
  origin: "https://localhost:5173", // Your frontend URL
  credentials: true
}));
app.use(express.json());


// Routes
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");
 
app.use("/api/auth", authRoutes);
 
app.get('/', (req, res) => {
  res.send('PulseVote API running!');
});
 
app.get('/test', (req, res) => {
  res.json({
    message: 'This is a test endpoint from PulseVote API!',
    status: 'success',
    timestamp: new Date()
  });
});
 
// Protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}! You have accessed protected data.`,
    timestamp: new Date()
  });
});
 
module.exports = app;
 