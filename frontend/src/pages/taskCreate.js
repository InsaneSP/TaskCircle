import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateTask = () => {
  const { user } = useAuth(); // ✅ Call hooks first
  const router = useRouter();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'To Do',
    assignedTo: ''
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
      if (user === null) {
        router.push('/login');
      }
    }, [user]);
  
    if (user === null) {
      return null;
    }

  useEffect(() => {
    if (user?.id) {
      axios.get("http://localhost:5000/api/users").then(res => setUsers(res.data));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (!user?.id) {
    console.log("No user id");
    return;
  }
  console.log("AssignedTo:", newTask.assignedTo);
  console.log("Users list:", users.map(u => ({ name: u.name, uid: u.uid })));

    const assignedUser = users.find(u => u._id === newTask.assignedTo);
    if (!assignedUser) {
      console.log("Assigned user not found");
      return;
    }

    const taskData = {
      ...newTask,
      assignedTo: assignedUser.uid,
      assignedBy: user.id,
      createdBy: user.id,
    };

    console.log("Task data to send:", taskData);

    try {
      const response = await axios.post("http://localhost:5000/api/tasks", taskData);
      console.log("Response:", response);
      if (response.status === 201) {
        router.push('/dashboard');
      } else {
        console.log("Unexpected response:", response.status);
      }
    } catch (err) {
      console.error("Error creating task", err.response?.data || err.message);
    }
  };

  if (!user?.id) {
    return <div>User is not logged in or missing ID.</div>;
  }

  return (
    <div className="container">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          required
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={newTask.assignedTo}
          onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
        >
          <option value="">-- Assign to --</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default CreateTask;