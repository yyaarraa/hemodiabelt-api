const crypto = require("crypto"); // to rest password
const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const patientSchema = new mongoose.Schema(
  {
    //properties
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [128, "Password must be less than 128 characters long"],
      validate: {
        validator: function (value) {
          // Require at least one uppercase letter, one lowercase letter, one special character and one number
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/;
          return regex.test(value);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
      },
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    countryCode: {
      type: Number,
      required: true,
      maxlength: 4,
    },
    mobileNumber: {
      type: String,
      required: true,
      maxlength: 11,
    },
    age: {
      type: Number,
      required: true,
      // ageValue --> age
      validate(ageValue) {
        if (ageValue <= 0) {
          throw new Error("Age must be positive number");
        }
      },
    },
    gender: {
      type: String,
      required: true,
    },
    barcode: {
      type: Number,
      required: true,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
    },
    pressure: {
      type: Number,
    },
    temperature: {
      type: Number,
    },
    sufferedFromDisease: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hashing Password
patientSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 8);
  }
});

//////////////////////////////////////////////////////////////////////////////////
patientSchema.virtual("sessions", {
  ref: "Session",
  foreignField: "patient",
  localField: "_id",
});
patientSchema.virtual("medicalTests", {
  ref: "MedicalTest",
  foreignField: "patient",
  localField: "_id",
});

patientSchema.virtual("medicines", {
  ref: "Medicine",
  foreignField: "patient",
  localField: "_id",
});

// Increment login count when user logs in
patientSchema.methods.incrementLoginCount = function () {
  this.loginCount += 1;
  return this.save();
};

patientSchema.statics.findByToken = function (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.findOne({ _id: decoded._id });
  } catch (err) {
    throw new Error(`Error verifying token: ${err.message}`);
  }
};

patientSchema.methods.generateToken = function () {
  // create token
  // console.log(this)
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
  return token;
};

// Generate and hash password token
patientSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex"); // generate some random data

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 + 1000;
  return resetToken;
};

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
