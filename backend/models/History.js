const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  task: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('History', historySchema);  // Collection name: 'histories'
