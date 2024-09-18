const express = require("express");
const userRouter = require("./routes/userRouter");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/tansactionRouter");
const cors = require("cors");
const app = express();
const URI =
  "mongodb+srv://sjorasiya665:sjorasiya665@cluster0.qq8dv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/mern-expenses";

//! Connect to mongoDb
mongoose
  .connect(URI)
  .then(() => console.log("connected to db"))
  .catch((e) => console.log(e));

//!Cors Configuratin
const corsOptions = { origin: ["https://moneytrail.vercel.app"] };
app.use(cors(corsOptions));

//!Middlewares
app.use(express.json());
//!Routes
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", transactionRouter);

//!Error
app.use(errorHandler);
//!Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
