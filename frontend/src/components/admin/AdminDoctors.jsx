import React, { useEffect, useState } from 'react';
import { Button, Container, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  const getDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/getalldoctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      } else {
        message.error("Failed to load doctors");
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong while fetching doctors');
    }
  };

  const handleApprove = async (doctorId, status, userId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/admin/getapprove', {
        doctorId, status, userid: userId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        message.success(res.data.message);
        getDoctors(); // Refresh doctor list
      } else {
        message.error("Failed to approve doctor");
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong during approval');
    }
  };

  const handleReject = async (doctorId, status, userId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/admin/getreject', {
        doctorId, status, userid: userId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        message.success(res.data.message);
        getDoctors(); // Refresh doctor list
      } else {
        message.error("Failed to reject doctor");
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong during rejection');
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <div>
      <h2 className='p-3 text-center'>All Doctors</h2>
      <Container>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length > 0 ? doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td>{doctor._id}</td>
                <td>{doctor.fullName}</td>
                <td>{doctor.email}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.status}</td>
                <td>
                  {doctor.status === 'pending' ? (
                    <Button
                      onClick={() => handleApprove(doctor._id, 'approved', doctor.userId)}
                      className='mx-2'
                      size='sm'
                      variant="outline-success"
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleReject(doctor._id, 'rejected', doctor.userId)}
                      className='mx-2'
                      size='sm'
                      variant="outline-danger"
                    >
                      Reject
                    </Button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6}>
                  <Alert variant="info" className="m-0">
                    <Alert.Heading>No Doctors to show</Alert.Heading>
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

export default AdminDoctors;
