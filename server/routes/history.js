const express = require("express");
const router = express.Router();
const TaskHistory = require("../models/TaskHistory");

// GET /api/history/:userId/:date
router.get("/:userId/:date", async (req, res) => {
  const { userId, date } = req.params;
  const startOfDay = new Date(`${date}T00:00:00.000Z`);
  const endOfDay = new Date(`${date}T23:59:59.999Z`);

  const tasks = await TaskHistory.find({
    userId,
    completedAt: { $gte: startOfDay, $lte: endOfDay },
  });

  res.json(tasks);
});

// POST /api/history/save
router.post("/save", async (req, res) => {
  const { userId, task, completedAt } = req.body;
  await TaskHistory.create({ userId, task, completedAt });
  res.status(201).json({ message: "History saved" });
});

// GET /api/history/user/:userId
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const history = await TaskHistory.find({ userId });
  res.json(history);
});

module.exports = router;