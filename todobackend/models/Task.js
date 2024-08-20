const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  taskLabel: { type: String, required: true },
  taskDescription: { type: String, required: false },
  taskStatus: { type: String },
  taskDeadline: { type: mongoose.SchemaTypes.Date, required: false },
});

const Task = mongoose.model("ToDo", taskSchema);

module.exports = Task;
