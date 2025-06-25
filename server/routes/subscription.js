const express = require("express");
const router = express.Router();
const TaskHistory = require("../models/TaskHistory");

// Save a completed task
router.post("/save", async (req, res) => {
  const { userId, task, completedAt } = req.body;
  await TaskHistory.create({ userId, task, completedAt });
  res.status(201).json({ message: "History saved" });
});

// Fetch history for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const history = await TaskHistory.find({ userId });
  res.json(history);
});

module.exports = router;
