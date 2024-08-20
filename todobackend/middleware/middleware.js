const expressValidator = require("express-validator");
const { InvalidToken } = require("../models/Token");
const jwt = require("jsonwebtoken");

const validatorMiddleware = async (req, res, next) => {
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

const validateToken = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return res.status(401).json({ message: "Access Token not found" });
  }

  const isTokenInvalid = await InvalidToken.findOne({ accessToken });
  if (isTokenInvalid) {
    return res.status(401).json({ message: "Invalid Token" });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESSTOKEN_SECRET);
    req.user = { id: decoded.userId };
    req.accessToken = { value: accessToken, exp: decoded.exp };

    next();
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { validatorMiddleware, validateToken };
