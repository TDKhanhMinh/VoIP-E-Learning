export const formatSchedule = (schedule) => {
  if (!Array.isArray(schedule) || schedule.length === 0) return "Chưa có lịch";

  const days = {
    2: "Thứ 2",
    3: "Thứ 3",
    4: "Thứ 4",
    5: "Thứ 5",
    6: "Thứ 6",
    7: "Thứ 7",
    8: "Chủ nhật",
  };

  return schedule.map((s) => (
    <span
      key={`${s.dayOfWeek}-${s.shift}`}
      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 mr-2 mb-1 border border-blue-100"
    >
      {days[s.dayOfWeek]} - Ca {s.shift}
    </span>
  ));
};
