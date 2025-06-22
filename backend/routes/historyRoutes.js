const express = require("express");
const router = express.Router();
const History = require("../models/History");

// GET history for a user
router.get("/:email", async (req, res) => {
  try {
    const userHistory = await History.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(userHistory);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
