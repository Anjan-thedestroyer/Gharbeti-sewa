import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { Helmet } from 'react-helmet';
import './AccWork.css';
import { useNavigate } from 'react-router-dom';

const AccWork = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axiosInstance.get('/freelance/accepted');
                setTasks(response.data?.data || []);

                setError(null);
            } catch (error) {
                console.error("Error fetching accepted tasks:", error);
                setError("Failed to load accepted tasks. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    const formatPhoneNumber = (phone) => {
        if (!phone) return 'N/A';
        const phoneStr = phone.toString();
        return `${phoneStr.slice(0, 4)}-${phoneStr.slice(4, 7)}-${phoneStr.slice(7)}`;
    };

    // Helper function to safely access room properties
    const getRoomProperty = (room, property) => {
        if (!room) return 'N/A';
        return room[property] || 'N/A';
    };
    const handleComplete = async (id, task_id) => {
        navigate(`/verify/${id}/${task_id}`)
    }
    return (
        <main className="accepted-work-container">
            <Helmet>
                <title>My Accepted Tasks | Gharbeti-sewa</title>
                <meta
                    name="description"
                    content="View and manage all your accepted freelance tasks in one place with client details and task specifications."
                />
            </Helmet>

            <header className="work-header">
                <h1>Accepted Tasks</h1>
                <p className="work-subtitle">Your current assignments and client details</p>
            </header>

            <section aria-live="polite">
                {loading && (
                    <div className="loading-state">
                        <div className="spinner" aria-hidden="true"></div>
                        <span>Loading tasks...</span>
                    </div>
                )}

                {error && (
                    <div className="error-state" role="alert">
                        <span className="error-icon">⚠️</span>
                        <p>{error}</p>
                        <button
                            className="retry-button"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && tasks.length === 0 && (
                    <div className="empty-state">
                        <p>No accepted tasks found.</p>
                        <p>When you accept new tasks, they'll appear here.</p>
                    </div>
                )}

                {!loading && !error && tasks.length > 0 && (
                    <ul className="task-list" aria-label="List of accepted tasks">
                        {tasks.map((task) => (
                            <li key={task._id} className="task-card">
                                <article>
                                    <header className="task-header">
                                        <h2 className="task-title">{task.description || "Task Details"}</h2>
                                        <span className={`task-status ${task.isCompleted ? 'completed' : 'in-progress'}`}>
                                            {task.isCompleted ? "Completed" : "In Progress"}
                                        </span>
                                    </header>

                                    <div className="task-details-grid">
                                        <div className="task-detail-section">
                                            <h3>Task Information</h3>
                                            <p>
                                                <strong>Created:</strong>
                                                <time dateTime={task.createdAt}>
                                                    {new Date(task.createdAt).toLocaleString()}
                                                </time>
                                            </p>
                                            <p>
                                                <strong>Due:</strong>
                                                <time dateTime={task.expiry}>
                                                    {new Date(task.expiry).toLocaleString()}
                                                </time>
                                            </p>
                                        </div>

                                        <div className="task-detail-section">
                                            <h3>Client Details</h3>
                                            {task.assignedTo && task.assignedTo.length > 0 && (
                                                <>
                                                    <p><strong>Name:</strong> {task.assignedTo[0].name || 'N/A'}</p>
                                                    <p><strong>Email:</strong> {task.assignedTo[0].email || 'N/A'}</p>
                                                    <p>
                                                        <strong>Phone:</strong>
                                                        {formatPhoneNumber(task.assignedTo[0].phone) || 'N/A'}
                                                    </p>
                                                    <p>
                                                        <strong>Location:</strong>
                                                        {task.assignedTo[0].location || 'N/A'}
                                                    </p>
                                                </>
                                            )}
                                        </div>

                                        <div className="task-detail-section">
                                            <h3>Property Details</h3>
                                            <p><strong>Shutter :</strong> {getRoomProperty(task.room, 'shutter')}</p>
                                            <p><strong>location:</strong> {getRoomProperty(task.room, 'location')}</p>
                                            <p><strong>Pricing:</strong> NPR {task.room?.pricing?.toLocaleString() || 'N/A'}</p>
                                            <p>
                                                <strong>Coordinates:</strong>
                                                {task.room?.coordinate ?
                                                    `${task.room.coordinate.lat}, ${task.room.coordinate.lon}` : 'N/A'}
                                            </p>
                                            <p><strong>Contact 1:</strong> {getRoomProperty(task.room, 'Contact_no1')}</p>
                                            <p><strong>Contact 2:</strong> {getRoomProperty(task.room, 'Contact_no2')}</p>
                                        </div>
                                    </div>

                                    {!task.isCompleted && (
                                        <footer className="task-actions">
                                            <button onClick={() => handleComplete(task.room._id, task._id)} className="complete-button">
                                                Complete
                                            </button>

                                            <button className="details-button">
                                                In map
                                            </button>
                                        </footer>
                                    )}
                                </article>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
};

export default AccWork;