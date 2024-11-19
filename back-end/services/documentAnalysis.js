const { ChatGroq } = require("@langchain/groq");
const vectorStore = require('./vectorStore');
const { PromptTemplate } = require("@langchain/core/prompts");
const { JsonOutputFunctionsParser } = require("langchain/output_parsers");
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

// Create the Groq model instance
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "llama3-8b-8192",
  configuration: {
    model: "llama3-8b-8192",
  }
});

// Define the output parser for structured analysis
const outputParser = new JsonOutputFunctionsParser({
  functionName: "provide_analysis",
  schema: {
    type: "object",
    properties: {
      summary: { type: "string" },
      insights: {
        type: "array",
        items: {
          type: "object",
          properties: {
            category: { type: "string" },
            strength: { type: "string" },
            improvement: { type: "string" },
            confidence: { type: "number" }
          }
        }
      }
    }
  }
});

// Create a prompt template for document analysis
const analysisPrompt = PromptTemplate.fromTemplate(`
You are an educational assessment expert analyzing a student's work.
Consider the grade {grade} curriculum standards for {subject}.
Identify key strengths and areas for improvement.

Document content: {text}

Relevant curriculum standards: {standards}

IMPORTANT: You must respond ONLY with a valid JSON object in the following format, with no additional text before or after:
{{
  "summary": "Overall assessment summary",
  "insights": [
    {{
      "category": "Specific skill or concept area",
      "strength": "What the student does well",
      "improvement": "What could be improved",
      "confidence": "Confidence score between 0 and 1"
    }}
  ]
}}
`);

async function extractText(fileBuffer) {
  try {
    // Get the file signature from the buffer to determine file type
    const fileSignature = fileBuffer.toString('hex', 0, 4);
    
    // PDF signature: 25504446 (starts with %PDF)
    if (fileSignature.startsWith('2550')) {
      const pdfData = await pdf(fileBuffer);
      return pdfData.text;
    }
    
    // DOCX signature: 504B0304 (PK..)
    if (fileSignature.startsWith('504b')) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value;
    }
    
    // If neither PDF nor DOCX, assume it's plain text
    return fileBuffer.toString('utf8');
    
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from document');
  }
}

async function analyzeDocument(fileBuffer, subject, grade) {
  try {
    // Convert document to text
    const text = await extractText(fileBuffer);
    
    // Use vectorStore for similarity search
    const standards = await vectorStore.similaritySearch(text);
    
    // Format the prompt with all parameters
    const formattedPrompt = await analysisPrompt.format({
      grade,
      subject,
      text,
      standards: JSON.stringify(standards.map(doc => doc.pageContent))
    });

    // Get the analysis from the model
    const response = await model.invoke(formattedPrompt);
    
    // Handle the response properly
    let contentToProcess = '';
    if (typeof response === 'string') {
      contentToProcess = response;
    } else if (response.content) {
      contentToProcess = response.content;
    } else if (response.text) {
      contentToProcess = response.text;
    } else {
      throw new Error('Unexpected response format from model');
    }

    // Clean the response string and ensure it's valid JSON
    contentToProcess = contentToProcess.trim();
    if (!contentToProcess.startsWith('{')) {
      // Try to extract JSON if there's other text
      const jsonMatch = contentToProcess.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        contentToProcess = jsonMatch[0];
      } else {
        throw new Error('No valid JSON found in response');
      }
    }

    // Parse the cleaned response
    try {
      return JSON.parse(contentToProcess);
    } catch (parseError) {
      console.error('Error parsing model response:', parseError);
      console.debug('Raw response:', contentToProcess);
      throw new Error('Failed to parse model response');
    }
  } catch (error) {
    console.error('Error in document analysis:', error);
    throw error;
  }
}

module.exports = { analyzeDocument }; 