const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const { taskLabel, taskDescription, taskDeadline } = req.body;

    const task = await Task.create({
      userId: req.user.id,
      taskLabel,
      ...(taskDescription && { taskDescription }),
      ...(taskDeadline && { taskDeadline }),
      taskStatus: "ongoing",
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.id,
    });

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete({
      _id: id,
      userId: req.user.id,
    });

    return res.status(200).json(deletedTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskLabel, taskDescription, taskStatus, taskDeadline } = req.body;
    await Task.findByIdAndUpdate(
      { _id: id, userId: req.user.id },
      {
        ...(taskLabel && { taskLabel }),
        ...(taskDescription && { taskDescription }),
        ...(taskStatus && { taskStatus }),
        ...(taskDeadline && { taskDeadline }),
      }
    );
    const updatedTask = await Task.findById({ _id: id, userId: req.user.id });
    return res.status(201).json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
