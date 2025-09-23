import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function ManageClasses() {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "Lập trình Web N01",
      course: "Lập trình Web",
      teacher: "Thầy Minh",
      semester: "HK1 - 2024-2025",
      schedule: "Thứ 2, Ca 1, P201",
    },
  ]);

  const handleAddClass = () => {
    const newClass = {
      id: classes.length + 1,
      name: "Cơ sở dữ liệu N02",
      course: "Cơ sở dữ liệu",
      teacher: "Cô Hằng",
      semester: "HK1 - 2024-2025",
      schedule: "Thứ 3, Ca 2, P301",
    };
    setClasses([...classes, newClass]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Quản lý Lớp học</h2>

      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold">Danh sách lớp</h3>
        <button
          onClick={handleAddClass}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" /> Thêm lớp học
        </button>
      </div>

      <table className="w-full border border-gray-200 bg-white shadow-md rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Tên lớp</th>
            <th className="px-4 py-2 border">Môn học</th>
            <th className="px-4 py-2 border">Giảng viên</th>
            <th className="px-4 py-2 border">Học kỳ</th>
            <th className="px-4 py-2 border">Lịch học</th>
            <th className="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id} className="text-center hover:bg-gray-50">
              <td className="border px-4 py-2">{cls.name}</td>
              <td className="border px-4 py-2">{cls.course}</td>
              <td className="border px-4 py-2">{cls.teacher}</td>
              <td className="border px-4 py-2">{cls.semester}</td>
              <td className="border px-4 py-2">{cls.schedule}</td>
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
    </div>
  );
}
