import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import tiki_icon from '../Assets/icon-tiki.png';
import notification_icon from '../Assets/icons8-notification-24.png';
import profile_icon from '../Assets/icons8-male-user-24.png';
import adduser_icon from '../Assets/adduser.png';

const Profile = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        company: '',
        status: '',
        password: '',
    });
    const [isEditing, setIsEditing] = useState({
        username: false,
        email: false,
        phone: false,
        address: false,
        company: false,
        status: false,
        password: false,
    });
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                const email = localStorage.getItem('email');

                if (!authToken || !email) {
                    console.error('Token or email not found');
                    return;
                }

                const userResponse = await axios.get(`http://localhost:5267/api/User/email/${email}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });

                if (userResponse.data) {
                    setUserData({
                        username: userResponse.data.userName,
                        email: userResponse.data.email,
                        phone: userResponse.data.phone,
                        address: userResponse.data.company ? userResponse.data.company.address : '',
                        company: userResponse.data.company ? userResponse.data.company.name : '',
                        status: userResponse.data.isActive ? 'true' : 'false',
                        password: userResponse.data.password,
                    });
                    setUserId(userResponse.data.id);
                } else {
                    console.error('No user data found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);
    const fetchCompanyId = async (companyName) => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.error('Token not found');
                return null;
            }

            const response = await axios.get(`http://localhost:5267/api/Company?name=${companyName}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            if (response.data && response.data.length > 0) {
                return response.data[0].id;
            } else {
                console.error('Company not found');
                return null;
            }
        } catch (error) {
            console.error('Error fetching company ID:', error);
            return null;
        }
    };



    const handleEditToggle = (field) => {
        setIsEditing(prevState => ({ ...prevState, [field]: !prevState[field] }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({ ...prevData, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prevPasswords => ({ ...prevPasswords, [name]: value }));
    };

    const handleSave = async (field) => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken || !userId) {
                console.error('Token or User ID not found');
                return;
            }

            let updateData;
            

            if (passwords.newPassword !== passwords.confirmPassword) {
                console.error('Passwords do not match');
                return;
            }

            const companyId = userData.company ? await fetchCompanyId(userData.company) : null;
            if (companyId === null) {
                console.error('Invalid company name');
                return;
            }


            updateData = {
                id: userId,
                userName: userData.username,
                email: userData.email,
                password: passwords.newPassword,
                phone: userData.phone,
                companyId: companyId,
                isActive: userData.status === 'true',
            };


            await axios.put(`http://localhost:5267/api/User/${userId}`, updateData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            setIsEditing(prevState => ({ ...prevState, [field]: false }));
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleAddUserClick = () => {
        navigate('/AddUser'); // Navigate to AddUser page
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
                    <span className="profile-name">{userData.username}</span>
                </div>
            </div>

            <div className="profile-content">
                <h2>Your Profile</h2>
                <div className="profile-details">
                    {['username', 'email', 'phone', 'address', 'company', 'status'].map(field => (
                        <div key={field} className="profile-item">
                            <label><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong></label>
                            {isEditing[field] ? (
                                <input
                                    type="text"
                                    name={field}
                                    value={userData[field]}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            ) : (
                                <span className="profile-value">{userData[field]}</span>
                            )}
                            <div className="profile-buttons">
                                {isEditing[field] && (
                                    <div className="save-cancel-buttons">
                                        <button className="save-button" onClick={() => handleSave(field)}>Save</button>
                                        <button className="cancel-button" onClick={() => handleEditToggle(field)}>Cancel</button>
                                    </div>
                                )}
                                {!isEditing[field] && (
                                    <button className="edit-button" onClick={() => handleEditToggle(field)}>✏️</button>
                                )}
                            </div>
                        </div>
                    ))}
                    <div className="profile-item">
                        <label><strong>Password:</strong></label>
                        <span className="profile-value">••••••••</span>
                        <div className="profile-buttons">
                            {isEditing.password && (
                                <div className="password-reset">
                                    <h3>Reset Password</h3>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        placeholder="Current Password"
                                        value={passwords.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="input-field"
                                    />
                                    <input
                                        type="password"
                                        name="newPassword"
                                        placeholder="New Password"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                        className="input-field"
                                    />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm New Password"
                                        value={passwords.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="input-field"
                                    />
                                    <div className="save-cancel-buttons">
                                        <button className="save-button" onClick={() => handleSave('password')}>Save</button>
                                        <button className="cancel-button" onClick={() => handleEditToggle('password')}>Cancel</button>
                                    </div>
                                </div>
                            )}
                            {!isEditing.password && (
                                <button className="edit-button" onClick={() => handleEditToggle('password')}>✏️</button>
                            )}
                        </div>
                    </div>

                </div>
                <div className="adduser-icon">
                    <img src={adduser_icon} alt="Add User" onClick={handleAddUserClick} style={{ cursor: 'pointer' }} />
                </div>

            </div>
        </div>
    );
};

export default Profile;
