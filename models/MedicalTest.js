const mongoose = require("mongoose");

const medicalTestSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },

  testName: {
    type: String,
  },
  testDate: {
    type: Date,
    required: true,
  },
  testTime: {
    type: String,
    required: true,
  },
  testType: {
    type: String, // "Photo" or "File"
  },
  testData: {
    type: String, // Field to store the photo or file data
  },
});

medicalTestSchema.pre(/^find/, function (next) {
  this.populate({ path: "patient", select: "username" })
  next();
});

const MedicalTest = mongoose.model("MedicalTest", medicalTestSchema);
module.exports = MedicalTest;
