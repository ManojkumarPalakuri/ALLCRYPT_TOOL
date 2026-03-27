const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cryptoRoutes = require('./routes/crypto');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/crypto', cryptoRoutes);

app.get('/', (req, res) => {
    res.send('ALLCRYPT API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
