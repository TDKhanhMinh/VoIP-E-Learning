import { useState } from "react";
import UploadModal from "./UploadModal";
import Button from "./Button";

export default function AssignmentItem({
  title,
  description,
  dueDate,
  status,
  submittedFile,
  submittedUrl,
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(status === "Đã nộp");
  const [fileName, setFileName] = useState(submittedFile || "");
  const [fileUrl, setFileUrl] = useState(submittedUrl || "");

  const statusColor = isSubmitted ? "text-green-600" : "text-red-500";

  const handleSubmit = (file) => {
    // ví dụ: khi upload thành công sẽ có file.name và file.url trả về từ server
    setFileName(file.name);
    setFileUrl(file.url);
    setIsSubmitted(true);
    setOpen(false);
  };

  const handleCancel = () => {
    setFileName("");
    setFileUrl("");
    setIsSubmitted(false);
  };

  return (
    <div className="border rounded-md shadow-lg mb-3 bg-white">
      {/* Header */}
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
        <div className="text-sm text-gray-500">Due {dueDate}</div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="p-4 border-t">
          <p className="mb-4 text-gray-700">{description}</p>

          <div className="flex justify-between items-center border-t pt-3">
            <div>
              <p className="text-sm text-gray-500">
                Bài nộp:{" "}
                {isSubmitted ? (
                  <a
                    href={fileUrl}
                    download
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {fileName}
                  </a>
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
        onSubmit={(file) => handleSubmit(file)}
      />
    </div>
  );
}
