import { useParams } from "react-router-dom";
import AssignmentItem from "../../components/AssignmentItem";

const courseDetails = {
    "522001": { name: "Mẫu thiết kế", teacher: "Thầy Vũ Đình Hồng", score: 10 },
    "522002": { name: "Điện toán đám mây", teacher: "Cô Nguyễn Lan", score: 8.4 },
    "522003": { name: "Lập trình Web", teacher: "Thầy Minh", score: 9.2 },
    "522004": { name: "Cơ sở dữ liệu", teacher: "Cô Hằng", score: 8.0 },
};

const assignmentsByCourse = {
    "522001": [
        {
            id: "a1",
            title: "LAB 6_Bài tập bonus cho SJF",
            description:
                "_SV nộp hình chụp file chạy giải thuật SJF (arrival time khác nhau). Nén lại 1 file rar/zip.",
            dueDate: "14/04/2023 14:09",
            status: "Chưa nộp",
        },
        {
            id: "a2",
            title: "LAB 6_Bài tập FCFS (6.3)",
            description: "Bài tập áp dụng thuật toán FCFS.",
            dueDate: "14/04/2023 14:08",
            status: "Đã nộp",
        },
        {
            id: "a2",
            title: "LAB 6_Bài tập FCFS (6.3)",
            description: "Bài tập áp dụng thuật toán FCFS.",
            dueDate: "14/04/2023 14:08",
            status: "Đã nộp",
        },
        {
            id: "a2",
            title: "LAB 6_Bài tập FCFS (6.3)",
            description: "Bài tập áp dụng thuật toán FCFS.",
            dueDate: "14/04/2023 14:08",
            status: "Đã nộp",
        },
        {
            id: "a2",
            title: "LAB 6_Bài tập FCFS (6.3)",
            description: "Bài tập áp dụng thuật toán FCFS.",
            dueDate: "14/04/2023 14:08",
            status: "Đã nộp",
        },

    ],
    "522002": [],
    "522003": [
        {
            id: "a3",
            title: "LAB 1_Bài tập SQL cơ bản",
            description: "Tạo bảng và truy vấn dữ liệu cơ bản.",
            dueDate: "20/04/2023 23:59",
            status: "Chưa nộp",
        },
    ],
};

export default function CourseDetail() {
    const { id } = useParams();
    const course = courseDetails[id];

    if (!course) return <p>Chưa chọn môn học.</p>;

    const assignments = assignmentsByCourse[id] || [];

    return (
        <div className="mx-4">
            <div className="h-20 rounded flex items-center ">
                <h2 className="text-3xl font-semibold">{course.name}</h2>
            </div>
            {assignments.length === 0 ? (
                <div className="text-gray-500 italic border border-red-500 h-10 rounded flex items-center "><span className="mx-2 font-semibold">Chưa có bài tập nào.</span></div>
            ) : (
                assignments.map((a) => (
                    <AssignmentItem
                        key={a.id}
                        title={a.title}
                        description={a.description}
                        dueDate={a.dueDate}
                        status={a.status}
                    />
                ))
            )}
        </div>
    );
}
