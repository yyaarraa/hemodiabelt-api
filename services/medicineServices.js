const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctorModel");
const Medicine = require("../models/MedicineModel");

const ApiError = require("../utils/ApiError");

// @desc    create Medicine to patient
// @route   POST /api/v1/patients/:patientId/medicine
// @access  Protected
exports.createMedicineOnSpecificPatient = asyncHandler(
  async (req, res, next) => {
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
      return next(new ApiError("doctor not found", 404));
    }
    if (!doctor.patients.includes(req.params.patientId)) {
      return next(
        new ApiError(
          "the patient not belong to you to add medicine to him",
          401
        )
      );
    }
    const medicine = await Medicine.create({
      patient: req.params.patientId,
      medicineName: req.body.medicineName,
    });
    res.status(200).json(medicine);
  }
);

// @desc    get all Medicine on patient
// @route   GET /api/v1/patients/:patientId/medicine
// @access  Protected
exports.getAllMedicineOnSpecificPatient = asyncHandler(
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
    const medicine = await Medicine.find({
      patient: req.params.patientId,
    });
    res.status(200).json(medicine);
  }
);

// @desc    get specific Medicine on patient
// @route   GET /api/v1/medicine/:id
// @access  Protected
exports.getSpecificMedicineOnPatient = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.user._id);
  if (!doctor) {
    return next(new ApiError("doctor not found", 404));
  }
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    return next(new ApiError("The medicine not found", 404));
  }
  if (!doctor.patients.includes(medicine.patient._id)) {
    return next(
      new ApiError("The patient not belong to you to access his medicine", 401)
    );
  }
  res.status(200).json(medicine);
});

// @desc    update Medicine on patient
// @route   PUT /api/v1/medicine/:id
// @access  Protected
exports.updateMedicineOnPatient = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.user._id);
  if (!doctor) {
    return next(new ApiError("doctor not found", 404));
  }
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    return next(new ApiError("The medicine not found", 404));
  }
  if (!doctor.patients.includes(medicine.patient._id)) {
    return next(
      new ApiError("The patient not belong to you to access his medicine", 401)
    );
  }
  medicine.medicineName = req.body.medicineName || medicine.medicineName;
  const updatedMedicine = await medicine.save();
  res.status(200).json(updatedMedicine);
});
