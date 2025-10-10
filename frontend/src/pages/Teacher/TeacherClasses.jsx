import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { classService } from "../../services/classService";
import { semesterService } from "../../services/semesterService";
import { enrollmentService } from "../../services/enrollmentService";
import Pagination from "../../components/Pagination";

export default function TeacherClasses() {
    const [classes, setClasses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [allEnrollments, setAllEnrollments] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentClasses = classes.slice(startIndex, endIndex);
    const totalPages = Math.ceil(classes.length / itemsPerPage);
    useEffect(() => {
        const fetchClasses = async () => {
            console.log(sessionStorage.getItem("userId"));
            console.log(await classService.getClassesByTeacher(sessionStorage.getItem("userId")));
            // console.log("Enrollments", await enrollmentService.getAllEnrollments());

            setClasses(await classService.getClassesByTeacher(sessionStorage.getItem("userId")))
            setSemesters(await semesterService.getAllSemesters());
            // setAllEnrollments(await enrollmentService.getAllEnrollments());
        };
        fetchClasses();
    }, [])

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Danh sách Lớp phụ trách</h2>
            <table className="w-full border bg-white shadow-md rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2">Tên lớp</th>
                        <th className="border px-4 py-2">Lịch học</th>
                        <th className="border px-4 py-2">Học kỳ</th>
                        <th className="border px-4 py-2">Số SV</th>
                        <th className="border px-4 py-2">Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {currentClasses.map((cls) => (
                        <tr key={cls.id} className="text-center hover:bg-gray-50">
                            <td className="border px-4 py-2">{cls.name}</td>
                            <td className="border px-4 py-2">{cls.schedule}</td>
                            <td className="border px-4 py-2">{semesters.find(se => se._id === cls.semester)?.name}</td>
                            <td className="border px-4 py-2">{allEnrollments.filter(e => e.class === cls._id)?.length}</td>
                            <td className="border px-4 py-2">
                                <Button
                                    to={`/teacher/class-details/${cls._id}`}
                                >
                                    <div className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                        Xem chi tiết
                                    </div>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {classes.length > itemsPerPage && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}
