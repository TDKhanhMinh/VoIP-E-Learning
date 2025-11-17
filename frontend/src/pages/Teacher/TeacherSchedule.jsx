import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import { teachingScheduleService } from "../../services/teachingScheduleService";
import { FaChalkboardTeacher } from "react-icons/fa";
import { toLocalTime } from "../../utils/localTime";
import { toast } from 'react-toastify';
import formatDate from './../../utils/formatDate';
import ConfirmDialog from "../../components/ConfirmDialog";

const periods = {
  1: { start: "06:50:00", end: "09:20:00", label: "Ca 1", color: "#3b82f6" },
  2: { start: "09:30:00", end: "12:00:00", label: "Ca 2", color: "#10b981" },
  3: { start: "12:45:00", end: "15:15:00", label: "Ca 3", color: "#f59e0b" },
  4: { start: "15:25:00", end: "17:55:00", label: "Ca 4", color: "#ef4444" },
};

export default function TeacherSchedule() {
  const navigate = useNavigate();
  const teacherID = sessionStorage.getItem("userId")?.replace(/"/g, "");
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventInfo, setSelectedEventInfo] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  useEffect(() => {
    if (teacherID) fetchTeacherSchedule();
  }, [teacherID]);

  const fetchTeacherSchedule = async () => {
    try {
      const data = await teachingScheduleService.getScheduleByTeacherId(teacherID);
      console.log("Schedule", data);

      const mapped = data.map((s, index) => {
        const shift = Object.values(periods).find(
          (p) =>
            p.start === s.startTime ||
            p.end === s.endTime ||
            s.startTime.includes(p.start.slice(0, 5))
        );
        let shiftNumber = null;

        const foundEntry = Object.entries(periods).find(([key, period]) => {
          return (
            period.start === s.startTime ||
            s.startTime.includes(period.start.slice(0, 5))
          );
        });

        if (foundEntry) {
          shiftNumber = foundEntry[0];
        }
        const localDate = toLocalTime(s.date);
        let eventColor = shift?.color || "#64748b";
        let eventTitle = `${s.class?.name || "Lớp học"} (${shift?.label || "Ca ?"
          })`;

        if (s.status === "ABSENT") {
          eventColor = "#9ca3af";
          eventTitle = `[GV BÁO VẮNG] ${eventTitle}`;
        }
        return {
          id: s._id || `schedule-${index}`,
          title: eventTitle,
          start: `${localDate}T${s.startTime}`,
          end: `${localDate}T${s.endTime}`,
          extendedProps: {
            classId: s.class?._id,
            courseName: s.class?.course?.title,
            period: shift?.label,
            rawDate: s.date,
            status: s.status,
            shift: shiftNumber,
          },
          color: eventColor,
        };
      });
      setEvents(mapped);
    } catch (error) {
      console.error("Lỗi khi tải lịch dạy:", error);
    }
  };

  const handleEventClick = (info) => {
    info.jsEvent.preventDefault();
    setSelectedEventInfo({
      ...info.event.extendedProps,
      startStr: info.event.startStr,
      endStr: info.event.endStr,
    });
    setIsModalOpen(true);
  };
  const handleDelete = async () => {
    if (!selectedEventInfo) return;
    try {
      const { shift, rawDate, classId } = selectedEventInfo;
      await teachingScheduleService.makeAbsentByTeacherId(teacherID, shift, rawDate, classId);
      toast.success("Báo vắng thành công!");
      setIsModalOpen(false);
      fetchTeacherSchedule();
    } catch (error) {
      console.error("Lỗi khi báo vắng:", error);
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra.");
    }
  };
  const handleConfirmAbsence = async () => {
    if (!selectedEventInfo) return;
    setOpenConfirmModal(true);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventInfo(null);
  };
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-md">
          <FaChalkboardTeacher className="text-white text-xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          Lịch dạy của tôi
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
        <FullCalendar
          timeZone="local"
          firstDay={1}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          initialDate={new Date()}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          events={events}
          eventClick={handleEventClick}
          nowIndicator={true}
          allDaySlot={false}
          slotMinTime="06:50:00"
          slotMaxTime="17:55:00"
          slotLabelInterval={{ minutes: 30 }}
          slotLabelContent={(arg) => {
            const hour = arg.date.getHours();
            const minute = arg.date.getMinutes();
            if (hour === 6 && minute === 50) return "Ca 1";
            if (hour === 9 && minute === 30) return "Ca 2";
            if (hour === 12 && minute === 45) return "Ca 3";
            if (hour === 15 && minute === 25) return "Ca 4";
            return "";
          }}
          height="80vh"
          locale="vi"
          dayHeaderFormat={{ weekday: "short" }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
          }}
        />
      </div>
      {isModalOpen && selectedEventInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleCloseModal}
        >
          <div
            className="relative z-[51] w-11/12 max-w-lg rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-2xl font-bold text-gray-800">
              Chi tiết Buổi học
            </h3>
            <div className="modal-body">
              <p className="mb-2 text-base text-gray-600">
                <strong>Lớp:</strong> {selectedEventInfo.courseName}
              </p>
              <p className="mb-2 text-base text-gray-600">
                <strong>Ca học: </strong>Ca {selectedEventInfo.shift}
              </p>
              <p className="mb-2 text-base text-gray-600">
                <strong>Ngày:</strong>{" "}
                {formatDate(selectedEventInfo.rawDate)}
              </p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="cursor-pointer rounded-lg px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-200"
                onClick={handleCloseModal}
              >
                Đóng
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600"
                onClick={() => navigate(`/teacher/class-details/${selectedEventInfo.classId}`)}
              >
                Xem chi tiết lớp
              </button>
              {
                selectedEventInfo.status !== "ABSENT" && <button
                  type="button"
                  className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
                  onClick={handleConfirmAbsence}
                >
                  Báo vắng buổi học này
                </button>
              }
            </div>

          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={openConfirmModal}
        title="Xác nhận xóa thông báo"
        message={`Bạn có chắc chắn muốn báo vắng buổi học này không? Hành động này không thể hoàn tác.Lớp: ${selectedEventInfo?.courseName}\n
          Ca: ${selectedEventInfo?.shift}\n 
          Ngày: ${new Date(selectedEventInfo?.rawDate).toLocaleDateString("vi-VN")}`}
        onCancel={() => setOpenConfirmModal(false)}
        onConfirm={() => {
          handleDelete();
          setOpenConfirmModal(false);
        }}
        btnDelete="Xác nhận"
        btnCancel="Hủy"
      />
    </div>
  );
}
