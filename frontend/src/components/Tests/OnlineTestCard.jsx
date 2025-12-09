import { useEffect, useState, useCallback } from "react";
import { attemptService } from "../../services/attemptService";
import { useNavigate } from "react-router-dom";
import DescriptionCopy from "./../Common/DescriptionCopy";
import formatDateTime from "./../../utils/formatDateTime";

// SVG Icons (Dùng trực tiếp để không cần cài thêm thư viện)
const Icons = {
  Clock: () => (
    <svg
      className="w-4 h-4 mr-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  ),
  User: () => (
    <svg
      className="w-4 h-4 mr-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      ></path>
    </svg>
  ),
  Book: () => (
    <svg
      className="w-4 h-4 mr-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      ></path>
    </svg>
  ),
  ChevronDown: ({ className }) => (
    <svg
      className={`w-5 h-5 transition-transform ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      ></path>
    </svg>
  ),
};

const OnlineTestCard = ({ data, role = "student", refreshKey }) => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [showDetails, setShowDetails] = useState(true);

  const fetchAttempts = useCallback(async () => {
    try {
      const res = await attemptService.getAttemptsByStudentAndTest(data._id);
      setAttempts(res);
    } catch (error) {
      console.error("Error fetching attempts:", error);
    }
  }, [data._id, refreshKey]);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  const isMaxAttemptsReached = attempts.length >= data.attempts;
  const isNotAvailable = !data.available;

  const bestScore =
    attempts.length > 0 ? Math.max(...attempts.map((r) => r.score)) : 0;
  const bestCorrect =
    attempts.length > 0
      ? Math.max(...attempts.map((r) => r.correctAnswers))
      : 0;
  const lastSubmit =
    attempts.length > 0 ? formatDateTime(attempts[0].submitedAt) : "Chưa có";

  return (
    <div className="flex flex-col rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-white border border-gray-200 overflow-hidden h-fit">
      <div
        onClick={() => setShowDetails(!showDetails)}
        className="flex justify-between items-center p-4 cursor-pointer bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-col gap-1">
          <h3
            className="text-lg font-bold text-gray-800 line-clamp-1"
            title={data.title}
          >
            {data.title}
          </h3>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full w-fit flex items-center">
            <Icons.Book />
            {data.subject}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {role === "student" &&
            (isMaxAttemptsReached ? (
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded border border-green-200 whitespace-nowrap">
                Đã hoàn thành
              </span>
            ) : !data.available ? (
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded border border-red-200 whitespace-nowrap">
                Đã đóng
              </span>
            ) : (
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded border border-blue-200 whitespace-nowrap">
                Đang mở
              </span>
            ))}
          <Icons.ChevronDown
            className={showDetails ? "rotate-180" : "rotate-0"}
          />
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          showDetails
            ? "max-h-[1000px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="col-span-1 md:col-span-2 flex items-start justify-between gap-2 bg-blue-50 p-2 rounded-md border border-blue-100">
              <span className="font-semibold text-blue-800 min-w-fit">
                Mô tả:
              </span>
              <div className="text-right w-full">
                <DescriptionCopy text={data.description} />
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-1">
              <span className="flex items-center text-gray-500">
                <Icons.Clock /> Bắt đầu:
              </span>
              <span className="font-medium text-gray-800">
                {formatDateTime(data.start)}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-1">
              <span className="flex items-center text-gray-500">
                <Icons.Clock /> Kết thúc:
              </span>
              <span className="font-medium text-gray-800">
                {formatDateTime(data.end)}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-1">
              <span className="flex items-center text-gray-500">
                Thời lượng:
              </span>
              <span className="font-medium text-gray-800">
                {data.time} phút
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-1">
              <span className="flex items-center text-gray-500">
                Số lần làm:
              </span>
              <span className="font-medium text-gray-800">
                {data.attempts} lần
              </span>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-between items-center border-b border-dashed border-gray-200 pb-1">
              <span className="flex items-center text-gray-500">
                <Icons.User /> Giảng viên:
              </span>
              <span className="font-medium text-gray-800">
                {data.teacherInfo?.full_name}
              </span>
            </div>
          </div>

          {role === "student" && (
            <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">
                Kết quả của bạn
              </h4>

              {attempts.length > 0 ? (
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Đã làm:</span>
                    <span className="font-medium">{attempts.length} lần</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nộp cuối:</span>
                    <span
                      className="font-medium truncate ml-2"
                      title={lastSubmit}
                    >
                      {lastSubmit}
                    </span>
                  </div>
                  <div className="flex justify-between col-span-2 md:col-span-1">
                    <span className="text-gray-500">Điểm cao nhất:</span>
                    <span className="font-bold text-red-600">{bestScore}</span>
                  </div>
                  <div className="flex justify-between col-span-2 md:col-span-1">
                    <span className="text-gray-500">Câu đúng nhất:</span>
                    <span className="font-bold text-green-600">
                      {bestCorrect}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic text-center py-2">
                  Bạn chưa thực hiện bài kiểm tra này.
                </p>
              )}
            </div>
          )}

          {role === "student" && (
            <div className="mt-4">
              <button
                onClick={() => {
                  const timestamp = Date.now();
                  navigate(`/home/exam/${data._id}?t=${timestamp}`);
                }}
                disabled={isNotAvailable || isMaxAttemptsReached}
                className={`w-full py-2.5 px-4 rounded-lg font-semibold shadow-sm transition-all duration-200 flex justify-center items-center gap-2
                  ${
                    isNotAvailable || isMaxAttemptsReached
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-md active:scale-[0.98]"
                  }`}
              >
                {isMaxAttemptsReached
                  ? "Đã hết lượt làm bài"
                  : isNotAvailable
                  ? "Bài thi đang đóng"
                  : "Bắt đầu làm bài"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlineTestCard;
