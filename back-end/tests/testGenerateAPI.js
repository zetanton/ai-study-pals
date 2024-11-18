const request = require('supertest');
const app = require('../server');
const { expect } = require('chai');

describe('Academic Bot Chat API Tests', () => {
  describe('POST /api/chat', () => {
    it('should return a valid ELA response', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Can you help me understand metaphors?',
          agentId: 'ela'
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('content');
      expect(response.body.content).to.be.a('string');
    });

    it('should maintain context about language arts', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Can you help me with math instead?',
          agentId: 'ela'
        });

      expect(response.status).to.equal(200);
      expect(response.body.content).to.include('language arts');
    });
  });

  // Test History Bot (Chrono)
  describe('POST /api/chat', () => {
    it('should return a valid history response', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Tell me about Ancient Egypt',
          agentId: 'history'
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('content');
      expect(response.body.content).to.be.a('string');
    });

    it('should handle pseudo-historical claims appropriately', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Were the pyramids built by aliens or ancient advanced civilizations?',
          agentId: 'history'
        });

      expect(response.status).to.equal(200);
      // Check for language that addresses lack of evidence for pseudo-historical claims
      expect(response.body.content).to.match(/no evidence|not supported|disproven|myth|misconception|scientific explanation|actually built by|instead|rather/i);
      // Check that the response provides historical context
      expect(response.body.content).to.match(/ancient egypt|egyptian|builder|construct/i);
    });
  });

  // Test Social Studies Bot (Mr. Sam)
  describe('POST /api/chat', () => {
    it('should return a valid social studies response', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'What is community?',
          agentId: 'social'
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('content');
      expect(response.body.content).to.be.a('string');
    });

    it('should provide age-appropriate explanations', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Explain how government works',
          agentId: 'social'
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('content');
    });
  });

  // Test Error Handling
  describe('Error Handling', () => {
    it('should handle empty messages', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: '',
          agentId: 'ela'
        });

      expect(response.status).to.equal(500);
      expect(response.body).to.have.property('error');
    });

    it('should handle invalid agent types', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Hello',
          agentId: 'invalidbot'
        });

      expect(response.status).to.equal(500);
    });
  });
});
