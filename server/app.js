require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("./config/logger.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { STARTED_LISTENING } = require("./utils/constants/logger-messages");
var localStorage = require("./utils/local-storage");

// Routes
const indexRouter = require("./routes/index");
// const userRouter = require('./routes/user');
// const projectRouter = require('./routes/project');
// const activityRouter = require('./routes/activity');
// const patientRouter = require('./routes/patient');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// For MongoDB - https://www.npmjs.com/package/connect-mongo

app.use("/api/", indexRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  app.emit("app_started");
  logger.info(STARTED_LISTENING(PORT));
});

module.exports = app;