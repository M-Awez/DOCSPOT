import React, { useEffect, useState } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/getallusers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h4 className='p-3 text-center'>All Users</h4>
      <Container>
        <Table className='my-3' striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>User Type</th>
              <th>Is Doctor</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.type === 'admin' ? 'Admin' : 'User'}</td>
                  <td>{user.isdoctor ? 'Yes' : 'No'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <Alert variant="info" className="m-0">
                    <Alert.Heading>No Users to show</Alert.Heading>
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

export default AdminUsers;
