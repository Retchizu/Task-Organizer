const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/middleware");
const toDoController = require("../controllers/toDoController");
const { toDoValidator } = require("../validators/toDoValidator");

router.post(
  "/create-task",
  validateToken,
  toDoValidator,
  toDoController.createTask
);

router.get("/get-task", validateToken, toDoController.getTask);

router.delete("/delete-task/:id", validateToken, toDoController.deleteTask);

router.put("/update-task/:id", validateToken, toDoController.updateTask);

module.exports = router;
