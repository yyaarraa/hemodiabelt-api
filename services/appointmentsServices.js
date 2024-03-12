const asyncHandler = require("express-async-handler");
const moment = require("moment");

const ApiError = require("../utils/ApiError");
const Appointment = require("../models/AppointmentsModel");

// @desc    Create Appointment
// @route   PUT /api/v1/appointments
// @access  Private/protected
exports.createAppointment = asyncHandler(async (req, res, next) => {
  const { date, startTime, endTime, category, note } = req.body;

  // Combine date and time, then convert to moment objects
  const startDateTime = moment(`${date} ${startTime}`, "DD MMMM YYYY hh:mm A");
  const endDateTime = moment(`${date} ${endTime}`, "DD MMMM YYYY hh:mm A");

  // Check if the appointment date is in the future
  if (startDateTime.isSameOrBefore(moment(), "minute")) {
    return res.status(400).json({ error: "Invalid appointment date or time" });
  }

  // Check if the time slot is already scheduled
  const existingSchedule = await Appointment.find({
    doctor: req.user._id,
    date,
    $or: [
      {
        startTime: { $gte: startDateTime.toDate() },
        endTime: { $lte: endDateTime.toDate() },
      },
      {
        startTime: { $lte: startDateTime.toDate() },
        endTime: { $gte: endDateTime.toDate() },
      },
    ],
  });
  if (existingSchedule.length > 0) {
    return res.status(400).json({ error: "Time slot already scheduled" });
  }

  // Create a new schedule
  const newSchedule = new Appointment({
    date,
    startTime: startDateTime.toDate(),
    endTime: endDateTime.toDate(),
    doctor: req.user._id,
    category,
    note,
  });

  // Save the schedule to the database
  await newSchedule.save();

  res.json({ message: "Schedule created successfully", newSchedule });
});

// @desc    Get all Upcoming Appointment (Upcoming)
// @route   PUT /api/v1/appointments/myappointments
// @access  Private/protected
exports.getAppointmentsForDoctor = asyncHandler(async (req, res, next) => {
  try {
    // Get the current time
    const currentTime = moment();

    // Fetch all appointments for the specified doctorId
    const appointments = await Appointment.find({
      doctor: req.user._id,
      startTime: { $gt: currentTime.toDate() },
    }).sort({ date: 1, startTime: 1 });

    // Format the results as required
    const formattedAppointments = appointments.map((appointment) => ({
      // date: moment(appointment.date).format("YYYY-MM-DD"),
      date: moment(appointment.date).format("DD MMMM YYYY"), // "MMMM" gives the full month name
      startTime: moment(appointment.startTime).format("h:mm A"),
      endTime: moment(appointment.endTime).format("h:mm A"),
      category: appointment.category,
      Note: appointment.note,
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc    Get all Upcoming Appointment (Past)
// @route   PUT /api/v1/appointments/mypastappointments
// @access  Private/protected
exports.getPastAppointmentsForDoctor = asyncHandler(async (req, res, next) => {
  try {
    // Get the current time
    const currentTime = moment();

    // Fetch all appointments for the specified doctorId
    const appointments = await Appointment.find({
      doctor: req.user._id,
      startTime: { $lt: currentTime.toDate() },
    });

    // Format the results as required
    const formattedAppointments = appointments.map((appointment) => ({
      // date: moment(appointment.date).format("YYYY-MM-DD"),
      date: moment(appointment.date).format("DD MMMM YYYY"), // "MMMM" gives the full month name
      startTime: moment(appointment.startTime).format("h:mm A"),
      endTime: moment(appointment.endTime).format("h:mm A"),
      category: appointment.category,
      Note: appointment.note,
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @desc    Delete Appointment
// @route   DELETE /api/v1/appointments/cancelappointment/:id
// @access  Private/protected
exports.deleteAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(
      new ApiError(`No appointment found with id ${req.params.id}`, 404)
    );
  }

  // Make sure appointment belongs to doctor
  if (appointment.doctor.toString() !== req.user._id.toString()) {
    return next(
      new ApiError(
        `Appointment ${req.params.id} does not belong to the doctor ${req.user._id}`,
        401
      )
    );
  }

  await Appointment.findByIdAndRemove(req.params.id);
  res.status(204).json();
});
