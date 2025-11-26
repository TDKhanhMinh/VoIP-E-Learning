import Button from "../UI/Button";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="w-full flex justify-center mt-4 gap-2">
            <Button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                &lt;
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-green-600 text-white" : "bg-gray-200"}`}
                >
                    {i + 1}
                </button>
            ))}
            <Button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                &gt;
            </Button>
        </div>
    );
}