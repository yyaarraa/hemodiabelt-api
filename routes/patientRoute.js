const router = require("express").Router({ mergeParams: true });

const sessionRoute = require("./sessionRoute");
const medicalTestRoute = require("./medicalTestRoute");
const medicineRoute = require("./medicineRoute");

const authServices = require("../services/authServices");
const { getSpecificPatient } = require("../services/patientsServices");

router.use("/:patientId/sessions", sessionRoute);

router.use("/:patientId/medicaltests", medicalTestRoute);

router.use("/:patientId/medicine", medicineRoute);

router.get(
  "/:id",
  authServices.protect,
  authServices.allowTo("doctor"),
  getSpecificPatient
);

module.exports = router;
