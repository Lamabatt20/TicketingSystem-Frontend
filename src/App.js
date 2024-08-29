import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/TicketingSystem/Login';
import SignUp from './Components/TicketingSystem/SignUp';
import ForgotPassword from './Components/TicketingSystem/forgotpassword';
import ViewTickets from './Components/TicketingSystem/ViewTickets';
import Dashboard from './Components/TicketingSystem/Dashboard';
import AddTicket from './Components/TicketingSystem/AddTicket';
import Profile from './Components/TicketingSystem/Profile';
import AddUser from './Components/TicketingSystem/AddUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ViewTickets/:ticketId" element={<ViewTickets />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/AddTicket" element={<AddTicket />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/AddUser" element={<AddUser />} />
      </Routes>
    </Router>
  );
}

export default App;
