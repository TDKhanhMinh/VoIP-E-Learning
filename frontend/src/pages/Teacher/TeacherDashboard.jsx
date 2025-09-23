export default function TeacherDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Bảng điều khiển Giảng viên</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="font-semibold text-lg">Tổng số lớp phụ trách</h3>
          <p className="text-3xl font-bold text-blue-600">5</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="font-semibold text-lg">Bài tập cần chấm</h3>
          <p className="text-3xl font-bold text-red-600">12</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="font-semibold text-lg">Thông báo mới</h3>
          <p className="text-3xl font-bold text-green-600">3</p>
        </div>
      </div>
    </div>
  );
}
