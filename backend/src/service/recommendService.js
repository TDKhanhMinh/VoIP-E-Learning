import { EmbeddingServiceFactory } from "./EmbeddingService.js";

const embeddingService = EmbeddingServiceFactory.create("huggingface", {
  model: "sentence-transformers/all-MiniLM-L6-v2",
});

console.log("Embedding Service Configuration:", embeddingService.getConfig());

export async function createEmbedding(text) {
  try {
    return await embeddingService.createEmbedding(text);
  } catch (error) {
    console.error("Failed to create embedding:", error.message);
    throw error;
  }
}

export async function createBatchEmbeddings(texts) {
  try {
    return await embeddingService.createBatchEmbeddings(texts);
  } catch (error) {
    console.error("Failed to create batch embeddings:", error.message);
    throw error;
  }
}

export { embeddingService };
