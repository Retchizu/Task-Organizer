const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/toDoRoute");
const notificationRoute = require("./routes/notificationRoute");
const cron = require("node-cron");
const userController = require("./controllers/userController");

app.use(express.json({ limit: "50mb" }));

mongoose
  .connect(process.env.MONGO_URI)
  .catch((error) => console.log(error.message));

const db = mongoose.connection;

db.on("error", (error) => console.log(error.message));
db.once("open", () => {
  try {
    console.log("connected to mongoDB");
    app.listen(port, () => {
      console.log(`Connected to port ${port}`);
    });
  } catch (error) {
    console.log(error.message);
  }
});

cron.schedule("0 * * * *", userController.deleteExpiredToken); // runs every one hour change later

app.use("/users", userRoute);
app.use("/task", taskRoute);
app.use("/notification", notificationRoute);
