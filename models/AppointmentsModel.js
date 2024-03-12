const mongoose = require("mongoose");

const AppointmentsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    enum: ["Meeting", "Session", "meeting", "session"],
    required: true,
  },
  note: String,
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
});

module.exports = mongoose.model("Appointment", AppointmentsSchema);
