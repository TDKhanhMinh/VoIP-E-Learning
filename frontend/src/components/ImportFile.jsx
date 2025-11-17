import { useState } from "react";
import QuestionPreview from "./QuestionReview";

export default function ImportExam() {
  const [questions, setQuestions] = useState([]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/parse-docx", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    setQuestions(data.questions);
  };

  return (
    <div>
      <input type="file" accept=".doc,.docx" onChange={handleUpload} />

      {questions.length > 0 && <QuestionPreview questions={questions} />}
    </div>
  );
}
