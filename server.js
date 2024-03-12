const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const dbConnection = require("./config/database");
const ApiError = require("./utils/ApiError");
const globalError = require("./middlewares/errorMiddleware");

const authRoute = require("./routes/authRoute");
const doctorInfoRoute = require("./routes/doctorInfoRoute");
const appointmentRoute = require("./routes/appointmentRoute");
const requestRoute = require("./routes/requestRoute");
const patientRoute = require("./routes/patientRoute");
const sessionRoute = require("./routes/sessionRoute");
const medicalTestRoute = require("./routes/medicalTestRoute");
const medicineRoute = require("./routes/medicineRoute");


dbConnection();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/doctor", doctorInfoRoute);
app.use("/api/v1/appointments", appointmentRoute);
app.use("/api/v1/requests", requestRoute);
app.use("/api/v1/patients", patientRoute);
app.use("/api/v1/sessions", sessionRoute);
app.use("/api/v1/sessions", sessionRoute);
app.use("/api/v1/medicaltests", medicalTestRoute);
app.use("/api/v1/medicine", medicineRoute);


// Handel unhandelling Routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't found this Route : ${req.originalUrl}`, 400));
});

// Global error handelling middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App Running on port ${PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.log(`unhandledRejection Error : ${error.name} | ${error.message}`);
  server.close(() => {
    console.error("Shutting down.... ");
    process.exit(1);
  });
});
