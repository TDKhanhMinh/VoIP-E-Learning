import { useParams } from "react-router-dom";
import AssignmentItem from "../../components/Assignments/AssignmentItem";
import { useEffect, useState } from "react";
import { assignmentService } from "./../../services/assignmentService";
import { classService } from "../../services/classService";
import { announcementService } from "../../services/announcementService";
import AssignmentSkeleton from "./../../components/SkeletonLoading/AssignmentSkeleton";

export default function Assignment() {
  const { id } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [userClass, setUserClass] = useState();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      setIsLoading(true);
      try {
        const [classData, assignmentData] = await Promise.all([
          classService.getClassById(id),
          assignmentService.getAllAssignmentsByClass(id),
        ]);

        setUserClass(classData);
        setAssignments(assignmentData ?? []);

        console.log("Class:", classData);
        console.log("Assignment:", assignmentData);
        announcementService
          .getAnnouncementByClassId(id)
          .then((res) => console.log("Notification", res));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  return (
    <div className="mx-4">
      <div className="h-20 rounded flex items-center">
        {isLoading ? (
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        ) : (
          <h2 className="text-3xl font-semibold dark:text-white">{userClass?.name}</h2>
        )}
      </div>

      {isLoading ? (
        <>
          <AssignmentSkeleton />
          <AssignmentSkeleton />
          <AssignmentSkeleton />
        </>
      ) : (
        <>
          {assignments.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 italic border border-red-500 dark:border-red-600 h-10 rounded flex items-center dark:bg-gray-800">
              <span className="mx-2 font-semibold">Chưa có bài tập nào.</span>
            </div>
          ) : (
            assignments.map((a) => (
              <AssignmentItem
                createDate={a.createdAt}
                key={a.id || a._id}
                title={a.title}
                description={a.description}
                dueDate={a.due_at}
                status={a.status}
                assignmentId={a._id}
              />
            ))
          )}
        </>
      )}
    </div>
  );
}
