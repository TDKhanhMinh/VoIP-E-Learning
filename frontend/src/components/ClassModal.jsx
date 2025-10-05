import { Dialog } from "@headlessui/react";
import { useState } from "react";
import Button from "./Button";

export default function ClassModal({ isOpen, onClose, onSave, courses = [], teachers = [], semesters = [] }) {
    const [name, setName] = useState("");
    const [courseId, setCourseId] = useState("");
    const [teacherId, setTeacherId] = useState("");
    const [semesterId, setSemesterId] = useState("");
    const [schedule, setSchedule] = useState("");

    const handleSubmit = () => {
        if (!name || !courseId || !teacherId || !semesterId || !schedule) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const newClass = {
            id: Date.now(),
            name,
            courseId,
            teacherId,
            semesterId,
            schedule,
        };

        onSave(newClass);
        onClose();
        setName("");
        setCourseId("");
        setTeacherId("");
        setSemesterId("");
        setSchedule("");
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
                    Thêm lớp học
                </Dialog.Title>

                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium">Tên lớp</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2 mt-1"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VD: Lập trình Web - Nhóm 1"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium">Môn học</label>
                        <select
                            className="w-full border rounded p-2 mt-1"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                        >
                            <option value="">-- Chọn môn học --</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.code} - {c.name}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div>
                        <label className="block text-sm font-medium">Giảng viên</label>
                        <select
                            className="w-full border rounded p-2 mt-1"
                            value={teacherId}
                            onChange={(e) => setTeacherId(e.target.value)}
                        >
                            <option value="">-- Chọn giảng viên --</option>
                            {teachers.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div>
                        <label className="block text-sm font-medium">Học kỳ</label>
                        <select
                            className="w-full border rounded p-2 mt-1"
                            value={semesterId}
                            onChange={(e) => setSemesterId(e.target.value)}
                        >
                            <option value="">-- Chọn học kỳ --</option>
                            {semesters.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.startDate} - {s.endDate})
                                </option>
                            ))}
                        </select>
                    </div>


                    <div>
                        <label className="block text-sm font-medium">Lịch học</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2 mt-1"
                            value={schedule}
                            onChange={(e) => setSchedule(e.target.value)}
                            placeholder="VD: Thứ 2 - Ca 1; Thứ 4 - Ca 3"
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
