require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("./config/logger.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { STARTED_LISTENING } = require("./utils/constants/logger-messages");
// var localStorage = require("./utils/local-storage");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
const indexRouter = require("./routes/index");
const financialRouter = require("./routes/financial");
const inventoryRouter = require("./routes/inventory");
const productsRouter = require("./routes/products");
const purchasesRouter = require("./routes/purchases");
const salesRouter = require("./routes/sales");
const overviewRouter = require("./routes/overview");

app.use("/api/", indexRouter);
app.use("/api/financial/", financialRouter);
app.use("/api/inventory/", inventoryRouter);
app.use("/api/product/", productsRouter);
app.use("/api/purchases/", purchasesRouter);
app.use("/api/sales/", salesRouter);
app.use("/api/overview/", overviewRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  app.emit("app_started");
  logger.info(STARTED_LISTENING(PORT));
});

module.exports = app;
