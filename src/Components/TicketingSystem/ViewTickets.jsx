import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewTicket.css';
import tikiIcon from '../Assets/icon-tiki.png';
import notificationIcon from '../Assets/icons8-notification-24.png';
import userIcon from '../Assets/icons8-male-user-24.png';
import editIcon from '../Assets/icons8-edit-50.png';

function ViewTicket() {
    const { ticketId } = useParams();
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [status, setStatus] = useState([]);
    const [priority, setPriority] = useState([]);
    const [service, setService] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [assignedTo, setAssignedTo] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedAssignedTo, setSelectedAssignedTo] = useState('');

    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [hasChanges, setHasChanges] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const authToken = localStorage.getItem('authToken');

                // Fetch ticket data
                const ticketResponse = await axios.get(`http://localhost:5267/api/Ticket/${ticketId}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setTicket(ticketResponse.data);

                const ticketData = ticketResponse.data;
                setSelectedStatus(ticketData.status.id || '');
                setSelectedPriority(ticketData.priority.id || '');
                setSelectedService(ticketData.service.id || '');
                setSelectedCustomer(ticketData.company.id || '');
                setSelectedAssignedTo(ticketData.assignedToId || '');


                const userResponse = await axios.get(`http://localhost:5267/api/User/${ticketData.createdBy}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                const createdByName = userResponse.data.userName;

                setTicket({
                    ...ticketData,
                    createdBy: createdByName
                });

                // Fetch comments
                const commentsResponse = await axios.get(`http://localhost:5267/api/Comment/ticket/${ticketId}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setComments(commentsResponse.data);

                // Fetch select field options
                const statusResponse = await axios.get('http://localhost:5267/api/Statuse', {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setStatus(statusResponse.data);

                const priorityResponse = await axios.get('http://localhost:5267/api/Priority', {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setPriority(priorityResponse.data);

                const serviceResponse = await axios.get('http://localhost:5267/api/Service', {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setService(serviceResponse.data);

                const customerResponse = await axios.get('http://localhost:5267/api/Company', {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setCustomer(customerResponse.data);

                const assignedToResponse = await axios.get('http://localhost:5267/api/User', {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setAssignedTo(assignedToResponse.data);

                const loggedInUserName = localStorage.getItem('userName');
                setUserName(loggedInUserName || '');




            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [ticketId]);


    const handleAddComment = async () => {
        try {
            const authToken = localStorage.getItem('authToken');


            if (!newComment.trim()) {
                throw new Error('Comment text is required');
            }

            const response = await axios.post('http://localhost:5267/api/Comment', {
                ticketId: ticketId,
                commentText: newComment,
                createdOn: new Date().toISOString(),
                createdBy: userName,
                updatedOn: new Date().toISOString(),
                updatedBy: userName
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            setNewComment('');

            const newAddedComment = response.data;
            setComments([...comments, {
                id: newAddedComment.id,
                ticketId: newAddedComment.ticketId,
                commentText: newAddedComment.commentText,
                createdOn: newAddedComment.createdOn,
                createdBy: newAddedComment.createdBy,
                updatedOn: newAddedComment.updatedOn,
                updatedBy: newAddedComment.updatedBy
            }]);
            alert("add comment Successfully");
        } catch (error) {
            console.error('Error adding comment:', error.response ? error.response.data : error.message);
        }
    };
    const handleFieldChange = (field, value) => {
        
        switch (field) {
            case 'statusId':
                setSelectedStatus(value);
                break;
            case 'priorityId':
                setSelectedPriority(value);
                break;
            case 'serviceId':
                setSelectedService(value);
                break;
            case 'companyId':
                setSelectedCustomer(value);
                break;
            case 'assignedToId':
                setSelectedAssignedTo(value);
                break;
            default:
                break;
        }
        setTicket(prev => ({
            ...prev,
            [field]: value
        }));
        setHasChanges(true);
    };

    const saveChanges = async () => {
        if (!hasChanges) return; 

        try {
            const authToken = localStorage.getItem('authToken');

            
            const usersResponse = await axios.get('http://localhost:5267/api/User/', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            const users = usersResponse.data;
            const user = users.find(u => u.userName === userName);
            const userId = user ? user.id : null;

            if (!userId) {
                throw new Error('User not found');
            }

            
            const updatedTicket = {
                id: ticket.id,
                title: ticket.title,
                description: ticket.description,
                statusId: ticket.status.id ,
                priorityId: ticket.priority.id ,
                companyId: ticket.companyId ,
                ticketTypeId: ticket.ticketType ? ticket.ticketType.id : ticket.ticketTypeId,
                serviceId: ticket.serviceId || ticket.serviceId,
                deadline: new Date().toISOString(),
                updatedBy: userId,
                ticketUserIds: ticket.assignedToId || ticket.assignedToId,
            };

            // Send the update request
            const response = await axios.put(`http://localhost:5267/api/Ticket/${ticketId}`, updatedTicket, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            console.log('Response:', response.data);
            setHasChanges(false);

            alert("update ticket Successfully");

        } catch (error) {
            console.error('Error updating ticket:', error.response ? error.response.data : error.message);
        }
    };



    const handleEditComment = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const user = localStorage.getItem('userName');
            setUserName(user || '');


            await axios.put(`http://localhost:5267/api/Comment/${editCommentId}`, {
                id: editCommentId,
                ticketId: ticketId,
                commentText: editCommentText,
                createdOn: new Date().toISOString(),
                createdBy: ticket.comments.find(comment => comment.id === editCommentId)?.createdBy,
                updatedOn: new Date().toISOString(),
                updatedBy: userName
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            // Reset editing state
            setIsEditing(false);
            setEditCommentId(null);
            setEditCommentText('');

            // Fetch updated comments
            const commentsResponse = await axios.get(`http://localhost:5267/api/Comment/ticket/${ticketId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setComments(commentsResponse.data);
            alert("update comment Successfully");
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    const handleProfileClick = () => {
        navigate(`/Profile`);
    };
    const handlebackClick = () => {
        navigate(`/Dashboard`);
    }

    return (
        <div className="container-viewticket">
            {/* App Bar */}
            <div className="app-bar">
                <img src={tikiIcon} alt="TIKI icon" className="logo" />
                <h1 className="tiki">TIKI</h1>
                <div className="profile-section">
                    <img src={notificationIcon} alt="Notifications" className="notification-icon" />
                    <img src={userIcon} alt="User" className="profile-icon" />
                    <span className="profile-name" onClick={handleProfileClick}>{userName}</span>
                </div>
            </div>

            <div className="main-content">
                {/* Ticket Information on the Left */}
                <div className="ticket-info">
                    {ticket && (
                        <>
                            {/* Ticket Title Box */}
                            <div className="ticket-title-box">
                                <h2 className="ticket-title">{ticket.title}</h2>
                            </div>

                            {/* Comment Boxes */}
                            <div className="comment-section">
                                {comments.length > 0 ? (
                                    comments.map(comment => (
                                        <div key={comment.id} className="comment-container">
                                            <button
                                                className="edit-ticket-button"
                                                onClick={() => {
                                                    setIsEditing(true);
                                                    setEditCommentId(comment.id);
                                                    setEditCommentText(comment.commentText);
                                                }}
                                            >
                                                <img src={editIcon} alt="Edit" className="edit-icon-ticket" />
                                            </button>
                                            <p className="comment-text-content">{comment.commentText}</p>

                                            {/* Comment Meta Information */}
                                            <div className="comment-meta">
                                                <div className="comment-meta-item">
                                                    <img src={userIcon} alt="User" className="profile-icons" /> {comment.updatedBy || comment.createdBy}
                                                </div>
                                                <div className="comment-meta-item">
                                                    {new Date(comment.updatedOn || comment.createdOn).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No comments yet.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>



                {/* Select Fields on the Right */}
                <div className="sidebar-viewticket">
                    <div className="sidebar-item">
                        <label><strong>Status:</strong></label><br />
                        <select value={selectedStatus} onChange={(e) => handleFieldChange('statusId', e.target.value)}>
                            {status.map(status => (
                                <option key={status.id} value={status.id}>{status.statusName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="sidebar-item">
                        <label><strong>Priority:</strong></label><br />
                        <select value={selectedPriority} onChange={(e) => handleFieldChange('priorityId', e.target.value)}>
                            {priority.map(priority => (
                                <option key={priority.id} value={priority.id}>{priority.priorityName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="sidebar-item">
                        <label><strong>Service:</strong></label><br />
                        <select value={selectedService} onChange={(e) => handleFieldChange('serviceId', e.target.value)}>
                            {service.map(service => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="sidebar-item">
                        <label><strong>Customer:</strong></label><br />
                        <select value={selectedCustomer} onChange={(e) => handleFieldChange('companyId', e.target.value)}>
                            {customer.map(customer => (
                                <option key={customer.id} value={customer.id}>{customer.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="sidebar-item">
                        <label><strong>Assigned To:</strong></label><br />
                        <select value={selectedAssignedTo} onChange={(e) => handleFieldChange('assignedToId', [e.target.value])}>
                            {assignedTo.map(user => (
                                <option key={user.id} value={user.id}>{user.userName}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <button onClick={saveChanges} disabled={!hasChanges}>
                Save Changes
            </button>

            {/* Add/Edit Comment */}
            {isEditing ? (
                <div className="add-comment-section">
                    <textarea
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        placeholder="Edit your comment here..."
                    />
                    <div className="comment-button">
                        <button onClick={handleEditComment} className="add-comment-button">Update Comment</button>
                        <button onClick={() => setIsEditing(false)} className="back-button">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="add-comment-section">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add your comment here..."
                    />
                    <div className="comment-buttons">
                        <button onClick={handleAddComment} className="add-comment-button">Add Comment</button>
                        <button onClick={handlebackClick} className="back-button">Back</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewTicket;
