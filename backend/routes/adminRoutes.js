const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersControllers,
  getAllDoctorsControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController,
} = require("../controllers/adminC");

const router = express.Router();

// Get all registered users
router.get("/users", authMiddleware, getAllUsersControllers);

// Get all doctor registrations
router.get("/doctors", authMiddleware, getAllDoctorsControllers);

// Approve a doctor request
router.post("/approve-doctor", authMiddleware, getStatusApproveController);

// Reject a doctor request
router.post("/reject-doctor", authMiddleware, getStatusRejectController);

// Get all appointments (admin view)
router.get("/appointments", authMiddleware, displayAllAppointmentController);

module.exports = router;
