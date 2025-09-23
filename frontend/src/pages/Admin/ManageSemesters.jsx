import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useParams} from "react-router-dom";
import SemesterModal from "../../components/SemesterModal";
import Button from "../../components/Button";

export default function ManageSemester() {
    const { yearId } = useParams();
    const [open, setOpen] = useState(false);

    const handleSave = (newSemester) => {
        setSemesters([...semesters, newSemester]);
    };

    const [semesters, setSemesters] = useState([
        {
            id: 1,
            yearId: 1,
            name: "HK1",
            startDate: "2024-09-01",
            endDate: "2025-01-15",
        },
        {
            id: 2,
            yearId: 1,
            name: "HK2",
            startDate: "2025-02-01",
            endDate: "2025-06-30",
        },
    ]);

    const handleAddSemester = () => {
        const newSem = {
            id: semesters.length + 1,
            yearId: parseInt(yearId),
            name: `HK${semesters.length + 1}`,
            startDate: "2025-09-01",
            endDate: "2026-01-15",
        };
        setSemesters([...semesters, newSem]);
    };

    const filteredSemesters = semesters.filter(
        (sem) => sem.yearId === parseInt(yearId)
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý Học kỳ - Năm {yearId}</h2>

            </div>

            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">Danh sách Học kỳ</h3>
                <Button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => setOpen(true)}
                >
                    Thêm học kỳ
                </Button>
            </div>

            <table className="w-full border border-gray-200 bg-white shadow-md rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">Tên học kỳ</th>
                        <th className="px-4 py-2 border">Ngày bắt đầu</th>
                        <th className="px-4 py-2 border">Ngày kết thúc</th>
                        <th className="px-4 py-2 border">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {semesters.map((sem) => (
                        <tr key={sem.id} className="text-center hover:bg-gray-50">
                            <td className="border px-4 py-2">{sem.name}</td>
                            <td className="border px-4 py-2">{sem.startDate}</td>
                            <td className="border px-4 py-2">{sem.endDate}</td>
                            <td className="border px-4 py-2 space-x-2">
                                <Button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                                    <FaEdit />
                                </Button>
                                <Button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <SemesterModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSave={handleSave}
            />

        </div>
    );
}
