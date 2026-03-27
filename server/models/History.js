const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  operationType: { type: String, enum: ['ENCRYPT', 'DECRYPT'], required: true },
  algorithm: { type: String, default: 'aes-256-cbc' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
