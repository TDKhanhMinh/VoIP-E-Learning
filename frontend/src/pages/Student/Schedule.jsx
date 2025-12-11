import CalendarSkeleton from "./../../components/SkeletonLoading/CalendarSkeleton";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { generateScheduleWithMidTerm } from "../../utils/generateSchedule";
import { semesterService } from "../../services/semesterService";
import { scheduleService } from "../../services/scheduleService";
import formatDate from "../../utils/formatDate";
import ConfirmDialog from "../../components/UI/ConfirmDialog";

export default function Schedule() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId")?.replace(/"/g, "");
  const userRole = sessionStorage.getItem("role")?.replace(/"/g, "");

  const [events, setEvents] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .fc .fc-timegrid-slot { height: 40px !important; }
      .fc .fc-timegrid-slot-label { vertical-align: middle !important; }
      .fc-timegrid-event { border-radius: 6px !important; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: none !important; }
      .fc-timegrid-event .fc-event-time { display: none !important; }
      .fc .fc-timegrid-col-events { margin: 0 !important; }
      .fc-timegrid-event-harness { margin-right: 2px !important; margin-left: 2px !important; }
    `;

    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (userId && selectedSemester) fetchSchedule();
  }, [userId, selectedSemester]);

  const fetchSemesters = async () => {
    try {
      setIsLoading(true);
      const data = await semesterService.getAllSemesters();
      setSemesters(data);
      if (data.length > 0) {
        setSelectedSemester(data[0]._id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải danh sách học kỳ");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      const classes = await scheduleService.getScheduleBySemester(
        selectedSemester
      );
      console.log("Schedule ", classes);

      if (!classes || classes.length === 0) {
        setEvents([]);
        return;
      }

      let allEvents = [];
      for (const cls of classes) {
        const eventsForClass = await generateScheduleWithMidTerm(cls);
        allEvents.push(...eventsForClass);
      }
      console.log("event", allEvents);

      setEvents(allEvents);
    } catch (err) {
      console.error("Error in fetchSchedule:", err);
      toast.error(
        "Lỗi tải thời khóa biểu: " + (err.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (info) => {
    info.jsEvent.preventDefault();
    const d = info.event.start;
    const formattedDate = d.toLocaleDateString("en-CA");

    setSelectedEvent({
      ...info.event.extendedProps,
      start: info.event.start,
      end: info.event.end,
      title: info.event.title,
      date: formattedDate,
    });
    setIsModalOpen(true);
  };

  const handleDeleteAbsence = async () => {
    try {
      const { classId, date } = selectedEvent;
      await scheduleService.addAbsenceDate(classId, date);
      toast.success("Báo vắng thành công!");
      setIsModalOpen(false);
      fetchSchedule();
    } catch (err) {
      console.error("Error adding absence:", err);
      toast.error(err?.response?.data?.message || "Lỗi báo vắng");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-md">
            <FaChalkboardTeacher className="text-white text-xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {userRole === "teacher" ? "Lịch dạy của tôi" : "Thời khóa biểu"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Học kỳ:</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm cursor-pointer outline-none"
          >
            {semesters.map((semester) => (
              <option key={semester._id} value={semester._id}>
                {semester.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
        {isLoading ? (
          <CalendarSkeleton />
        ) : events.length === 0 ? (
          <div className="flex items-center justify-center h-[80vh]">
            <div className="text-center">
              <FaChalkboardTeacher className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                Chưa có lịch dạy trong học kỳ này
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Vui lòng chọn học kỳ khác
              </p>
            </div>
          </div>
        ) : (
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            events={events}
            eventClick={handleEventClick}
            eventContent={(arg) => {
              const props = arg.event.extendedProps || {};
              const isAbsent = props.isAbsent || false;
              const isTheory = props.type === "theory";

              const bgColor = isTheory ? "bg-blue-50" : "bg-purple-50";
              const textColor = isTheory ? "text-blue-700" : "text-purple-700";

              return {
                html: `
      <div class="${bgColor} ${textColor} w-full h-full p-1 flex flex-col justify-center text-center overflow-hidden">
        ${
          isAbsent
            ? '<div class="bg-red-500 text-white text-[10px] font-bold px-1 rounded mb-1 inline-block mx-auto">GV Báo Vắng</div>'
            : ""
        }
        <div class="font-bold text-xs truncate leading-tight">${
          arg.event.title
        }</div>
        <div class="text-[10px] opacity-80 mt-1">${props.className || ""}</div>
        <div class="text-[10px] font-semibold">Phòng ${props.room || ""}</div>
      </div>
    `,
              };
            }}
            firstDay={1}
            allDaySlot={false}
            height="80vh"
            locale="vi"
            slotMinTime="06:00:00"
            slotMaxTime="18:00:00"
            slotDuration="01:00:00"
            slotLabelInterval="01:00:00"
            slotLabelContent={(arg) => arg.date.getHours()}
            expandRows={true}
            stickyHeaderDates={true}
            slotEventOverlap={false}
            dayMaxEventRows={false}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Hôm nay",
              week: "Tuần",
              day: "Ngày",
            }}
          />
        )}
      </div>

      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl w-96 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Chi tiết buổi học
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Môn học:</span>
                <span className="font-semibold text-gray-900 text-right w-2/3">
                  {selectedEvent.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lớp:</span>
                <span className="font-semibold text-gray-900">
                  {selectedEvent.className}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ca học:</span>
                <span className="font-semibold text-blue-600 bg-blue-50 px-2 rounded">
                  Ca {selectedEvent.shift}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phòng:</span>
                <span className="font-semibold text-gray-900">
                  {selectedEvent.room || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thời gian:</span>
                <span className="font-semibold text-gray-900">
                  {formatDate(selectedEvent.start)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Đóng
              </button>

              <button
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
                onClick={() => {
                  const basePath =
                    userRole === "teacher" ? "/teacher" : "/home";
                  navigate(
                    `${basePath}/class-details/${selectedEvent.classId}`
                  );
                }}
              >
                Xem lớp
              </button>

              {userRole === "teacher" && !selectedEvent.isAbsent && (
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                  onClick={() => {
                    setIsModalOpen(false);
                    setOpenConfirmModal(true);
                  }}
                >
                  Báo vắng
                </button>
              )}

              {userRole === "teacher" && selectedEvent.isAbsent && (
                <span className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed">
                  Đã báo vắng
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={openConfirmModal}
        title="Xác nhận báo vắng"
        message={`Bạn chắc chắn muốn báo vắng môn ${selectedEvent?.title} vào ngày ${selectedEvent?.date}?`}
        onCancel={() => setOpenConfirmModal(false)}
        onConfirm={() => {
          handleDeleteAbsence();
          setOpenConfirmModal(false);
        }}
        btnDelete="Xác nhận báo vắng"
        btnCancel="Hủy bỏ"
      />
    </div>
  );
}
