const express = require('express');
const router = express.Router();

router.get('/previous-assignments', (req, res) => {
  // Mock data - replace with actual database query
  const assignments = [
    {
      id: 1,
      name: 'Math Homework 1',
      grade: '95',
      submittedDate: '2024-03-15'
    }
  ];
  
  res.json(assignments);
});

module.exports = router; 