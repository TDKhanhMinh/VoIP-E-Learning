export default function ClassListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              {[...Array(5)].map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-lg mr-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-10"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded w-24 mx-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
