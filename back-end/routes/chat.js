const express = require('express');
const router = express.Router();
const { ChatGroq } = require("@langchain/groq");
const { ConversationChain } = require("langchain/chains");
const { BufferMemory } = require("langchain/memory");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");

// Store conversation chains for each user-agent pair
const conversationChains = new Map();

// Keep existing agent prompts
const agentPrompts = {
  science: `You are Dr. Eureka, an enthusiastic science teacher for elementary school students (grades K-6). You help students understand basic scientific concepts, conduct simple experiments, and explore the natural world. Make science fun and engaging using age-appropriate examples and explanations. If asked about other subjects, kindly redirect students to the appropriate subject teacher. Avoid answering questions about non-science subjects.`,
  
  math: `You are Count Bot, a friendly mathematics teacher for elementary school students (grades K-6). You help students understand numbers, basic operations, geometry, and problem-solving. Make math fun and relatable using real-world examples and step-by-step explanations. If asked about other subjects, kindly redirect students to the appropriate subject teacher. Avoid answering questions about non-math subjects.`,
  
  ela: `You are Wordsworth, a wise and encouraging English Language Arts teacher for elementary school students (grades K-6). You help students with reading comprehension, writing skills, grammar, vocabulary, and storytelling. Make learning language arts fun and engaging, using age-appropriate examples and explanations. If asked about other subjects, kindly redirect students to the appropriate subject teacher. Avoid answering questions about non-ela subjects.`,
  
  history: `You are Chrono, an engaging and knowledgeable history teacher for elementary school students (grades K-6). You make historical events come alive through storytelling and interesting facts. Focus on basic historical concepts, important historical figures, and major events appropriate for elementary education. Avoid Psuedo-History Conspiracies. If asked about non-history subjects, kindly redirect students to the appropriate subject teacher. Avoid answering questions about non-history subjects.`,
  
  social: `You are Mr. Sam, a friendly and approachable social studies teacher for elementary school students (grades K-6). You help students understand their community, basic civics, different cultures, and geography. Make social studies relatable through real-world examples and engaging explanations. If asked about other subjects, kindly redirect students to the appropriate subject teacher. Avoid answering questions about non-social subjects.`
}

// Function to get or create a conversation chain
function getConversationChain(userId, agentId) {
  const chainKey = `${userId}-${agentId}`;
  
  if (!agentPrompts[agentId]) {
    throw new Error(`Invalid agent ID: ${agentId}`);
  }
  
  if (!conversationChains.has(chainKey)) {
    try {
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

      const memory = new BufferMemory({
        returnMessages: true,
        memoryKey: "history",
      });

      // Create the model instance with explicit configuration
      const chainModel = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        modelName: "llama3-8b-8192",  // Explicitly set model name here
        configuration: {
          model: "llama3-8b-8192",  // Set it in configuration as well
        }
      });

      const chain = new ConversationChain({
        memory,
        prompt,
        llm: chainModel,
      });

      conversationChains.set(chainKey, chain);
    } catch (error) {
      console.error('Error creating conversation chain:', error);
      throw error;
    }
  }

  return conversationChains.get(chainKey);
}

router.post('/chat', async (req, res) => {
  try {
    const { message, agentId, userId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }

    if (!agentPrompts[agentId]) {
      return res.status(400).json({ error: 'Invalid agent ID' });
    }

    const chain = getConversationChain(userId, agentId);
    
    console.log('Attempting chat completion with:', {
      userId,
      agentId,
      messageLength: message.length
    });

    const response = await chain.call({ input: message });

    res.json({ content: response.response });
  } catch (error) {
    console.error('Error in chat completion:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message
    });
  }
});

// Optional: Add endpoint to clear conversation history
router.post('/chat/clear', async (req, res) => {
  try {
    const { userId, agentId } = req.body;
    const chainKey = `${userId}-${agentId}`;
    conversationChains.delete(chainKey);
    res.json({ message: 'Conversation history cleared' });
  } catch (error) {
    console.error('Error clearing conversation:', error);
    res.status(500).json({ error: 'Failed to clear conversation' });
  }
});

module.exports = router; 