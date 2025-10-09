import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaClock, FaGraduationCap } from "react-icons/fa";
import SemesterModal from "../../components/SemesterModal";
import Button from "../../components/Button";
import { semesterService } from "../../services/semesterService";
import { toast } from "react-toastify";
import formatDate from "../../utils/formatDate";
import Pagination from '../../components/Pagination';

export default function ManageSemester() {
    const [open, setOpen] = useState(false);
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSemesters = semesters.slice(startIndex, endIndex);
    const totalPages = Math.ceil(semesters.length / itemsPerPage);

    useEffect(() => {
        fetchSemesters();
    }, []);

    const fetchSemesters = async () => {
        try {
            const data = await semesterService.getAllSemesters();
            setSemesters(data);
        } catch (error) {
            console.error("Error fetching semesters:", error);
        }
    };

    const handleAddSemester = async (semesterData) => {
        try {
            if (new Date(semesterData.endDate) < new Date(semesterData.startDate)) {
                toast.error("Ngày kết thúc phải sau ngày bắt đầu!");
                return;
            }
            await semesterService.createSemester(semesterData);
            toast.success("Thêm học kỳ thành công");
            fetchSemesters();
            setOpen(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Lỗi khi thêm học kỳ");
            console.error("Error adding semester:", error);
        }
    };

    const handleUpdateSemester = async (semesterData) => {
        try {
            if (new Date(semesterData.endDate) < new Date(semesterData.startDate)) {
                toast.error("Ngày kết thúc phải sau ngày bắt đầu!");
                return;
            }
            const { _id, ...payload } = semesterData;
            console.log("Updating semester with ID:", selectedSemester._id, "Payload:", payload);

            const data = await semesterService.updateSemester(selectedSemester._id, payload);
            console.log("Semester update:", data);
            toast.success("Cập nhật học kỳ thành công");
            setSelectedSemester(null);
            fetchSemesters();
            setOpen(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Lỗi khi cập nhật học kỳ");
            console.error("Error update semester:", error);
        }
    };

    const getActiveSemesters = () => {
        const now = new Date();
        return semesters.filter(sem => {
            const start = new Date(sem.start_date);
            const end = new Date(sem.end_date);
            return now >= start && now <= end;
        }).length;
    };

    const getUpcomingSemesters = () => {
        const now = new Date();
        return semesters.filter(sem => new Date(sem.start_date) > now).length;
    };

    const getSemesterStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) {
            return { label: "Upcoming", color: "bg-blue-100 text-blue-700 border-blue-200" };
        } else if (now > end) {
            return { label: "Completed", color: "bg-gray-100 text-gray-700 border-gray-200" };
        } else {
            return { label: "Active", color: "bg-green-100 text-green-700 border-green-200" };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">

                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg">
                            <FaGraduationCap className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-800 bg-clip-text pb-4 text-transparent">
                                Quản lý Học kỳ
                            </h2>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <FaCalendarAlt className="text-purple-600 text-xl" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Total Semesters</div>
                                    <div className="text-3xl font-bold text-gray-800">{semesters.length}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 shadow-lg text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <FaClock className="text-white text-xl" />
                                </div>
                                <div>
                                    <div className="text-sm opacity-90">Active Now</div>
                                    <div className="text-3xl font-bold">{getActiveSemesters()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 shadow-lg text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <FaCalendarAlt className="text-white text-xl" />
                                </div>
                                <div>
                                    <div className="text-sm opacity-90">Upcoming</div>
                                    <div className="text-3xl font-bold">{getUpcomingSemesters()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">All Semesters</h3>
                            <p className="text-sm text-gray-500 mt-1">Showing {currentSemesters.length} of {semesters.length} semesters</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedSemester(null);
                                setOpen(true);
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-800 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all font-semibold hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <FaPlus />
                            <span>Thêm học kỳ</span>
                        </button>
                    </div>
                </div>


                {currentSemesters.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        {currentSemesters.map((sem) => {
                            const status = getSemesterStatus(sem.start_date, sem.end_date);
                            return (
                                <div
                                    key={sem.id}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                                <FaGraduationCap className="text-white text-2xl" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-800">{sem.name}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendarAlt className="text-purple-500" />
                                                        <span>Start: <span className="font-semibold">{formatDate(sem.start_date)}</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendarAlt className="text-pink-500" />
                                                        <span>End: <span className="font-semibold">{formatDate(sem.end_date)}</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setOpen(true);
                                                    setSelectedSemester(sem);
                                                }}
                                                className="p-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
                                            >
                                                <FaEdit />
                                            </button>
                                            {/* <button className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all hover:shadow-lg hover:-translate-y-0.5">
                                                <FaTrash />
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                <FaGraduationCap className="text-gray-400 text-3xl" />
                            </div>
                            <p className="text-gray-500 font-medium text-lg">No semesters found</p>
                            <button
                                onClick={() => {
                                    setSelectedSemester(null);
                                    setOpen(true);
                                }}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-800 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all font-semibold"
                            >
                                <FaPlus />
                                <span>Add Your First Semester</span>
                            </button>
                        </div>
                    </div>
                )}


                {semesters.length > itemsPerPage && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>


            <SemesterModal
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                    setSelectedSemester(null);
                }}
                onSave={selectedSemester ? handleUpdateSemester : handleAddSemester}
                initialData={selectedSemester}
            />
        </div>
    );
}