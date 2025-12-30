import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { attemptService } from "../../services/attemptService";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const TestResult = () => {
  const { testId } = useParams();
  const [attempts, setAttempts] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestResult = async () => {
      setIsLoading(true);
      try {
        const data = await attemptService.getAttemptsByTest(testId);
        setClassStudents(data.classStudent);
        setAttempts(data.attempts);
      } catch (error) {
        console.error("Error fetching test results:", error);
        toast.error("Failed to fetch test results.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestResult();
  }, [testId]);

  const formatted = classStudents.map((cs) => {
    const studentAttempts = attempts.filter(
      (a) => a.student._id === cs.student._id
    );

    const maxScore =
      studentAttempts.length > 0
        ? Math.max(...studentAttempts.map((a) => a.score))
        : null;

    return {
      student: cs.student,
      attempts: studentAttempts,
      maxScore,
    };
  });

  const ResultTableSkeleton = () => (
    <div className="w-full mt-6 px-4 md:px-8 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
      <div className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-700 h-12 w-full border-b border-gray-200 dark:border-gray-600"></div>
        <div className="p-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-700"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <ResultTableSkeleton />;
  }

  return (
    <div className="w-full mt-6 px-4 md:px-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Kết Quả Bài Kiểm Tra
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
            <tr>
              <th className="p-4 font-semibold text-left">Học sinh</th>
              <th className="p-4 font-semibold text-left">Email</th>
              <th className="p-4 text-center font-semibold whitespace-nowrap">
                Điểm cao nhất
              </th>
              <th className="p-4 text-center font-semibold">Chi tiết</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 dark:text-gray-300">
            {formatted.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-8 text-center text-gray-500 dark:text-gray-400 italic"
                >
                  Chưa có dữ liệu kết quả nào.
                </td>
              </tr>
            ) : (
              formatted.map(({ student, attempts, maxScore }) => (
                <React.Fragment key={student._id}>
                  <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                    <td className="p-4 font-semibold text-gray-800 dark:text-white">
                      {student.full_name}
                    </td>

                    <td className="p-4">{student.email}</td>

                    <td className="p-4 text-center">
                      {maxScore !== null ? (
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-full 
                            ${
                              maxScore >= 8
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : maxScore >= 5
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            }
                            `}
                        >
                          {maxScore}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic">
                          Chưa làm bài
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      {attempts.length > 0 ? (
                        <button
                          className="mx-auto flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition"
                          onClick={() =>
                            setOpenRow(
                              openRow === student._id ? null : student._id
                            )
                          }
                        >
                          Chi tiết
                          {openRow === student._id ? (
                            <FiChevronUp size={18} />
                          ) : (
                            <FiChevronDown size={18} />
                          )}
                        </button>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          —
                        </span>
                      )}
                    </td>
                  </tr>

                  {openRow === student._id && (
                    <tr className="bg-gray-50 dark:bg-gray-900 animate-fadeIn">
                      <td colSpan="4" className="p-6">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm p-4">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                            Các lần làm bài
                          </h4>

                          <ul className="space-y-2">
                            {attempts.map((a) => (
                              <li
                                key={a._id}
                                className="p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                              >
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    Điểm:
                                  </span>
                                  <span className="font-semibold dark:text-white">
                                    {a.score}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {new Date(a.createdAt).toLocaleString()}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TestResult;
