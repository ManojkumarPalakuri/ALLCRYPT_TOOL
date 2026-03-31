const mongoose = require('mongoose');

const urlLinkSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  encryptedUrl: { type: String, required: true },
  passwordHash: { type: String, required: true },
  expiresAt: { type: Date, default: null }, // Optional
  accessCount: { type: Number, default: 0 },
  isOneTime: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UrlLink', urlLinkSchema);
