import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/NotificationsPage.css";
import socket from "../utils/socket";
import { useRouter } from "next/router";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const userId = user?.id || user?.uid;
      if (!userId) return;

      console.log("Using userId:", userId);

      const res = await fetch(`http://localhost:5000/api/notifications/${userId}?status=${filter}`);
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

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, filter]);

  useEffect(() => {
    const userId = user?.id || user?.uid;
    if (!userId) return;

    if (!socket.connected) {
      socket.connect();
      socket.emit("join", userId);
    }

    const handleNewNotification = (notif) => {
      if (filter === "all" || (filter === "unread" && !notif.read)) {
        setNotifications((prev) => [notif, ...prev]);
      }
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [user, filter]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (user) {
        fetchNotifications();
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, user]);

  const markAsRead = async (id) => {
    await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: "PUT" });
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    const userId = user?.id || user?.uid;
    if (!userId) {
      console.error("User ID is undefined. Cannot mark all as read.");
      return;
    }

    try {
      console.log("Marking all as read for userId:", userId);
      await fetch(`http://localhost:5000/api/notifications/${userId}/read-all`, { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="notificationsPage">
      <h2>All Notifications</h2>
      <div className="notifControls">
        <div className="filterButtons">
          <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
          <button onClick={() => setFilter("unread")} className={filter === "unread" ? "active" : ""}>Unread</button>
        </div>
        <div className="markAllButton">
          <button onClick={markAllAsRead}>Mark All as Read</button>
        </div>
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
