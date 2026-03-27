const express = require('express');
const crypto = require('crypto');

const router = express.Router();

const getAlgoDetails = (algo) => {
  switch (algo) {
    case 'AES-256': return { name: 'aes-256-cbc', keyLen: 32, ivLen: 16 };
    case 'AES-192': return { name: 'aes-192-cbc', keyLen: 24, ivLen: 16 };
    case 'AES-128': return { name: 'aes-128-cbc', keyLen: 16, ivLen: 16 };
    default: return { name: 'aes-256-cbc', keyLen: 32, ivLen: 16 };
  }
};

const deriveKey = (password, keyLen) => {
  // Using a static salt for simplicity, but in a real app this could be dynamic 
  // and prepended to the ciphertext.
  return crypto.scryptSync(password, 'allcrypt_salt', keyLen);
};

router.post('/encrypt', async (req, res) => {
  const { text, password, algorithm } = req.body;
  try {
    if (!text || !password) return res.status(400).json({ message: 'Text and password are required' });
    
    const details = getAlgoDetails(algorithm);
    const key = deriveKey(password, details.keyLen);
    const iv = crypto.randomBytes(details.ivLen);
    
    const cipher = crypto.createCipheriv(details.name, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Combining IV and ciphertext
    const resultPayload = iv.toString('hex') + ':' + encrypted;
    
    res.json({ result: resultPayload, keyUsed: password });
  } catch (err) {
    res.status(500).json({ message: 'Encryption failed', error: err.message });
  }
});

router.post('/decrypt', async (req, res) => {
  const { encryptedText, password, algorithm } = req.body;
  try {
    if (!encryptedText || !password) return res.status(400).json({ message: 'Encrypted text and password are required' });

    const details = getAlgoDetails(algorithm);
    const key = deriveKey(password, details.keyLen);
    
    const parts = encryptedText.split(':');
    if (parts.length !== 2) return res.status(400).json({ message: 'Invalid encrypted text format. Must contain :' });
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedData = parts[1];
    
    const decipher = crypto.createDecipheriv(details.name, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    res.json({ result: decrypted });
  } catch (err) {
    res.status(500).json({ message: 'Decryption failed. Invalid password or corrupted data.', error: err.message });
  }
});

module.exports = router;
