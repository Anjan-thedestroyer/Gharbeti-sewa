import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { Helmet } from 'react-helmet';
import './TaskReq.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const TaskReq = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/freelance/get-task');
                const taskArray = response.data?.data?.task || [];
                const now = new Date();
                const filterArray = taskArray.filter(task => !task.isAccepted || new Date(task.expiry) > now)
                setTasks(filterArray);
                setError(null);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                setError("Failed to load tasks. Please try again later.");
                showAlert('Failed to load tasks. Please try again later.', 'error');
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => {
            setAlert({ show: false, message: '', type: '' });
        }, 5000);
    };

    const getStatusBadge = (task) => {
        if (task.isCompleted) {
            return <span className="status-badge completed">Completed</span>;
        }
        if (task.isAccepted) {
            return <span className="status-badge in-progress">In Progress</span>;
        }
        return <span className="status-badge pending">Pending Acceptance</span>;
    };

    const handleViewMap = (lat, lon) => {
        if (!lat || !lon) {
            showAlert("Location coordinates missing", 'error');
            return;
        }

        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
        window.open(url, "_blank");
    };

    const handleAccept = async (id) => {
        try {
            await axiosInstance.put(`/freelance/accept/${id}`);
            // Update the task list after successful acceptance
            const updatedTasks = tasks.map(task =>
                task._id === id ? { ...task, isAccepted: true } : task
            );
            setTasks(updatedTasks);
            showAlert('Task accepted successfully!', 'success');
        } catch (error) {
            console.log(error);
            showAlert('Failed to accept task. Please try again.', 'error');
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <Navbar color='no' />
            <div className="task-management-container">
                <Helmet>
                    <title>Freelancer Task Management | Gharbeti-sewa</title>
                    <meta name="description" content="View and manage your assigned tasks as a freelancer. Track task status, deadlines, and client information." />
                    <meta name="keywords" content="freelancer tasks, task management, job assignments, freelance work" />
                </Helmet>

                {alert.show && (
                    <div className={`alert alert-${alert.type}`}>
                        {alert.message}
                        <button
                            onClick={() => setAlert({ show: false, message: '', type: '' })}
                            className="alert-close"
                        >
                            &times;
                        </button>
                    </div>
                )}

                <header className="task-header">
                    <h1>Your Assigned Tasks</h1>
                    <p className="subtitle">Manage your current work assignments and deadlines</p>
                </header>
                <h5 onClick={() => navigate('/accepted-work')} className='btn your-task'>
                    <span>
                        Accepted task
                    </span>
                </h5>

                {loading ? (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <p>Loading your tasks...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="retry-button">
                            Retry
                        </button>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="empty-state">
                        <img src="/images/no-tasks.svg" alt="No tasks assigned" className="empty-image" />
                        <h3>No Tasks Assigned</h3>
                        <p>You currently don't have any tasks assigned to you. Check back later or contact support if you believe this is an error.</p>
                    </div>
                ) : (
                    <div className="task-grid">
                        {tasks.map((task) => (
                            <div key={task._id} className="task-card">
                                <div className="task-card-header">
                                    <h3>{task.description.substring(0, 50)}{task.description.length > 50 ? '...' : ''}</h3>
                                    {getStatusBadge(task)}
                                </div>

                                <div className="task-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Due Date:</span>
                                        <span className={`detail-value ${new Date(task.expiry) < new Date() ? 'overdue' : ''}`}>
                                            {formatDate(task.expiry)}
                                            {new Date(task.expiry) < new Date() && !task.isCompleted && (
                                                <span className="overdue-badge">Overdue</span>
                                            )}
                                        </span>
                                    </div>

                                    <div className="detail-row">
                                        <span className="detail-label">Location:</span>
                                        <span className="detail-value">{task.room.location}</span>
                                    </div>

                                    <div className="contact-section">
                                        <h4>Contact Information</h4>
                                        <div className="detail-row">
                                            <span className="detail-label">Primary Contact:</span>
                                            <span className="detail-value">
                                                <a href={`tel:${task.room.Contact_no1}`}>{task.room.Contact_no1}</a>
                                            </span>
                                        </div>
                                        {task.room.Contact_no2 && (
                                            <div className="detail-row">
                                                <span className="detail-label">Secondary Contact:</span>
                                                <span className="detail-value">
                                                    <a href={`tel:${task.room.Contact_no2}`}>{task.room.Contact_no2}</a>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="task-actions">
                                    {!task.isAccepted && (
                                        <button onClick={() => handleAccept(task._id)} className="action-button accept">Accept Task</button>
                                    )}
                                    {task.isAccepted && !task.isCompleted && (
                                        <button className="action-button complete">Mark Complete</button>
                                    )}
                                    <button
                                        className="action-button secondary"
                                        onClick={() =>
                                            handleViewMap(task.room.coordinate.lat, task.room.coordinate.lon)
                                        }
                                    >
                                        View Directions
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default TaskReq;