const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
//Routes
const ordersRouter = require("./Api/routes/orders");
const productsRouter = require("./Api/routes/products");

app.use(morgan("dev")); //middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// app.use((req, res, next) => {
//     res.status(200).json({ "Message": "Its works !!"})
// }); //1

mongoose
  .connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,

    useCreateIndex: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

app.use("/orders", ordersRouter);
app.use("/products", productsRouter);

app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Original", "*");
  ReadableStream.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT",
      "POSt",
      "PATCH",
      "DELETE",
      "GET"
    );
    return res.status(200).json({});
  }
  next();
});

module.exports = app;
