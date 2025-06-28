import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge } from 'antd';
import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicationIcon from '@mui/icons-material/Medication';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';

import Notification from '../common/Notification';
import AdminUsers from './AdminUsers';
import AdminDoctors from './AdminDoctors';
import AdminAppointments from './AdminAppointments';

const AdminHome = () => {
  const [userdata, setUserData] = useState({});
  const [activeMenuItem, setActiveMenuItem] = useState('adminappointments'); // ✅ Default view

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserData(user);
    }
  };

  const getUserData = async () => {
    try {
      await axios.post('http://localhost:5000/api/user/getuserdata', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.log("Error getting user data:", error);
    }
  };

  useEffect(() => {
    getUser();
    getUserData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  return (
    <div className='main'>
      <div className="layout">
        <div className="sidebar">
          <div className="logo">
            <h2>MediCareBook</h2>
          </div>
          <div className="menu">
            <div
              className={`menu-items ${activeMenuItem === 'adminusers' ? 'active' : ''}`}
              onClick={() => handleMenuItemClick('adminusers')}
            >
              <CalendarMonthIcon className='icon' /><span>Users</span>
            </div>
            <div
              className={`menu-items ${activeMenuItem === 'admindoctors' ? 'active' : ''}`}
              onClick={() => handleMenuItemClick('admindoctors')}
            >
              <MedicationIcon className='icon' /><span>Doctors</span>
            </div>
            <div className="menu-items" onClick={logout}>
              <LogoutIcon className='icon' /><span>Logout</span>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="header">
            <div className="header-content" style={{ cursor: 'pointer' }}>
              <Badge
                className={`notify ${activeMenuItem === 'notification' ? 'active' : ''}`}
                onClick={() => handleMenuItemClick('notification')}
                count={userdata?.notification?.length || 0}
              >
                <NotificationsIcon className='icon' />
              </Badge>
              <h3>Hi.. {userdata?.fullName || "Admin"}</h3>
            </div>
          </div>

          <div className="body">
            {activeMenuItem === 'notification' && <Notification />}
            {activeMenuItem === 'adminusers' && <AdminUsers />}
            {activeMenuItem === 'admindoctors' && <AdminDoctors />}
            {activeMenuItem === 'adminappointments' && <AdminAppointments />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
