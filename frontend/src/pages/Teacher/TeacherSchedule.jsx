import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";

const periods = {
  1: { start: "06:50:00", end: "09:20:00", label: "Ca 1" },
  2: { start: "09:30:00", end: "12:00:00", label: "Ca 2" },
  3: { start: "12:45:00", end: "15:15:00", label: "Ca 3" },
  4: { start: "15:25:00", end: "17:55:00", label: "Ca 4" },
};

export default function TeacherSchedule() {
  const navigate = useNavigate();

  const [events] = useState([
    {
      id: "1",
      title: "Lập trình Web - N01 (Ca 1)",
      start: `2025-09-22T${periods[1].start}`,
      end: `2025-09-22T${periods[1].end}`,
      extendedProps: { classId: 101, courseId: 1, period: 1 },
      color: "#3b82f6",
    },
    {
      id: "2",
      title: "Cơ sở dữ liệu - N02 (Ca 3)",
      start: `2025-09-23T${periods[3].start}`,
      end: `2025-09-23T${periods[3].end}`,
      extendedProps: { classId: 201, courseId: 2, period: 3 },
      color: "#10b981",
    },
    {
      id: "3",
      title: "Mẫu thiết kế - N01 (Ca 2)",
      start: `2025-09-24T${periods[2].start}`,
      end: `2025-09-24T${periods[2].end}`,
      extendedProps: { classId: 301, courseId: 3, period: 2 },
      color: "#f59e0b",
    },
  ]);

  const handleEventClick = (info) => {
    const { classId, period } = info.event.extendedProps;
    const date = info.event.startStr.slice(0, 10);
    navigate(`/teacher/attendance?classId=${classId}&date=${date}&period=${period}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📅 Lịch dạy của tôi (Tuần)</h2>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next",
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


          if (hour === 6 && minute === 55) return "Ca 1";
          if (hour === 9 && minute === 30) return "Ca 2";
          if (hour === 12 && minute === 45) return "Ca 3";
          if (hour === 15 && minute === 25) return "Ca 4";
          return "";
        }}
        height="80vh"
      />
    </div>
  );
}
