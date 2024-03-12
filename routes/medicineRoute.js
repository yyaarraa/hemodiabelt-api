const router = require("express").Router({ mergeParams: true });

const authServices = require("../services/authServices");

const {
  createMedicineOnSpecificPatient,
  getAllMedicineOnSpecificPatient,
  getSpecificMedicineOnPatient,
  updateMedicineOnPatient,
} = require("../services/medicineServices");

router.post(
  "/",
  authServices.protect,
  authServices.allowTo("doctor"),
  createMedicineOnSpecificPatient
);

router.get(
  "/",
  authServices.protect,
  authServices.allowTo("doctor"),
  getAllMedicineOnSpecificPatient
);

router.get(
  "/:id",
  authServices.protect,
  authServices.allowTo("doctor"),
  getSpecificMedicineOnPatient
);

router.put(
  "/:id",
  authServices.protect,
  authServices.allowTo("doctor"),
  updateMedicineOnPatient
);
module.exports = router;
