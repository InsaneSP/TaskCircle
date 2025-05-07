// pages/tasks.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const TasksPage = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState([]);
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user]);

  if (user === null) {
    return null;
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`);
        setTasks(res.data);
        const uniqueAssignees = [...new Set(res.data.map(task => task.assignedTo?.name).filter(Boolean))];
        setAssignees(uniqueAssignees);
      } catch (err) {
        console.error('Error fetching tasks', err);
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    console.log(task);  // Log task data to verify status and priority values
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status);
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter.toLowerCase();
    const matchesAssignee = assigneeFilter.length === 0 || assigneeFilter.includes(task.assignedTo?.name);
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });
  

  const toggleFilter = (filter, value, setFilter) => {
    setFilter(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p>Manage and track all team tasks</p>
        </div>
        <Link href="/taskCreate">
          <button className="new-task-btn">+ New Task</button>
        </Link>
      </div>

      <div className="tasks-content">
        <aside className="filters">
          <div className="filter-group">
            <h3>Status</h3>
            {['To Do', 'In Progress', 'Completed'].map(status => (
              <label key={status}>
                <input
                  type="checkbox"
                  checked={statusFilter.includes(status)}
                  onChange={() => toggleFilter(statusFilter, status, setStatusFilter)}
                /> {status}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3>Priority</h3>
            {['All', 'High', 'Medium', 'Low'].map(p => (
              <label key={p}>
                <input
                  type="radio"
                  name="priority"
                  checked={priorityFilter === p}
                  onChange={() => setPriorityFilter(p)}
                /> {p}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3>Assignee</h3>
            {assignees.map(name => (
              <label key={name}>
                <input
                  type="checkbox"
                  checked={assigneeFilter.includes(name)}
                  onChange={() => toggleFilter(assigneeFilter, name, setAssigneeFilter)}
                /> {name}
              </label>
            ))}
          </div>
        </aside>

        <main className="task-table-container">
          <input
            className="search-bar"
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Assignee</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                  <td>{task.priority}</td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>{task.assignedTo?.name || '-'}</td>
                  <td>{task.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default TasksPage;
