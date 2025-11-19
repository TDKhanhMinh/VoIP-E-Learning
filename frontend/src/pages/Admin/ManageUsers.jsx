import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaUsers, FaSearch, FaFilter, FaLock, FaLockOpen } from "react-icons/fa";
import { userService } from "../../services/userService";
import AddUserModal from "../../components/AddUserModal";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

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
        const data = await userService.getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
    };

    const filterUsers = () => {
        let filtered = users;

        if (roleFilter !== "all") {
            filtered = filtered.filter((u) => u.role === roleFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter((u) =>
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
            setOpenModal(false)
            setRoleFilter("all");
            setSearchQuery("");
            await fetchUsers();
            toast.success("User added successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error adding user");
        }
    };

    const handleUpdateUser = async (userData) => {
        console.log("User to update:", userData);
        const { _id, ...payload } = userData;
        try {
            const res = await userService.updateUser(selectedUser._id, payload);
            console.log("🎉 User update:", res);
            await fetchUsers();
            setOpenModal(false);
            toast.success("User updated successfully");
            setSelectedUser(null);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error updating user");
        }
    };

    const handleLockUser = async (user) => {
        try {
            const res = await userService.updateUser(user._id, { available: !user.available });
            fetchUsers();
            toast.success("User locked successfully");
            console.log("🎉 User locked:", res);
        }
        catch (error) {
            toast.error(error?.response?.data?.message || "Error locking user");
        }
    }
    const getRoleBadgeColor = (role) => {
        const colors = {
            admin: "bg-purple-100 text-purple-700 border-purple-200",
            teacher: "bg-blue-100 text-blue-700 border-blue-200",
            student: "bg-green-100 text-green-700 border-green-200"
        };
        return colors[role] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    const Pagination = ({ currentPage, totalPages, onPageChange }) => {
        return (
            <div className="flex items-center justify-center gap-2 mt-6">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium"
                >
                    Previous
                </button>

                <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => onPageChange(i + 1)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === i + 1
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                : "border-2 border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-medium"
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">

                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <FaUsers className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent pb-4">
                                Quản lý Người dùng
                            </h2>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                            <div className="text-sm text-gray-600 mb-1">Total Users</div>
                            <div className="text-3xl font-bold text-gray-800">{users.length}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 shadow-lg text-white">
                            <div className="text-sm opacity-90 mb-1">Admins</div>
                            <div className="text-3xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg text-white">
                            <div className="text-sm opacity-90 mb-1">Teachers</div>
                            <div className="text-3xl font-bold">{users.filter(u => u.role === 'teacher').length}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 shadow-lg text-white">
                            <div className="text-sm opacity-90 mb-1">Students</div>
                            <div className="text-3xl font-bold">{users.filter(u => u.role === 'student').length}</div>
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>


                        <div className="flex gap-3">
                            <div className="relative">
                                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white cursor-pointer"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="student">Student</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedUser(null);
                                    setOpenModal(true);
                                }}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all font-semibold hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <FaPlus />
                                <span>Thêm người dùng</span>
                            </button>
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Tên đầy đủ</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Vai trò</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Trạng thái</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((user, index) => (
                                        <tr
                                            key={user.id || index}
                                            className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                                                        {user.full_name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-gray-800">{user.full_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border-2 ${getRoleBadgeColor(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    {user.available ? (
                                                        <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold border-2 border-green-200">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-bold border-2 border-red-200">
                                                            Inactive
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
                                                        className="p-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setOpenConfirmModal(true);
                                                        }}
                                                        className={`p-2.5  text-white rounded-lg ${user.available ? "bg-red-500  hover:bg-red-600" : "bg-green-500  hover:bg-green-600"} transition-all hover:shadow-lg hover:-translate-y-0.5`}>
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
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <FaUsers className="text-gray-400 text-2xl" />
                                                </div>
                                                <p className="text-gray-500 font-medium">No users found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
                title={selectedUser?.available ? "Khóa người dùng" : "Mở khóa người dùng"}
                message={selectedUser?.available ? `Bạn có chắc chắn muốn khóa người dùng này không?` : `Bạn có chắc chắn muốn mở khóa người dùng này không?`}
                onCancel={() => setOpenConfirmModal(false)}
                onConfirm={() => { handleLockUser(selectedUser); setOpenConfirmModal(false); }}
                btnDelete={selectedUser?.available ? "Khóa" : "Mở khóa"}
                btnCancel="Hủy"
            />

            <AddUserModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={selectedUser ? handleUpdateUser : handleAddUser}
                initialData={selectedUser}
            />
        </div>
    );
}