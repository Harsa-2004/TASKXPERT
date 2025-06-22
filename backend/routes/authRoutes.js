// routes/authRoutes.js
const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
router.get("/me", protect, async (req, res) => {
  res.json(req.user); // will return user info if valid token provided
});

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
