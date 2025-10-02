import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Button from './../../components/Button';
import ClassModal from "../../components/ClassModal";

export default function ManageClasses() {
  const [open, setOpen] = useState(false);
  const [classes, setClasses] = useState([]);

  // demo dữ liệu cho dropdown
  const courses = [
    { id: 1, code: "IT001", name: "Lập trình Web" },
    { id: 2, code: "DB101", name: "Cơ sở dữ liệu" },
  ];
  const teachers = [
    { id: 1, name: "Thầy Minh" },
    { id: 2, name: "Cô Hằng" },
  ];
  const semesters = [
    { id: 1, name: "Học kỳ 1 - 2025", startDate: "2025-01-01", endDate: "2025-06-01" },
    { id: 2, name: "Học kỳ 2 - 2025", startDate: "2025-08-01", endDate: "2025-12-31" },
  ];

  const handleSave = (newClass) => {
    setClasses([...classes, newClass]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Quản lý Lớp học</h2>

      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold">Danh sách lớp</h3>
        <Button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => setOpen(true)}
        >
          Thêm lớp
        </Button>
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
          {classes.length > 0 ? (
            classes.map((cl) => (
              <tr key={cl.id}>
                <td className="p-2 border">{cl.name}</td>
                <td className="p-2 border">{courses.find(c => c.id == cl.courseId)?.name}</td>
                <td className="p-2 border">{teachers.find(t => t.id == cl.teacherId)?.name}</td>
                <td className="p-2 border">{semesters.find(s => s.id == cl.semesterId)?.name}</td>
                <td className="p-2 border">{cl.schedule}</td>
                <td className="border text-center px-4 py-2 space-x-2">
                  <Button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                    <FaEdit />
                  </Button>
                  <Button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                Chưa có lớp học nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ClassModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        courses={courses}
        teachers={teachers}
        semesters={semesters}
      />
    </div>
  );
}
