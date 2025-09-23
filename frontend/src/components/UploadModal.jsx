
import Button from './Button';
export default function UploadModal({ isOpen, onClose, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[600px]">
        <div className="flex justify-between items-center border-b px-4 py-2">
          <h2 className="text-lg font-semibold">Upload file nộp bài</h2>
          <Button
            className="text-gray-500 hover:text-black"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <p>
              Nộp bài cho: <b>{title}</b>
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1">Chọn file cần nộp</label>
            <TextInput type="file" className="block w-full border rounded p-1" />
            <p className="text-sm text-gray-500 mt-1">
              Chỉ chấp nhận 01 file dạng jpg,png,xls,xlsx,doc,docx,zip,pdf,ppt,
              pptx,txt,csv,tsv,c,cpp,java,sql. Nếu bạn nộp nhiều file hãy nén
              thành 1 file .zip
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1">Ghi chú (nếu có)</label>
            <textarea
              className="w-full border rounded p-2"
              rows="4"
              placeholder="Nhập ghi chú..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t px-4 py-2">
          <Button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Tải lên
          </Button>
        </div>
      </div>
    </div>
  );
}
