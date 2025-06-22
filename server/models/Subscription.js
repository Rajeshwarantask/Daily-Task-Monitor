const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  subscription: Object,
  userName: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);

