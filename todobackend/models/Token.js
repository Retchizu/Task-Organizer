const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: mongoose.SchemaTypes.Date,
    required: true,
  },
});

const invalidTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: mongoose.SchemaTypes.Date,
    required: true,
  },
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
const InvalidToken = mongoose.model("InvalidToken", invalidTokenSchema);

module.exports = {
  RefreshToken,
  InvalidToken,
};
