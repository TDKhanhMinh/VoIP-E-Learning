import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { testService } from "../../services/testService";
import { testSessionService } from "../../services/testSessionService";
import { toast } from "react-toastify";
export default function ExamScreen() {
  const { test_id } = useParams();
  const [test, setTest] = useState(null);
  const [testSession, setTestSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testData = await testService.getTestById(test_id);
        setTest(testData);

        const sessionRes =
          await testSessionService.getTestSessionsByTestAndStudent(test_id);
        const session = sessionRes[0];

        const savedAnswers = {};
        session.questions.forEach((q) => {
          if (q.selectedOptionId)
            savedAnswers[q.questionId] = q.selectedOptionId;
        });

        setTestSession(session);
        setAnswers(savedAnswers);

        const totalTime = testData.time * 60;
        const elapsed = Math.floor(
          (Date.now() - new Date(session.startedAt).getTime()) / 1000
        );
        setTimeLeft(Math.max(totalTime - elapsed, 0));
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải đề thi hoặc phiên làm bài.");
        navigate("/home/online-test", { state: { refreshAt: Date.now() } });
      }
    };
    fetchData();
  }, [test_id]);

  const handleSelect = async (questionId, optionId) => {
    try {
      const data = {
        questions: [{ questionId, selectedOptionId: optionId }],
      };
      await testSessionService.updateTestSession(testSession._id, data);

      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      await testService.createTestAttempt(testSession._id);
      toast.success("Nộp bài thành công!");
      navigate("/home/online-test", { state: { refreshAt: Date.now() } });
    } catch (err) {
      console.error(err);
    }
  }, [testSession, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Hết thời gian. Hệ thống tự nộp bài.");
          handleSubmit();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleSubmit]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!test || !testSession) {
    return <div className="p-6 text-center">Đang tải đề thi...</div>;
  }

  const currentSessionQuestion = testSession.questions[currentIndex];
  const originalQuestion = test.questions.find(
    (q) => q._id.toString() === currentSessionQuestion.questionId.toString()
  );

  if (!originalQuestion) {
    return <div className="p-6 text-center">Đang tải câu hỏi...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 p-4 gap-4">
      <div className="flex-1 p-6 overflow-y-auto col-span-1 lg:col-span-3 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">{test.title}</h1>
          <div className="text-lg font-bold bg-red-500 text-white px-4 py-2 rounded">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-lg font-medium mb-3">
            Câu {currentIndex + 1}: {originalQuestion.question}
          </h2>

          {originalQuestion.image && (
            <div className="flex w-full justify-center">
              <img
                src={originalQuestion.image}
                className="w-full max-w-md mb-4 rounded"
                alt="question"
              />
            </div>
          )}

          <div className="flex flex-col gap-3">
            {currentSessionQuestion.options.map((opt) => (
              <label
                key={opt.optionId}
                className="flex items-center gap-3 p-3 border rounded hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="radio"
                  name={currentSessionQuestion.questionId}
                  checked={
                    answers[currentSessionQuestion.questionId] === opt.optionId
                  }
                  onChange={() =>
                    handleSelect(
                      currentSessionQuestion.questionId,
                      opt.optionId
                    )
                  }
                />
                <span>{opt.answer}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200"
          >
            Câu trước
          </button>

          <button
            disabled={currentIndex === testSession.questions.length - 1}
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
          >
            Câu tiếp
          </button>
        </div>
      </div>

      <div className="bg-white border-r p-4 overflow-y-auto w-full rounded-lg shadow-lg border border-gray-200 h-fit">
        <h2 className="font-semibold text-lg mb-4">Danh sách câu hỏi</h2>
        <div className="grid grid-cols-5 gap-2">
          {testSession.questions.map((q, idx) => {
            const isDone = answers[q.questionId] !== undefined;
            const isActive = idx === currentIndex;
            return (
              <button
                key={q.questionId}
                onClick={() => setCurrentIndex(idx)}
                className={`py-2 rounded text-sm border
                  ${isActive ? "bg-blue-500 text-white" : ""}
                  ${!isActive && isDone ? "bg-green-200" : ""}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-6 text-right w-full">
          <button
            onClick={() => {
              if (window.confirm("Bạn chắc chắn muốn nộp bài chứ?")) {
                handleSubmit();
              }
            }}
            className="px-6 py-2 bg-green-600 text-white rounded w-full"
          >
            Nộp bài
          </button>
        </div>
      </div>
    </div>
  );
}
