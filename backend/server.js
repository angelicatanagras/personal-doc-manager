const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const registerAppListeners = require('./listeners/registerAppListeners');

dotenv.config();

const app = express();

registerAppListeners();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/folders', require('./routes/folderRoutes'));
app.use('/api/versions', require('./routes/versionRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.send(`<h1>Welcome to Personal Doc Manager - Server Instance: ${process.env.INSTANCE_NAME || 'Unknown'}</h1>`);
});

if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
