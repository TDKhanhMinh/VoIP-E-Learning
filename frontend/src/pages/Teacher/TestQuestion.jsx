import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { testService } from "../../services/testService";
import { toast } from "react-toastify";
import QuestionCard from "../../components/Tests/QuestionCard";
import AddQuestionModal from './../../components/Modals/AddQuestionModal';

const TestQuestion = () => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const { testId } = useParams();
  const [showModal, setShowModal] = useState(false);

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
      toast.success("Lưu thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Lưu thất bại!");
    }
  };

  useEffect(() => {
    const fetchTest = async () => {
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

  return (
    <div className="max-h-[calc(100vh-100px)] overflow-y-auto p-10">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <AddQuestionModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onImport={handleFileUpload}
          />
          <div className="w-full flex flex-row justify-end space-x-3">
            <button
              onClick={() => setShowModal(true)}
              className="p-3 rounded-md bg-blue-400 text-white font-bold hover:bg-blue-500 transition-all mb-5"
            >
              Import file
            </button>
            <button
              onClick={handleAddQuestion}
              className="p-3 rounded-md bg-blue-400 text-white font-bold hover:bg-blue-500 transition-all mb-5"
            >
              Thêm câu hỏi
            </button>

            <button
              onClick={handleSave}
              className="py-3 px-5 rounded-md bg-green-500 text-white font-bold hover:bg-green-600 transition-all mb-5"
            >
              Lưu
            </button>
          </div>
          {test && test.questions.length > 0 ? (
            <div className="space-y-5">
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
            <div className="w-full flex flex-col justify-center items-center p-12 rounded-2xl border border-dashed border-gray-300 bg-white hover:border-blue-400 transition-all">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-500"
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

              <p className="text-gray-500 max-w-md text-center">
                Tạo câu hỏi đầu tiên để xây dựng bài test. Bạn có thể nhập thủ
                công hoặc sử dụng chức năng đọc file Word.
              </p>

              <button
                onClick={handleAddQuestion}
                className="mt-6 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md"
              >
                Thêm câu hỏi
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TestQuestion;
