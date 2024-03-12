const mongoose = require("mongoose");

const pathientRequestsSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },

  {
    timestamps: true,
  }
);

pathientRequestsSchema.pre(/^find/, function (next) {
  this.populate({ path: "patient", select: "username" });
  next();
});

module.exports = mongoose.model("patientRequests", pathientRequestsSchema);
