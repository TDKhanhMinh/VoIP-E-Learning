import express from "express";
import multer from "multer";
import fs from "fs";
import mammoth from "mammoth";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/word", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;

    const questions = parseQuestions(text);

    res.json({ questions });

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Import file thất bại" });
  }
});

router.post("/csv", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const data = fs.readFileSync(filePath, "utf-8");

    const lines = data.split("\n").map((line) => line.trim());
    const users = lines.map((line) => {
      const [name, email, role] = line.split(",").map((field) => field.trim());
      return { name, email, role };
    });

    res.json({ users });

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Import file thất bại" });
  }
});

export default router;

function parseQuestions(text) {
  const questions = [];
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let currentQuestion = null;

  lines.forEach((line) => {
    const questionMatch = line.match(/^Câu\s*\d+:\s*(.+)$/);
    if (questionMatch) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        question: questionMatch[1],
        options: [],
      };
      return;
    }

    const optionMatch = line.match(/^([A-D])\.\s*(.+)$/);
    if (optionMatch && currentQuestion) {
      currentQuestion.options.push({
        answer: optionMatch[2].trim(),
        isCorrect: currentQuestion.options.length === 0,
      });
    }
  });

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  return questions;
}
