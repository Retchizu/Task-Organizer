const Notification = require("../models/Notification");

const { ObjectId } = require("mongoose");

exports.storeNotification = async (req, res) => {
  try {
    const { userId, taskId, notificationMessage, isRead } = req.body;

    const notification = await Notification.create({
      userId: userId,
      taskId: taskId,
      notificationMessage: notificationMessage,
      isRead: isRead,
    });

    return res.status(201).json(notification);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
    });

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete({
      _id: notificationId,
      userId: req.user.id,
    });

    return res.status(200).json(deletedNotification);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateReadStatus = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { isRead } = req.body;

    const notification = await Notification.findByIdAndUpdate(
      { _id: notificationId },
      {
        isRead: isRead,
      }
    );

    const updatedNotification = await Notification.findById({
      _id: notification._id,
    });

    return res.status(200).json(updatedNotification);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
