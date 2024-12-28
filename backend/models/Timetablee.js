const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  rows: {
    type: Number,
    required: true,
  },
  columns: {
    type: Number,
    required: true,
  },
  data: {
    type: [[String]],
    default: [],
  },
});

module.exports = mongoose.model('Timetable', timetableSchema);
