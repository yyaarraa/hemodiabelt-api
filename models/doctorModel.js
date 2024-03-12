const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name required"],
    minLength: [3, "Too short user name"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "email Required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password required"],
    minLength: [8, "Too short password"],
  },
  phone: String,
  ID: String,
  location: String,
  experience: Number,
  profileImg: String,

  role: {
    type: String,
    default: "doctor",
  },
  isVerifiredID: {
    type: Boolean,
    default: false,
  },

  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  }],

  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
});

DoctorSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 12);
  next();
});

module.exports = mongoose.model("Doctor", DoctorSchema);
