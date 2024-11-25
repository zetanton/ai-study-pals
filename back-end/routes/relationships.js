const express = require('express');
const router = express.Router();
const { User, StudentParent, StudentEducator } = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const { generateStudentCode } = require('../utils/userUtils');
const sequelize = require('../config/database');

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

// Remove student association from educator
router.delete('/educator/remove-student/:studentId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await StudentEducator.destroy({
      where: {
        educatorId: req.user.id,
        studentId: req.params.studentId
      }
    });

    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student completely (only if educator created them)
router.delete('/educator/delete-student/:studentId', auth, async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    if (req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // First check if the educator is associated with this student
    const association = await StudentEducator.findOne({
      where: {
        educatorId: req.user.id,
        studentId: req.params.studentId
      },
      transaction
    });

    if (!association) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the student exists
    const student = await User.findByPk(req.params.studentId, { transaction });
    if (!student) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete all associations first
    await StudentEducator.destroy({
      where: { studentId: req.params.studentId },
      transaction
    });

    await StudentParent.destroy({
      where: { studentId: req.params.studentId },
      transaction
    });

    // Finally delete the student
    await User.destroy({
      where: { id: req.params.studentId },
      transaction
    });

    // If everything succeeded, commit the transaction
    await transaction.commit();

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    // If anything fails, rollback the transaction
    await transaction.rollback();
    console.error('Error deleting student:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update student information
router.put('/educator/update-student/:studentId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { name, email } = req.body;

    // Verify educator has access to this student
    const association = await StudentEducator.findOne({
      where: {
        educatorId: req.user.id,
        studentId: req.params.studentId
      }
    });

    if (!association) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update student information
    await User.update(
      { name, email },
      { where: { id: req.params.studentId } }
    );

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 