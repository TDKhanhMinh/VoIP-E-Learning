import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ClassSubmission() {
    const [submissions, setSubmissions] = useState([
        { id: 1, student: "Nguyễn Văn A", assignment: "Lab 1", score: 8.5, status: "Đã chấm" },
        { id: 2, student: "Trần Thị B", assignment: "Lab 1", score: null, status: "Chưa chấm" },
        { id: 3, student: "Phạm Văn C", assignment: "Lab 1", score: 7, status: "Đã chấm" },
    ]);
    const navigate = useNavigate();
    return (
        <div className="p-6 space-y-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium mb-4 transition-colors"
            >
                <FaArrowLeft /> Quay lại
            </button>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">📤 Bài nộp của sinh viên</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    🔄 Làm mới
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                        <tr>
                            <th className="p-3">Sinh viên</th>
                            <th className="p-3">Bài tập</th>
                            <th className="p-3 text-center">Điểm</th>
                            <th className="p-3 text-center">Trạng thái</th>
                            <th className="p-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((s) => (
                            <tr key={s.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{s.student}</td>
                                <td className="p-3">{s.assignment}</td>
                                <td className="p-3 text-center">{s.score ?? "-"}</td>
                                <td
                                    className={`p-3 text-center font-medium ${s.status === "Đã chấm" ? "text-green-600" : "text-orange-500"
                                        }`}
                                >
                                    {s.status}
                                </td>
                                <td className="p-3 text-center space-x-2">
                                    <button className="text-blue-600 hover:underline">Xem</button>
                                    <button className="text-green-600 hover:underline">Chấm</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
