const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const UrlLink = require('../models/UrlLink');

const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: { message: 'Too many links created, please try again later.' }
});

const accessLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50, 
  message: { message: 'Too many attempts, please try again later.' }
});

const getEncryptionKey = () => {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) throw new Error("ENCRYPTION_SECRET not set");
  if (secret.length === 64) {
    return Buffer.from(secret, 'hex');
  } else if (secret.length === 32) {
      return Buffer.from(secret);
  } else {
      return crypto.createHash('sha256').update(secret).digest();
  }
};

const encryptUrl = (text) => {
  const iv = crypto.randomBytes(16);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

const decryptUrl = (encryptedText) => {
  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encrypted = Buffer.from(textParts.join(':'), 'hex');
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

router.post('/create', createLimiter, async (req, res) => {
  try {
    const { url, password, expiresInMinutes, isOneTime } = req.body;

    if (!url || !password) {
      return res.status(400).json({ message: 'URL and password are required' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const encryptedUrl = encryptUrl(url);
    const token = crypto.randomBytes(4).toString('hex');

    let expiresAt = null;
    if (expiresInMinutes) {
      expiresAt = new Date(Date.now() + parseInt(expiresInMinutes) * 60 * 1000);
    }

    const newLink = new UrlLink({
      token,
      encryptedUrl,
      passwordHash,
      expiresAt,
      isOneTime: !!isOneTime
    });

    await newLink.save();
    res.status(201).json({ token, message: 'Link created successfully' });
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ message: 'Server error creating link' });
  }
});

router.post('/access/:token', accessLimiter, async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const link = await UrlLink.findOne({ token });
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      await UrlLink.deleteOne({ _id: link._id });
      return res.status(410).json({ message: 'This link has expired' });
    }

    const isMatch = await bcrypt.compare(password, link.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const url = decryptUrl(link.encryptedUrl);

    if (link.isOneTime) {
      await UrlLink.deleteOne({ _id: link._id });
    } else {
      link.accessCount += 1;
      await link.save();
    }

    res.json({ url });
  } catch (error) {
    console.error('Access link error:', error);
    // If decryption fails due to wrong key structure etc.
    res.status(500).json({ message: 'Server error accessing link' });
  }
});

module.exports = router;
