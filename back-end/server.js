const express = require('express');
const { exec } = require('child_process');
const { sequelize } = require('./models/User'); // Import sequelize instance
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Sync database
sequelize.sync({ force: true }).then(() => {
  console.log('Database & tables created!');
});

// Endpoint to generate text using vllm
app.post('/generate', (req, res) => {
  const prompt = req.body.prompt;
  exec(`python3 SmolLMService.py "${prompt}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Error generating text');
    }
    res.send(stdout);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
