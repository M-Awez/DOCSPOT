// ✅ userC.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const userSchema = require("../schemas/userModel");
const docSchema = require("../schemas/docModel");
const appointmentSchema = require("../schemas/appointmentModel");

const registerController = async (req, res) => {
  try {
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) return res.status(200).send({ message: "User already exists", success: false });

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const newUser = new userSchema(req.body);
    await newUser.save();
    return res.status(201).send({ message: "Registered successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) return res.status(200).send({ message: "User not found", success: false });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(200).send({ message: "Invalid credentials", success: false });

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });
    user.password = undefined;

    return res.status(200).send({ message: "Login successful", success: true, token, userData: user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    if (!user) return res.status(200).send({ message: "User not found", success: false });
    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Auth error", success: false });
  }
};

const docController = async (req, res) => {
  try {
    const { doctor, userId } = req.body;
    const newDoctor = new docSchema({ ...doctor, userId, status: "pending" });
    await newDoctor.save();

    const adminUser = await userSchema.findOne({ type: "admin" });
    if (!adminUser) return res.status(404).send({ success: false, message: "Admin user not found" });

    adminUser.notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.fullName} applied for doctor registration`,
      data: { userId: newDoctor._id, fullName: newDoctor.fullName, onClickPath: "/admin/doctors" },
    });
    await adminUser.save();

    return res.status(201).send({ success: true, message: "Doctor request sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: "Error applying for doctor", error: error.message });
  }
};

const getallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    user.seennotification.push(...user.notification);
    user.notification = [];
    await user.save();
    return res.status(200).send({ success: true, message: "Notifications marked as read", data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error fetching notifications", success: false });
  }
};

const deleteallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    user.notification = [];
    user.seennotification = [];
    await user.save();
    return res.status(200).send({ success: true, message: "Notifications deleted", data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error deleting notifications", success: false });
  }
};

const getAllDoctorsControllers = async (req, res) => {
  try {
    const docUsers = await docSchema.find({ status: "approved" });
    return res.status(200).send({ message: "Doctor list", success: true, data: docUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error fetching doctors", success: false });
  }
};

const appointmentController = async (req, res) => {
  try {
    let { userInfo, doctorInfo } = req.body;
    userInfo = JSON.parse(userInfo);
    doctorInfo = JSON.parse(doctorInfo);

    const documentData = req.file ? { filename: req.file.filename, path: `/uploads/${req.file.filename}` } : null;
    const newAppointment = new appointmentSchema({
      userId: req.body.userId,
      doctorId: req.body.doctorId,
      userInfo,
      doctorInfo,
      date: req.body.date,
      document: documentData,
      status: "pending",
    });

    await newAppointment.save();

    const doctor = await userSchema.findById(doctorInfo.userId);
    doctor.notification.push({ type: "New Appointment", message: `New request from ${userInfo.fullName}` });
    await doctor.save();

    return res.status(200).send({ message: "Appointment booked", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Booking failed", success: false });
  }
};

const getAllUserAppointments = async (req, res) => {
  try {
    const allAppointments = await appointmentSchema.find({ userId: req.body.userId });
    const doctorIds = allAppointments.map(app => app.doctorId);
    const doctors = await docSchema.find({ _id: { $in: doctorIds } });

    const appointmentsWithDoctor = allAppointments.map(app => {
      const doctor = doctors.find(doc => doc._id.toString() === app.doctorId.toString());
      return { ...app.toObject(), docName: doctor ? doctor.fullName : "" };
    });

    return res.status(200).send({ message: "User appointments", success: true, data: appointmentsWithDoctor });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error fetching appointments", success: false });
  }
};

const getDocsController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    if (!user.documents?.length) return res.status(200).send({ message: "No documents found", success: true });
    return res.status(200).send({ message: "Documents retrieved", success: true, data: user.documents });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error retrieving documents", success: false });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
  docController,
  getallnotificationController,
  deleteallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController,
};
