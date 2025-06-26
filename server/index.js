const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
require("dotenv").config();
require("./jobs/scheduler");
const sendPushNotifications = require('./jobs/scheduler');
const { SubscriptionModel } = require('./models/Subscription');
const webPush = require('web-push');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const subscriptionRoutes = require("./routes/subscription");
app.use("/api/subscription", subscriptionRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));


const historyRoutes = require('./routes/history');
app.use('/api/history', historyRoutes);

const reminderTimeRoutes = require('./routes/reminderTime');
app.use('/api/reminder-time', reminderTimeRoutes);


app.get('/api/test-push', async (req, res) => {
  const subs = await SubscriptionModel.find();
  for (const sub of subs) {
    try {
      await webPush.sendNotification(sub.subscription, JSON.stringify({
        title: "Routine Reminder",
        body: "You have incomplete tasks!",
        tag: "routine-reminder"
      }));
    } catch (err) {
      console.error("Push error:", err);
    }
  }
  res.send("Push sent");
});

app.post("/api/subscription/save", async (req, res) => {
  const subscription = req.body;
  console.log("Push subscription created", subscription);

  if (!subscription) {
    return res.status(400).json({ error: "No subscription found" });
  }

  await SubscriptionModel.create({ subscription });
  res.status(201).json({ message: "Saved" });
});

app.use(express.static(path.join(__dirname, '../dist'))); // or wherever your build is

// Catch-all route for SPA (must be after all other routes)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Push Notification Server running on port ${PORT}`);
});
