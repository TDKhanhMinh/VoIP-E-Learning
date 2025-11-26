import { useState } from "react";

export default QuestionPreview({ questions }) {
  const [list, setList] = useState(questions);

  const updateCorrect = (qIndex, optIndex) => {
    const updated = [...list];
    updated[qIndex].correct = optIndex;
    setList(updated);
  };

  const saveToDB = async () => {
    await fetch("/api/save-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: list }),
    });
    alert("Lưu thành công!");
  };

  return (
    <div className="mt-4 space-y-6">
      {list.map((q, i) => (
        <div key={i} className="p-4 border rounded">
          <p className="font-bold mb-2">{`Câu ${i + 1}: ${q.question}`}</p>

          {q.options.map((opt, idx) => (
            <label key={idx} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`q-${i}`}
                checked={q.correct === idx}
                onChange={() => updateCorrect(i, idx)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={saveToDB}
      >
        Lưu vào DB
      </button>
    </div>
  );
}
