import React, { useState, useEffect, useCallback } from 'react';
import '../styles/dashboard.css';
const API_BASE_URL = "https://businesssurvey-gvrb.onrender.com/api";

const SurveyDashboard = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch
    const [error, setError] = useState(null); // State to hold fetch errors
    const [isDeleting, setIsDeleting] = useState(false); // State for single item deletion
    const [isClearing, setIsClearing] = useState(false); // State for clear all

    // Function to fetch survey data
    const fetchSurveyData = useCallback(async () => {
        setIsLoading(true);
        setError(null); // Clear previous errors
        try {
            const response = await fetch(`${API_BASE_URL}/get-surveys`);
            if (!response.ok) {
                 const errorBody = await response.text().catch(() => 'Unknown error');
                 throw new Error(`HTTP error! status: ${response.status} - ${errorBody}`);
            }
            const result = await response.json();
            setUsers(result.usersData || []);
        } catch (err) {
            setError(`Failed to load survey data: Please  connect to internate.`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSurveyData();
    }, [fetchSurveyData]);

    const handleDeleteUser = useCallback(async (userId) => {
        if (isDeleting || isClearing) return;

        if (!window.confirm("Are you sure you want to delete this survey entry?")) {
            return;
        }

        setIsDeleting(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/delete-user/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                 const errorText = await response.text().catch(() => 'Unknown error');
                 throw new Error(`Failed to delete user: ${response.status} ${errorText}`);
            }

            setUsers(currentUsers => currentUsers.filter(user => user._id !== userId));

        } catch (err) {
            setError(`Failed to delete entry: ${err.message}. Please try again.`);
        } finally {
            setIsDeleting(false);
        }
    }, [isDeleting, isClearing]);

    const handleClearAll = useCallback(async () => {
        if (isClearing || isDeleting) return;

        if (!window.confirm("Are you sure you want to delete ALL survey entries? This action cannot be undone!")) {
            return;
        }

        setIsClearing(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/delete-all-users`, {
                method: 'DELETE',
            });

             if (!response.ok) {
                 const errorText = await response.text().catch(() => 'Unknown error');
                 throw new Error(`Failed to delete all users: ${response.status} ${errorText}`);
            }

            setUsers([]);

        } catch (err) {
           
            setError(`Failed to clear all entries: ${err.message}. Please try again.`);
        } finally {
            setIsClearing(false);
        }
    }, [isClearing, isDeleting]);


    let content;
    if (isLoading) {
         content = (
            <div className="dashboard-loading-state">
                <div className="spinner"></div>
                <p>Loading survey data...</p>
            </div>
        );
    } else if (error) {
        content = (
            <div className="dashboard-error-state">{error}</div> 
        );
    } else if (users.length === 0) {
        content = (
            <div className="dashboard-empty-state">No survey data submitted yet.</div>
        );
    } else {
        content = (
            <div className="users-list">
                {users.map(user => (
                    <div key={user._id} className="user-card"> 
                        <h3>{user.fullname || 'Anonymous User'}</h3>
                        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                        <p><strong>Address (City):</strong> {user.address || 'N/A'}</p>
                        <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
                        <p><strong>Job Status:</strong> {user.usersJob || 'N/A'}</p>

                        {user.jobType && <p><strong>Job Type:</strong> {user.jobType}</p>}
                        {user.levelOfEducation && <p><strong>Education Level:</strong> {user.levelOfEducation}</p>}
                        {user.wayOfGettingInfo && <p><strong>Preferred Info Channel:</strong> {user.wayOfGettingInfo}</p>}

                         {user.questionOne && user.questionOne.length > 0 && (
                             <div className="q1-list-container"> {/* Applied CSS class */}
                                <p><strong>Reasons for Interest (Q1):</strong></p>
                                <ul>
                                     {user.questionOne.map((reason, index) => (
                                         <li key={index}>{reason}</li>
                                     ))}
                                </ul>
                             </div>
                         )}

                        <button
                            className="delete-user-button"
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={isDeleting || isClearing}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="dashboard-page-container"> {/* Applied CSS class */}
            <div className="dashboard-content-container"> {/* Applied CSS class */}
                <h1>Survey Submissions Dashboard</h1>

                <div className="dashboard-actions"> {/* Applied CSS class */}
                    {users.length > 0 && (
                         <button
                            className="clear-all-button" 
                            onClick={handleClearAll}
                            disabled={isClearing || isDeleting}
                        >
                            {isClearing ? 'Clearing All...' : 'Clear All Surveys'}
                        </button>
                    )}
                </div>

                {content}

            </div>
        </div>
    );
};

export default SurveyDashboard;