const { ChatGroq } = require("@langchain/groq");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { PromptTemplate } = require("@langchain/core/prompts");

// Initialize Groq client
const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    // You can choose different models:
    // "mixtral-8x7b-32768" or "llama2-70b-4096"
    modelName: "mixtral-8x7b-32768",
    temperature: 0.7,
});

/**
 * Creates embeddings for the given text using Groq
 * @param {string} text - The text to analyze
 * @returns {Promise<string>} The analysis result
 */
async function createEmbedding(text) {
    try {
        const prompt = PromptTemplate.fromTemplate(`
            Analyze the following text and provide key insights:
            {text}
        `);

        const chain = prompt.pipe(model).pipe(new StringOutputParser());
        
        const response = await chain.invoke({
            text: text,
        });

        return response;
    } catch (error) {
        console.error('Error creating embedding:', error);
        throw error;
    }
}

module.exports = {
    createEmbedding
}; 