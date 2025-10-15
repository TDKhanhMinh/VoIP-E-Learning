import { useEffect, useState } from "react";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import { classService } from './../../services/classService';
import { semesterService } from './../../services/semesterService';
import { enrollmentService } from "../../services/enrollmentService";
import {
    FaChalkboardTeacher,
    FaUsers,
    FaCalendarAlt,
    FaClock,
    FaEye,
    FaSearch,
    FaFilter,
    FaBook
} from "react-icons/fa";

export default function TeacherClasses() {
    const [classes, setClasses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [allEnrollments, setAllEnrollments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setIsLoading(true);
        try {
            const userId = sessionStorage.getItem("userId");
            console.log("Teacher id", userId);

            const [classesData, semestersData, enrollmentsData] = await Promise.all([
                classService.getClassesByTeacher(userId),
                semesterService.getAllSemesters(),
                // enrollmentService.getAllEnrollments()
            ]);

            console.log("Classes", classesData);
            setClasses(classesData);
            setSemesters(semestersData);
            setAllEnrollments(enrollmentsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter classes based on search and semester
    const filteredClasses = classes.filter(cls => {
        // const matchesSearch = cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //     cls.schedule?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSemester = selectedSemester === "all" || cls.semester === selectedSemester;
        return matchesSemester;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentClasses = filteredClasses.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

    // const getStudentCount = (classId) => {
    //     return allEnrollments.filter(e => e.class === classId)?.length || 0;
    // };

    const getSemesterName = (semesterId) => {
        return semesters.find(se => se._id === semesterId)?.name || "—";
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                            <FaChalkboardTeacher className="text-white text-2xl" />
                        </div>
                        Lớp học phụ trách
                    </h1>
                    <p className="text-gray-600 ml-16">Quản lý và theo dõi các lớp học của bạn</p>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Tổng số lớp</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{classes.length}</p>
                            </div>
                            <div className="p-4 bg-blue-100 rounded-xl">
                                <FaChalkboardTeacher className="text-blue-600 text-3xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Tổng sinh viên</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">
                                    {/* {allEnrollments.length} */}
                                </p>
                            </div>
                            <div className="p-4 bg-green-100 rounded-xl">
                                <FaUsers className="text-green-600 text-3xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Học kỳ hiện tại</p>
                                <p className="text-lg font-bold text-purple-600 mt-2">
                                    {semesters[0]?.name || "—"}
                                </p>
                            </div>
                            <div className="p-4 bg-purple-100 rounded-xl">
                                <FaCalendarAlt className="text-purple-600 text-3xl" />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">

                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên lớp hoặc lịch học..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>


                        <div className="relative min-w-[200px]">
                            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={selectedSemester}
                                onChange={(e) => {
                                    setSelectedSemester(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">Tất cả học kỳ</option>
                                {semesters.map(semester => (
                                    <option key={semester._id} value={semester._id}>
                                        {semester.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>


                    <div className="mt-4 text-sm text-gray-600">
                        Hiển thị <span className="font-semibold text-blue-600">{filteredClasses.length}</span> lớp học
                        {(searchTerm || selectedSemester !== "all") && " (đã lọc)"}
                    </div>
                </div>


                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {currentClasses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                                <FaChalkboardTeacher className="text-blue-600 text-4xl" />
                            </div>
                            <p className="text-gray-600 font-medium text-lg">
                                {searchTerm || selectedSemester !== "all"
                                    ? "Không tìm thấy lớp học phù hợp"
                                    : "Chưa có lớp học nào"}
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                {searchTerm || selectedSemester !== "all"
                                    ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                                    : "Các lớp học sẽ được hiển thị ở đây"}
                            </p>
                        </div>
                    ) : (
                        <>

                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Tên lớp
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Lịch học
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Học kỳ
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Số sinh viên
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {currentClasses.map((cls) => (
                                            <tr key={cls._id} className="hover:bg-blue-50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2.5 bg-blue-100 rounded-lg">
                                                            <FaBook className="text-blue-600" />
                                                        </div>
                                                        <span className="font-semibold text-gray-800">
                                                            {cls.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FaClock className="text-gray-400" />
                                                        {Array.isArray(cls.schedule) && cls.schedule.length > 0 ? (
                                                            cls.schedule
                                                                .map((s) => {
                                                                    const days = {
                                                                        2: "Thứ 2",
                                                                        3: "Thứ 3",
                                                                        4: "Thứ 4",
                                                                        5: "Thứ 5",
                                                                        6: "Thứ 6",
                                                                        7: "Thứ 7",
                                                                    };
                                                                    return `${days[s.dayOfWeek] || "?"} - Ca ${s.shift}`;
                                                                })
                                                                .join("; ")
                                                        ) : (
                                                            "Chưa có lịch"
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                                        <FaCalendarAlt className="text-xs" />
                                                        {getSemesterName(cls.semester)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 bg-green-100 rounded-lg">
                                                            <FaUsers className="text-green-600" />
                                                        </div>
                                                        <span className="font-semibold text-gray-800">
                                                            {/* {getStudentCount(cls._id)} */}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Button to={`/teacher/class-details/${cls._id}`}>
                                                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                                                            <FaEye /> Xem chi tiết
                                                        </div>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                            <div className="md:hidden space-y-4 p-4">
                                {currentClasses.map((cls) => (
                                    <div key={cls._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <FaBook className="text-blue-600 text-xl" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800">{cls.name}</h3>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaClock className="text-gray-400" />
                                                <span>
                                                    {Array.isArray(cls.schedule) && cls.schedule.length > 0 ? (
                                                        cls.schedule
                                                            .map((s) => {
                                                                const days = {
                                                                    2: "Thứ 2",
                                                                    3: "Thứ 3",
                                                                    4: "Thứ 4",
                                                                    5: "Thứ 5",
                                                                    6: "Thứ 6",
                                                                    7: "Thứ 7",
                                                                };
                                                                return `${days[s.dayOfWeek] || "?"} - Ca ${s.shift}`;
                                                            })
                                                            .join("; ")
                                                    ) : (
                                                        "Chưa có lịch"
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <FaCalendarAlt className="text-purple-600" />
                                                <span className="text-purple-700 font-medium">
                                                    {getSemesterName(cls.semester)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <FaUsers className="text-green-600" />
                                                <span className="font-semibold text-gray-800">
                                                    {/* {getStudentCount(cls._id)} sinh viên */}
                                                </span>
                                            </div>
                                        </div>
                                        <Button to={`/teacher/class-details/${cls._id}`}>
                                            <div className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-md">
                                                <FaEye /> Xem chi tiết
                                            </div>
                                        </Button>
                                    </div>
                                ))}
                            </div>


                            {totalPages > 1 && (
                                <div className="px-6 py-4 bg-gray-50 border-t">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}