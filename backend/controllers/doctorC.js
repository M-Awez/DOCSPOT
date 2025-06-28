const fs = require("fs");
const path = require("path");
const docSchema = require("../schemas/docModel");
const appointmentSchema = require("../schemas/appointmentModel");
const userSchema = require("../schemas/userModel");

const updateDoctorProfileController = async (req, res) => {
  try {
    const doctor = await docSchema.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );
    return res.status(200).send({ success: true, data: doctor, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong", success: false });
  }
};

const getAllDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await docSchema.findOne({ userId: req.body.userId });
    if (!doctor) return res.status(404).send({ message: "Doctor not found", success: false });

    const allAppointments = await appointmentSchema.find({ doctorId: doctor._id });
    return res.status(200).send({ message: "Appointments fetched", success: true, data: allAppointments });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong", success: false });
  }
};

const handleStatusController = async (req, res) => {
  try {
    const { userid, appointmentId, status } = req.body;
    const appointment = await appointmentSchema.findByIdAndUpdate(appointmentId, { status }, { new: true });

    const user = await userSchema.findById(userid);
    if (!user.notification) user.notification = [];
    user.notification.push({
      type: "status-updated",
      message: `Your appointment has been ${status}`,
      onClickPath: "/user/appointments",
    });

    await user.save();
    return res.status(200).send({ success: true, message: "Appointment status updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong", success: false });
  }
};

const documentDownloadController = async (req, res) => {
  try {
    const appointId = req.query.appointId;
    const appointment = await appointmentSchema.findById(appointId);
    if (!appointment || !appointment.document?.path)
      return res.status(404).send({ message: "Document not found", success: false });

    const absoluteFilePath = path.resolve(__dirname, "..", appointment.document.path);
    fs.access(absoluteFilePath, fs.constants.F_OK, (err) => {
      if (err) return res.status(404).send({ message: "File not found", success: false });

      res.setHeader("Content-Disposition", `attachment; filename=\"${path.basename(absoluteFilePath)}\"`);
      res.setHeader("Content-Type", "application/octet-stream");

      const fileStream = fs.createReadStream(absoluteFilePath);
      fileStream.pipe(res);
      fileStream.on("error", err => res.status(500).send({ message: "Error streaming file", success: false }));
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong", success: false });
  }
};

module.exports = {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
};
