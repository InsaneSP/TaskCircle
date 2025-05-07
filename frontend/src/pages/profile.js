import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Profile() {
    const { user, setUser } = useAuth();
    console.log("User in context:", user);  // Log the user object

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        about: '',
        phone: '',
        location: '',
        dob: '',
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!user?.id) {
            console.log("User ID is not available.");
            return; // Exit early if user.id is undefined
        }

        const fetchUserData = async () => {
            console.log("Fetching user profile for ID:", user.id);  // Log user ID
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${user.id}`);
                setUser(response.data); // Update the user context or state with the fetched data
            } catch (err) {
                console.error("Failed to fetch user data", err);
            }
        };

        fetchUserData();
    }, [user?.id]); // Trigger the effect when user.id changes

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                about: user.about || '',
                phone: user.phone || '',
                location: user.location || '',
                dob: user.dob ? user.dob.slice(0, 10) : '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Ensure user.uid is available before proceeding
        if (!user?.uid) {
            alert("User ID is missing. Please try logging in again.");
            return; // Exit early if user.uid is undefined
        }
    
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/update-profile/${user.uid}`, {
                uid: user.uid,  // Use the correct uid field here
                ...formData,  // Include the form data to update
            });
    
            setUser({
                ...user,
                name: res.data.name,
                email: res.data.email,
                about: res.data.about,
                phone: res.data.phone,
                location: res.data.location,
                dob: res.data.dob,
            });
    
            setFormData({
                name: res.data.name,
                email: res.data.email,
                about: res.data.about,
                phone: res.data.phone,
                location: res.data.location,
                dob: res.data.dob ? res.data.dob.slice(0, 10) : '',
            });
    
            alert("Profile updated successfully.");
            setIsEditing(false); // Close edit mode after saving
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        }
    };    

    if (!user) return <div className="container text-center mt-5">Please log in to view your profile.</div>;

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4">Your Profile</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                {[{ label: 'Full Name', name: 'name', type: 'text' },
                  { label: 'Email', name: 'email', type: 'email', disabled: true },
                  { label: 'About Me', name: 'about', type: 'textarea' },
                  { label: 'Phone Number', name: 'phone', type: 'tel' },
                  { label: 'Location', name: 'location', type: 'text' },
                  { label: 'Date of Birth', name: 'dob', type: 'date' }]
                    .map(({ label, name, type, disabled }) => (
                    <div className="mb-3" key={name}>
                        <label className="form-label">{label}</label>
                        {type === 'textarea' ? (
                            <textarea
                                className="form-control"
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                rows="3"
                                placeholder={`Enter ${label.toLowerCase()}`}
                                disabled={!isEditing || disabled}
                            ></textarea>
                        ) : (
                            <input
                                type={type}
                                className="form-control"
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                placeholder={`Enter ${label.toLowerCase()}`}
                                disabled={!isEditing || disabled}
                            />
                        )}
                    </div>
                ))}

                {isEditing ? (
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-success">Save Changes</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                ) : (
                    <button type="button" className="btn btn-primary w-100" onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
            </form>
        </div>
    );
}
