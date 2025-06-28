import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';

const AdminAppointments = () => {
  const [allAppointments, setAllAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/getallAppointmentsAdmin', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (res.data.success) {
        setAllAppointments(res.data.data);
      } else {
        message.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong while fetching appointments");
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <div>
      <h2 className='p-3 text-center'>All Appointments for Admin Panel</h2>
      <Container>
        <Table className='my-3' striped bordered hover responsive>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>User Name</th>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allAppointments.length > 0 ? (
              allAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment._id}</td>
                  <td>{appointment.userInfo?.fullName || "N/A"}</td>
                  <td>{appointment.doctorInfo?.fullName || "N/A"}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <Alert variant="info" className="m-0">
                    <Alert.Heading>No Appointments to show</Alert.Heading>
                  </Alert>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default AdminAppointments;
