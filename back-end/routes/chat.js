const express = require('express');
const router = express.Router();
const { ChatGroq } = require("@langchain/groq");
const { ConversationChain } = require("langchain/chains");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const SequelizeMemory = require('../services/SequelizeMemory');
const ConversationHistory = require('../models/ConversationHistory');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// Keep existing agent prompts
const agentPrompts = {
  science: `You are Dr. Eureka, an enthusiastic science teacher for elementary school students (grades K-6). You help students understand basic scientific concepts, conduct simple experiments, and explore the natural world. Make science fun and engaging using age-appropriate examples and explanations. If asked about other subjects, kindly redirect students to the appropriate subject teacher. Avoid answering questions about non-science subjects.`,
  
  math: `You are Count Bot, a friendly mathematics teacher for elementary school students (grades K-6). You help students understand numbers, basic operations, geometry, and problem-solving. Make math fun and relatable using real-world examples and step-by-step explanations. If asked about other subjects, kindly redirect students to the appropriate subject teacher. Avoid answering questions about non-math subjects.`,
  
  ela: `You are Wordsworth, a wise and encouraging English Language Arts teacher for elementary school students (grades K-6). You help students with reading comprehension, writing skills, grammar, vocabulary, and storytelling. Make learning language arts fun and engaging, using age-appropriate examples and explanations. If asked about other subjects, kindly redirect students to the appropriate subject teacher. Avoid answering questions about non-ela subjects.`,
  
  history: `You are Chrono, an engaging and knowledgeable history teacher for elementary school students (grades K-6). You make historical events come alive through storytelling and interesting facts. Focus on basic historical concepts, important historical figures, and major events appropriate for elementary education. Avoid Psuedo-History Conspiracies. If asked about non-history subjects, kindly redirect students to the appropriate subject teacher. Avoid answering questions about non-history subjects.`,
  
  social: `You are Mr. Sam, a friendly and approachable social studies teacher for elementary school students (grades K-6). You help students understand their community, basic civics, different cultures, and geography. Make social studies relatable through real-world examples and engaging explanations. If asked about other subjects, kindly redirect students to the appropriate subject teacher. Avoid answering questions about non-social subjects.`
}

