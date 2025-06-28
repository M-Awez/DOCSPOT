const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
} = require("../controllers/doctorC");

const router = express.Router();

///////////// Multer File Storage Setup /////////////
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

///////////// Routes ////////////////////////////////

// @route   POST /api/doctor/updateprofile
router.post("/updateprofile", authMiddleware, updateDoctorProfileController);

// @route   GET /api/doctor/getdoctorappointments
router.get("/getdoctorappointments", authMiddleware, getAllDoctorAppointmentsController);

// @route   POST /api/doctor/handlestatus
router.post("/handlestatus", authMiddleware, handleStatusController);

// @route   GET /api/doctor/getdocumentdownload/:filename
router.get("/getdocumentdownload/:filename", authMiddleware, documentDownloadController);

module.exports = router;
