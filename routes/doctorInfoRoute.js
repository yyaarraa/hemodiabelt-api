const {
  getLoggedDoctor,
  getLoggedDoctorPrivacy,
  getLoggedDoctorAccountInfo,
} = require("../services/doctorInfoServices");

const router = require("express").Router();

const authServices = require("../services/authServices");

router.get("/getMe", authServices.protect, getLoggedDoctor);
router.get("/getMe/privacy", authServices.protect, getLoggedDoctorPrivacy);
router.get(
  "/getMe/accountinfo",
  authServices.protect,
  getLoggedDoctorAccountInfo
);

module.exports = router;
