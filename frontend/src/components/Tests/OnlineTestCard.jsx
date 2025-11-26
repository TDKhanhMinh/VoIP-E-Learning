import { useEffect, useState, useCallback } from "react";
import { attemptService } from "../../services/attemptService";
import { Link, useNavigate } from "react-router-dom";
import DescriptionCopy from './../common/DescriptionCopy';

const OnlineTestCard = ({ data, role = "student", refreshKey }) => {
  const navigate = useNavigate();
  const formatDateTime = (dateTimeStr) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeStr).toLocaleString(undefined, options);
  };

  const [attempts, setAttempts] = useState([]);

  const fetchAttempts = useCallback(async () => {
    try {
      const res = await attemptService.getAttemptsByStudentAndTest(data._id);

      setAttempts(res);
    } catch (error) {
      console.error("Error fetching attempts:", error);
    }
  }, [data._id, data.title, refreshKey]);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  const [showDetails, setShowDetails] = useState(true);
  return (
    <>
      <div
        className={`flex flex-col p-3 rounded-md shadow-md col-span-1 bg-white border ${
          showDetails ? "h-fit" : "h-fit"
        }`}
      >
        <div
          onClick={() => {
            setShowDetails(!showDetails);
          }}
          className="flex w-full pl-2 text-xl font-bold cursor-pointer hover:text-blue-600"
        >
          {data.title}
        </div>
        <div
          className={`flex flex-col w-full text-md font-medium pt-4 px-4 space-y-5  ${
            showDetails ? "block" : "hidden"
          }`}
        >
          <hr />
          <div className="flex flex-row justify-between items-center space-x-3 max-h-10 overflow-hidden">
            <p className="min-w-fit font-light">Mô tả</p>
            <DescriptionCopy text={data.description} />
          </div>

          <hr />
          <div className="flex flex-row jutify-between items-center space-x-3">
            <p className="min-w-fit font-light">Môn học</p>
            <p className="justify-end flex w-full">{data.subject}</p>
          </div>
          <hr />
          <div className="flex flex-row jutify-between items-center space-x-3">
            <p className="min-w-fit font-light">Thời gian</p>
            <p className="justify-end flex w-full">{`${formatDateTime(
              data.start
            )} đến ${formatDateTime(data.end)} `}</p>
          </div>

          <hr />
          <div className="flex flex-row jutify-between items-center space-x-3">
            <p className="min-w-fit font-light">Thời gian làm bài</p>
            <p className="justify-end flex w-full">{data.time} phút</p>
          </div>
          <hr />
          <div className="flex flex-row jutify-between items-center space-x-3">
            <p className="min-w-fit font-light">Số lần làm bài</p>
            <p className="justify-end flex w-full">{data.attempts}</p>
          </div>
          <hr />
          <div className="flex flex-row jutify-between items-center space-x-3">
            <p className="min-w-fit font-light">Giảng viên</p>
            <p className="justify-end flex w-full">
              {data.teacherInfo.full_name}
            </p>
          </div>
          <hr />
          <div className={`${role === "student" ? "block" : "hidden"} mt-2`}>
            <div className="text-lg font-semibold mb-1">Kết quả:</div>
            <div className="flex flex-row justify-between items-center space-x-3">
              <p className="min-w-fit font-light">Số lần làm bài:</p>
              <p className="justify-end flex w-full">
                {attempts.length > 0 ? attempts.length : "Chưa có"}
              </p>
            </div>
            <div className="flex flex-row justify-between items-center space-x-3">
              <p className="min-w-fit font-light">Lần cuối nộp bài:</p>
              <p className="justify-end flex w-full">
                {attempts.length > 0
                  ? formatDateTime(attempts[0].submitedAt)
                  : "Chưa có"}
              </p>
            </div>

            <div className="flex flex-row justify-between items-center space-x-3">
              <p className="min-w-fit font-light">Điểm số cao nhất</p>
              <p
                className={`justify-end flex w-full ${
                  attempts.length > 0 ? "text-red-600 font-bold" : ""
                }`}
              >
                {attempts.length > 0
                  ? Math.max(...attempts.map((r) => r.score))
                  : "Chưa có"}
              </p>
            </div>
            <div className="flex flex-row justify-between items-center space-x-3">
              <p className="min-w-fit font-light">Số câu trả lời đúng:</p>
              <p
                className={`justify-end flex w-full ${
                  attempts.length > 0 ? "text-green-600 font-bold" : ""
                }`}
              >
                {attempts.length > 0
                  ? Math.max(...attempts.map((r) => r.correctAnswers))
                  : "Chưa có"}
              </p>
            </div>
            <p> </p>
          </div>
          <div className={`${role === "student" ? "block" : "hidden"} mt-2`}>
            <button
              onClick={() => {
                const timestamp = Date.now();
                navigate(`/home/exam/${data._id}?t=${timestamp}`);
              }}
              disabled={!data.available || attempts.length >= data.attempts}
              className={`w-full  py-2 px-4 rounded-md ${
                !data.available || attempts.length >= data.attempts
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {!data.available || attempts.length >= data.attempts
                ? "Đã hết thời gian làm bài"
                : "Bắt đầu làm bài"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnlineTestCard;
