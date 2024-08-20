const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validator = require("../validators/userValidator");
const {
  validatorMiddleware,
  validateToken,
} = require("../middleware/middleware");

router.post(
  "/register",
  validator.registerValidator,
  validatorMiddleware,
  userController.registerUser
);

router.post(
  "/login",
  validator.loginValidator,
  validatorMiddleware,
  userController.loginUser
);

router.get("/current", validateToken, userController.currentUser);

router.post("/refresh-token", userController.refreshToken);

router.get("/logout", validateToken, userController.logout);
module.exports = router;
