import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import { teachingScheduleService } from "../../services/teachingScheduleService";
import { FaChalkboardTeacher } from "react-icons/fa";
import { toLocalTime } from "../../utils/localTime";

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
        const color = shift?.color || "#64748b";
        const localDate = toLocalTime(s.date);
        console.log(
          "UTC:", s.date,
          "Local converted:", localDate,
        );

        return {
          id: s._id || `schedule-${index}`,
          title: `${s.class?.name || "Lớp học"} (${shift?.label || "Ca ?"})`,
          start: `${localDate}T${s.startTime}`,
          end: `${localDate}T${s.endTime}`,
          extendedProps: {
            classId: s.class?._id,
            courseName: s.class?.course?.title,
            period: shift?.label,
          },
          color,
        };
      });
      setEvents(mapped);
    } catch (error) {
      console.error("Lỗi khi tải lịch dạy:", error);
    }
  };

  const handleEventClick = (info) => {
    const { classId } = info.event.extendedProps;
    navigate(`/teacher/class-details/${classId}`);
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
    </div>
  );
}
