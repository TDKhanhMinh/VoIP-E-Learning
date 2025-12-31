import TableSkeleton from "./../../components/SkeletonLoading/TableSkeleton";
import StatsSkeleton from "./../../components/SkeletonLoading/StatsSkeleton";
import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaUsers,
  FaSearch,
  FaFilter,
  FaLock,
  FaLockOpen,
} from "react-icons/fa";
import { userService } from "../../services/userService";
import AddUserModal from "../../components/Modals/AddUserModal";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/UI/ConfirmDialog";
import AddQuestionModal from "../../components/Modals/AddQuestionModal";
import UserImportPreview from "../../components/Upload/UserImportPreview";
import Papa from "papaparse";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [roleFilter, searchQuery, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleAddUser = async (userData) => {
    console.log("User to create:", userData);
    try {
      const res = await userService.createUser(userData);
      console.log("User created:", res);
      setOpenModal(false);
      setRoleFilter("all");
      setSearchQuery("");
      await fetchUsers();
      toast.success("Thêm người dùng thành công");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi thêm người dùng");
    }
  };

  const handleUpdateUser = async (userData) => {
    console.log("User to update:", userData);
    const { _id, ...payload } = userData;
    try {
      const res = await userService.updateUser(selectedUser._id, payload);
      console.log("User update:", res);
      await fetchUsers();
      setOpenModal(false);
      toast.success("Cập nhật người dùng thành công");
      setSelectedUser(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Lỗi khi cập nhật người dùng"
      );
    }
  };

  const handleLockUser = async (user) => {
    try {
      const res = await userService.updateUser(user._id, {
        available: !user.available,
      });
      fetchUsers();
      toast.success("Khóa người dùng thành công");
      console.log(" User locked:", res);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi khóa người dùng");
    }
  };

  const validateUser = (user) => {
    const errors = [];

    if (!user.full_name || user.full_name.trim() === "") {
      errors.push("Tên không được để trống");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email || !emailRegex.test(user.email)) {
      errors.push("Email không hợp lệ");
    }

    if (!user.role || !["admin", "teacher", "student"].includes(user.role)) {
      errors.push("Vai trò không hợp lệ (admin/teacher/student)");
    }

    return errors;
  };

  const handleFileUpload = (file) => {
    if (!file) {
      toast.error("Vui lòng chọn file CSV");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log("Parsed CSV:", results);

        const validatedUsers = results.data.map((row) => {
          const user = {
            full_name: row.full_name || row.name || row.Name || "",
            email: row.email || row.Email || "",
            password: row.password || "123456",
            role: (row.role || row.Role || "student").toLowerCase(),
          };

          const errors = validateUser(user);
          return { ...user, errors };
        });

        console.log("Validated users:", validatedUsers);
        setPreviewData(validatedUsers);
        setOpenImportModal(false);
        setShowPreview(true);
      },
      error: (error) => {
        console.error("CSV Parse Error:", error);
        toast.error("Lỗi khi đọc file CSV");
      },
    });
  };

  const handleConfirmImport = async (selectedUsers) => {
    try {
      const validUsers = selectedUsers.filter(
        (user) => !user.errors || user.errors.length === 0
      );

      if (validUsers.length === 0) {
        toast.error("Không có người dùng hợp lệ để import");
        return;
      }

      const createPromises = validUsers.map((user) =>
        userService.createUser({
          full_name: user.full_name,
          email: user.email,
          password: user.password || "123456",
          role: user.role,
        })
      );

      const results = await Promise.allSettled(createPromises);

      const successCount = results.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const failCount = results.filter((r) => r.status === "rejected").length;

      if (successCount > 0) {
        toast.success(`Nhập thành công ${successCount} người dùng`);
      }
      if (failCount > 0) {
        toast.warning(
          `${failCount} người dùng không thể nhập (có thể đã tồn tại)`
        );
      }

      setShowPreview(false);
      setPreviewData([]);
      await fetchUsers();
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Lỗi khi import người dùng");
    }
  };
  const getRoleBadgeColor = (role) => {
    const colors = {
      admin:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      teacher:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      student:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    };
    return (
      colors[role] ||
      "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-slate-700"
    );
  };

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-all font-medium bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                currentPage === i + 1
                  ? "bg-blue-600 dark:bg-blue-700 text-white shadow-lg dark:shadow-blue-900/50"
                  : "border-2 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-all font-medium bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-blue-600 dark:bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-blue-900/50">
              <FaUsers className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 pb-4">
                Quản lý Người dùng
              </h2>
            </div>
          </div>

          {isLoading ? (
            <StatsSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white dark:bg-slate-700 rounded-2xl p-5 shadow-lg dark:shadow-slate-900/70 border border-gray-100 dark:border-slate-600">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Total Users
                </div>
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {users.length}
                </div>
              </div>
              <div className="bg-blue-500 dark:bg-blue-600 rounded-2xl p-5 shadow-lg dark:shadow-blue-900/50 text-white">
                <div className="text-sm opacity-90 mb-1">Quản trị viên</div>
                <div className="text-3xl font-bold">
                  {users.filter((u) => u.role === "admin").length}
                </div>
              </div>
              <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-5 shadow-lg dark:shadow-blue-900/50 text-white">
                <div className="text-sm opacity-90 mb-1">Giáo viên</div>
                <div className="text-3xl font-bold">
                  {users.filter((u) => u.role === "teacher").length}
                </div>
              </div>
              <div className="bg-green-600 dark:bg-green-700 rounded-2xl p-5 shadow-lg dark:shadow-green-900/50 text-white">
                <div className="text-sm opacity-90 mb-1">Sinh viên</div>
                <div className="text-3xl font-bold">
                  {users.filter((u) => u.role === "student").length}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-lg dark:shadow-slate-900/70 border border-gray-100 dark:border-slate-600 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-12 pr-8 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all appearance-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 cursor-pointer"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="student">Sinh viên</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedUser(null);
                  setOpenModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg dark:shadow-blue-900/50 transition-all font-semibold hover:shadow-xl hover:-translate-y-0.5"
              >
                <FaPlus />
                <span>Thêm người dùng</span>
              </button>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setOpenImportModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg dark:shadow-blue-900/50 transition-all font-semibold hover:shadow-xl hover:-translate-y-0.5"
              >
                <FaPlus />
                <span>Nhập File</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/70 border border-gray-100 dark:border-slate-600 overflow-hidden">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-700 border-b-2 border-gray-200 dark:border-slate-600">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">
                      Tên đầy đủ
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">
                      Email
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300">
                      Vai trò
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user, index) => (
                      <tr
                        key={user.id || index}
                        className="border-b border-gray-100 dark:border-slate-600 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white font-bold shadow-md dark:shadow-blue-900/50">
                              {user.full_name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-100">
                              {user.full_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <span
                              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border-2 ${getRoleBadgeColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {user.available ? (
                              <span className="px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border-2 border-green-200 dark:border-green-800">
                                Hoạt động
                              </span>
                            ) : (
                              <span className="px-4 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-bold border-2 border-red-200 dark:border-red-800">
                                Không hoạt động
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setOpenModal(true);
                              }}
                              className="p-2.5 bg-yellow-500 dark:bg-yellow-600 text-white rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all hover:shadow-lg dark:shadow-yellow-900/50 hover:-translate-y-0.5"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setOpenConfirmModal(true);
                              }}
                              className={`p-2.5 text-white rounded-lg ${
                                user.available
                                  ? "bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500"
                                  : "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-500"
                              } transition-all hover:shadow-lg dark:shadow-slate-900/50 hover:-translate-y-0.5`}
                            >
                              {user.available ? <FaLock /> : <FaLockOpen />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <FaUsers className="text-gray-400 dark:text-gray-500 text-2xl" />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 font-medium">
                            Không tìm thấy người dùng
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {filteredUsers.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={openConfirmModal}
        title={
          selectedUser?.available ? "Khóa người dùng" : "Mở khóa người dùng"
        }
        message={
          selectedUser?.available
            ? `Bạn có chắc chắn muốn khóa người dùng này không?`
            : `Bạn có chắc chắn muốn mở khóa người dùng này không?`
        }
        onCancel={() => setOpenConfirmModal(false)}
        onConfirm={() => {
          handleLockUser(selectedUser);
          setOpenConfirmModal(false);
        }}
        btnDelete={selectedUser?.available ? "Khóa" : "Mở khóa"}
        btnCancel="Hủy"
      />

      <AddUserModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={selectedUser ? handleUpdateUser : handleAddUser}
        initialData={selectedUser}
      />
      <AddQuestionModal
        isOpen={openImportModal}
        onClose={() => setOpenImportModal(false)}
        title="Import người dùng từ file CSV"
        description={
          <div>
            <p className="mb-2">
              Chọn file CSV (.csv) chứa danh sách người dùng của bạn.
            </p>
            <p className="text-sm text-gray-600">
              Định dạng CSV: full_name, email, password (tùy chọn), role
            </p>
            <a
              href="/sample-users.csv"
              download
              className="inline-flex items-center gap-2 mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Tải file CSV mẫu
            </a>
          </div>
        }
        fileType=".csv"
        onImport={handleFileUpload}
      />

      <UserImportPreview
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setPreviewData([]);
        }}
        users={previewData}
        onConfirm={handleConfirmImport}
      />
    </div>
  );
}
