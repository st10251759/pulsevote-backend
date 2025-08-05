const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
 
dotenv.config();
 
const app = express();
 
// First apply basic helmet middleware
app.use(helmet());

// Then apply specific CSP configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://localhost:5000", "https://localhost:5173"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
    reportOnly: false, // Set to true for testing, false for enforcement
  })
);

// CORS configuration
app.use(cors({
  origin: "https://localhost:5173", // Your frontend URL
  credentials: true
}));

// Body parser middleware
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

// CSP violation reporting endpoint (optional but useful for monitoring)
app.post('/csp-violation-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  console.log('CSP Violation:', req.body);
  res.status(204).end();
});
 
module.exports = app;