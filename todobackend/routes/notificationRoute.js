const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/middleware");
const notificatiionController = require("../controllers/notificationController");

router.post(
  "/store-notification",
  validateToken,
  notificatiionController.storeNotification
);

router.get(
  "/get-notification",
  validateToken,
  notificatiionController.getNotification
);

router.delete(
  "/delete-notification",
  validateToken,
  notificatiionController.deleteNotification
);

router.put(
  "/update-status/:id",
  validateToken,
  notificatiionController.updateReadStatus
);

module.exports = router;
