import { Dialog } from "@headlessui/react";
import { useState } from "react";
import Button from "./Button";
import TextInput from "./TextInput";

export default function SemesterModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = () => {
    if (!name || !startDate || !endDate) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const newSemester = {
      id: Date.now(),
      name,
      startDate,
      endDate,
    };

    onSave(newSemester);
    onClose();
    setName("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />

      <div className="bg-white rounded-lg shadow-lg p-6 w-[450px] z-10">
        <Dialog.Title className="text-xl font-bold mb-4">
          Thêm học kỳ
        </Dialog.Title>

        <div className="space-y-4">
  
          <div>
            <label className="block text-sm font-medium">Tên học kỳ</label>
            <TextInput
              type="text"
              className="w-full border rounded p-2 mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Học kỳ 1 - Năm học 2025"
            />
          </div>

  
          <div>
            <label className="block text-sm font-medium">Thời gian bắt đầu</label>
            <TextInput
              type="date"
              className="w-full border rounded p-2 mt-1"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

  
          <div>
            <label className="block text-sm font-medium">Thời gian kết thúc</label>
            <TextInput
              type="date"
              className="w-full border rounded p-2 mt-1"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>


        <div className="mt-6 flex justify-end space-x-3">
          <Button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Lưu
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
