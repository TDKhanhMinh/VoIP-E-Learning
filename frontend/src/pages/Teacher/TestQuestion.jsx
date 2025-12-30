import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { testService } from "../../services/testService";
import { toast } from "react-toastify";
import QuestionCard from "../../components/Tests/QuestionCard";
import AddQuestionModal from "./../../components/Modals/AddQuestionModal";

const TestQuestion = () => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const { testId, id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const getQuestionId = (q) => q._id || q.id;

  const handleFileUpload = async (file) => {
    const res = await testService.uploadQuestionsFromWord(file);

    const questions = res.questions || [];

    if (!Array.isArray(questions) || questions.length === 0) {
      toast.error("Không tìm thấy câu hỏi trong file đã tải lên.");
      return;
    }

    const normalizedQuestions = questions.map((q) => ({
      id: crypto.randomUUID(),
      question: q.question,
      selectedOption: null,
      options: (q.options || []).map((o, idx) => ({
        _id: crypto.randomUUID(),
        answer: o.answer,
        isCorrect: idx === 0,
      })),
      image: q.image || null,
    }));

    setTest((prev) => ({
      ...prev,
      questions: [...normalizedQuestions, ...(prev?.questions || [])],
    }));
  };

  const handleSelectedOptionChange = (questionId, optionId) => {
    setTest((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (getQuestionId(q) !== questionId) return q;

        return {
          ...q,
          selectedOption: optionId,
          options: q.options.map((opt) => ({
            ...opt,
            isCorrect: opt._id === optionId,
          })),
        };
      }),
    }));
  };

  const handleQuestionTextChange = (questionId, newText) => {
    setTest((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        getQuestionId(q) === questionId ? { ...q, question: newText } : q
      ),
    }));
  };

  const handleAddQuestion = () => {
    setTest((prev) => ({
      ...prev,
      questions: [
        {
          id: crypto.randomUUID(),
          question: "Câu hỏi mới",
          selectedOption: null,
          options: [
            { _id: crypto.randomUUID(), answer: "Đáp án 1", isCorrect: true },
            { _id: crypto.randomUUID(), answer: "Đáp án 2", isCorrect: false },
            { _id: crypto.randomUUID(), answer: "Đáp án 3", isCorrect: false },
            { _id: crypto.randomUUID(), answer: "Đáp án 4", isCorrect: false },
          ],
          image: null,
        },
        ...prev.questions,
      ],
    }));
  };

  const handleOptionTextChange = (questionId, optionId, newText) => {
    setTest((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        getQuestionId(q) === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o._id === optionId ? { ...o, answer: newText } : o
              ),
            }
          : q
      ),
    }));
  };

  const handleDeleteQuestion = (questionId) => {
    setTest((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => getQuestionId(q) !== questionId),
    }));
  };

  const handleAddOption = (questionId, newOption) => {
    setTest((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        getQuestionId(q) === questionId
          ? { ...q, options: [...q.options, newOption] }
          : q
      ),
    }));
  };

  const handleDeleteOption = (questionId, optionId) => {
    setTest((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        getQuestionId(q) === questionId
          ? { ...q, options: q.options.filter((o) => o._id !== optionId) }
          : q
      ),
    }));
  };

  const handleSave = async () => {
    try {
      const testId = test._id;
      const testQuestions = test.questions;
      await testService.updateTestQuestions(testId, testQuestions);
      navigate(`/teacher/class-details/${id}/tests`);
      toast.success("Lưu thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Lưu thất bại!");
    }
  };

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        const data = await testService.getTestById(testId);
        setTest(data);
      } catch (error) {
        console.error("Error fetching test:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  const QuestionSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse relative">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
      </div>

      <div className="h-24 bg-gray-100 rounded-lg w-full mb-6 border border-gray-200"></div>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div className="h-10 bg-gray-50 rounded-lg w-full border border-gray-100"></div>
            <div className="h-8 w-8 bg-gray-200 rounded flex-shrink-0"></div>
          </div>
        ))}
      </div>

      <div className="mt-4 h-8 w-32 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="max-h-[calc(100vh-100px)] overflow-y-auto p-10 bg-gray-50/50">
      <AddQuestionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onImport={handleFileUpload}
      />

      <div className="w-full flex flex-row justify-end space-x-3 mb-6 sticky top-0 z-10 py-2">
        <button
          onClick={() => setShowModal(true)}
          disabled={loading}
          className="px-4 py-2.5 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Import file
        </button>
        <button
          onClick={handleAddQuestion}
          disabled={loading}
          className="px-4 py-2.5 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Thêm câu hỏi
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lưu thay đổi
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <QuestionSkeleton />
          <QuestionSkeleton />
          <QuestionSkeleton />
        </div>
      ) : (
        <>
          {test && test.questions.length > 0 ? (
            <div className="space-y-6">
              {test.questions.map((q) => (
                <QuestionCard
                  key={getQuestionId(q)}
                  question={q}
                  onSelectOption={handleSelectedOptionChange}
                  onQuestionTextChange={handleQuestionTextChange}
                  onOptionTextChange={handleOptionTextChange}
                  onDelete={handleDeleteQuestion}
                  onAddOption={handleAddOption}
                  onDeleteOption={handleDeleteOption}
                />
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col justify-center items-center p-16 rounded-2xl border-2 border-dashed border-gray-300 bg-white hover:border-blue-400 transition-all">
              <div className="bg-blue-50 p-6 rounded-full mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Bạn chưa thêm câu hỏi nào
              </h3>

              <p className="text-gray-500 max-w-md text-center mb-6">
                Tạo câu hỏi đầu tiên để xây dựng bài test. Bạn có thể nhập thủ
                công hoặc sử dụng chức năng đọc file Word.
              </p>

              <button
                onClick={handleAddQuestion}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Thêm câu hỏi ngay
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TestQuestion;
