import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Timetable from './components/Timetable';

function App() {
  const [name, setName] = useState('');
  const [rows, setRows] = useState('');
  const [columns, setColumns] = useState('');
  const [timetables, setTimetables] = useState([]);
  const [selectedTimetable, setSelectedTimetable] = useState(null);

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const response = await axios.get('https://timetable-generator-backend-2pby.onrender.com/api/timetables/getTable');
      setTimetables(response.data);
      if (response.data.length > 0) {
        setSelectedTimetable(response.data[response.data.length - 1]);
      }
    } catch (error) {
      console.error('Error fetching timetables:', error);
    }
  };

  const createTimetable = async () => {
    if (name && rows && columns) {
      try {
        const response = await axios.post('https://timetable-generator-backend-2pby.onrender.com/api/timetables/createTable', { name, rows: parseInt(rows), columns: parseInt(columns) });
        setTimetables([...timetables, response.data]);
        setSelectedTimetable(response.data);
        setName('');
        setRows('');
        setColumns('');
      } catch (error) {
        console.error('Error creating timetable:', error);
      }
    } else {
      alert('Please enter a valid table name, row, and column numbers');
    }
  };

  const updateTimetable = async (id, updatedData, updatedName, updatedRows, updatedColumns) => {
    try {
      const response = await axios.post('https://timetable-generator-backend-2pby.onrender.com/api/timetables/updateTable', { id, data: updatedData, name: updatedName, rows: updatedRows, columns: updatedColumns });
      setTimetables(timetables.map(t => (t._id === id ? response.data : t)));
      setSelectedTimetable(response.data);
    } catch (error) {
      console.error('Error updating timetable:', error);
    }
  };

  const deleteTimetable = async (id) => {
    try {
      await axios.delete(`https://timetable-generator-backend-2pby.onrender.com/api/timetables/deleteTable/${id}`);
      const updatedTimetables = timetables.filter(t => t._id !== id);
      setTimetables(updatedTimetables);
      setSelectedTimetable(updatedTimetables.length > 0 ? updatedTimetables[updatedTimetables.length - 1] : null);
    } catch (error) {
      console.error('Error deleting timetable:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Create New Timetable</h1>
      <div className="form-group">
        <label>
          Table Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Rows:
          <input type="number" value={rows} onChange={(e) => setRows(e.target.value)} />
        </label>
        <label>
          Columns:
          <input type="number" value={columns} onChange={(e) => setColumns(e.target.value)} />
        </label>
        <button onClick={createTimetable}>Create</button>
      </div>

      <h2>Select Timetable</h2>
      <select onChange={(e) => setSelectedTimetable(timetables.find(t => t._id === e.target.value))} value={selectedTimetable?._id || ''}>
        {timetables.map(timetable => (
          <option key={timetable._id} value={timetable._id}>{timetable.name}</option>
        ))}
      </select>

      {selectedTimetable && (
        <Timetable
          timetable={selectedTimetable}
          updateTimetable={updateTimetable}
          deleteTimetable={deleteTimetable}
        />
      )}
    </div>
  );
}

export default App;
