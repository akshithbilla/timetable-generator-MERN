import React, { useState, useEffect } from 'react';

const Timetable = ({ timetable, updateTimetable, deleteTimetable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    setLocalData(timetable.data || Array.from({ length: timetable.rows }).map(() => Array(timetable.columns).fill('')));
  }, [timetable]);

  const handleInputChange = (rowIndex, colIndex, value) => {
    const updatedData = localData.map((row, ri) =>
      ri === rowIndex ? row.map((cell, ci) => (ci === colIndex ? value : cell)) : row
    );
    setLocalData(updatedData);
  };

  const handleSubmit = () => {
    updateTimetable(timetable._id, localData);
    setIsEditing(false);
  };

  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Popup blocker is preventing the print window from opening. Please allow popups for this site.');
        return;
      }

      const tableHTML = `
        <html>
          <head>
            <title>Print Timetable</title>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              td {
                border: 1px solid #000;
                text-align: center;
                padding: 10px;
              }
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
            </style>
          </head>
          <body>
            <h1>Timetable ID: ${timetable._id}</h1>
            <table>
              ${localData
                .map(
                  (row) =>
                    `<tr>${row
                      .map((cell) => `<td>${cell || ''}</td>`)
                      .join('')}</tr>`
                )
                .join('')}
            </table>
            <script>
              window.onload = () => {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(tableHTML);
      printWindow.document.close();
    } catch (error) {
      console.error('Error during printing:', error);
    }
  };

  return (
    <div className="timetable-container">
      <h3>Timetable ID: {timetable._id}</h3>
      <table>
        <tbody>
          {localData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    value={cell}
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
        <div>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => deleteTimetable(timetable._id)}>Delete</button>
          <button onClick={handlePrint}>Print Table</button>
        </div>
      )}
    </div>
  );
};

export default Timetable;
