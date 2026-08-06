const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send("Backend is running");
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

const swotRoutes = require('./routes/swot');
app.use('/api/swot', swotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));