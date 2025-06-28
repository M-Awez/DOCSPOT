import { Routes, Route } from 'react-router-dom';
import Home from './components/common/Home';
import Login from './components/common/Login';
import Register from './components/common/Register';
import UserHome from './components/user/UserHome';
import AdminHome from './components/admin/AdminHome';
import UserAppointments from './components/user/UserAppointments';

function App() {
  const userLoggedIn = !!localStorage.getItem("userData");

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {userLoggedIn && (
          <>
            <Route path="/adminhome" element={<AdminHome />} />
            <Route path="/userhome" element={<UserHome />} />
            <Route path="/userhome/userappointments/:doctorId" element={<UserAppointments />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
