const express = require('express');
const router = express.Router();
const ReminderTime = require('../models/ReminderTime');
const { scheduleJobs } = require('../jobs/scheduler');

// Get reminder times
router.get('/', async (req, res) => {
  let doc = await ReminderTime.findOne();
  if (!doc) doc = await ReminderTime.create({});
  res.json(doc);
});

// Update reminder times
router.post('/', async (req, res) => {
  const { morning, night } = req.body;

  // Expecting: morning = "HH:mm", night = "HH:mm"
  const [morningHour, morningMinute] = morning.split(':').map(Number);
  const [nightHour, nightMinute] = night.split(':').map(Number);

  // Upsert morning
  await ReminderTime.findOneAndUpdate(
    { timeOfDay: 'morning' },
    { hour: morningHour, minute: morningMinute, timeOfDay: 'morning' },
    { upsert: true, new: true }
  );
  // Upsert evening
  await ReminderTime.findOneAndUpdate(
    { timeOfDay: 'evening' },
    { hour: nightHour, minute: nightMinute, timeOfDay: 'evening' },
    { upsert: true, new: true }
  );

  await scheduleJobs();
  res.json({ success: true });
});

module.exports = router;