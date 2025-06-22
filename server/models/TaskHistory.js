const mongoose = require('mongoose');

const TaskHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  id: { type: String, required: true }, // frontend expects this
  text: { type: String, required: true },
  completed: { type: Boolean, required: true },
  completedBy: { type: String, default: null },
  completedAt: { type: Date, required: true },
  timeOfDay: { type: String, enum: ['morning', 'evening'], required: true },
});

module.exports = mongoose.model('TaskHistory', TaskHistorySchema);
