import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Button from './../../components/Button';
import CourseModal from "../../components/CourseModal";

export default function ManageCourses() {
  const [open, setOpen] = useState(false);
  const handleSave = (newCourse) => {
    setCourses([...courses, newCourse]);
  };
  const [courses, setCourses] = useState([
    { id: 1, code: "504077", name: "Mẫu thiết kế", description: "Học về design pattern" },
    { id: 2, code: "501122", name: "Lập trình Web", description: "React + NodeJS" },
  ]);

  const handleAddCourse = () => {
    const newCourse = {
      id: courses.length + 1,
      code: "501133",
      name: "Cơ sở dữ liệu",
      description: "MySQL, MongoDB",
    };
    setCourses([...courses, newCourse]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Quản lý Môn học</h2>

      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold">Danh sách môn học</h3>
        <Button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => setOpen(true)}
        >
          Thêm môn học
        </Button>
      </div>

      <table className="w-full border border-gray-200 bg-white shadow-md rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Mã môn</th>
            <th className="px-4 py-2 border">Tên môn học</th>
            <th className="px-4 py-2 border">Mô tả</th>
            <th className="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="text-center hover:bg-gray-50">
              <td className="border px-4 py-2">{course.code}</td>
              <td className="border px-4 py-2">{course.name}</td>
              <td className="border px-4 py-2">{course.description}</td>
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
      <CourseModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div >
  );
}
