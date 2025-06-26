const mongoose = require('mongoose');

const reminderTimeSchema = new mongoose.Schema({
  hour: Number,
  minute: Number,
  timeOfDay: {
    type: String,
    enum: ['morning', 'evening'],
    required: true
  }
});

module.exports = mongoose.model('ReminderTime', reminderTimeSchema);
