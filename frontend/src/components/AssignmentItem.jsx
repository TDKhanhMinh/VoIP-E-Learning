import { useEffect, useState } from "react";
import UploadModal from "./UploadModal";
import Button from "./Button";
import formatDateTime from './../utils/formatDateTime';
import { submissionService } from "../services/submissionService";
import { uploadService } from "../services/uploadService";

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
  const studentId = sessionStorage.getItem("userId").split('"').join('').toString();

  useEffect(() => {

    fetchSubmission();
  }, [])

  const handleCancel = () => {
    const data = submissionService.deleteSubmission(submission.find(s => s.assignment?._id === assignmentId)._id);
    console.log("Delete", data);

    setIsSubmitted(false);
  };
  const fetchSubmission = async () => {
    const submissionData = await submissionService.getSubmissionByUserId(studentId)
    console.log("Data", submissionData);
    setSubmission(submissionData);
    if (submissionData.find(s => s.assignment?._id === assignmentId)) setIsSubmitted(true)
  };
  const handleDownload = async () => {
    const url = submission.find(s => s.assignment?._id === assignmentId).file_url;
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = submission.file_name || "file.zip";
    // a.target = "_blank";
    // a.click();
    const downloadLink = await uploadService.downloadUrl(url);
    window.open(downloadLink, "_blank");
  };
  const handlerSubmit = async (data, setProgress) => {
    try {
      setOpen(true)
      const file = data.file[0];
      const uploadResult = await uploadService.uploadFile(file, setProgress);
      // const form = new FormData();
      // form.append("file", file);
      // console.log("upload file data", form);

      // let uploadResult = null
      // try {
      //   uploadResult = await driveUploadService.uploadToDrive(form);
      //   console.log("upload result ", uploadResult);
      // } catch (error) {
      //   toast.error("Lỗi khi upload file");
      //   console.log(error);
      // }
      // if (uploadResult) return

      console.log("upload data", uploadResult);
      const payload = {
        assignment: assignmentId,
        file_url: uploadResult.url,
        file_name: uploadResult.file_name,
        student: studentId,
      }
      const submitData = await submissionService.createSubmission(payload);
      console.log(submitData);
      fetchSubmission();
      setOpen(false)
    } catch (error) {
      console.log(error);

    }
  }
  return (
    <div className="border rounded-md shadow-lg mb-3 bg-white">

      <div
        className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">{title}</span>
          <span className={`${statusColor} text-sm`}>
            {isSubmitted ? "Đã nộp" : "Chưa nộp"}
          </span>
        </div>
        <div className="text-sm text-gray-500">Due {formatDateTime(dueDate)}</div>
      </div>


      {expanded && (
        <div className="p-4 border-t">
          <p className="mb-4 text-gray-700 text-xs">Assignment posted in {formatDateTime(createDate)}</p>
          <p className="mb-4 text-gray-700">{description}</p>

          <div className="flex justify-between items-center border-t pt-3">
            <div>
              <p className="text-sm text-gray-500">
                Bài nộp:{" "}
                {isSubmitted ? (
                  <a
                    href={submission.find(s => s.assignment?._id === assignmentId).file_url}
                    download
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
                  >
                    <span className="underline">
                      {submission.find(s => s.assignment?._id === assignmentId).file_name?.split('.')[0] || "Tải xuống"}
                    </span>
                  </a>
                  // <button onClick={handleDownload}
                  //   // href={submission.find(s => s.assignment?._id === assignmentId).file_url?.replace("/upload/", "/upload/fl_attachment/")}
                  //   className="text-blue-600 underline hover:text-blue-800"
                  // >
                  //   {submission.find(s => s.assignment?._id === assignmentId).file_name?.split('.')[0]}
                  // </button>
                ) : (
                  <span className="text-red-500">Chưa nộp</span>
                )}
              </p>
              <p className="text-sm text-teal-600">HÌNH THỨC NỘP: NỘP FILE</p>
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
