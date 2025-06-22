const express = require("express");
const router = express.Router();
const TaskHistory = require("../models/TaskHistory");

// GET /api/history/:userId/:date (date in YYYY-MM-DD)
router.get("/:userId/:date", async (req, res) => {
  const { userId, date } = req.params;

  try {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const tasks = await TaskHistory.find({
      userId,
      completedAt: { $gte: startOfDay, $lte: endOfDay }
    });

    res.json(tasks);
  } catch (err) {
    console.error("❌ Error fetching task history:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
