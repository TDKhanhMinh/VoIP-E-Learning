export default function TopicSidebar({
  topics,
  selectedTopic,
  onTopicSelect,
  onEditTopic,
  canCreateTopic,
  canApprove,
  filter,
  onFilterChange,
}) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Chủ Đề</h2>
        <div className="space-y-2">
          <button
            onClick={() => onTopicSelect(null)}
            className={`w-full text-left px-3 py-2 rounded transition ${
              !selectedTopic
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            Tất cả
          </button>
          {topics.map((topic) => (
            <div key={topic._id} className="flex items-center gap-2">
              <button
                onClick={() => onTopicSelect(topic._id)}
                className={`flex-1 text-left px-3 py-2 rounded transition ${
                  selectedTopic === topic._id
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {topic.title}
              </button>
              {canCreateTopic && (
                <button
                  onClick={() => onEditTopic(topic)}
                  className="p-1 hover:bg-gray-200 rounded"
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
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {canApprove && (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
          <h3 className="font-semibold mb-3 text-gray-800">
            Lọc theo trạng thái
          </h3>
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>
      )}
    </div>
  );
}
