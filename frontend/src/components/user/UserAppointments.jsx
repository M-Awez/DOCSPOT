import React, { useEffect, useState } from 'react';
import { Table, Alert, Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';

const UserAppointments = () => {
  const [userid, setUserId] = useState(null);
  const [type, setType] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserId(user._id);
      setType(user.isdoctor);
    } else {
      message.error('No user found');
    }
  };

  const getUserAppointment = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/getuserappointments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { userId: userid },
      });
      if (res.data.success) {
        setUserAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error('Failed to fetch user appointments');
    }
  };

  const getDoctorAppointment = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctor/getdoctorappointments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { userId: userid },
      });
      if (res.data.success) {
        setDoctorAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error('Failed to fetch doctor appointments');
    }
  };

  const handleStatus = async (userId, appointmentId, status) => {
    try {
      const res = await axios.post('http://localhost:5000/api/doctor/handlestatus', {
        userid: userId,
        appointmentId,
        status,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        message.success(res.data.message);
        getDoctorAppointment();
        getUserAppointment();
      }
    } catch (error) {
      console.log(error);
      message.error('Failed to update appointment status');
    }
  };

  const handleDownload = async (url, appointId) => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctor/getdocumentdownload', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { appointId },
        responseType: 'blob'
      });
      if (res.data) {
        const fileUrl = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
        const link = document.createElement("a");
        const fileName = url?.split("/")?.pop() || "document.pdf";
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.log(error);
      message.error('Failed to download document');
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (userid) {
      if (type) {
        getDoctorAppointment();
      } else {
        getUserAppointment();
      }
    }
  }, [userid, type]);

  return (
    <div>
      <h2 className='p-3 text-center'>All Appointments</h2>
      <Container>
        {type ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Phone</th>
                <th>Document</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctorAppointments.length > 0 ? doctorAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.userInfo?.fullName}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.userInfo?.phone}</td>
                  <td>
                    {appointment.document?.filename ? (
                      <Button
                        variant='link'
                        onClick={() => handleDownload(appointment.document.path, appointment._id)}
                      >
                        {appointment.document.filename}
                      </Button>
                    ) : 'No document'}
                  </td>
                  <td>{appointment.status}</td>
                  <td>
                    {appointment.status !== 'approved' && (
                      <Button onClick={() => handleStatus(appointment.userInfo._id, appointment._id, 'approved')}>
                        Approve
                      </Button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6}>
                    <Alert variant="info">No appointments to show</Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userAppointments.length > 0 ? userAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.docName}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.status}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3}>
                    <Alert variant="info">No appointments to show</Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default UserAppointments;
