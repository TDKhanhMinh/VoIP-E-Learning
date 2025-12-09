export default function NotificationSkeleton() {
  return (
    <div className="w-full bg-white border border-gray-100 p-4 mb-4 rounded-lg shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>{" "}
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>{" "}
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>{" "}
        </div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div> {/* Tiêu đề */}
      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>{" "}
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>{" "}
    </div>
  );
}
