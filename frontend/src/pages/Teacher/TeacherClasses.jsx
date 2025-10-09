import { useEffect, useState } from "react";
import Button from "../../components/Button";

export default function TeacherClasses() {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {

        };
        fetchClasses();
    }, [])

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Danh sách Lớp phụ trách</h2>
            <table className="w-full border bg-white shadow-md rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2">Tên lớp</th>
                        <th className="border px-4 py-2">Học kỳ</th>
                        <th className="border px-4 py-2">Số SV</th>
                        <th className="border px-4 py-2">Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map((cls) => (
                        <tr key={cls.id} className="text-center hover:bg-gray-50">
                            <td className="border px-4 py-2">{cls.name}</td>
                            <td className="border px-4 py-2">{cls.semester}</td>
                            <td className="border px-4 py-2">{cls.students}</td>
                            <td className="border px-4 py-2">
                                <Button
                                    to={`/teacher/class-details/${cls.id}`}
                                >
                                    <div className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                        Xem chi tiết
                                    </div>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
