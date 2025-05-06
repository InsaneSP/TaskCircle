import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const EditTask = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [task, setTask] = useState(null);

  useEffect(() => {
    if (id && user?.id) {
      axios.get(`http://localhost:5000/api/tasks/${id}`).then(res => {
        setTask(res.data);
      });
    }
  }, [id, user]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Extract UIDs from nested user objects
    const updatedTask = {
      ...task,
      assignedTo: task.assignedTo?.uid || "",
      assignedBy: task.assignedBy?.uid || "",
      createdBy: task.createdBy?.uid || user.id,
    };
  
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedTask);
      console.log("Task updated successfully:", response.data);
      router.push('/dashboard');
    } catch (err) {
      console.error("Failed to update task:", err.response ? err.response.data : err.message);
    }
  };  
  
  if (!task) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>Edit Task</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={task.title} onChange={handleChange} required />
        <textarea name="description" value={task.description} onChange={handleChange} />
        <input name="dueDate" type="date" value={task.dueDate?.slice(0, 10)} onChange={handleChange} required />
        <select name="priority" value={task.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select name="status" value={task.status} onChange={handleChange}>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">Update Task</button>
      </form>
    </div>
  );
};

export default EditTask;
