const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const chatRouter = require('./routes/chat');
const assignmentsRouter = require('./routes/assignments');

// Export the app for testing
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api', chatRouter);
app.use('/api', assignmentsRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/auth', require('./routes/auth'));

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;

