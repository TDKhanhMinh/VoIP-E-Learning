import React, { useState, useEffect } from "react";

const QuestionCard = ({
  question,
  onSelectOption,
  onQuestionTextChange,
  onOptionTextChange,
  onDelete,
  onAddOption,
  onDeleteOption,
}) => {
  const [selectedOption, setSelectedOption] = useState(() => {
    return (
      question.selectedOption ||
      question.options.find((opt) => opt.isCorrect)?._id ||
      null
    );
  });
  const getQuestionId = (q) => q._id || q.id;
  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);
    onSelectOption?.(getQuestionId(question), optionId);
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      onDelete?.(getQuestionId(question));
    }
  };

  const handleAddOption = () => {
    const newOption = {
      _id: crypto.randomUUID(),
      answer: `Đáp án ${question.options.length + 1}`,
      isCorrect: false,
    };
    onAddOption?.(getQuestionId(question), newOption);
  };

  const handleDeleteOption = (optionId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đáp án này?")) {
      onDeleteOption?.(getQuestionId(question), optionId);
    }
  };

  return (
    <div className="w-full rounded-xl p-6 shadow-md border border-gray-100 bg-white transition-all hover:shadow-lg relative">
      <input
        type="text"
        className="font-semibold mb-4 w-full p-3 border rounded-lg border-gray-200 focus:outline-none focus:border-blue-500 transition"
        value={question.question}
        onChange={(e) =>
          onQuestionTextChange?.(getQuestionId(question), e.target.value)
        }
      />

      <div className="flex flex-col gap-3">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt._id;

          return (
            <div key={opt._id} className="flex items-center gap-3">
              <label
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer border flex-1 transition-all
                ${
                  isSelected
                    ? "border-green-500 bg-green-50 shadow-sm"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition
                  ${
                    isSelected
                      ? "border-green-600 bg-green-600"
                      : "border-gray-400"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                </div>

                <input
                  type="radio"
                  name={`question-${getQuestionId(question)}`}
                  checked={isSelected}
                  onChange={() => handleOptionChange(opt._id)}
                  className="hidden"
                />

                <input
                  type="text"
                  value={opt.answer}
                  onChange={(e) =>
                    onOptionTextChange?.(
                      getQuestionId(question),
                      opt._id,
                      e.target.value
                    )
                  }
                  className={`flex-1 border rounded-md px-3 py-2 bg-white focus:outline-none focus:border-blue-400 transition
                  ${
                    isSelected
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200"
                  }`}
                />
              </label>

              <button
                onClick={() => handleDeleteOption(opt._id)}
                className="text-red-500 hover:text-red-700 font-bold transition"
                title="Xóa đáp án"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleAddOption}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Thêm đáp án
        </button>
        <button
          onClick={handleDelete}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Xóa câu hỏi
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
