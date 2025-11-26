import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    FaTimes,
    FaUser,
    FaEnvelope,
    FaLock,
    FaUserTag,
} from "react-icons/fa";

export default function AddUserModal({ isOpen, onClose, onSubmit, initialData }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            full_name: "",
            email: "",
            password: "",
            role: "student",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                full_name: initialData.full_name || "",
                email: initialData.email || "",
                password: null,
                role: initialData.role || "student",
            });
        } else {
            reset({
                full_name: "",
                email: "",
                password: "",
                role: "student",
            });
        }
    }, [initialData, reset]);

    const submitHandler = (data) => {
        if (initialData?._id) data._id = initialData._id;
        onSubmit(data);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    const isUpdate = Boolean(initialData);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative transform transition-all animate-fadeIn overflow-hidden">
                
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 opacity-10"></div>

                
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all z-10"
                >
                    <FaTimes size={20} />
                </button>

                <div className="relative p-8">
                    <div className="flex flex-col items-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {isUpdate ? "Update User" : "Add New User"}
                        </h2>
                        <p className="text-gray-500 text-sm mt-2">
                            {isUpdate
                                ? "Edit the user information below"
                                : "Create a new account with the form below"}
                        </p>
                    </div>

                    
                    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
                        
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <FaUser size={16} />
                                </div>
                                <input
                                    {...register("full_name", { required: "Full name is required" })}
                                    className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>
                            {errors.full_name && (
                                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                                    <span></span> {errors.full_name.message}
                                </p>
                            )}
                        </div>

                        
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <FaEnvelope size={16} />
                                </div>
                                <input
                                    type="email"
                                    disabled={isUpdate}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Invalid email format",
                                        },
                                    })}
                                    className={`w-full border-2 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${isUpdate ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200"
                                        }`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                                    <span></span> {errors.email.message}
                                </p>
                            )}
                        </div>

                        
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {isUpdate ? "New Password (optional)" : "Password"}
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <FaLock size={16} />
                                </div>
                                <input
                                    type="password"
                                    {...register("password", {
                                        required: !isUpdate && "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Minimum 6 characters",
                                        },
                                    })}
                                    className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder={
                                        isUpdate ? "Leave blank to keep old password" : "••••••••"
                                    }
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                                    <span></span> {errors.password.message}
                                </p>
                            )}
                        </div>

                        
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                User Role
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                                    <FaUserTag size={16} />
                                </div>
                                <select
                                    {...register("role", { required: true })}
                                    className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white cursor-pointer"
                                >
                                    <option value="teacher">Teacher</option>
                                    <option value="student">Student</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
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
                        </div>

                        
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 font-semibold text-gray-700 transition-all hover:border-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`flex-1 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-0.5 ${isUpdate
                                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-green-500/30 hover:shadow-green-500/40"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30 hover:shadow-blue-500/40"
                                    }`}
                            >
                                {isUpdate ? "Update User" : "Add User"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
