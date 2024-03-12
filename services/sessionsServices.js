const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctorModel");
const Session = require("../models/Session");

const ApiError = require("../utils/ApiError");

//TODO : Delete this function
exports.createSession = asyncHandler(async (req, res, next) => {
  const request = await Session.create(req.body);
  res.status(201).json(request);
});

// @desc    get all sessions on patient
// @route   GET /api/v1/patients/:patientId/sessions
// @access  Protected
exports.getAllSessionsOnSpecificPatient = asyncHandler(
  async (req, res, next) => {
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
      return next(new ApiError("doctor not found", 404));
    }
    if (!doctor.patients.includes(req.params.patientId)) {
      return next(
        new ApiError("the patient not belong to you to access it", 401)
      );
    }
    const sessions = await Session.find({ patient: req.params.patientId });
    res.status(200).json(sessions);
  }
);

// @desc    get specific session on patient
// @route   GET /api/v1/sessions/:id
// @access  Protected
exports.getSpecificSessionOnPatient = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.user._id);
  if (!doctor) {
    return next(new ApiError("doctor not found", 404));
  }
  const session = await Session.findById(req.params.id);
  if (!session) {
    return next(new ApiError("The session not found", 404));
  }
  if (!doctor.patients.includes(session.patient._id)) {
    return next(
      new ApiError("The patient not belong to you to access his session", 401)
    );
  }
  res.status(200).json(session);
});
