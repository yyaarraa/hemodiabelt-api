const router = require("express").Router();

const authServices = require("../services/authServices");
const {
  sendRequest,
  getMyPendingPatientRequests,
  getMyAllPatientRequests,
  acceptRequest,
  rejectRequest,
} = require("../services/requestsServices");

router.post("/", sendRequest);

router.get(
  "/mypendingpatientrequests",
  authServices.protect,
  authServices.allowTo("doctor"),
  getMyPendingPatientRequests
);

router.get(
  "/myallpatientrequests",
  authServices.protect,
  authServices.allowTo("doctor"),
  getMyAllPatientRequests
);

router.put(
  "/acceptrequest/:id",
  authServices.protect,
  authServices.allowTo("doctor"),
  acceptRequest
);

router.put(
  "/rejectrequest/:id",
  authServices.protect,
  authServices.allowTo("doctor"),
  rejectRequest
);

module.exports = router;
