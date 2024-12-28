const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const timetableRoutes = require('./Routes/timetableRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

 
let dbConnected = false;
 
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    dbConnected = true;
    console.log('MongoDB connected');
  })
  .catch((err) => {
    dbConnected = false;
    console.error('MongoDB connection error:', err);
  });
 
app.get('/', (req, res) => {
  if (dbConnected) {
    res.send('<h3>Server is connected!</h3>');
  } else {
    res.status(500).send('Error: Server could not connect to the database');
  }
});

 
app.use('/api/timetables', timetableRoutes);

 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
