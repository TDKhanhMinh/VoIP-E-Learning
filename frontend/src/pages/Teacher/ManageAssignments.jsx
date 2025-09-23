import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import AssignmentModal from "../../components/AssignmentModal";
import Button from "../../components/Button";

export default function ManageAssignments() {
    const { classId } = useParams();
    const [open, setOpen] = useState(false);
    const handleSave = (newAssignment) => {
        setAssignments([...assignments, newAssignment]);
    };
    const [assignments, setAssignments] = useState([
        { id: 1, title: "Lab 1", dueDate: "2025-09-30" },
        { id: 2, title: "Lab 2", dueDate: "2025-10-15" },
    ]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">
                Quản lý Bài tập - Lớp {classId}
            </h2>

            <Button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
                onClick={() => setOpen(true)}
            >
                + Giao bài
            </Button>

            <table className="w-full border bg-white shadow-md rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2">Tên bài tập</th>
                        <th className="border px-4 py-2">Hạn nộp</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((a) => (
                        <tr key={a.id} className="text-center hover:bg-gray-50">
                            <td className="border px-4 py-2">{a.title}</td>
                            <td className="border px-4 py-2">{a.dueDate}</td>
                            <td className="border px-4 py-2 space-x-2">
                                <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                                    <FaEdit />
                                </button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AssignmentModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
}
