const express = require('express');
const router = express.Router();
const { User, StudentParent, StudentEducator } = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const { generateStudentCode } = require('../utils/userUtils');

// Add student to parent
router.post('/parent/add-child', auth, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Only parents can add children' });
    }

    const { studentCode } = req.body;
    const student = await User.findOne({ 
      where: { studentCode, role: 'student' }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const existingRelationship = await StudentParent.findOne({
      where: {
        studentId: student.id,
        parentId: req.user.id
      }
    });

    if (existingRelationship) {
      return res.status(400).json({ message: 'Child already added to parent' });
    }

    await StudentParent.create({
      studentId: student.id,
      parentId: req.user.id
    });

    res.json({ message: 'Child added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add student to educator
router.post('/educator/add-student', auth, async (req, res) => {
  try {
    if (req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Only educators can add students' });
    }

    // Check license limit
    const currentStudents = await StudentEducator.count({
      where: { educatorId: req.user.id }
    });

    if (req.user.licenseLimit && currentStudents >= req.user.licenseLimit) {
      return res.status(403).json({ message: 'License limit reached' });
    }

    const { name, email } = req.body;
    const studentCode = await generateStudentCode();
    
    const student = await User.create({
      name,
      email,
      password: await bcrypt.hash(Math.random().toString(36), 10),
      role: 'student',
      studentCode
    });

    await StudentEducator.create({
      studentId: student.id,
      educatorId: req.user.id
    });

    res.json({ 
      message: 'Student created successfully',
      studentCode 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all children for a parent
router.get('/parent/children', auth, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const parent = await User.findByPk(req.user.id, {
      include: [{
        model: User,
        as: 'children',
        attributes: ['id', 'name', 'email', 'studentCode']
      }]
    });

    res.json(parent.children);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all students for an educator
router.get('/educator/students', auth, async (req, res) => {
  try {
    if (req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const educator = await User.findByPk(req.user.id, {
      include: [{
        model: User,
        as: 'students',
        attributes: ['id', 'name', 'email', 'studentCode']
      }]
    });

    res.json(educator.students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove child from parent
router.delete('/parent/remove-child/:studentId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await StudentParent.destroy({
      where: {
        parentId: req.user.id,
        studentId: req.params.studentId
      }
    });

    res.json({ message: 'Child removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add after the existing /parent/add-child route
router.post('/parent/create-child', auth, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Only parents can create children' });
    }

    const { name, email } = req.body;
    const studentCode = await generateStudentCode();
    
    const student = await User.create({
      name,
      email,
      password: await bcrypt.hash(Math.random().toString(36), 10),
      role: 'student',
      studentCode
    });

    await StudentParent.create({
      studentId: student.id,
      parentId: req.user.id
    });

    res.json({ 
      message: 'Child created successfully',
      studentCode 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 