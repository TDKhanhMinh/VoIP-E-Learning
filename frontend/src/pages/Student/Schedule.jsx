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
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .fc .fc-timegrid-slot {
        height: 30px !important;
      }
      .fc .fc-timegrid-slot-label {
        vertical-align: middle !important;
      }
      .fc-timegrid-event {
        border-radius: 4px !important;
      }
      .fc-timegrid-event .fc-event-time {
        display: none !important;
      }
      .fc .fc-timegrid-col-events {
        margin: 0 !important;
      }
      .fc-timegrid-event-harness {
        margin-right: 1px !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (userId && selectedSemester) fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, selectedSemester]);

  const fetchSemesters = async () => {
    try {
      const data = await semesterService.getAllSemesters();
      setSemesters(data);
      if (data.length > 0) {
        setSelectedSemester(data[0]._id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải danh sách học kỳ");
    }
  };

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      console.log("Fetching schedule for semester:", selectedSemester);
      console.log("User ID:", userId);
      console.log("User Role:", userRole);

      const classes = await scheduleService.getScheduleBySemester(
        selectedSemester
      );

      console.log("Classes from API:", classes);
      console.log("Number of classes:", classes?.length);

      if (!classes || classes.length === 0) {
        console.log("No classes found for this semester");
        setEvents([]);
        return;
      }

      let allEvents = [];

      classes.forEach((cls) => {
        console.log("Processing class:", cls._id);
        console.log("Class absent dates:", cls.absent);
        const eventsForClass = generateScheduleWithMidTerm(cls);
        console.log("Generated events:", eventsForClass.length);

        allEvents.push(...eventsForClass);
      });

      setEvents(allEvents);
    } catch (err) {
      console.error("Error in fetchSchedule:", err);
      toast.error(
        "Lỗi tải thời khóa biểu: " + (err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
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
      console.log("Adding absence for class:", classId, "on date:", date);

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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
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
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Đang tải lịch học...</p>
            </div>
          </div>
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
              const isAbsent = arg.event.extendedProps.isAbsent;
              return {
                html: `<div style="padding: 4px; font-size: 13px; line-height: 1.4; text-align: center; display: flex; flex-direction: column; justify-content: center; height: 100%;">
                  ${
                    isAbsent
                      ? '<div style="font-size: 10px; font-weight: 700; color: #fff; background: rgba(0,0,0,0.2); padding: 2px 4px; border-radius: 4px; margin-bottom: 2px;">GV Báo Vắng</div>'
                      : ""
                  }
                  <div style="font-weight: 600; margin-bottom: 2px;">${
                    arg.event.title
                  }</div>
                  <div style="font-size: 12px; opacity: 0.95; margin-bottom: 2px;">${
                    arg.event.extendedProps.className
                  }</div>
                  <div style="font-size: 12px; opacity: 0.9;">${
                    arg.event.extendedProps.room
                  }</div>
                </div>`,
              };
            }}
            firstDay={1}
            allDaySlot={false}
            height="80vh"
            locale="vi"
            slotMinTime="00:00:00"
            slotMaxTime="12:00:00"
            slotDuration="01:00:00"
            slotLabelInterval="01:00:00"
            slotLabelContent={(arg) => {
              return arg.date.getHours() + 1;
            }}
            expandRows={true}
            stickyHeaderDates={false}
            slotEventOverlap={false}
            dayMaxEventRows={false}
            eventMaxStack={10}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Chi tiết buổi học
            </h3>

            <div className="space-y-2 text-gray-700">
              <p>
                <strong className="text-gray-900">Môn:</strong>{" "}
                {selectedEvent.title}
              </p>
              <p>
                <strong className="text-gray-900">Ca:</strong> Ca{" "}
                {selectedEvent.shift}
              </p>
              <p>
                <strong className="text-gray-900">Loại:</strong>{" "}
                {selectedEvent.type === "theory" ? "Lý thuyết" : "Thực hành"}
              </p>
              <p>
                <strong className="text-gray-900">Phòng:</strong>{" "}
                {selectedEvent.room || "Chưa xác định"}
              </p>
              <p>
                <strong className="text-gray-900">Tuần:</strong> Tuần{" "}
                {selectedEvent.week}
              </p>
              <p>
                <strong className="text-gray-900">Ngày:</strong>{" "}
                {formatDate(selectedEvent.start)}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200"
                onClick={() => setIsModalOpen(false)}
              >
                Đóng
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-blue-500 text-white"
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
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  onClick={() => {
                    setIsModalOpen(false);
                    setOpenConfirmModal(true);
                  }}
                >
                  Báo vắng
                </button>
              )}

              {userRole === "teacher" && selectedEvent.isAbsent && (
                <div className="px-4 py-2 rounded-lg bg-gray-300 text-gray-600 cursor-not-allowed">
                  Đã báo vắng
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={openConfirmModal}
        title="Xác nhận báo vắng"
        message="Bạn chắc chắn muốn báo vắng buổi này?"
        onCancel={() => setOpenConfirmModal(false)}
        onConfirm={() => {
          handleDeleteAbsence();
          setOpenConfirmModal(false);
        }}
        btnDelete="Xác nhận"
        btnCancel="Hủy"
      />
    </div>
  );
}
