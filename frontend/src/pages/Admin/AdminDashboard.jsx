import { motion } from "framer-motion";

function AdminDashboard() {
  const adminName = "Quản trị viên";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-slate-700 shadow-lg dark:shadow-slate-900/70 rounded-2xl p-6 mb-8 text-center border border-gray-200 dark:border-slate-600"
        >
          <h1 className="text-3xl font-bold text-indigo-700 dark:text-blue-300 mb-2">
            Xin chào, {adminName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Chào mừng bạn quay lại bảng điều khiển quản trị hệ thống E-Learning.
          </p>
          <p className="text-gray-500 dark:text-gray-200 mt-1">
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

export default AdminDashboard;
