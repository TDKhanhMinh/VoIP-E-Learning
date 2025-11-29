class VectorSimilarity {
  static cosine(vectorA, vectorB) {
    if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
      console.warn("Invalid vectors for cosine similarity");
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  static euclidean(vectorA, vectorB) {
    if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
      return Infinity;
    }

    let sum = 0;
    for (let i = 0; i < vectorA.length; i++) {
      const diff = vectorA[i] - vectorB[i];
      sum += diff * diff;
    }

    return Math.sqrt(sum);
  }

  static dotProduct(vectorA, vectorB) {
    if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
      return 0;
    }

    let sum = 0;
    for (let i = 0; i < vectorA.length; i++) {
      sum += vectorA[i] * vectorB[i];
    }

    return sum;
  }

  static findTopK(queryVector, items, k = 5, method = "cosine") {
    const scored = items.map((item) => {
      let score;

      switch (method) {
        case "euclidean":
          const distance = this.euclidean(queryVector, item.vector);
          score = distance === 0 ? 1 : 1 / (1 + distance);
          break;

        case "dot":
          score = this.dotProduct(queryVector, item.vector);
          break;

        case "cosine":
        default:
          score = this.cosine(queryVector, item.vector);
      }

      return {
        score,
        data: item.data,
      };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, k);
  }

  static normalize(vector) {
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) return vector;
    return vector.map((val) => val / norm);
  }

  static magnitude(vector) {
    return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  }
}

export function cosineSimilarity(a, b) {
  return VectorSimilarity.cosine(a, b);
}

export default VectorSimilarity;
