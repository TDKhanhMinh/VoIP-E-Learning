import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { FaSearch, FaUserPlus, FaTimes, FaCheckCircle } from "react-icons/fa";
import Button from "./Button";
import { enrollmentService } from "../services/enrollmentService";

export default function AddStudentsModal({
    isOpen,
    onClose,
    onSubmit,
    studentsList = [],
    classId,
}) {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const studentsEnrolled = await enrollmentService.getAllEnrollments(classId)
                .then(enrollments => enrollments.map(e => e.student._id));
            studentsList.filter(s => !studentsEnrolled.includes(s._id));
            console.log("Students already enrolled:", studentsEnrolled);
            console.log("Filtered students list:", studentsList);
        };
        fetchData();
    }, [classId, studentsList]);

    const filteredStudents = studentsList.filter((s) =>
        s.full_name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    const toggleStudent = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter((s) => s !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleSubmit = () => {
        if (selected.length === 0) {
            alert("Vui lòng chọn ít nhất một sinh viên!");
            return;
        }
        onSubmit({
            class: classId,
            student: selected,
        });
        setSelected([]);
        setSearch("");
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            setSelected([]);
            setSearch("");
        }
    }, [isOpen]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={() => {
                    onClose();
                    setSelected([]);
                    setSearch("");
                }}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/60 via-blue-900/40 to-gray-900/60 backdrop-blur-md" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-90 translate-y-8"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95 translate-y-4"
                    >
                        <Dialog.Panel className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                            {/* Modern Header with Gradient */}
                            <div className="relative px-6 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 overflow-hidden">
                                {/* Decorative circles */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <FaUserPlus className="text-white text-xl" />
                                        </div>
                                        <div>
                                            <Dialog.Title className="text-xl font-bold text-white">
                                                Thêm sinh viên vào lớp
                                            </Dialog.Title>
                                            <p className="text-blue-100 text-sm mt-0.5">
                                                Chọn sinh viên để thêm vào lớp học
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                                    >
                                        <FaTimes className="text-xl" />
                                    </button>
                                </div>
                            </div>

                            {/* Search Section */}
                            <div className="px-6 py-4 bg-gradient-to-b from-gray-50 to-white border-b">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaSearch className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo tên, MSSV hoặc email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Table Header */}
                            <div className="px-6 py-3 bg-gray-50 border-b">
                                <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <span className="col-span-1 flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selected.length === filteredStudents.length && filteredStudents.length > 0}
                                            onChange={() => {
                                                if (selected.length === filteredStudents.length) {
                                                    setSelected([]);
                                                } else {
                                                    setSelected(filteredStudents.map(s => s._id));
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </span>
                                    <span className="col-span-4">Họ và tên</span>
                                    <span className="col-span-3">Mã số SV</span>
                                    <span className="col-span-4">Email</span>
                                </div>
                            </div>

                            {/* Scrollable Student List */}
                            <div className="max-h-[50vh] overflow-y-auto">
                                {filteredStudents.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 px-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <FaSearch className="text-gray-400 text-2xl" />
                                        </div>
                                        <p className="text-gray-500 font-medium">Không tìm thấy sinh viên</p>
                                        <p className="text-gray-400 text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {filteredStudents.map((s) => (
                                            <div
                                                key={s._id}
                                                onClick={() => toggleStudent(s._id)}
                                                className={`grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-all duration-200 ${selected.includes(s._id)
                                                        ? 'bg-blue-50 hover:bg-blue-100'
                                                        : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="col-span-1 flex items-center">
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={selected.includes(s._id)}
                                                            onChange={() => toggleStudent(s._id)}
                                                            className="w-5 h-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                                                        />
                                                        {selected.includes(s._id) && (
                                                            <FaCheckCircle className="absolute -top-1 -right-1 text-blue-600 text-xs bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="col-span-4 font-semibold text-gray-800 flex items-center">
                                                    {s.full_name}
                                                </span>
                                                <span className="col-span-3 text-gray-600 font-mono text-sm flex items-center">
                                                    {s.student_id}
                                                </span>
                                                <span className="col-span-4 text-gray-500 text-sm flex items-center truncate">
                                                    {s.email}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Modern Footer */}
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {selected.length > 0 ? (
                                        <>
                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                                                <span className="text-white text-sm font-bold">{selected.length}</span>
                                            </div>
                                            <span className="text-gray-700 font-medium">
                                                sinh viên đã chọn
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-gray-500 text-sm">
                                            Chưa chọn sinh viên nào
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            onClose();
                                            setSelected([]);
                                            setSearch("");
                                        }}
                                        className="px-5 py-2.5 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-xl transition-all duration-200 hover:shadow-md"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={selected.length === 0}
                                        className={`px-6 py-2.5 font-medium rounded-xl transition-all duration-200 flex items-center gap-2 ${selected.length === 0
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                            }`}
                                    >
                                        <FaUserPlus />
                                        Thêm vào lớp
                                    </button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}