const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Email validator - reusable for both routes
const emailValidator = body("email")
  .isEmail()
  .withMessage("Email must be valid")
  .normalizeEmail()
  .isLength({ max: 254 })
  .withMessage("Email is too long");

// Password validator for registration
const passwordValidator = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters")
  .matches(/[A-Za-z]/)
  .withMessage("Password must include at least one letter")
  .matches(/\d/)
  .withMessage("Password must include at least one number")
  .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
  .withMessage("Password must include at least one special character")
  .trim()
  .escape();

// Login password validator (less strict for existing users)
const loginPasswordValidator = body("password")
  .notEmpty()
  .withMessage("Password is required")
  .trim()
  .escape();

// Routes with validation middleware
router.post("/register", [emailValidator, passwordValidator], register);
router.post("/login", [emailValidator, loginPasswordValidator], login);

module.exports = router;