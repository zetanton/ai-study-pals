const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

// Get dashboard data based on user role
router.get('/', async (req, res) => {
  try {
    const user = req.user;
    let dashboardData = {};

    switch (user.role) {
      case 'student':
        // Add student-specific dashboard data
        dashboardData = {
          role: 'student',
          name: user.name,
          // Add other student-specific data
        };
        break;

      case 'parent':
        // Parent sees their children's data
        dashboardData = {
          role: 'parent',
          children: user.children,
          // Add other parent-specific data
        };
        break;

      case 'educator':
        // Educator sees their students' data
        dashboardData = {
          role: 'educator',
          students: user.students,
          licenseLimit: user.licenseLimit,
          // Add other educator-specific data
        };
        break;

      default:
        return res.status(400).json({ message: 'Invalid user role' });
    }

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 