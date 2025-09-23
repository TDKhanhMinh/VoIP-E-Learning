import { useState } from "react";

export default function ManageAttendance() {
    // Demo courses
    const courses = [
        { id: 1, name: "Lập trình Web" },
        { id: 2, name: "Cơ sở dữ liệu" },
    ];

    const classes = [
        { id: 101, courseId: 1, name: "Lập trình Web - N01" },
        { id: 102, courseId: 1, name: "Lập trình Web - N02" },
        { id: 201, courseId: 2, name: "CSDL - N01" },
    ];

    const students = {
        101: ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"],
        102: ["Phạm Văn D", "Nguyễn Thị E"],
        201: ["Hoàng Văn F", "Đỗ Thị G", "Nguyễn Văn H"],
    };

    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedClass, setSelectedClass] = useState("");

    const [attendance, setAttendance] = useState({});

    const filteredClasses = selectedCourse
        ? classes.filter((cls) => cls.courseId === parseInt(selectedCourse))
        : [];

    const classStudents = selectedClass ? students[selectedClass] || [] : [];

    const today = new Date().toISOString().slice(0, 10);

    const handleStatusChange = (student, status) => {
        setAttendance((prev) => ({
            ...prev,
            [student]: status,
        }));
    };

    const statusOptions = ["Có mặt", "Vắng", "Đi trễ"];
    const statusColors = {
        "Có mặt": "bg-green-500 text-white",
        "Vắng": "bg-red-500 text-white",
        "Đi trễ": "bg-yellow-500 text-white",
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Quản lý Điểm danh</h2>

            <div className="flex items-center gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Môn học
                    </label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => {
                            setSelectedCourse(e.target.value);
                            setSelectedClass("");
                        }}
                        className="border rounded p-2"
                    >
                        <option value="">-- Chọn môn học --</option>
                        {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Lớp học
                    </label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="border rounded p-2"
                        disabled={!selectedCourse}
                    >
                        <option value="">-- Chọn lớp học --</option>
                        {filteredClasses.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedClass && (
                <p className="mb-4 text-gray-600">
                    Ngày điểm danh: <span className="font-semibold">{today}</span>
                </p>
            )}

            {selectedClass && (
                <table className="w-full border bg-white shadow-md rounded">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">Sinh viên</th>
                            <th className="border px-4 py-2">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classStudents.map((student) => (
                            <tr key={student} className="text-center hover:bg-gray-50">
                                <td className="border px-4 py-2">{student}</td>
                                <td className="border px-4 py-2">
                                    <div className="flex justify-center gap-2">
                                        {statusOptions.map((stt) => (
                                            <button
                                                key={stt}
                                                onClick={() => handleStatusChange(student, stt)}
                                                className={`px-3 py-1 rounded text-sm ${attendance[student] === stt
                                                        ? statusColors[stt]
                                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    }`}
                                            >
                                                {stt}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {!selectedClass && (
                <p className="mt-6 text-gray-500 italic">
                    Vui lòng chọn môn học và lớp để hiển thị danh sách sinh viên.
                </p>
            )}
        </div>
    );
}
