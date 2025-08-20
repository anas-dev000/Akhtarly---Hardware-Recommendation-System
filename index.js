const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const globalErrorHandler = require("./middlewares/globalErrorhandler");
const ApiError = require("./Utils/apiError");
const cpuRouter = require("./routers/cpuRouter");
const gpuRouter = require("./routers/gpuRouter");
const programRouter = require("./routers/programRouter");
const authRoutes = require("./routers/userRouter");

dotenv.config({ path: "./config.env" });

// Connect to the database
function connectToDatabase() {
  mongoose
    .connect(process.env.connect_url)
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((error) => {
      console.log("Error connecting to the database:", error);
    });
}


connectToDatabase();
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Using routes
app.use("/api/gpus/", gpuRouter);
app.use("/api/cpus/", cpuRouter);
app.use("/api/programs/", programRouter);
app.use("/auth", authRoutes); // Use the userRouter for authentication routes

app.all("*", (req, res, next) => {
  return next(new ApiError(`Can't find ${req.url}`, 404));
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

