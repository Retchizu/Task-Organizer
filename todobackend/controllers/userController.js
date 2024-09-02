const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { RefreshToken, InvalidToken } = require("../models/Token");

const parseDuration = (duration) => {
  const match = duration.match(/(\d+)([dhms])/);
  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "d":
      return value * 24 * 60 * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "m":
      return value * 60 * 1000;
    case "s":
      return value * 1000;
    default:
      return 0;
  }
};

const refreshTokenExpiration = "1h";
const accessTokenExpiration = "10m";

exports.registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: "Email is already in used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "inavlid email or password" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_ACCESSTOKEN_SECRET,
      {
        subject: "AccessApi",
        expiresIn: accessTokenExpiration,
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_REFRESHTOKEN_SECRET,
      {
        subject: "RefreshToken",
        expiresIn: refreshTokenExpiration,
      }
    );

    await RefreshToken.create({
      userId: user._id,
      refreshToken,
      expirationTime: new Date(
        Date.now() + parseDuration(refreshTokenExpiration)
      ),
    });

    return res.status(200).json({
      id: user._id,
      userName: user.userName,
      email: user.email,
      accessToken,
      refreshToken,
    });
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

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    return res.status(200).json({
      id: user._id,
      userName: user.userName,
      email: user.email,
      displayPicture: user.displayPicture,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Empty Token" });
  }
  if (await InvalidToken.findOne({ token: refreshToken })) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESHTOKEN_SECRET
    );
    const storedRefreshToken = await RefreshToken.findOne({
      userId: decodedRefreshToken.userId,
      refreshToken: refreshToken,
    });

    if (!storedRefreshToken) {
      return res.status(401).json({ message: "Token not found" });
    }

    const newAccessToken = jwt.sign(
      { userId: decodedRefreshToken.userId },
      process.env.JWT_ACCESSTOKEN_SECRET,
      {
        subject: "AccessApi",
        expiresIn: accessTokenExpiration,
      }
    );
    const newRefreshToken = jwt.sign(
      { userId: decodedRefreshToken.userId },
      process.env.JWT_REFRESHTOKEN_SECRET,
      { subject: "RefreshToken", expiresIn: refreshTokenExpiration }
    );

    await RefreshToken.findOneAndUpdate(
      { userId: decodedRefreshToken.userId },
      {
        refreshToken: newRefreshToken,
        expirationTime: new Date(
          Date.now() + parseDuration(refreshTokenExpiration)
        ),
      }
    );

    await InvalidToken.create({
      userId: decodedRefreshToken.userId,
      token: refreshToken,
      expirationTime: storedRefreshToken.expirationTime,
    });
    return res.status(200).json({
      newAccessToken,
      newRefreshToken,
    });
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    return res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await RefreshToken.findOneAndDelete({ userId: req.user.id });
    console.log(req.accessToken.exp);
    await InvalidToken.create({
      token: req.accessToken.value,
      expirationTime: new Date(req.accessToken.exp),
      userId: req.user.id,
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteExpiredToken = async () => {
  const currentTime = new Date();
  try {
    const invalidAccessTokenResult = await InvalidToken.deleteMany({
      expirationTime: { $lt: currentTime },
    });

    const invalidRefreshTokenResult = await RefreshToken.deleteMany({
      expirationTime: { $lt: currentTime },
    });

    console.log(
      "expired tokens cleaned\n",
      invalidAccessTokenResult,
      invalidRefreshTokenResult
    );
  } catch (error) {
    console.log(error.message);
  }
};

exports.updateUserProfilePicture = async (req, res) => {
  try {
    const { displayPicture } = req.body;
    await User.findByIdAndUpdate(
      { _id: req.user.id },
      {
        displayPicture: displayPicture,
      }
    );
    const updatedUser = await User.findById({ _id: req.user.id });
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
