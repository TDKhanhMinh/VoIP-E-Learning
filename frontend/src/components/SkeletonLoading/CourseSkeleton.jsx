export default function CourseSkeleton() {
  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 animate-pulse">
      <div className="bg-gray-300 p-4 h-32 relative">
        <div className="h-6 bg-gray-400 rounded w-3/4 mb-3"></div>{" "}
        <div className="h-4 bg-gray-400 rounded w-1/2 mb-2"></div>{" "}
        <div className="h-3 bg-gray-400 rounded w-1/3 mt-4"></div>{" "}
      </div>

      <div className="p-3 h-20 bg-gray-100 relative">
        <div className="rounded-full bg-gray-400 h-16 w-16 absolute -top-[40%] right-5 border-4 border-white"></div>
      </div>
    </div>
  );
}
