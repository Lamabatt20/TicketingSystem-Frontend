import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import tiki_icon from '../Assets/icon-tiki.png';
import notification_icon from '../Assets/icons8-notification-24.png';
import profile_icon from '../Assets/icons8-male-user-24.png';
import add_icon from '../Assets/icons8-add-30.png';

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ticketsPerPage] = useState(4);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchFields, setSearchFields] = useState({
        description: '',
        employeeName: '',
        customerId: '',
        serviceId: '',
        statusName: ''
    });
    const [userName, setUserName] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                const [ticketsResponse, customersResponse, servicesResponse, statusesResponse, userTicketsResponse, usersResponse] = await Promise.all([
                    axios.get('http://localhost:5267/api/Ticket', {
                        headers: { Authorization: `Bearer ${authToken}` }
                    }),
                    axios.get('http://localhost:5267/api/Company', {
                        headers: { Authorization: `Bearer ${authToken}` }
                    }),
                    axios.get('http://localhost:5267/api/Service', {
                        headers: { Authorization: `Bearer ${authToken}` }
                    }),
                    axios.get('http://localhost:5267/api/Statuse', {
                        headers: { Authorization: `Bearer ${authToken}` }
                    }),
                    axios.get('http://localhost:5267/api/UserTicket', {
                        headers: { Authorization: `Bearer ${authToken}` }
                    }),
                    axios.get('http://localhost:5267/api/User', {
                        headers: { Authorization: `Bearer ${authToken}` }
                    }),
                ]);

                const tickets = ticketsResponse.data;
                const userTickets = userTicketsResponse.data;
                const users = usersResponse.data;

                const userMap = users.reduce((acc, user) => {
                    acc[user.id] = user.userName;
                    return acc;
                }, {});

                const ticketsWithEmployeeNames = tickets.map(ticket => {
                    const userTicket = userTickets.find(ut => ut.ticketId === ticket.id);
                    return {
                        ...ticket,
                        employeeName: userTicket ? userMap[userTicket.userId] : ''
                    };
                });

                setTickets(ticketsWithEmployeeNames);
                setFilteredTickets(ticketsWithEmployeeNames);
                setCustomers(customersResponse.data);
                setServices(servicesResponse.data);
                setStatuses(statusesResponse.data);

                
                const loggedInUserName = localStorage.getItem('userName');
                setUserName(loggedInUserName || ''); 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const getStatusClass = (statusName) => {
        switch (statusName) {
            case 'Closed':
                return 'status-closed';
            case 'rejected':
                return 'status-rejected';
            case 'on progress':
                return 'status-on-progress';
            case 'Open':
                return 'status-open';
            default:
                return '';
        }
    };

    const handleSearch = () => {
        const filtered = tickets.filter(ticket => {
            const creationDate = new Date(ticket.createdOn);
            const deadline = new Date(ticket.deadline);

            return (
                (searchFields.description === '' || (ticket.description && ticket.description.toLowerCase().includes(searchFields.description.toLowerCase()))) &&
                (searchFields.employeeName === '' || (ticket.employeeName && ticket.employeeName.toLowerCase().includes(searchFields.employeeName.toLowerCase()))) &&
                (searchFields.customerId === '' || ticket.company.name === searchFields.customerId) &&
                (searchFields.serviceId === '' || ticket.service.name === searchFields.serviceId) &&
                (searchFields.statusName === '' || ticket.status.statusName === searchFields.statusName) &&
                (fromDate === '' || creationDate >= new Date(fromDate)) &&
                (toDate === '' || deadline <= new Date(toDate))
            );
        });
        setCurrentPage(1);
        setFilteredTickets(filtered);
    };
    const handleAddClick = () => {
        navigate('/AddTicket'); 
    };

    const handleInputChange = (e) => {
        setSearchFields({ ...searchFields, [e.target.name]: e.target.value });
    };

    const handleViewClick = (ticketId) => {
        navigate(`/ViewTickets/${ticketId}`);
    };

    const handleProfileClick = () => {
        navigate(`/Profile`); 
    };
    // Pagination logic
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

    return (
        <div className="dashboard">
            <div className="app-bar">
                <img src={tiki_icon} alt="TIKI icon" className="logo" />
                <h1 className="tiki">TIKI</h1>
                <div className="profile-section">
                    <img src={notification_icon} alt="Notifications" className="notification-icon" />
                    <img src={profile_icon} alt="User" className="profile-icon" />
                    <span className="profile-name" onClick={handleProfileClick}>{userName}</span>
                </div>
            </div>

            <h1>Ticket Query Screen</h1>

            <div className="search-panel">
                <div className="search-row">
                    <input 
                        type="text" 
                        name="description" 
                        placeholder="Ticket Descrition" 
                        value={searchFields.description} 
                        onChange={handleInputChange} 
                    />
                    <div className="date-panel">
                        <label>Date:</label>
                        <input 
                            type="date" 
                            value={fromDate} 
                            onChange={(e) => setFromDate(e.target.value)} 
                        />
                        <span>to</span>
                        <input 
                            type="date" 
                            value={toDate} 
                            onChange={(e) => setToDate(e.target.value)} 
                        />
                    </div>
                    <input 
                        type="text" 
                        name="employeeName" 
                        placeholder="Employee Name" 
                        value={searchFields.employeeName} 
                        onChange={handleInputChange} 
                    />
                </div>
                <div className="search-row">
                    <select 
                        name="customerId" 
                        value={searchFields.customerId} 
                        onChange={handleInputChange}
                    >
                        <option value="">Customer</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.name}>{customer.name}</option>
                        ))}
                    </select>
                    <select 
                        name="serviceId" 
                        value={searchFields.serviceId} 
                        onChange={handleInputChange}
                    >
                        <option value="">Service</option>
                        {services.map(service => (
                            <option key={service.id} value={service.name}>{service.name}</option>
                        ))}
                    </select>
                    <select 
                        name="statusName" 
                        value={searchFields.statusName} 
                        onChange={handleInputChange}
                    >
                        <option value="">Status</option>
                        {statuses.map(status => (
                            <option key={status.id} value={status.statusName}>{status.statusName}</option>
                        ))}
                    </select>
                </div>
                <div className="search-row">
                    <button className="search-button search" onClick={handleSearch}>Search</button>
                    <button className="search-button report">Report</button>
                    <button className="search-button clear" onClick={() => {
                        setSearchFields({
                            description: '',
                            employeeName: '',
                            customerId: '',
                            serviceId: '',
                            statusName: ''
                        });
                        setFromDate('');
                        setToDate('');
                        setFilteredTickets(tickets); // Reset filtered tickets
                        setCurrentPage(1); // Reset to the first page
                    }}>Clear</button>
                </div>
            </div>
            <div className="add-ticket-containers">
                    <img 
                        src={add_icon} 
                        alt="Add Ticket" 
                        className="add-icon" 
                        onClick={handleAddClick} 
                    />
                </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Ticket Id</th>
                            <th>Ticket Description</th>
                            <th>Priority</th>
                            <th>Service</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTickets.map(ticket => (
                            <tr key={ticket.id}>
                                <td>{ticket.id}</td>
                                <td>{ticket.description}</td>
                                <td>{ticket.priority.priorityName}</td>
                                <td>{ticket.service.name}</td>
                                <td>{ticket.company.name}</td>
                                <td className={getStatusClass(ticket.status.statusName)}>{ticket.status.statusName}</td>
                                <td><button onClick={() => handleViewClick(ticket.id)}>👁️</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    &lt;&lt;
                </button>
                {[...Array(totalPages).keys()].map(page => (
                    <button
                        key={page + 1}
                        className={page + 1 === currentPage ? 'active' : ''}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        {page + 1}
                    </button>
                ))}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    &gt;&gt;
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
