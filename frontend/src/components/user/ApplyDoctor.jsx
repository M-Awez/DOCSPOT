import { Col, Form, Input, Row, TimePicker, message } from 'antd';
import { Container } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

function ApplyDoctor({ userId }) {
  const [doctor, setDoctor] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    specialization: '',
    experience: '',
    fees: '',
    timings: [],
  });

  const handleTimingChange = (times) => {
    const formattedTimes = times ? [
      moment(times[0]).format("HH:mm"),
      moment(times[1]).format("HH:mm"),
    ] : [];
    setDoctor({ ...doctor, timings: formattedTimes });
  };

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/registerdoc', {
        doctor,
        userId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log("Apply doctor error:", error);
      message.error('Something went wrong');
    }
  };

  return (
    <Container>
      <h2 className='text-center p-3'>Apply for Doctor</h2>
      <Form onFinish={handleSubmit} className='m-3'>
        <h4>Personal Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Full Name" required>
              <Input name='fullName' value={doctor.fullName} onChange={handleChange} placeholder='Enter name' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Phone" required>
              <Input name='phone' value={doctor.phone} onChange={handleChange} type='text' placeholder='Your phone' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Email" required>
              <Input name='email' value={doctor.email} onChange={handleChange} type='email' placeholder='Your email' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Address" required>
              <Input name='address' value={doctor.address} onChange={handleChange} type='text' placeholder='Your address' />
            </Form.Item>
          </Col>
        </Row>

        <h4>Professional Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Specialization" required>
              <Input name='specialization' value={doctor.specialization} onChange={handleChange} placeholder='Your specialization' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Experience" required>
              <Input name='experience' value={doctor.experience} onChange={handleChange} type='number' placeholder='Years of experience' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Fees" required>
              <Input name='fees' value={doctor.fees} onChange={handleChange} type='number' placeholder='Consultation fee' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Timings" required>
              <TimePicker.RangePicker format="HH:mm" onChange={handleTimingChange} />
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" type="submit">Submit</button>
        </div>
      </Form>
    </Container>
  );
}

export default ApplyDoctor;
