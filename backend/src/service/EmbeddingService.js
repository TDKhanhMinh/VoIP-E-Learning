import { HfInference } from "@huggingface/inference";

class EmbeddingService {
  async createEmbedding(text) {
    throw new Error("createEmbedding method must be implemented");
  }

  async createBatchEmbeddings(texts) {
    throw new Error("createBatchEmbeddings method must be implemented");
  }
}

class HuggingFaceEmbeddingService extends EmbeddingService {
  constructor(apiKey, model = "sentence-transformers/all-MiniLM-L6-v2") {
    super();
    this.apiKey = apiKey;
    this.model = model;
    this.hf = new HfInference(apiKey);
    this.maxRetries = 3;
    this.retryDelay = 2000;
  }

  async createEmbedding(text) {
    if (!text || typeof text !== "string") {
      throw new Error("Invalid input: text must be a non-empty string");
    }

    console.log(`Creating embedding for text: "${text.substring(0, 100)}..."`);

    let lastError;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const embedding = await this.hf.featureExtraction({
          model: this.model,
          inputs: text,
        });

        if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
          throw new Error("Invalid embedding format received from API");
        }

        console.log(
          `Embedding created successfully (length: ${embedding.length})`
        );
        return embedding;
      } catch (error) {
        lastError = error;
        console.error(
          `Attempt ${attempt}/${this.maxRetries} failed:`,
          error.message
        );

        if (attempt < this.maxRetries) {
          console.log(`Retrying in ${this.retryDelay}ms...`);
          await this._sleep(this.retryDelay);
          this.retryDelay *= 2;
        }
      }
    }

    throw new Error(
      `Failed to create embedding after ${this.maxRetries} attempts: ${lastError.message}`
    );
  }

  async createBatchEmbeddings(texts) {
    if (!Array.isArray(texts) || texts.length === 0) {
      throw new Error("Invalid input: texts must be a non-empty array");
    }

    console.log(`Creating batch embeddings for ${texts.length} texts`);

    const embeddings = await Promise.all(
      texts.map((text) => this.createEmbedding(text))
    );

    console.log(`Batch embeddings created successfully`);
    return embeddings;
  }

  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setModel(model) {
    this.model = model;
    console.log(`Model changed to: ${model}`);
  }

  getConfig() {
    return {
      model: this.model,
      baseUrl: this.baseUrl,
      maxRetries: this.maxRetries,
      hasApiKey: !!this.apiKey,
    };
  }
}

class OpenAIEmbeddingService extends EmbeddingService {
  constructor(apiKey, model = "text-embedding-3-small") {
    super();
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = "https://api.openai.com/v1/embeddings";
  }

  async createEmbedding(text) {
    console.log(
      `Creating OpenAI embedding for text: "${text.substring(0, 100)}..."`
    );

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
        model: this.model,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const embedding = data.data[0].embedding;

    console.log(
      `OpenAI embedding created successfully (length: ${embedding.length})`
    );
    return embedding;
  }

  async createBatchEmbeddings(texts) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: texts,
        model: this.model,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return data.data.map((item) => item.embedding);
  }
}

class EmbeddingServiceFactory {
  static create(provider = "huggingface", config = {}) {
    switch (provider.toLowerCase()) {
      case "huggingface":
      case "hf":
        return new HuggingFaceEmbeddingService(
          config.apiKey || process.env.HF_TOKEN || process.env.HF_API_KEY,
          config.model
        );

      case "openai":
        return new OpenAIEmbeddingService(
          config.apiKey || process.env.OPENAI_API_KEY,
          config.model
        );

      default:
        throw new Error(`Unsupported embedding provider: ${provider}`);
    }
  }
}

export {
  EmbeddingService,
  HuggingFaceEmbeddingService,
  OpenAIEmbeddingService,
  EmbeddingServiceFactory,
};

const defaultService = EmbeddingServiceFactory.create("huggingface");
export const createEmbedding = (text) => defaultService.createEmbedding(text);
export const createBatchEmbeddings = (texts) =>
  defaultService.createBatchEmbeddings(texts);
