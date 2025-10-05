import { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function ManageUsers() {
    const [users, setUsers] = useState([
        { id: 1, fullName: "Nguyễn Văn A", email: "a@sv.tdt.edu.vn", role: "STUDENT" },
        { id: 2, fullName: "Trần Thị B", email: "b@tdt.edu.vn", role: "TEACHER" },
        { id: 3, fullName: "Admin", email: "admin@system.com", role: "ADMIN" },
    ]);

    const handleAddUser = () => {
        const newUser = {
            id: users.length + 1,
            fullName: "User mới",
            email: "new@sv.tdt.edu.vn",
            role: "STUDENT",
        };
        setUsers([...users, newUser]);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Quản lý Người dùng</h2>

            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">Danh sách người dùng</h3>
                <button
                    onClick={handleAddUser}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    <FaPlus className="mr-2" /> Thêm người dùng
                </button>
            </div>

            <table className="w-full border border-gray-200 bg-white shadow-md rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">Tên đầy đủ</th>
                        <th className="px-4 py-2 border">Email</th>
                        <th className="px-4 py-2 border">Vai trò</th>
                        <th className="px-4 py-2 border">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="text-center hover:bg-gray-50">
                            <td className="border px-4 py-2">{user.fullName}</td>
                            <td className="border px-4 py-2">{user.email}</td>
                            <td className="border px-4 py-2">{user.role}</td>
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
