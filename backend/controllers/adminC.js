const docSchema = require("../schemas/docModel");
const userSchema = require("../schemas/userModel");
const appointmentSchema = require("../schemas/appointmentModel");

const getAllUsersControllers = async (req, res) => {
  try {
    const users = await userSchema.find({});
    return res.status(200).send({ message: "Users data list", success: true, data: users });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong", success: false });
  }
};

const getAllDoctorsControllers = async (req, res) => {
  try {
    const docUsers = await docSchema.find({});
    return res.status(200).send({ message: "Doctor users data list", success: true, data: docUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong", success: false });
  }
};

const getStatusApproveController = async (req, res) => {
  try {
    const { doctorId, status, userid } = req.body;
    const doctor = await docSchema.findByIdAndUpdate(doctorId, { status }, { new: true });

    const user = await userSchema.findById(userid);
    user.notification.push({
      type: "doctor-account-approved",
      message: `Your Doctor account has been ${status}`,
      onClickPath: "/notification",
    });
    user.isdoctor = status === "approved";

    await user.save();
    return res.status(201).send({ message: `Doctor status updated to ${status}`, success: true, data: doctor });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong", success: false });
  }
};

const getStatusRejectController = async (req, res) => {
  try {
    const { doctorId, status, userid } = req.body;
    const doctor = await docSchema.findByIdAndUpdate(doctorId, { status }, { new: true });

    const user = await userSchema.findById(userid);
    user.notification.push({
      type: "doctor-account-rejected",
      message: `Your Doctor account has been ${status}`,
      onClickPath: "/notification",
    });

    await user.save();
    return res.status(201).send({ message: `Doctor status updated to ${status}`, success: true, data: doctor });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong", success: false });
  }
};

const displayAllAppointmentController = async (req, res) => {
  try {
    const allAppointments = await appointmentSchema.find();
    return res.status(200).send({ message: "All appointments fetched", success: true, data: allAppointments });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong", success: false });
  }
};

module.exports = {
  getAllDoctorsControllers,
  getAllUsersControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController,
};