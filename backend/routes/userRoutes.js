const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer({ dest: 'uploads/' }); // Handles file uploads

// Controllers
const {
  registerController,
  loginController,
  authController,
  docController,
  deleteallnotificationController,
  getallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController,
  downloadDocController,
} = require("../controllers/userC");

// Middleware
const authMiddleware = require("../middlewares/authMiddleware");

// ---------- Public Routes ----------
router.post("/register", registerController);      // User registration
router.post("/login", loginController);            // User login

// ---------- Authenticated Routes ----------
router.post("/getuserdata", authMiddleware, authController);  // Get current user data
router.post("/registerdoc", authMiddleware, docController);   // Doctor registration
router.get("/getalldoctorsu", authMiddleware, getAllDoctorsControllers); // All doctors for users
router.post("/getappointment", upload.single("image"), authMiddleware, appointmentController); // Book appointment with image
router.post("/getallnotification", authMiddleware, getallnotificationController);
router.post("/deleteallnotification", authMiddleware, deleteallnotificationController);
router.get("/getuserappointments", authMiddleware, getAllUserAppointments); // User appointments
router.get("/getDocsforuser", authMiddleware, getDocsController); // View uploaded docs

// [Optional] If this is implemented:
// router.get("/downloadDoc/:id", authMiddleware, downloadDocController);

module.exports = router;
