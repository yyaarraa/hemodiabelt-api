const {
  getLoggedDoctor,
  getLoggedDoctorPrivacy,
  getLoggedDoctorAccountInfo,
  addpatient,
  getMyPatients,
} = require("../services/doctorInfoServices");

const router = require("express").Router();

const authServices = require("../services/authServices");

router.get("/getMe", authServices.protect,authServices.allowTo("doctor"), getLoggedDoctor);
router.get("/getMe/privacy", authServices.protect,authServices.allowTo("doctor"), getLoggedDoctorPrivacy);
router.get(
  "/getMe/accountinfo",
  authServices.protect,
  getLoggedDoctorAccountInfo
);
router.get(
  "/myPatients",
  authServices.protect,
  authServices.allowTo("doctor"),
  getMyPatients
);
//TODO : Delete this route
router.post("/add", addpatient);

module.exports = router;
