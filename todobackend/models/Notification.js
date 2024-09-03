const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  taskId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  notificationMessage: { type: String, required: true },
  isRead: { type: Boolean, default: false, required: true },
  createdAt: { type: Date, required: true },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
