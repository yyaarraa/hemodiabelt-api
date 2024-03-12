const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctorModel");
const Request = require("../models/Patient'sRequests");

const ApiError = require("../utils/ApiError");

 //TODO : Delete this function 
exports.sendRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.create(req.body);
  res.status(201).json(request);
});

// @desc    Get All Patient's Requests (pendind)
// @route   get /api/v1/requests/mypatientrequests
// @access  Private/protected
exports.getMyPendingPatientRequests = asyncHandler(async (req, res, next) => {
  const requests = await Request.find({
    doctor: req.user._id,
    status: "pending",
  });
  res.status(200).json(requests);
});

// @desc    Get All Patient's Requests (pendind)
// @route   get /api/v1/requests/mypatientrequests
// @access  Private/protected
exports.getMyAllPatientRequests = asyncHandler(async (req, res, next) => {
  const requests = await Request.find({ doctor: req.user._id });
  res.status(200).json(requests);
});

// @desc    Accept Request
// @route   put /api/v1/requests/:requestid
// @access  Private/protected
exports.acceptRequest = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await Request.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    }).session(session);

    if (!request) {
      return next(
        new ApiError(
          "There is no request, or this request does not belong to this doctor",
          400
        )
      );
    }

    const acceptedRequest = await Request.findByIdAndUpdate(
      request._id,
      { status: "accepted" },
      { new: true, session }
    );

    if (!acceptedRequest || acceptedRequest.status !== "accepted") {
      return next(new ApiError("There is an error", 400));
    }

    const doctor = await Doctor.findById(acceptedRequest.doctor._id).session(
      session
    );

    if (!doctor) {
      return next(new ApiError("Doctor not found", 404));
    }

    // Check if the patient already belongs to the doctor
    if (doctor.patients.includes(acceptedRequest.patient._id)) {
      return res.status(200).json({
        status: "success",
        message: "Patient already in the doctor",
        patients: doctor.patients,
      });
    }

    // Add user to doctor's patients array
    const updatedDoctor = await Doctor.updateOne(
      { _id: acceptedRequest.doctor._id }, // Use acceptedRequest.doctor._id instead of req.params.id
      { $addToSet: { patients: acceptedRequest.patient._id } }
    ).session(session);

    // Check if the update to the doctor was successful
    if (updatedDoctor.nModified === 0) {
      throw new Error("Failed to update the doctor. Please try again later.");
    }

    // Commit the transaction
    await session.commitTransaction();

    // User added to the doctor's patients successfully
    res.status(200).json({
      status: "success",
      message: "Patient added to the doctor",
      doctor: doctor.patients,
    });
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    return next(new ApiError("Transaction failed", 500));
  } finally {
    // End the session
    session.endSession();
  }
});

// reject reuest
// @desc    Reject Request
// @route   put /api/v1/requests/rejectrequest/:id
// @access  Private/protected
exports.rejectRequest = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await Request.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    }).session(session);

    if (!request) {
      return next(
        new ApiError(
          "There is no request, or this request does not belong to this doctor",
          400
        )
      );
    }

    const rejectedRequest = await Request.findByIdAndUpdate(
      request._id,
      { status: "rejected" },
      { new: true, session }
    );

    if (!rejectedRequest || rejectedRequest.status !== "rejected") {
      return next(new ApiError("There is an error", 400));
    }

    // Commit the transaction
    await session.commitTransaction();

    // User added to the doctor's patients successfully
    res.status(200).json({
      status: "success",
      message: "Request rejected",
    });
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    return next(new ApiError("Transaction failed", 500));
  } finally {
    // End the session
    session.endSession();
  }
});
