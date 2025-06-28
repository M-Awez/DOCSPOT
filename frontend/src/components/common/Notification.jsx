import { Tabs, message } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const getUser = () => {
    const userdata = JSON.parse(localStorage.getItem('userData'));
    if (userdata) {
      setUser(userdata);
    } else {
      navigate("/login");
    }
  };

  const handleAllMarkRead = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/user/getallnotification',
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        const updatedUser = {
          ...user,
          notification: [],
          seennotification: [...user.seennotification, ...user.notification],
        };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/user/deleteallnotification',
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        const updatedUser = { ...user, seennotification: [] };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <h2 className='p-3 text-center'>Notification</h2>
      <Tabs>
        <Tabs.TabPane tab="Unread" key={0}>
          <div className="d-flex justify-content-end">
            <h4 style={{ cursor: 'pointer' }} onClick={handleAllMarkRead} className="p-2">
              Mark all as read
            </h4>
          </div>
          {(user?.notification || []).length === 0 ? (
            <p className='text-center text-muted'>No new notifications</p>
          ) : (
            user.notification.map((notificationMsg, index) => (
              <div key={index} className="card mb-2" style={{ cursor: 'pointer' }}>
                <div className="card-body">{notificationMsg.message}</div>
              </div>
            ))
          )}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Read" key={1}>
          <div className="d-flex justify-content-end">
            <h4 style={{ cursor: 'pointer' }} onClick={handleDeleteAllRead} className="p-2">
              Delete all read
            </h4>
          </div>
          {(user?.seennotification || []).length === 0 ? (
            <p className='text-center text-muted'>No read notifications</p>
          ) : (
            user.seennotification.map((notificationMsg, index) => (
              <div
                key={index}
                className="card mb-2"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(notificationMsg.onClickPath)}
              >
                <div className="card-body">{notificationMsg.message}</div>
              </div>
            ))
          )}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Notification;
