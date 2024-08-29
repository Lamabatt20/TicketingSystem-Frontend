import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddTicket.css';
import { useNavigate } from 'react-router-dom';
import tiki_icon from '../Assets/icon-tiki.png';
import notification_icon from '../Assets/icons8-notification-24.png';
import profile_icon from '../Assets/icons8-male-user-24.png';

const AddTicket = () => {
  const [statusOptions, setStatusOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [assignedOptions, setAssignedOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [ticketTypeOptions, setTicketTypeOptions] = useState([]);
  const [userName, setUserName] = useState('');
  const [tickets, setTickets] = useState([]);  // Added state for tickets
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({
    status: '',
    service: '',
    customer: '',
    assigned: '',
    priority: '',
    title: '',
    description: '',
    ticketTypeId: '',
    deadline: '',
    updatedBy: '',
    ticketUserIds: []
  });
  const handlebackClick = () => {
    navigate(`/Dashboard`);
  }

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) throw new Error('No auth token found.');

        // Fetch status options
        const statusResponse = await axios.get('http://localhost:5267/api/Statuse', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setStatusOptions(statusResponse.data);

        // Fetch priority options
        const priorityResponse = await axios.get('http://localhost:5267/api/Priority', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setPriorityOptions(priorityResponse.data);

        // Fetch service options
        const serviceResponse = await axios.get('http://localhost:5267/api/Service', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setServiceOptions(serviceResponse.data);

        // Fetch customer options
        const customerResponse = await axios.get('http://localhost:5267/api/Company', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setCustomerOptions(customerResponse.data);

        // Fetch assigned options (users)
        const assignedResponse = await axios.get('http://localhost:5267/api/User', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setAssignedOptions(assignedResponse.data);

        const ticketTypeResponse = await axios.get('http://localhost:5267/api/TicketType', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setTicketTypeOptions(ticketTypeResponse.data);

        const loggedInUserName = localStorage.getItem('userName');
        setUserName(loggedInUserName || '');

      } catch (error) {
        console.error('Error fetching options', error);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      // Basic validation: Ensure required fields are filled
      if (!ticket.title.trim() || !ticket.description.trim()) {
        throw new Error('Title and description are required');
      }
      const usersResponse = await axios.get('http://localhost:5267/api/User/', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const users = usersResponse.data;
      const user = users.find(u => u.userName === userName);
      const userId = user ? user.id : null;

      // Send the ticket data to the server
      const response = await axios.post('http://localhost:5267/api/Ticket', {
        title: ticket.title,
        description: ticket.description,
        statusId: ticket.status,
        priorityId: ticket.priority,
        companyId: ticket.customer,
        serviceId: ticket.service,
        ticketTypeId: ticket.ticketTypeId,
        deadline: new Date().toISOString(),
        updatedBy: userId,
        ticketUserIds: [ticket.assigned]
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      // Reset the form fields after a successful ticket addition
      setTicket({
        title: '',
        description: '',
        statusId: '',
        priorityId: '',
        companyId: '',
        serviceId: '',
        ticketTypeId: '',
        deadline: '',
        updatedBy: '',
        ticketUserIds: []
      });

      // Add the new ticket to the state
      const newAddedTicket = response.data;
      setTickets([...tickets, {
        id: newAddedTicket.id,
        title: newAddedTicket.title,
        description: newAddedTicket.description,
        statusId: newAddedTicket.statusId,
        priorityId: newAddedTicket.priorityId,
        companyId: newAddedTicket.companyId,
        serviceId: newAddedTicket.serviceId,
        ticketTypeId: newAddedTicket.ticketTypeId,
        deadline: newAddedTicket.deadline,
        updatedBy: newAddedTicket.updatedBy,
        ticketUserIds: newAddedTicket.ticketUserIds
      }]);
      alert("add ticket Successfully");
    } catch (error) {
      console.error('Error adding ticket:', error.response ? error.response.data : error.message);
    }
  };

  const handleProfileClick = () => {
    navigate(`/Profile`);
  };

  return (
    <div className="add-ticket-container">
      <div className="app-bar">
        <img src={tiki_icon} alt="TIKI icon" className="logo" />
        <h1 className="tiki">TIKI</h1>
        <div className="profile-section">
          <img src={notification_icon} alt="Notifications" className="notification-icon" />
          <img src={profile_icon} alt="User" className="profile-icon" />
          <span className="profile-name" onClick={handleProfileClick}>{userName}</span>
        </div>
      </div>

      <div className="add-ticket-content">
        {/* View Ticket Box */}
        <div className="view-ticket-box">
          <label>
            Ticket Title:
            <input
              type="text"
              name="title"
              value={ticket.title}
              onChange={handleChange}
              required
            />
            <br /><br /><br />
          </label>
          {tickets.length > 0 && tickets.map(ticket => (
            <div key={ticket.id} className="ticket-container">
              <h1>{tickets[tickets.length - 1].title}</h1>
              <p>{tickets[tickets.length - 1].description}</p>
              <div className="comment-meta">
                <div className="comment-meta-item">
                  <img src={profile_icon} alt="User" className="profile-icons" /> {userName}
                </div>
                <div className="comment-meta-item">
                  {new Date().toISOString}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="add-ticket-form">
          <label>
            Status:
            <select name="status" value={ticket.status} onChange={handleChange} required>
              {statusOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.statusName}</option>
              ))}
            </select>
          </label>

          <label>
            Service:
            <select name="service" value={ticket.service} onChange={handleChange} required>
              {serviceOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </label>

          <label>
            Customer:
            <select name="customer" value={ticket.customer} onChange={handleChange} required>
              {customerOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </label>

          <label>
            Assigned To:
            <select name="assigned" value={ticket.assigned} onChange={handleChange} required>
              {assignedOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.userName}</option>
              ))}
            </select>
          </label>

          <label>
            Priority:
            <select name="priority" value={ticket.priority} onChange={handleChange}>
              {priorityOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.priorityName}</option>
              ))}
            </select>
          </label>

          <label>
            Ticket Type:
            <select name="ticketTypeId" value={ticket.ticketTypeId} onChange={handleChange} required>
              {ticketTypeOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.typeName}</option>
              ))}
            </select>
          </label>

        </form>

      </div>
      {/* Add New Ticket Section */}
      <div className="add-new-ticket">
        <textarea placeholder="Add a new ticket"
          name="description"
          value={ticket.description}
          onChange={handleChange}
          required />
        <div className="ticket-buttons">
          <button onClick={handleSubmit} className="add-ticket-button">Add Ticket</button>
          <button onClick={handlebackClick} className="back-buttons">Back</button>
        </div>
      </div>
    </div>
  );
};

export default AddTicket;
