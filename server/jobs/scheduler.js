const cron = require("node-cron");
const Subscription = require("../models/Subscription");
const webPush = require("../utils/webPush");

const sendReminder = async () => {
  const subs = await Subscription.find();

  const payload = JSON.stringify({
    title: "Daily Reminder",
    body: "Please ensure all your tasks are completed!",
  });

  subs.forEach(async (sub) => {
    try {
      await webPush.sendNotification(sub.subscription, payload); // <-- FIXED
    } catch (err) {
      console.error("Failed to send notification", err);
    }
  });
};

// Run at 6:30 AM and 10:30 PM daily
cron.schedule("30 6,22 * * *", () => {
  console.log("Running scheduled task");
  sendReminder();
});

module.exports = sendReminder;


