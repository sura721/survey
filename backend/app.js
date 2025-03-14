const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User'); 
require('dotenv').config();
const cors= require('cors')

const app = express();
app.use(cors()); 
// Middleware to parse incoming request body
app.use(bodyParser.json()); // for JSON data
app.use(bodyParser.urlencoded({ extended: true })); // for form data

// Connect to MongoDB

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// POST endpoint to save survey data
app.post('/api/submit-survey', async (req, res) => {
  try {
    // Create a new user document based on the incoming data
    const newUser = new User({
      questionOne: req.body.questionOne,
      usersJob: req.body.usersJob,
      jobType: req.body.jobType,
      levelOfEducation: req.body.levelOfEducation,
      wayOfGettingInfo: req.body.wayOfGettingInfo,
      fullname: req.body.fullname,
      phone: req.body.phone,
      address: req.body.address,
      gender: req.body.gender,
    });

    // Save the user data to the database
    await newUser.save();

    // Send a success response
    res.status(200).json({ message: 'Survey data submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving survey data' });
  }
});

// Port setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
