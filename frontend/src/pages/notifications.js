import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/NotificationsPage.css";
import socket from "../utils/socket";

useEffect(() => {
  if (!user?.uid) return;

  const userId = user.uid;

  if (!socket.connected) {
    socket.connect();
    socket.emit("join", userId);
  }

  const handleNewNotification = (notif) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  socket.on("newNotification", handleNewNotification);

  return () => {
    socket.off("newNotification", handleNewNotification);
  };
}, [user]);

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
 
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/notifications/${user.uid}?status=${filter}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          console.error("Expected array, got:", data);
          setNotifications([]);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setNotifications([]);
      }
    };
  
    if (user?.uid) {
      fetchNotifications();
    }
  }, [user, filter]);
  

  const markAsRead = async (id) => {
    await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: "PUT" });
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    await fetch(`http://localhost:5000/api/notifications/${user.uid}/read-all`, { method: "PUT" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (!user) return null;

  return (
    <div className="notificationsPage">
      <h2>All Notifications</h2>
      <div className="notifControls">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
        <button onClick={() => setFilter("unread")} className={filter === "unread" ? "active" : ""}>Unread</button>
        <button onClick={markAllAsRead}>Mark All as Read</button>
      </div>

      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <div className="notifList">
          {notifications.map((n) => (
            <div key={n._id} className={`notifItem ${n.read ? "read" : "unread"}`}>
              <strong>{n.message}</strong>
              <p>{n?.task?.title}</p>
              <span>{new Date(n.createdAt).toLocaleTimeString()}</span>
              {!n.read && <button onClick={() => markAsRead(n._id)}>Mark as Read</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
