import Document from "../model/document.js";
import { createEmbedding } from "../service/recommendService.js";
import VectorSimilarity from "../utils/VectorSimilarity.js";

export const createDocument = async (req, res) => {
  try {
    const {
      title,
      description = "",
      tags = [],
      level = "",
      link = "",
    } = req.body;

    const titleText = title || "";
    const tagsText = tags.join(", ") || "";
    const levelText = level || "";
    const descText = description || "";

    const fullText = `${titleText}. ${descText}. Tags: ${tagsText}. Level: ${levelText}`;
    const embedding = await createEmbedding(fullText);

    const titleEmbedding = titleText ? await createEmbedding(titleText) : null;
    const tagsEmbedding = tagsText ? await createEmbedding(tagsText) : null;
    const levelEmbedding = levelText ? await createEmbedding(levelText) : null;
    const descEmbedding = descText ? await createEmbedding(descText) : null;

    const doc = await Document.create({
      title,
      description,
      tags,
      level,
      link,
      embedding,
      titleEmbedding,
      tagsEmbedding,
      levelEmbedding,
      descriptionEmbedding: descEmbedding,
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const listDocuments = async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const recommendDocuments = async (req, res) => {
  try {
    const { query, topK = 5, method = "cosine", useWeighted = true } = req.body;
    if (!query) return res.status(400).json({ error: "Missing query" });

    console.log(
      `Searching for: "${query}" (top ${topK}, weighted: ${useWeighted})`
    );

    const qEmbedding = await createEmbedding(query);
    const docs = await Document.find();

    if (docs.length === 0) {
      return res.json([]);
    }

    let results;

    if (useWeighted) {
      const weights = {
        title: 0.35,
        tags: 0.3,
        level: 0.2,
        description: 0.15,
      };

      const items = docs.map((doc) => {
        let weightedScore = 0;
        let totalWeight = 0;

        if (doc.titleEmbedding && doc.titleEmbedding.length > 0) {
          const titleScore = VectorSimilarity.cosine(
            qEmbedding,
            doc.titleEmbedding
          );
          weightedScore += titleScore * weights.title;
          totalWeight += weights.title;
        }

        if (doc.tagsEmbedding && doc.tagsEmbedding.length > 0) {
          const tagsScore = VectorSimilarity.cosine(
            qEmbedding,
            doc.tagsEmbedding
          );
          weightedScore += tagsScore * weights.tags;
          totalWeight += weights.tags;
        }

        if (doc.levelEmbedding && doc.levelEmbedding.length > 0) {
          const levelScore = VectorSimilarity.cosine(
            qEmbedding,
            doc.levelEmbedding
          );
          weightedScore += levelScore * weights.level;
          totalWeight += weights.level;
        }

        if (doc.descriptionEmbedding && doc.descriptionEmbedding.length > 0) {
          const descScore = VectorSimilarity.cosine(
            qEmbedding,
            doc.descriptionEmbedding
          );
          weightedScore += descScore * weights.description;
          totalWeight += weights.description;
        }

        if (totalWeight === 0 && doc.embedding && doc.embedding.length > 0) {
          weightedScore = VectorSimilarity.cosine(qEmbedding, doc.embedding);
          totalWeight = 1;
        }

        const finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;

        return {
          score: finalScore,
          data: doc,
        };
      });

      items.sort((a, b) => b.score - a.score);
      results = items.slice(0, topK);
    } else {
      const items = docs.map((doc) => ({
        vector: doc.embedding,
        data: doc,
      }));
      results = VectorSimilarity.findTopK(qEmbedding, items, topK, method);
    }

    const validResults = results.filter((result) => result.score > 0);

    const formattedResults = validResults.map((result) => ({
      _id: result.data._id,
      title: result.data.title,
      description: result.data.description,
      tags: result.data.tags,
      level: result.data.level,
      link: result.data.link,
      score: result.score,
      createdAt: result.data.createdAt,
    }));

    console.log(
      `Found ${formattedResults.length} recommendations (filtered from ${results.length})`
    );
    res.json(formattedResults);
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, level, link } = req.body;

    // Tạo embeddings riêng cho từng phần
    const titleText = title || "";
    const tagsText = (tags || []).join(", ");
    const levelText = level || "";
    const descText = description || "";

    const fullText = `${titleText}. ${descText}. Tags: ${tagsText}. Level: ${levelText}`;
    const embedding = await createEmbedding(fullText);

    const titleEmbedding = titleText ? await createEmbedding(titleText) : null;
    const tagsEmbedding = tagsText ? await createEmbedding(tagsText) : null;
    const levelEmbedding = levelText ? await createEmbedding(levelText) : null;
    const descEmbedding = descText ? await createEmbedding(descText) : null;

    const doc = await Document.findByIdAndUpdate(
      id,
      {
        title,
        description,
        tags,
        level,
        link,
        embedding,
        titleEmbedding,
        tagsEmbedding,
        levelEmbedding,
        descriptionEmbedding: descEmbedding,
      },
      { new: true }
    );

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findByIdAndDelete(id);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
