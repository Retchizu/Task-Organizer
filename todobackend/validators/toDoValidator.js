const expressValidator = require("express-validator");
const body = expressValidator.body;

const toDoValidator = [
  body("toDoLabel", "Task Label is empty").not().isEmpty(),
  body("userId", "User not found").not().isEmpty(),
];

module.exports = { toDoValidator };
