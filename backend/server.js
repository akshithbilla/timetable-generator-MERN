const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const timetableRoutes = require('./Routes/timetableRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route for displaying a message in the browser
app.get('/', (req, res) => {
  res.send('Server is connected');
});

// Use routes
app.use('/api/timetables', timetableRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
