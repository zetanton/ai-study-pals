const { BaseMemory } = require('langchain/memory');
const { HumanMessage, AIMessage } = require('@langchain/core/messages');
const ConversationHistory = require('../models/ConversationHistory');

class SequelizeMemory extends BaseMemory {
  constructor(sessionId) {
    super();
    this.sessionId = sessionId;
    this.memoryKey = 'history';
    console.log(`Initializing SequelizeMemory for session: ${sessionId}`);
  }

  async loadMemoryVariables() {
    const messages = await ConversationHistory.findAll({
      where: { sessionId: this.sessionId },
      order: [['createdAt', 'ASC']]
    });

    console.log(`Loaded ${messages.length} messages for session ${this.sessionId}`);

    const formattedMessages = messages.map(msg => 
      msg.role === 'human' 
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    );

    console.log('Formatted messages:', formattedMessages.map(m => ({
      type: m._getType(),
      content: m.content.substring(0, 50) + '...'
    })));

    return { [this.memoryKey]: formattedMessages };
  }

  async saveContext(inputs, outputs) {
    const input = inputs.input;
    const output = outputs.response;

    console.log(`Saving conversation for session ${this.sessionId}:`, {
      humanMessage: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
      aiMessageLength: output.length
    });

    try {
      await Promise.all([
        ConversationHistory.create({
          sessionId: this.sessionId,
          role: 'human',
          content: input
        }),
        ConversationHistory.create({
          sessionId: this.sessionId,
          role: 'ai',
          content: output
        })
      ]);
      console.log('Successfully saved conversation to database');
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  }

  async clear() {
    console.log(`Clearing conversation history for session ${this.sessionId}`);
    try {
      const deletedCount = await ConversationHistory.destroy({
        where: { sessionId: this.sessionId }
      });
      console.log(`Deleted ${deletedCount} messages from conversation history`);
    } catch (error) {
      console.error('Error clearing conversation history:', error);
      throw error;
    }
  }
}

module.exports = SequelizeMemory; 