// Get all sessions for an agent
router.get('/chat/sessions/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get the latest non-default title for each session
    const conversations = await ConversationHistory.findAll({
      where: { 
        sessionId: {
          [Op.startsWith]: `${userId}-${agentId}-`
        },
        title: {
          [Op.and]: {
            [Op.not]: null,
            [Op.ne]: '',
            [Op.ne]: '💭 New Discussion'
          }
        }
      },
      attributes: [
        'sessionId',
        'createdAt',
        [sequelize.fn('MAX', sequelize.col('title')), 'title'],
        'content'
      ],
      group: ['sessionId', 'createdAt', 'content'],
      order: [['createdAt', 'DESC']],
      raw: true
    });

    const sessions = conversations.map(conv => ({
      id: conv.sessionId,
      createdAt: conv.createdAt,
      title: conv.title || 'Untitled Discussion',
      preview: conv.content.substring(0, 50) + '...'
    }));

    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get messages for a specific session
router.get('/chat/messages/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Verify session belongs to user
    if (!sessionId.startsWith(`${userId}-`)) {
      return res.status(403).json({ error: 'Unauthorized access to session' });
    }
    
    // First get the latest non-default title for this session
    const latestTitle = await ConversationHistory.findOne({
      where: { 
        sessionId,
        title: {
          [Op.and]: {
            [Op.not]: null,
            [Op.ne]: '',
            [Op.ne]: '💭 New Discussion',
            [Op.ne]: 'Untitled Discussion'
          }
        }
      },
      order: [['createdAt', 'DESC']],
      attributes: ['title'],
      raw: true
    });

    const messages = await ConversationHistory.findAll({
      where: { sessionId },
      order: [['createdAt', 'ASC']],
      attributes: ['id', 'content', ['role', 'sender'], 'createdAt'],
      raw: true
    });

    const firstMessage = messages[0];
    
    res.json({
      id: sessionId,
      date: firstMessage?.createdAt || new Date().toISOString(),
      title: latestTitle?.title || 'Untitled Discussion',
      messages: messages.map(m => ({
        id: m.id,
        content: m.content,
        sender: m.role === 'human' ? 'user' : 'agent'
      })),
      preview: firstMessage?.content.substring(0, 50) + '...' || 'Empty conversation'
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create a new session
router.post('/chat/sessions', async (req, res) => {
  try {
    const { agentId, userId } = req.body;
    
    if (!agentId || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const sessionId = `${userId}-${agentId}-${Date.now()}`;
    const initialTitle = '💭 New Discussion';

    const newMessage = await ConversationHistory.create({
      sessionId,
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      title: initialTitle
    });

    res.json({
      session: {
        id: sessionId,
        createdAt: newMessage.createdAt,
        preview: 'Hello! How can I help you today?',
        title: initialTitle
      }
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Modify your chat endpoint to use SequelizeMemory
router.post('/chat', async (req, res) => {
  try {
    const { message, agentId, userId, sessionId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    if (!userId || !agentId || !sessionId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (!agentPrompts[agentId]) {
      return res.status(400).json({ error: 'Invalid agent ID' });
    }

    const memory = new SequelizeMemory(sessionId);

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `${agentPrompts[agentId]}
        Format your responses using markdown for better readability:
        - Use **bold** for emphasis
        - Use bullet points for lists
        - Use \`code blocks\` for examples
        - Use > for important notes
        - Use ### for section headers
        
        Keep responses clear, engaging, and well-structured for elementary students.`],
      new MessagesPlaceholder("history"),
      ["human", "{input}"],
    ]);

    const chainModel = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: "llama3-8b-8192",
      configuration: {
        model: "llama3-8b-8192",
      }
    });

    const chain = new ConversationChain({
      memory,
      prompt,
      llm: chainModel,
    });

    const existingMessages = await ConversationHistory.findAll({
      where: { sessionId },
      order: [['createdAt', 'ASC']]
    });

    let updatedTitle = null;
    if (existingMessages.length === 1) { // Only the initial greeting
      const titlePrompt = `Based on this first message from a student: "${message}", 
        generate a very brief (2-4 words) title that starts with a relevant emoji.
        For example:
        - "🌍 Earth's Atmosphere"
        - "🧮 Adding Fractions"
        - "📚 Story Elements"
        - "⚔️ Ancient Rome"
        - "🗺️ World Cultures"
        Response should be ONLY the title with emoji, nothing else.`;

      const titleChain = new ConversationChain({
        prompt: ChatPromptTemplate.fromTemplate(titlePrompt),
        llm: chainModel,
      });

      const titleResponse = await titleChain.call({ input: message });
      const title = titleResponse.response.trim();

      // Update all messages in this session with the new title
      await ConversationHistory.update(
        { title },
        { 
          where: { sessionId },
          silent: true
        }
      );

      updatedTitle = title;
    }

    // After the first user message, generate a title
    if (message && sessionId) {
      const response = await chain.call({ input: message });
      
      // Save the assistant's response to the conversation history
      await ConversationHistory.create({
        sessionId,
        role: 'assistant',
        content: response.response,
        title: existingMessages[0]?.title
      });

      res.json({ 
        content: response.response,
        updatedTitle: updatedTitle
      });
    }
  } catch (error) {
    console.error('Error in chat completion:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message
    });
  }
});

// Modify your clear endpoint to use SequelizeMemory
router.post('/chat/clear', async (req, res) => {
  try {
    const { userId, agentId } = req.body;
    const sessionId = `${userId}-${agentId}`;
    const memory = new SequelizeMemory(sessionId);
    await memory.clear();
    res.json({ message: 'Conversation history cleared' });
  } catch (error) {
    console.error('Error clearing conversation:', error);
    res.status(500).json({ error: 'Failed to clear conversation' });
  }
});

module.exports = router; 