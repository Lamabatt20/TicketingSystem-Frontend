import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import tiki_icon from '../Assets/icon-tiki.png';
import notification_icon from '../Assets/icons8-notification-24.png';
import profile_icon from '../Assets/icons8-male-user-24.png';

const AddUser = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: 'Lama@tiki1',
        phone: '',
        companyId: '',
        isActive: true
    });
    const [companies, setCompanies] = useState([]);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchCompanies = async () => {
            const authToken = localStorage.getItem('authToken');
            const email = localStorage.getItem('email');
            try {
                const response = await axios.get('http://localhost:5267/api/Company', {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setCompanies(response.data);

                const userResponse = await axios.get(`http://localhost:5267/api/User/email/${email}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });

                setUserName(userResponse.data.userName);

            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            await axios.post('http://localhost:5267/api/User', userData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            alert("Add User Seccessfully");
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };


    const handleCancel = () => {

        setUserData({
            username: '',
            email: '',
            password: 'Lama@tiki1',
            phone: '',
            address: '',
            companyId: '',
            isActive: true
        });
    };
    const handleProfileClick = () => {
        navigate(`/Profile`);
    };


    return (
        <div className="profile-page">
            <div className="app-bar">
                <a href="/Dashboard">
                    <img src={tiki_icon} alt="TIKI icon" className="logo" />
                </a>
                <h1 className="tiki">TIKI</h1>
                <div className="profile-section">
                    <img src={notification_icon} alt="Notifications" className="notification-icon" />
                    <img src={profile_icon} alt="User" className="profile-icon" />
                    <span className="profile-name" onClick={handleProfileClick}>{userName}</span>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-header">
                    <h2>Add User</h2>
                </div>
                <div className="profile-details">
                    <div className="profile-item">
                        <label><strong>Username:</strong></label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </div>
                    <div className="profile-item">
                        <label><strong>Email:</strong></label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </div>
                    <div className="profile-item">
                        <label><strong>Phone Number:</strong></label>
                        <input
                            type="text"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </div>
                    <div className="profile-item">
                        <label><strong>Address:</strong></label>
                        <input
                            type="text"
                            name="address"
                            value={userData.address}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </div>
                    <div className="profile-item">
                        <label><strong>Company:</strong></label>
                        <select
                            name="companyId"
                            value={userData.companyId}
                            onChange={handleInputChange}
                            className="input-field"
                        >
                            <option value="">Select a Company</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="save-cancel-buttons">
                        <button className="save-button" onClick={handleSave}>Save</button>
                        <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUser;
