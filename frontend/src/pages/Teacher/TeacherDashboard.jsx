import { motion } from "framer-motion";

export default function TeacherDashboard() {
  const adminName = sessionStorage.getItem("name") || "Giáo viên";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">
            Xin chào, {adminName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Chào mừng bạn quay lại bảng điều khiển quản trị hệ thống E-Learning.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Hôm nay là{" "}
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
