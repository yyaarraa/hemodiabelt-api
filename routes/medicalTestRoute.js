const router = require("express").Router({ mergeParams: true });

const authServices = require("../services/authServices");
const {
  createMedicalTest,
  getAllMedicalTestsOnSpecificPatient,
  getSpecificMedicalTestOnPatient,
} = require("../services/medicalTestServices");

// TODO Delete this route
router.post(
  "/",
  authServices.protect,
  authServices.allowTo("doctor"),
  createMedicalTest
);

router.get(
  "/",
  authServices.protect,
  authServices.allowTo("doctor"),
  getAllMedicalTestsOnSpecificPatient
);

router.get(
  "/:id",
  authServices.protect,
  authServices.allowTo("doctor"),
  getSpecificMedicalTestOnPatient
);
module.exports = router;
