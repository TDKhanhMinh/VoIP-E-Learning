import { addDays, isWithinInterval, format } from "date-fns";

const periods = {
  1: { start: "00:00:00", end: "03:00:00", label: "Ca 1", color: "#3b82f6" },
  2: { start: "03:00:00", end: "06:00:00", label: "Ca 2", color: "#10b981" },
  3: { start: "06:00:00", end: "09:00:00", label: "Ca 3", color: "#f59e0b" },
  4: { start: "09:00:00", end: "12:00:00", label: "Ca 4", color: "#8b5cf6" },
};

function getWeekStartDates(startDate, endDate) {
  const weeks = [];
  let start = new Date(startDate);

  const dayOfWeek = start.getDay();
  const daysToMonday = dayOfWeek === 0 ? 1 : (1 - dayOfWeek + 7) % 7;
  let current = addDays(start, daysToMonday);

  if (current > start) current = addDays(current, -7);

  while (current <= new Date(endDate)) {
    weeks.push(new Date(current));
    current = addDays(current, 7);
  }
  return weeks;
}

function getDateOfWeek(weekStart, dayOfWeek) {
  return addDays(weekStart, dayOfWeek - 2);
}

function formatDateLocal(date) {
  return format(date, "yyyy-MM-dd");
}

export async function generateScheduleWithMidTerm(classData) {
  const { schedule, semester, theoryWeeks, practiceWeeks, absent } = classData;
  const { start_date, end_date, mid_term } = semester;

  const weekStarts = getWeekStartDates(start_date, end_date);
  const events = [];

  const midTermRange =
    mid_term && mid_term.start_date
      ? {
          start: new Date(mid_term.start_date),
          end: new Date(mid_term.end_date),
        }
      : null;

  const absenceDates = (absent || [])
    .map((a) => {
      if (!a?.date) return null;
      const d = new Date(a.date);
      return isNaN(d.getTime()) ? null : formatDateLocal(d);
    })
    .filter(Boolean);

  schedule.forEach((s) => {
    const totalWeeks = s.type === "theory" ? theoryWeeks : practiceWeeks;
    const startWeek = s.type === "practice" ? 2 : 0;

    for (let i = startWeek; i < startWeek + totalWeeks; i++) {
      const weekStart = weekStarts[i];
      if (!weekStart) continue;

      const day = getDateOfWeek(weekStart, s.dayOfWeek);

      if (midTermRange && isWithinInterval(day, midTermRange)) continue;

      const period = periods[s.shift];
      const dateStr = formatDateLocal(day);

      const isAbsent = absenceDates.includes(dateStr);

      events.push({
        id: `${classData._id}-${s.type}-${i}-${s.dayOfWeek}-${s.shift}`,
        title: classData.course.title,
        start: `${dateStr}T${period.start}Z`,
        end: `${dateStr}T${period.end}Z`,
        backgroundColor: isAbsent ? "#ef4444" : period.color,
        borderColor: isAbsent ? "#dc2626" : period.color,
        extendedProps: {
          type: s.type,
          room: s.room,
          shift: s.shift,
          week: i + 1,
          classId: classData._id,
          courseName: classData.course.title,
          className: classData.name,
          isAbsent,
        },
      });
    }
  });

  return events;
}
