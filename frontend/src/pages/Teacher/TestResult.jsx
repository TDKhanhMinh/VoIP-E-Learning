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

  useEffect(() => {
    const fetchTestResult = async () => {
      try {
        const data = await attemptService.getAttemptsByTest(testId);
        setClassStudents(data.classStudent);
        setAttempts(data.attempts);
      } catch (error) {
        console.error("Error fetching test results:", error);
        toast.error("Failed to fetch test results.");
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

  return (
    <div className="w-full mt-6 px-4 md:px-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Kết Quả Bài Kiểm Tra
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-4 font-semibold text-left">Học sinh</th>
              <th className="p-4 font-semibold text-left">Email</th>
              <th className="p-4 text-center font-semibold whitespace-nowrap">
                Điểm cao nhất
              </th>
              <th className="p-4 text-center font-semibold">Chi tiết</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {formatted.map(({ student, attempts, maxScore }) => (
              <React.Fragment key={student._id}>
                <tr className="border-b hover:bg-gray-50 transition-all">
                  <td className="p-4 font-semibold text-gray-800">
                    {student.full_name}
                  </td>

                  <td className="p-4">{student.email}</td>

                  <td className="p-4 text-center">
                    {maxScore !== null ? (
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full 
                          ${
                            maxScore >= 8
                              ? "bg-green-100 text-green-700"
                              : maxScore >= 5
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {maxScore}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Chưa làm bài</span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    {attempts.length > 0 ? (
                      <button
                        className="mx-auto flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
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
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>

                {openRow === student._id && (
                  <tr className="bg-gray-50 animate-fadeIn">
                    <td colSpan="4" className="p-6">
                      <div className="border border-gray-200 rounded-lg bg-white shadow-sm p-4">
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Các lần làm bài
                        </h4>

                        <ul className="space-y-2">
                          {attempts.map((a) => (
                            <li
                              key={a._id}
                              className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                            >
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-700">
                                  Điểm:
                                </span>
                                <span className="font-semibold">{a.score}</span>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
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
            ))}
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
