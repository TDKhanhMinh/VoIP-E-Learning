import { Dialog } from "@headlessui/react";
import { useState } from "react";
import Button from "./Button";
import TextInput from "./TextInput";

export default function CourseModal({ isOpen, onClose, onSave }) {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        if (!code || !name || !description) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const newCourse = {
            id: Date.now(),
            code,
            name,
            description,
        };

        onSave(newCourse);
        onClose();
        setCode("");
        setName("");
        setDescription("");
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
                    Thêm môn học
                </Dialog.Title>

                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium">Mã môn học</label>
                        <TextInput
                            type="text"
                            className="w-full border rounded p-2 mt-1"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="VD: IT001"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium">Tên môn học</label>
                        <TextInput
                            type="text"
                            className="w-full border rounded p-2 mt-1"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VD: Lập trình Web"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium">Mô tả</label>
                        <textarea
                            rows={3}
                            className="w-full border rounded p-2 mt-1"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả ngắn gọn về môn học"
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
