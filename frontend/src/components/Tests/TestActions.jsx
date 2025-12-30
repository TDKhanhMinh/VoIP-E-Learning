import { useState, useRef, useEffect } from "react";
import { MdOutlinePublicOff, MdPublic } from "react-icons/md";
import { FaPlus, FaEye, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";

function TestActions({
  a,
  id,
  navigate,
  handlePublishTest,
  setSelectedTest,
  setModalOpen,
  setOpenConfirmModal,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative flex justify-center">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors"
      >
        <FaEllipsisV />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-20 w-52 rounded-lg border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <button
                onClick={() => {
                  handlePublishTest(a);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {a.isPublished === false ? (
                  <>
                    <MdPublic className="text-gray-500 dark:text-gray-400" />{" "}
                    Công bố bài thi
                  </>
                ) : (
                  <>
                    <MdOutlinePublicOff className="text-gray-500 dark:text-gray-400" />{" "}
                    Thu hồi bài thi
                  </>
                )}
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  navigate(`/teacher/class-details/${id}/tests/${a._id}`);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <FaPlus className="text-gray-500 dark:text-gray-400" /> Thêm câu
                hỏi
              </button>
            </li>

            {a.isPublished !== false && (
              <li>
                <button
                  onClick={() => {
                    navigate(`/teacher/test-results/${a._id}`);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <FaEye className="text-gray-500 dark:text-gray-400" /> Xem kết
                  quả
                </button>
              </li>
            )}

            <li>
              <button
                onClick={() => {
                  setSelectedTest(a);
                  setModalOpen(true);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <FaEdit className="text-gray-500 dark:text-gray-400" /> Chỉnh
                sửa
              </button>
            </li>

            <li className="border-t border-gray-100 dark:border-slate-700 mt-1 pt-1">
              <button
                onClick={() => {
                  setSelectedTest(a);
                  setOpenConfirmModal(true);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <FaTrash /> Xóa
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default TestActions;
