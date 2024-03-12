const router = require("express").Router();
const {
  createAppointment,
  getAppointmentsForDoctor,
  getPastAppointmentsForDoctor,
  deleteAppointment,
} = require("../services/appointmentsServices");
const authServices = require("../services/authServices");

router.post(
  "/",
  authServices.protect,
  authServices.allowTo("doctor"),
  createAppointment
);
router.get(
  "/myappointments",
  authServices.protect,
  authServices.allowTo("doctor"),
  getAppointmentsForDoctor
);

router.get(
  "/mypastappointments",
  authServices.protect,
  authServices.allowTo("doctor"),
  getPastAppointmentsForDoctor
);

router.delete(
  "/cancelappointment/:id",
  authServices.protect,
  authServices.allowTo("doctor"),
  deleteAppointment
);

module.exports = router;
