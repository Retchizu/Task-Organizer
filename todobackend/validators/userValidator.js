const expressValidator = require("express-validator");
const body = expressValidator.body;

const registerValidator = [
  body("email", "Email field is empty").not().isEmpty(),
  body("email", "Invalid email").isEmail(),
  body("password", "Password shoud be atleast 6 characters").isLength({
    min: 6,
  }),
  body("userName", "Username field is empty").not().isEmpty(),
];

const loginValidator = [
  body("email", "Email field is empty").not().isEmpty(),
  body("password", "Passowrd field is empty").not().isEmpty(),
];

exports.registerValidatorMiddleware = async (req, res, next) => {
  try {
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
  const error = expressValidator.validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(422)
      .json({ message: error.array().map((err) => err.msg) });
  }
  next();
};

exports.registerValidator = registerValidator;
exports.loginValidator = loginValidator;
