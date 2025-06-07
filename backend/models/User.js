const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  questionOne: {
    type: [String], // Array of strings, as it's an empty array in the initial state
  
  },
  usersJob: {
    type: String,  },
  jobType: {
    type: String
  },
  levelOfEducation: {
    type: String,
   
  },
  wayOfGettingInfo: {
    type: String,
   
  },
  fullname: {
    type: String,
   
  },
  phone: {
    type: String,
   
  },
  address: {
    type: String,

  },
  gender: {
    type: String,
   
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
