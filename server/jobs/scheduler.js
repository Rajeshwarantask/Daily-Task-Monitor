const cron = require("node-cron");
const Subscription = require("../models/Subscription");
const webPush = require("../utils/webPush");
const ReminderTime = require("../models/ReminderTime");

let morningJob = null;
let nightJob = null;

const sendReminder = async () => {
  const subs = await Subscription.find();
  const payload = JSON.stringify({
    title: "Daily Reminder",
    body: "Please ensure all your tasks are completed!",
  });
  subs.forEach(async (sub) => {
    try {
      await webPush.sendNotification(sub.subscription, payload);
    } catch (err) {
      console.error("Failed to send notification", err);
    }
  });
};

const scheduleJobs = async () => {
  const morning = await ReminderTime.findOne({ timeOfDay: "morning" });
  const night = await ReminderTime.findOne({ timeOfDay: "evening" });

  // Use defaults if not set
  const morningHour = morning?.hour ?? 6;
  const morningMinute = morning?.minute ?? 30;
  const nightHour = night?.hour ?? 22;
  const nightMinute = night?.minute ?? 30;

  // Clear previous jobs
  if (morningJob) morningJob.stop();
  if (nightJob) nightJob.stop();

  // Log cron expressions for debugging
  console.log(`Scheduling morning: ${morningMinute} ${morningHour} * * *`);
  console.log(`Scheduling night: ${nightMinute} ${nightHour} * * *`);

  // Schedule new jobs
  morningJob = cron.schedule(
    `${morningMinute} ${morningHour} * * *`,
    sendReminder
  );
  nightJob = cron.schedule(`${nightMinute} ${nightHour} * * *`, sendReminder);
};

// Call once at startup
scheduleJobs();

// Export a function to reschedule (call this after updating times)
module.exports = { sendReminder, scheduleJobs };


