import { useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaUser,
} from "react-icons/fa";

export default function UserImportPreview({
  isOpen,
  onClose,
  users,
  onConfirm,
}) {
  const [selectedUsers, setSelectedUsers] = useState(
    users.map((_, index) => index)
  );

  if (!isOpen) return null;

  const hasErrors = users.some((user) => user.errors && user.errors.length > 0);
  const validUsers = users.filter(
    (user) => !user.errors || user.errors.length === 0
  );
  const errorUsers = users.filter(
    (user) => user.errors && user.errors.length > 0
  );

  const toggleUser = (index) => {
    setSelectedUsers((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (selectedUsers.length === validUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(
        users
          .map((user, index) =>
            !user.errors || user.errors.length === 0 ? index : null
          )
          .filter((i) => i !== null)
      );
    }
  };

  const handleConfirm = () => {
    const usersToImport = selectedUsers.map((index) => users[index]);
    onConfirm(usersToImport);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUser className="text-blue-600" />
              </div>
              Xem trước dữ liệu import
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Kiểm tra và xác nhận dữ liệu trước khi thêm vào hệ thống
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500 text-xl" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b border-gray-200">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng số</p>
                <p className="text-2xl font-bold text-gray-800">
                  {users.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUser className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Hợp lệ</p>
                <p className="text-2xl font-bold text-green-600">
                  {validUsers.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Lỗi</p>
                <p className="text-2xl font-bold text-red-600">
                  {errorUsers.length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  selectedUsers.length === validUsers.length &&
                  validUsers.length > 0
                }
                onChange={toggleAll}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Chọn tất cả ({selectedUsers.length}/{validUsers.length})
              </span>
            </label>

            {hasErrors && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                <FaExclamationTriangle />
                <span>Một số dòng có lỗi và sẽ bị bỏ qua</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Tên
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Mật khẩu
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Vai trò
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user, index) => {
                  const hasError = user.errors && user.errors.length > 0;
                  const isSelected = selectedUsers.includes(index);

                  return (
                    <tr
                      key={index}
                      className={`${
                        hasError
                          ? "bg-red-50"
                          : isSelected
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {!hasError && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleUser(index)}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                          )}
                          <span className="text-sm text-gray-600">
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-800">
                          {user.full_name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {user.email}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600 font-mono">
                          {user.password || "123456"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "teacher"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role === "teacher" ? "Giảng viên" : "Sinh viên"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {hasError ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                              <FaExclamationTriangle />
                              Có lỗi
                            </span>
                            <div className="text-xs text-red-500">
                              {user.errors.map((err, i) => (
                                <div key={i}>• {err}</div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                            <FaCheckCircle />
                            Hợp lệ
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">
              {selectedUsers.length}
            </span>{" "}
            người dùng được chọn để import
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedUsers.length === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xác nhận import ({selectedUsers.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
