import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const userId = user?.id;
  const [activeTab, setActiveTab] = useState('assigned');
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0, completed: 0, inProgress: 0, teamMembers: 0,
    priorities: { high: 0, medium: 0, low: 0 },
    statuses: { todo: 0, inProgress: 0, completed: 0 },
  });

  const calculateStats = (taskList) => {
    const priorityCounts = { high: 0, medium: 0, low: 0 };
    const statusCounts = { todo: 0, inProgress: 0, completed: 0 };

    taskList.forEach(task => {
      const priority = task.priority?.toLowerCase();
      if (priority && priorityCounts[priority] !== undefined) {
        priorityCounts[priority]++;
      }

      if (task.status === 'To Do') statusCounts.todo++;
      else if (task.status === 'In Progress') statusCounts.inProgress++;
      else if (task.status === 'Completed') statusCounts.completed++;
    });

    return {
      total: taskList.length,
      completed: statusCounts.completed,
      inProgress: statusCounts.inProgress,
      priorities: priorityCounts,
      statuses: statusCounts
    };
  };

  useEffect(() => {
    if (user === null) {
      router.push('/login'); 
    }
  }, [user]);

  if (user === null) {
    return null;
  }

  useEffect(() => {
    const fetchTasksAndStats = async () => {
      if (!userId) return;

      try {
        let endpoint = '';
        if (activeTab === 'assigned' || activeTab === 'overdue') {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/assigned/${userId}`;
        } else if (activeTab === 'created') {
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/created/${userId}`;
        }

        const res = await axios.get(endpoint);
        let filteredTasks = res.data;

        if (activeTab === 'overdue') {
          const now = new Date();
          filteredTasks = filteredTasks.filter(
            task => new Date(task.dueDate) < now && task.status !== 'Completed'
          );
        }

        setTasks(filteredTasks);
        setStats(prev => ({
          ...prev,
          ...calculateStats(filteredTasks)
        }));
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };

    fetchTasksAndStats();
  }, [userId, activeTab]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`, { status: newStatus });

      const updatedTasks = tasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );

      setTasks(updatedTasks);
      setStats(prev => ({
        ...prev,
        ...calculateStats(updatedTasks)
      }));
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`);
      const updatedTasks = tasks.filter(task => task._id !== taskId);
      setTasks(updatedTasks);
      setStats(prev => ({
        ...prev,
        ...calculateStats(updatedTasks)
      }));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-heading">Dashboard</h1>
        <Link href="/taskCreate">
          <button className="new-task-button">+ New Task</button>
        </Link>
      </div>

      <div className="metrics-container">
        <MetricCard title="Total Tasks" value={stats.total} />
        <MetricCard title="Completed" value={stats.completed} />
        <MetricCard title="In Progress" value={stats.inProgress} />
        <MetricCard title="Team Members" value={stats.teamMembers} />
      </div>

      <div className="tabs-container">
        {['assigned', 'created', 'overdue'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? 'active-tab' : ''}`}
          >
            {tab === 'assigned' ? 'Assigned to Me' : tab === 'created' ? 'Created by Me' : 'Overdue'}
          </button>
        ))}
      </div>

      <div className="tasks-container">
        <div className="task-list">
          <h2 className="task-list-title">
            {activeTab === 'assigned' ? 'Tasks Assigned to Me' :
              activeTab === 'created' ? 'Tasks Created by Me' : 'Overdue Tasks'}
          </h2>

          {tasks.map(task => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <p className="task-title">{task.title}</p>
                <span className="task-assigned-icon">👤</span>
              </div>
              <p className="task-description">{task.description}</p>
              <p className="task-due-date">Due {new Date(task.dueDate).toLocaleDateString()}</p>
              <div className="task-status-priority">
                <span className={`task-priority ${task.priority}-priority`}>{task.priority}</span>
                <span className={`task-status ${task.status.toLowerCase().replace(" ", "-")}`}>
                  {activeTab === 'assigned' ? (
                    <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className={`status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  
                  ) : (
                    task.status
                  )}
                </span>
              </div>

              {activeTab === 'created' && (
                <div className="task-actions">
                  <Link href={`/taskEdit/${task._id}`}>
                    <button className="edit-button">✏️ Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(task._id)}>🗑 Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="task-stats">
          <h2 className="task-stats-title">Task Statistics</h2>
          {Object.entries(stats.statuses).map(([label, count]) => (
            <ProgressBar key={label} label={label} value={count} />
          ))}
          <hr className="divider" />
          {Object.entries(stats.priorities).map(([label, count]) => (
            <ProgressBar key={label} label={`${label} priority`} value={count} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value }) => (
  <div className="metric-card">
    <p className="metric-card-title">{title}</p>
    <h3 className="metric-card-value">{value}</h3>
  </div>
);

const ProgressBar = ({ label, value }) => (
  <div className="progress-bar-container">
    <div className="progress-bar-header">
      <span className="progress-bar-label">{label}</span>
      <span className="progress-bar-value">{value}</span>
    </div>
    <div className="progress-bar-background">
      <div className="progress-bar" style={{ width: `${value * 10}%` }}></div>
    </div>
  </div>
);

export default Dashboard;