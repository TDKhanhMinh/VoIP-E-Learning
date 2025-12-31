import { useEffect, useState } from "react";
import Button from "../UI/Button";
import formatDateTime from "../../utils/formatDateTime";
import { submissionService } from "../../services/submissionService";
import { uploadService } from "../../services/uploadService";
import UploadModal from "./../Modals/UploadModal";

export default function AssignmentItem({
  title,
  description,
  dueDate,
  assignmentId,
  createDate,
  status,
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [submission, setSubmission] = useState();
  const [isSubmitted, setIsSubmitted] = useState(status === "Đã nộp");

  const statusColor = isSubmitted ? "text-green-600" : "text-red-500";
  const studentId = sessionStorage
    .getItem("userId")
    .split('"')
    .join("")
    .toString();

  useEffect(() => {
    fetchSubmission();
  }, []);

  const handleCancel = () => {
    const data = submissionService.deleteSubmission(
      submission.find((s) => s.assignment?._id === assignmentId)._id
    );
    console.log("Delete", data);

    setIsSubmitted(false);
  };
  const fetchSubmission = async () => {
    const submissionData = await submissionService.getSubmissionByUserId(
      studentId
    );
    console.log("Data", submissionData);
    setSubmission(submissionData);
    if (submissionData.find((s) => s.assignment?._id === assignmentId))
      setIsSubmitted(true);
  };

  const handlerSubmit = async (data, setProgress) => {
    try {
      setOpen(true);
      const file = data.file[0];
      const uploadResult = await uploadService.uploadFile(file, setProgress);

      console.log("upload data", uploadResult);
      const payload = {
        assignment: assignmentId,
        file_url: uploadResult.url,
        file_name: uploadResult.file_name,
        student: studentId,
      };
      const submitData = await submissionService.createSubmission(payload);
      console.log(submitData);
      fetchSubmission();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="border dark:border-gray-700 rounded-md shadow-lg mb-3 bg-white dark:bg-gray-800">
      <div
        className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium dark:text-white">{title}</span>
          <span
            className={`${statusColor} dark:${
              isSubmitted ? "text-green-400" : "text-red-400"
            } text-sm`}
          >
            {isSubmitted ? "Đã nộp" : "Chưa nộp"}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Due {formatDateTime(dueDate)}
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t dark:border-gray-700">
          <p className="mb-4 text-gray-700 dark:text-gray-300 text-xs">
            Bài tập được đăng vào ngày {formatDateTime(createDate)}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">{description}</p>

          <div className="flex justify-between items-center border-t dark:border-gray-700 pt-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bài nộp:{" "}
                {isSubmitted ? (
                  <a
                    href={
                      submission.find((s) => s.assignment?._id === assignmentId)
                        .file_url
                    }
                    download
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group"
                  >
                    <span className="underline">
                      {submission
                        .find((s) => s.assignment?._id === assignmentId)
                        .file_name?.split(".")[0] || "Tải xuống"}
                    </span>
                  </a>
                ) : (
                  <span className="text-red-500 dark:text-red-400">
                    Chưa nộp
                  </span>
                )}
              </p>
              <p className="text-sm text-teal-600 dark:text-teal-400">
                HÌNH THỨC NỘP: NỘP FILE
              </p>
            </div>

            {!isSubmitted ? (
              <Button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Nộp bài
              </Button>
            ) : (
              <Button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Huỷ bài nộp
              </Button>
            )}
          </div>
        </div>
      )}

      <UploadModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={title}
        onSubmitData={handlerSubmit}
      />
    </div>
  );
}
