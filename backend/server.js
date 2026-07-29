// SAHI ORDER
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();   // ✅ Pehle declare karo

app.use(cors());          // ✅ Uske baad use karo
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send("Backend is running");
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));