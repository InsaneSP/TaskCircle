import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Profile() {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    about: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        about: user.about || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/update`, {
        uid: user.uid,
        ...formData,
      });

      // Update local context with new user data
      setUser({ ...user, ...formData });
      alert("Profile updated successfully.");
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
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email (read-only)</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">About Me</label>
          <textarea
            className="form-control"
            name="about"
            value={formData.about}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Save Changes</button>
      </form>
    </div>
  );
}
