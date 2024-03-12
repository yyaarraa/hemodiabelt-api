const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctorModel");
const MedicalTest = require("../models/MedicalTest");

const ApiError = require("../utils/ApiError");

//TODO : Delete this function
exports.createMedicalTest = asyncHandler(async (req, res, next) => {
  const medicalTest = await MedicalTest.create(req.body);
  res.status(201).json(medicalTest);
});

// @desc    get all MedicalTests on patient
// @route   GET /api/v1/patients/:patientId/medicalTests
// @access  Protected
exports.getAllMedicalTestsOnSpecificPatient = asyncHandler(
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
    const medicalTest = await MedicalTest.find({
      patient: req.params.patientId,
    });
    res.status(200).json(medicalTest);
  }
);

// @desc    get specific MedicalTest on patient
// @route   GET /api/v1/medicalTests/:id
// @access  Protected
exports.getSpecificMedicalTestOnPatient = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.user._id);
  if (!doctor) {
    return next(new ApiError("doctor not found", 404));
  }
  const medicalTest = await MedicalTest.findById(req.params.id);
  if (!medicalTest) {
    return next(new ApiError("The medicalTest not found", 404));
  }
  if (!doctor.patients.includes(medicalTest.patient._id)) {
    return next(
      new ApiError("The patient not belong to you to access his medicalTest", 401)
    );
  }
  res.status(200).json(medicalTest);
});
