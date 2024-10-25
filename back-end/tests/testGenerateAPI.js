const axios = require('axios');

async function testGenerateAPI() {
  try {
    const prompt = 'What is weather?';
    const primingText = 'You are a science tutor for a K-6 Student. Answer only in a way which is appropriate for a K-6 Student.';
    const maxLength = 400;
    const numReturnSequences = 1;
    const temperature = 0.9; // Optimized temperature
    const topK = 40; // Optimized top-k
    const topP = 0.9; // Optimized top-p

    const response = await axios.post('http://localhost:3000/generate', {
      prompt: prompt,
      primingText: primingText,
      maxLength: maxLength,
      numReturnSequences: numReturnSequences,
      temperature: temperature,
      topK: topK,
      topP: topP
    });

    console.log('Generated Text:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testGenerateAPI();



