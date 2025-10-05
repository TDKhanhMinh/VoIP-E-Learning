import { Dialog } from "@headlessui/react";
import { useState } from "react";
import Button from "./Button";
import TextInput from "./TextInput";

export default function AssignmentModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title || !dueDate || !description) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const newAssignment = {
      id: Date.now(),
      title,
      dueDate,
      description,
      status: "Chưa nộp",
    };

    onSave(newAssignment);
    onClose();
    setTitle("");
    setDueDate("");
    setDescription("");
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />

      <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] z-10">
        <Dialog.Title className="text-xl font-bold mb-4">
          Giao bài tập mới
        </Dialog.Title>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Tên bài</label>
            <TextInput
              type="text"
              className="w-full border rounded p-2 mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên bài tập"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Hạn nộp</label>
            <TextInput
              type="datetime-local"
              className="w-full border rounded p-2 mt-1"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mô tả</label>
            <textarea
              rows={4}
              className="w-full border rounded p-2 mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập nội dung mô tả bài tập"
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
