import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ManageCourseAssignments() {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/assignments/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(res.data);
    } catch (err) {
      setMessage('Failed to fetch assignments');
    }
  };

  // CREATE
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:4000/api/assignments/${courseId}`,
        { title, description: desc, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setTitle(''); setDesc(''); setDueDate('');
      fetchAssignments();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Create failed');
    }
  };

  // DELETE
  const handleDelete = async (assignmentId) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/assignments/${courseId}/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Assignment deleted');
      fetchAssignments();
    } catch (err) {
      setMessage('Delete failed');
    }
  };

  // (Optional) for editing, you'd do a PATCH route similarly

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Manage Assignments</h3>
      {message && <p>{message}</p>}

      {/* CREATE form */}
      <div>
        <label>Title:</label><br/>
        <input value={title} onChange={(e) => setTitle(e.target.value)} /><br/>
        <label>Description:</label><br/>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} /><br/>
        <label>Due Date:</label><br/>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        /><br/>
        <button onClick={handleCreate}>Create Assignment</button>
      </div>
      <hr/>
      {/* LIST assignments */}
      <ul>
        {assignments.map((a) => (
          <li key={a._id}>
            <strong>{a.title}</strong> (due: {a.dueDate || 'N/A'})
            <br/>
            {a.description}
            <br/>
            <button onClick={() => handleDelete(a._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageCourseAssignments;
