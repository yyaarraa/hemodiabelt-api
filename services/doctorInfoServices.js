const asyncHandler = require("express-async-handler");

const Doctor = require("../models/doctorModel");

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
  const { name, ID, location, experience, age } = myData;
  res.status(200).json({ "Account Info": { name, ID, location, experience, age } });
});
