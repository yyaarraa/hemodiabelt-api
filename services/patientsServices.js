const asyncHandler = require("express-async-handler");

const Doctor = require("../models/doctorModel");
const Patient = require("../models/Patient");
const ApiError = require("../utils/ApiError");

// @desc    Get specific patient to doctor
// @route   get /api/v1/patients/:id
// @access  Private/protected
exports.getSpecificPatient = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const doctor = await Doctor.findById(req.user._id);
  if (!doctor) {
    return next(new ApiError("doctor not found", 404));
  }
  if (!doctor.patients.includes(id)) {
    return next(
      new ApiError("the patient not belong to you to access it", 401)
    );
  }
  const patient = await Patient.findById(id)
    .populate("sessions")
    .populate("medicalTests")
    .populate("medicines");
  res.status(200).json({ message: "success", patient });
});
