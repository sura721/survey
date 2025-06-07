const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User'); 

dotenv.config();
const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// MongoDB Connection
if (!process.env.MONGO_URL) {
  console.error('❌ MONGO_URL is missing in environment variables!');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// POST - Submit Survey Data
app.post('/api/submit-survey', async (req, res) => {
  try {
    const { questionOne, usersJob, jobType, levelOfEducation, wayOfGettingInfo, fullname, phone, address, gender } = req.body;

    if (!fullname || !phone) {
      return res.status(400).json({ message: '❌ Fullname and phone are required!' });
    }

    const newUser = new User({ questionOne, usersJob, jobType, levelOfEducation, wayOfGettingInfo, fullname, phone, address, gender });
    await newUser.save();

    res.status(201).json({ message: '✅ Survey data submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Error saving survey data' });
  }
});

app.get('/uptime', (req, res) => {
  console.log(`Ping received at : ${new Date().toISOString()}`);
  res.status(200).send('OK');
});


// GET - Fetch All Surveys
app.get('/api/get-surveys', async (req, res) => {
  try {
    const usersData = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ usersData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Error fetching survey data' });
  }
});

// DELETE - Remove Single User
app.delete('/api/delete-user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: '✅ User deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Error deleting user' });
  }
});

// DELETE - Remove All Users
app.delete('/api/delete-all-users', async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: '✅ All users deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Error deleting all users' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
