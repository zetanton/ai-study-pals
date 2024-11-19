const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeDocument } = require('../services/documentAnalysis');
const { Assignment, LearningInsight } = require('../models/Assignment');
const { sequelize } = require('../models');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/upload-assignment', upload.single('file'), async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { subject, grade } = req.body;
    const file = req.file;

    if (!file || !subject || !grade) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Analyze the document using RAG
    const analysis = await analyzeDocument(file.buffer, subject, grade);

    // Create the assignment first with userId: 1
    const assignment = await Assignment.create({
      userId: 1,  // Hardcoded to 1
      subject: req.body.subject,
      grade: req.body.grade,
      fileName: req.file.originalname,
      fileContent: req.file.buffer,
      summary: analysis.summary
    }, { transaction });

    // Create the insights with the assignmentId
    const insights = await Promise.all(
      analysis.insights.map(insight => 
        LearningInsight.create({
          assignmentId: assignment.id,
          category: insight.category,
          strength: insight.strength,
          improvement: insight.improvement,
          confidence: insight.confidence
        }, { transaction })
      )
    );

    await transaction.commit();

    // Fetch the complete assignment with insights for the response
    const completeAssignment = await Assignment.findByPk(assignment.id, {
      include: [{
        model: LearningInsight,
        as: 'LearningInsights',
        attributes: ['id', 'category', 'strength', 'improvement', 'confidence']
      }]
    });

    res.json({
      assignment: completeAssignment,
      insights: completeAssignment.LearningInsights,
      analysis: analysis.summary
    });

  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

router.get('/previous-assignments', async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [{
        model: LearningInsight,
        as: 'LearningInsights',
        attributes: ['category', 'strength', 'improvement', 'confidence']
      }],
      order: [['createdAt', 'DESC']]
    });

    const formattedAssignments = assignments.map(assignment => ({
      id: assignment.id,
      name: assignment.fileName,
      subject: assignment.subject,
      grade: assignment.grade,
      submittedDate: assignment.createdAt,
      insights: assignment.LearningInsights
    }));

    res.json(formattedAssignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

router.get('/assignment/:id', async (req, res) => {
  try {
    console.log('Fetching assignment with ID:', req.params.id);
    
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [{
        model: LearningInsight,
        as: 'LearningInsights',
        attributes: ['id', 'category', 'strength', 'improvement', 'confidence']
      }],
      attributes: ['id', 'subject', 'grade', 'fileName', 'summary', 'createdAt']
    });
    
    console.log('Found assignment:', assignment);
    console.log('Learning insights:', assignment?.LearningInsights);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

module.exports = router; 