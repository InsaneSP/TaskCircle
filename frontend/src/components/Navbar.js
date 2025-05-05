import { useState } from "react";
import Link from "next/link";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext"; 

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="left">
        <span className="logo">🛞 TaskCircle </span>
        <Link href="/dashboard" className="link">Dashboard</Link>
        <Link href="/tasks" className="link">Tasks</Link>
        <Link href="/team" className="link">Team</Link>
      </div>

      <div className="right">
        {/* Notifications dropdown */}
        <div className="notification" onClick={() => {
          setShowNotifications(!showNotifications);
          setShowProfile(false);
        }}>
          🔔
          <span className="badge">2</span>
          {showNotifications && (
            <div className="dropdown">
              <h4>Notifications</h4>
              <div className="tabs">
                <button className="activeTab">All</button>
                <button>Unread <span className="unread">2</span></button>
              </div>
              <div className="notifItem">
                <strong>Task Assigned</strong>
                <p>You have been assigned to ‘Redesign the landing page’</p>
                <span>30 minutes ago</span>
              </div>
              <div className="notifItem">
                <strong>Task Updated</strong>
                <p>The due date for ‘Fix bug on mobile’ was changed</p>
                <span>2 hours ago</span>
              </div>
              <button className="viewAll">View all notifications</button>
            </div>
          )}
        </div>

        {/* Profile avatar dropdown */}
        <div className="avatar" onClick={() => {
          setShowProfile(!showProfile);
          setShowNotifications(false);  // Close notifications dropdown if open
        }}>
          {user ? user.name.substring(0, 2).toUpperCase() : "??"} {/* Display first 2 letters of user's name */}
          {showProfile && (
            <div className="profileDropdown">
              <div>
                <strong>{user ? user.name : "Guest"}</strong><br />
                <small>{user ? user.email : "Not logged in"}</small>
              </div>
              <hr />
              <Link href="/profile">👤 Profile</Link>
              <Link href="/settings">⚙️ Settings</Link>
              {/* Only show logout button if user is authenticated */}
              {isAuthenticated && (
                <button onClick={() => { 
                  logout(); 
                  // Optionally redirect to login page after logout
                  window.location.href = "/login"; 
                }}>
                  ↩️ Log out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
