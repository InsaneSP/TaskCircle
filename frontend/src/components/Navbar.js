import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import { useMemo } from "react";

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
  transports: ["websocket"],
  autoConnect: false,
});

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("unread");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) =>
      activeTab === "unread" ? !n.read : n.read
    );
  }, [notifications, activeTab]);

  useEffect(() => {
    console.log("User changed:", user);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    console.log("User object:", user);

    const userId = user.id || user.uid;
    if (!userId) {
      console.error("User ID is not available. Cannot connect to socket.");
      return;
    }

    socket.connect();
    socket.emit("join", userId);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          console.error("Expected an array of notifications, but got:", data);
          setNotifications([]);  // Fallback to an empty array
        }})
      .catch((error) => console.error("Failed to fetch notifications:", error));

    const handleNewNotif = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    };

    socket.on("newNotification", handleNewNotif);

    return () => {
      socket.off("newNotification", handleNewNotif);
      socket.disconnect();
    };
  }, [user]);

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="left">
        <span className="logo">🛞 TaskCircle </span>
        <Link href="/dashboard" className="link">Dashboard</Link>
        <Link href="/tasks" className="link">Tasks</Link>
        {/* <Link href="/team" className="link">Team</Link> */}
      </div>

      <div className="right">
        <div className="notification" onClick={() => {
          setShowNotifications(!showNotifications);
          setShowProfile(false);
        }}>
          🔔
          <span className="badge">{notifications.filter(n => !n.read).length}</span>
          {showNotifications && (
            <div className="dropdown">
              <h4>Notifications</h4>

              <div className="tabs">
                <button
                  className={activeTab === "unread" ? "activeTab" : ""}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("unread");
                  }}
                >
                  Unread <span className="unread">{notifications.filter(n => !n.read).length}</span>
                </button>
                <button
                  className={activeTab === "read" ? "activeTab" : ""}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("read");
                  }}
                >
                  Read
                </button>

              </div>

              <div className="notifList">
                {filteredNotifications.length === 0 ? (
                  <div className="notifItem">No notifications</div>
                ) : (
                  filteredNotifications.slice(0, 5).map((notif) => (
                    <div
                      className={`notifItem ${notif.read ? "read" : "unread"}`}
                      key={notif._id}
                      onClick={async () => {
                        try {
                          await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${notif._id}/read`,
                            { method: "PUT" }
                          );
                          setNotifications((prev) =>
                            prev.map((n) =>
                              n._id === notif._id ? { ...n, read: true } : n
                            )
                          );
                        } catch (error) {
                          console.error("Failed to mark notification as read", error);
                        }
                      }}
                    >
                      <strong>{notif.message}</strong>
                      <p>{notif?.task?.title || ""}</p>
                      <span>{new Date(notif.createdAt).toLocaleTimeString()}</span>
                    </div>
                  ))
                )}
              </div>

              <Link href="/notifications">
                <button className="viewAll">View all notifications</button>
              </Link>
            </div>
          )}
        </div>

        <div className="avatar" onClick={() => {
          setShowProfile(!showProfile);
          setShowNotifications(false);
        }}>
          {user ? user.name.substring(0, 1).toUpperCase() : "??"}
          {showProfile && (
            <div className="profileDropdown">
              <div>
                <strong>{user?.name || "Guest"}</strong><br />
                <small>{user?.email || "Not logged in"}</small>
              </div>
              <hr />
              <Link href="/profile">👤 Profile</Link>
              {isAuthenticated && (
                <button onClick={() => {
                  logout();
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
