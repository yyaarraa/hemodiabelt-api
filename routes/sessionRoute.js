const router = require("express").Router({ mergeParams: true });

const authServices = require("../services/authServices");
const {
  createSession,
  getAllSessionsOnSpecificPatient,
  getSpecificSessionOnPatient,
} = require("../services/sessionsServices");

// TODO Delete this route
router.post(
  "/",
  authServices.protect,
  authServices.allowTo("doctor"),
  createSession
);

router.get(
  "/",
  authServices.protect,
  authServices.allowTo("doctor"),
  getAllSessionsOnSpecificPatient
);

router.get(
  "/:id",
  authServices.protect,
  authServices.allowTo("doctor"),
  getSpecificSessionOnPatient
);
module.exports = router;
