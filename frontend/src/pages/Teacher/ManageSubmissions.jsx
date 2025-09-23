import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ManageSubmissions() {
  const { classId } = useParams();
  const [submissions, setSubmissions] = useState([
    { id: 1, student: "Nguyễn Văn A", assignment: "Lab 1", file: "lab1-a.pdf", score: 9 },
    { id: 2, student: "Trần Thị B", assignment: "Lab 1", file: "lab1-b.pdf", score: null },
  ]);

  const handleGrade = (id, score) => {
    setSubmissions(
      submissions.map((s) =>
        s.id === id ? { ...s, score } : s
      )
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Quản lý Bài nộp - Lớp {classId}
      </h2>

      <table className="w-full border bg-white shadow-md rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Sinh viên</th>
            <th className="border px-4 py-2">Bài tập</th>
            <th className="border px-4 py-2">File</th>
            <th className="border px-4 py-2">Điểm</th>
            <th className="border px-4 py-2">Chấm điểm</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id} className="text-center hover:bg-gray-50">
              <td className="border px-4 py-2">{s.student}</td>
              <td className="border px-4 py-2">{s.assignment}</td>
              <td className="border px-4 py-2">
                <a href={`/uploads/${s.file}`} download className="text-blue-600 underline">
                  {s.file}
                </a>
              </td>
              <td className="border px-4 py-2">{s.score ?? "Chưa có"}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleGrade(s.id, 10)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Chấm 10
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
