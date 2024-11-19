require('dotenv').config();
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { Document } = require("langchain/document");
const { ChatGroq } = require("@langchain/groq");
const { HuggingFaceInferenceEmbeddings } = require("@langchain/community/embeddings/hf");

class VectorStore {
    constructor() {
        console.log('HF Token loaded:', !!process.env.HUGGINGFACE_API_KEY);
        this.embeddings = new HuggingFaceInferenceEmbeddings({
            apiKey: process.env.HUGGINGFACE_API_KEY,
            model: "sentence-transformers/all-MiniLM-L6-v2"
        });
        this.store = new MemoryVectorStore(this.embeddings);
        this.documents = new Map();
    }

    /**
     * Adds a document to the vector store
     * @param {string} id - Unique identifier for the document
     * @param {string} content - Text content of the document
     * @returns {Promise<void>}
     */
    async addDocument(id, content) {
        try {
            const doc = new Document({
                pageContent: content,
                metadata: { id }
            });
            
            await this.store.addDocuments([doc]);
            this.documents.set(id, doc);
        } catch (error) {
            console.error('Error adding document to vector store:', error);
            throw error;
        }
    }

    /**
     * Searches for similar documents
     * @param {string} query - Search query
     * @param {number} k - Number of results to return
     * @returns {Promise<Document[]>}
     */
    async similaritySearch(query, k = 4) {
        try {
            const results = await this.store.similaritySearch(query, k);
            return results;
        } catch (error) {
            console.error('Error performing similarity search:', error);
            throw error;
        }
    }

    /**
     * Batch adds multiple documents to the store
     * @param {Array<{id: string, content: string}>} documents 
     * @returns {Promise<void>}
     */
    async addDocuments(documents) {
        try {
            const docs = documents.map(({ id, content }) => 
                new Document({
                    pageContent: content,
                    metadata: { id }
                })
            );
            
            await this.store.addDocuments(docs);
            docs.forEach(doc => this.documents.set(doc.metadata.id, doc));
        } catch (error) {
            console.error('Error batch adding documents:', error);
            throw error;
        }
    }

    /**
     * Removes a document from the store
     * @param {string} id - Document ID to remove
     */
    removeDocument(id) {
        this.documents.delete(id);
        // Note: Since we're using MemoryVectorStore, we'd need to rebuild the store
        // to truly remove the document. In production, use a persistent store like
        // Pinecone or Weaviate that supports deletion
    }
}

// Export a singleton instance
module.exports = new VectorStore(); 