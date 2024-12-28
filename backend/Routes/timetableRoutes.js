const express = require('express');
const Timetable = require('../models/Timetablee');
const router = express.Router();

// Create a new timetable
router.post('/createTable', async (req, res) => {
  try {
    const { rows, columns } = req.body;
    const newTable = new Timetable({
      rows,
      columns,
      data: Array(rows).fill(Array(columns).fill('')),
    });
    await newTable.save();
    res.json(newTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all timetables
router.get('/getTable', async (req, res) => {
  try {
    const tables = await Timetable.find();
    res.json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a timetable
router.post('/updateTable', async (req, res) => {
  try {
    const { id, data } = req.body;
    const updatedTable = await Timetable.findByIdAndUpdate(id, { data }, { new: true });
    res.json(updatedTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add to timetableRoutes.js
router.delete('/deleteTable/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Timetable.findByIdAndDelete(id);
      res.json({ message: 'Timetable deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

module.exports = router;
