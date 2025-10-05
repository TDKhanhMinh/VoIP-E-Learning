import { Link, useParams } from "react-router-dom";

export default function TeacherClassDetails() {
  const { classId } = useParams();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Chi tiết lớp {classId}</h2>

      <div className="grid grid-cols-3 gap-6">
        <Link
          to={`/teacher/classes/${classId}/assignments`}
          className="p-4 bg-white shadow rounded hover:bg-gray-100"
        >
          Quản lý Bài tập
        </Link>
        <Link
          to={`/teacher/classes/${classId}/attendance`}
          className="p-4 bg-white shadow rounded hover:bg-gray-100"
        >
          Quản lý Điểm danh
        </Link>
        <Link
          to={`/teacher/classes/${classId}/submissions`}
          className="p-4 bg-white shadow rounded hover:bg-gray-100"
        >
          Quản lý Bài nộp
        </Link>
      </div>
    </div>
  );
}
