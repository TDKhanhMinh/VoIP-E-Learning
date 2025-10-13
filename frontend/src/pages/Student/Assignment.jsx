import { useParams } from "react-router-dom";
import AssignmentItem from "../../components/AssignmentItem";
import { useEffect, useState } from "react";
import { assignmentService } from './../../services/assignmentService';
import { classService } from "../../services/classService";


export default function Assignment() {
    const { id } = useParams();
    const [assignments, setAssignments] = useState([]);
    const [userClass, setUserClass] = useState();


    useEffect(() => {
        const fetchAssignment = async () => {
            console.log(await classService.getClassById(id));
            setAssignments(await assignmentService.getAllAssignmentsByClass(id) ?? 0);
            setUserClass(await classService.getClassById(id));
            console.log("assignment", await assignmentService.getAllAssignmentsByClass(id));

        };
        fetchAssignment();
    }, [id])

    return (
        <div className="mx-4">
            <div className="h-20 rounded flex items-center ">
                <h2 className="text-3xl font-semibold">{userClass?.name}</h2>
            </div>
            {assignments.length === 0 ? (
                <div className="text-gray-500 italic border border-red-500 h-10 rounded flex items-center "><span className="mx-2 font-semibold">Chưa có bài tập nào.</span></div>
            ) : (
                assignments.map((a) => (
                    <AssignmentItem
                        createDate={a.createdAt}
                        key={a.id}
                        title={a.title}
                        description={a.description}
                        dueDate={a.due_at}
                        status={a.status}
                        assignmentId={a._id}
                    />
                ))
            )}
        </div>
    );
}
