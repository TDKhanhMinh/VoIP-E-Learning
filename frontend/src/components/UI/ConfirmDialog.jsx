
import Button from './Button';

export default function ConfirmDialog({
    isOpen,
    title = "Xác nhận",
    message = "Bạn có chắc chắn xóa hay không?",
    onCancel,
    onConfirm,
    btnDelete = "Xóa",
    btnCancel = "Hủy"
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                <p className="text-gray-700 mb-6">{message}</p>

                <div className="flex justify-end gap-3">
                    <Button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        {btnCancel}
                    </Button>
                    {btnDelete &&
                        <Button
                            onClick={onConfirm}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            {btnDelete}
                        </Button>
                    }
                </div>
            </div>
        </div>
    );
}
