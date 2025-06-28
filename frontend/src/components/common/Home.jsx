import React from 'react';
import { Container, Button } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import p3 from '../../images/p3.png'; // 🧠 Make sure the image path is correct

const Home = () => {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">DOCSPOT</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto d-flex gap-5"> {/* 👈 gap between nav items */}
              <Nav.Link as={Link} to="/" className="nav-link">Home</Nav.Link>
              <Nav.Link as={Link} to="/login" className="nav-link">Login</Nav.Link>
              <Nav.Link as={Link} to="/register" className="nav-link">Register</Nav.Link>
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="home-container d-flex align-items-center justify-content-center flex-wrap p-5">
        <div className="text-center text-md-start col-md-6 mb-4">
          <img alt="hero" src={p3} className="img-fluid rounded" />
        </div>
        <div className="text-center text-md-start col-md-6">
          <h2>Schedule your doctor without any <strong>Fear</strong></h2>
          <p className="lead">Only a few clicks,<br /> putting your health in your hands.</p>
          <Button variant="primary" as={Link} to="/login">Book Your Doctor</Button>
        </div>
      </div>
    </>
  );
};

export default Home;
