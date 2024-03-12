const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  date: Date,
  startTime: Date,
  duration: Number,

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },

  rate: {
    type: Number,
  },
  waste: {
    type: Number,
    required: true,
  },
  fluid: {
    type: Number,
    required: true,
  },
  bloodTemperature: {
    type: Number,
    required: true,
  },
  bloodPressure: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
  },
  totalSessions: Number,
  completedSessions: Number,
  pointer: Number,
});

sessionSchema.pre(/^find/, function (next) {
  this.populate({ path: "patient", select: "username" });
  next();
});

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
