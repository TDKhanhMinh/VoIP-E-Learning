import VectorSimilarity, {
  cosineSimilarity,
} from "../../../src/utils/VectorSimilarity.js";

describe("VectorSimilarity Utils", () => {
  describe("cosine similarity", () => {
    it("should return 1 for identical vectors", () => {
      const vectorA = [1, 2, 3, 4];
      const vectorB = [1, 2, 3, 4];
      const similarity = VectorSimilarity.cosine(vectorA, vectorB);
      expect(similarity).toBeCloseTo(1, 5);
    });

    it("should return 0 for orthogonal vectors", () => {
      const vectorA = [1, 0, 0];
      const vectorB = [0, 1, 0];
      const similarity = VectorSimilarity.cosine(vectorA, vectorB);
      expect(similarity).toBe(0);
    });

    it("should return -1 for opposite vectors", () => {
      const vectorA = [1, 2, 3];
      const vectorB = [-1, -2, -3];
      const similarity = VectorSimilarity.cosine(vectorA, vectorB);
      expect(similarity).toBeCloseTo(-1, 5);
    });

    it("should return 0 for zero magnitude vector", () => {
      const vectorA = [0, 0, 0];
      const vectorB = [1, 2, 3];
      const similarity = VectorSimilarity.cosine(vectorA, vectorB);
      expect(similarity).toBe(0);
    });

    it("should return 0 for different length vectors", () => {
      const vectorA = [1, 2, 3];
      const vectorB = [1, 2];
      const similarity = VectorSimilarity.cosine(vectorA, vectorB);
      expect(similarity).toBe(0);
    });

    it("should return 0 for null/undefined vectors", () => {
      expect(VectorSimilarity.cosine(null, [1, 2, 3])).toBe(0);
      expect(VectorSimilarity.cosine([1, 2, 3], null)).toBe(0);
      expect(VectorSimilarity.cosine(undefined, [1, 2, 3])).toBe(0);
    });

    it("should calculate correct similarity for partial match", () => {
      const vectorA = [1, 2, 3, 4];
      const vectorB = [1, 2, 0, 0];
      const similarity = VectorSimilarity.cosine(vectorA, vectorB);
      expect(similarity).toBeGreaterThan(0);
      expect(similarity).toBeLessThan(1);
    });

    it("should handle negative values", () => {
      const vectorA = [-1, -2, -3];
      const vectorB = [-1, -2, -3];
      const similarity = VectorSimilarity.cosine(vectorA, vectorB);
      expect(similarity).toBeCloseTo(1, 5);
    });
  });

  describe("euclidean distance", () => {
    it("should return 0 for identical vectors", () => {
      const vectorA = [1, 2, 3];
      const vectorB = [1, 2, 3];
      const distance = VectorSimilarity.euclidean(vectorA, vectorB);
      expect(distance).toBe(0);
    });

    it("should calculate correct distance for 3-4-5 triangle", () => {
      const vectorA = [0, 0, 0];
      const vectorB = [3, 4, 0];
      const distance = VectorSimilarity.euclidean(vectorA, vectorB);
      expect(distance).toBe(5);
    });

    it("should return Infinity for different length vectors", () => {
      const vectorA = [1, 2, 3];
      const vectorB = [1, 2];
      const distance = VectorSimilarity.euclidean(vectorA, vectorB);
      expect(distance).toBe(Infinity);
    });

    it("should return Infinity for null vectors", () => {
      expect(VectorSimilarity.euclidean(null, [1, 2, 3])).toBe(Infinity);
      expect(VectorSimilarity.euclidean([1, 2, 3], undefined)).toBe(Infinity);
    });

    it("should handle negative differences", () => {
      const vectorA = [1, 2, 3];
      const vectorB = [4, 5, 6];
      const distance = VectorSimilarity.euclidean(vectorA, vectorB);
      expect(distance).toBeCloseTo(5.196, 2);
    });

    it("should be symmetric", () => {
      const vectorA = [1, 2, 3];
      const vectorB = [4, 5, 6];
      const distanceAB = VectorSimilarity.euclidean(vectorA, vectorB);
      const distanceBA = VectorSimilarity.euclidean(vectorB, vectorA);
      expect(distanceAB).toBe(distanceBA);
    });
  });

  describe("dot product", () => {
    it("should calculate correct dot product", () => {
      const vectorA = [1, 2, 3];
      const vectorB = [4, 5, 6];
      const dot = VectorSimilarity.dotProduct(vectorA, vectorB);
      expect(dot).toBe(32); // 1*4 + 2*5 + 3*6 = 32
    });

    it("should return 0 for orthogonal vectors", () => {
      const vectorA = [1, 0, 0];
      const vectorB = [0, 1, 0];
      const dot = VectorSimilarity.dotProduct(vectorA, vectorB);
      expect(dot).toBe(0);
    });

    it("should return 0 for different length vectors", () => {
      const vectorA = [1, 2, 3];
      const vectorB = [1, 2];
      const dot = VectorSimilarity.dotProduct(vectorA, vectorB);
      expect(dot).toBe(0);
    });

    it("should return 0 for null vectors", () => {
      expect(VectorSimilarity.dotProduct(null, [1, 2, 3])).toBe(0);
      expect(VectorSimilarity.dotProduct([1, 2, 3], undefined)).toBe(0);
    });

    it("should handle negative values", () => {
      const vectorA = [1, -2, 3];
      const vectorB = [-1, 2, -3];
      const dot = VectorSimilarity.dotProduct(vectorA, vectorB);
      expect(dot).toBe(-14);
    });

    it("should be commutative", () => {
      const vectorA = [1, 2, 3];
      const vectorB = [4, 5, 6];
      const dotAB = VectorSimilarity.dotProduct(vectorA, vectorB);
      const dotBA = VectorSimilarity.dotProduct(vectorB, vectorA);
      expect(dotAB).toBe(dotBA);
    });
  });

  describe("findTopK", () => {
    const items = [
      { vector: [1, 0, 0], data: { id: 1, name: "Item 1" } },
      { vector: [0, 1, 0], data: { id: 2, name: "Item 2" } },
      { vector: [0.9, 0.1, 0], data: { id: 3, name: "Item 3" } },
      { vector: [0.5, 0.5, 0], data: { id: 4, name: "Item 4" } },
      { vector: [0, 0, 1], data: { id: 5, name: "Item 5" } },
    ];

    it("should find top k similar items using cosine similarity", () => {
      const query = [1, 0, 0];
      const results = VectorSimilarity.findTopK(query, items, 2, "cosine");

      expect(results).toHaveLength(2);
      expect(results[0].data.id).toBe(1);
      expect(results[1].data.id).toBe(3);
      expect(results[0].score).toBeCloseTo(1, 5);
    });

    it("should find top k similar items using euclidean distance", () => {
      const query = [1, 0, 0];
      const results = VectorSimilarity.findTopK(query, items, 2, "euclidean");

      expect(results).toHaveLength(2);
      expect(results[0].score).toBeGreaterThan(results[1].score);
    });

    it("should find top k similar items using dot product", () => {
      const query = [1, 0, 0];
      const results = VectorSimilarity.findTopK(query, items, 2, "dot");

      expect(results).toHaveLength(2);
      expect(results[0].data.id).toBe(1);
    });

    it("should return all items if k is larger than items length", () => {
      const query = [1, 0, 0];
      const results = VectorSimilarity.findTopK(query, items, 10, "cosine");

      expect(results).toHaveLength(items.length);
    });

    it("should default to cosine method", () => {
      const query = [1, 0, 0];
      const results = VectorSimilarity.findTopK(query, items, 1);

      expect(results).toHaveLength(1);
      expect(results[0].data.id).toBe(1);
    });

    it("should return results sorted by score descending", () => {
      const query = [1, 0, 0];
      const results = VectorSimilarity.findTopK(query, items, 5, "cosine");

      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
      }
    });

    it("should include both score and data in results", () => {
      const query = [1, 0, 0];
      const results = VectorSimilarity.findTopK(query, items, 1, "cosine");

      expect(results[0]).toHaveProperty("score");
      expect(results[0]).toHaveProperty("data");
      expect(results[0].data).toHaveProperty("id");
      expect(results[0].data).toHaveProperty("name");
    });
  });

  describe("normalize", () => {
    it("should normalize a vector to unit length", () => {
      const vector = [3, 4, 0];
      const normalized = VectorSimilarity.normalize(vector);

      expect(normalized[0]).toBeCloseTo(0.6, 5);
      expect(normalized[1]).toBeCloseTo(0.8, 5);
      expect(normalized[2]).toBe(0);
    });

    it("should handle zero vector", () => {
      const vector = [0, 0, 0];
      const normalized = VectorSimilarity.normalize(vector);

      expect(normalized).toEqual([0, 0, 0]);
    });

    it("should return unit length vector", () => {
      const vector = [1, 2, 3];
      const normalized = VectorSimilarity.normalize(vector);
      const magnitude = VectorSimilarity.magnitude(normalized);

      expect(magnitude).toBeCloseTo(1, 5);
    });

    it("should preserve direction", () => {
      const vector = [3, 4];
      const normalized = VectorSimilarity.normalize(vector);

      expect(normalized[0] / normalized[1]).toBeCloseTo(
        vector[0] / vector[1],
        5
      );
    });

    it("should handle negative values", () => {
      const vector = [-3, -4];
      const normalized = VectorSimilarity.normalize(vector);
      const magnitude = VectorSimilarity.magnitude(normalized);

      expect(magnitude).toBeCloseTo(1, 5);
      expect(normalized[0]).toBeLessThan(0);
      expect(normalized[1]).toBeLessThan(0);
    });
  });

  describe("magnitude", () => {
    it("should calculate vector magnitude correctly", () => {
      const vector = [3, 4, 0];
      const magnitude = VectorSimilarity.magnitude(vector);
      expect(magnitude).toBe(5);
    });

    it("should return 0 for zero vector", () => {
      const vector = [0, 0, 0];
      const magnitude = VectorSimilarity.magnitude(vector);
      expect(magnitude).toBe(0);
    });

    it("should handle single element vector", () => {
      const vector = [5];
      const magnitude = VectorSimilarity.magnitude(vector);
      expect(magnitude).toBe(5);
    });

    it("should handle negative values", () => {
      const vector = [-3, -4];
      const magnitude = VectorSimilarity.magnitude(vector);
      expect(magnitude).toBe(5);
    });

    it("should calculate magnitude for high-dimensional vectors", () => {
      const vector = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      const magnitude = VectorSimilarity.magnitude(vector);
      expect(magnitude).toBeCloseTo(Math.sqrt(10), 5);
    });
  });

  describe("cosineSimilarity export", () => {
    it("should work as standalone function", () => {
      const vectorA = [1, 2, 3];
      const vectorB = [1, 2, 3];
      const similarity = cosineSimilarity(vectorA, vectorB);
      expect(similarity).toBeCloseTo(1, 5);
    });

    it("should be equivalent to VectorSimilarity.cosine", () => {
      const vectorA = [1, 2, 3];
      const vectorB = [4, 5, 6];
      const similarity1 = cosineSimilarity(vectorA, vectorB);
      const similarity2 = VectorSimilarity.cosine(vectorA, vectorB);
      expect(similarity1).toBe(similarity2);
    });
  });
});
