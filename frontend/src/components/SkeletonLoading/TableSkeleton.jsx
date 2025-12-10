export default function TableSkeleton() {
  return (
    <div className="overflow-x-scroll animate-pulse">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {[...Array(6)].map((_, i) => (
              <th key={i} className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
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
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 bg-gray-200 rounded-full w-32"></div>
              </td>
              <td className="px-6 py-4 flex justify-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
