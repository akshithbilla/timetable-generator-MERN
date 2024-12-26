import React, { useState, useEffect, useCallback } from 'react';

const Timetable = ({ timetable, updateTimetable, deleteTimetable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState([]);
  const [name, setName] = useState(timetable.name);
  const [rows, setRows] = useState(timetable.rows);
  const [columns, setColumns] = useState(timetable.columns);

  useEffect(() => {
    setLocalData(timetable.data || Array.from({ length: timetable.rows }).map(() => Array(timetable.columns).fill('')));
    setName(timetable.name);
    setRows(timetable.rows);
    setColumns(timetable.columns);
  }, [timetable]);

  const resizeData = useCallback((newRows, newColumns) => {
    if (newRows <= 0 || newColumns <= 0) return;

    const newData = Array.from({ length: newRows }).map((_, rowIndex) =>
      rowIndex < localData.length
        ? localData[rowIndex].slice(0, newColumns).concat(Array(Math.max(newColumns - localData[rowIndex].length, 0)).fill(''))
        : Array(newColumns).fill('')
    );
    setLocalData(newData);
  }, [localData]);

  useEffect(() => {
    resizeData(rows, columns);
  }, [rows, columns, resizeData]);

  const handleInputChange = (rowIndex, colIndex, value) => {
    const updatedData = localData.map((row, ri) =>
      ri === rowIndex ? row.map((cell, ci) => (ci === colIndex ? value : cell)) : row
    );
    setLocalData(updatedData);
  };

  const handleSubmit = () => {
    updateTimetable(timetable._id, localData, name, rows, columns);
    setIsEditing(false);
  };

  return (
    <div className="timetable-container">
      <h3>Timetable Name: {isEditing ? (
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        ) : (
          timetable.name
        )}
      </h3>
      {isEditing && (
        <div>
          <label>
            Rows:
            <input type="number" value={rows} onChange={(e) => setRows(Math.max(parseInt(e.target.value) || 0, 1))} />
          </label>
          <label>
            Columns:
            <input type="number" value={columns} onChange={(e) => setColumns(Math.max(parseInt(e.target.value) || 0, 1))} />
          </label>
        </div>
      )}
      <table>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    value={localData[rowIndex]?.[colIndex] || ''}
                    onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                    disabled={!isEditing}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {isEditing ? (
        <div className="submit-buttons">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="submit-buttons">
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => deleteTimetable(timetable._id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Timetable;
