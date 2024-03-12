const asyncHandler = require("express-async-handler");

const Doctor = require("../models/doctorModel");
const Patient = require("../models/Patient");

// @desc    Get Logged doctor
// @route   get /api/v1/doctor/getMe
// @access  Private/protected
exports.getLoggedDoctor = asyncHandler(async (req, res, next) => {
  const myData = await Doctor.findById(req.user._id);
  res.status(200).json(myData);
});

// @desc    Get Logged doctor Privacy
// @route   get /api/v1/doctor/getMe/privacy
// @access  Private/protected
exports.getLoggedDoctorPrivacy = asyncHandler(async (req, res, next) => {
  const myData = await Doctor.findById(req.user._id);
  const { email, phone, password } = myData;
  res.status(200).json({ privacy: { email, phone, password } });
});

// @desc    Get Logged doctor Account Info
// @route   get /api/v1/doctor/getMe/accountinfo
// @access  Private/protected
exports.getLoggedDoctorAccountInfo = asyncHandler(async (req, res, next) => {
  const myData = await Doctor.findById(req.user._id);
  const { name, ID, location, experience } = myData;
  res.status(200).json({ "Account Info": { name, ID, location, experience } });
});

// @desc    Get Patients of Logged doctor
// @route   get /api/v1/doctor/myPatients
// @access  Private/protected
exports.getMyPatients = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.user._id).populate("patients");

  if (!doctor) {
    return next(new ApiError("Doctor not found", 404));
  }

  res.status(200).json(doctor.patients);
});

//TODO : Delete this function
exports.addpatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.create(req.body);
  res.status(200).json(patient);
});
