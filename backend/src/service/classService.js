import Class from "../model/class.js";
import Course from "../model/course.js";
import Semester from "../model/semester.js";
import TeachingSchedule from "../model/teachingSchedule.js";
import User from "../model/user.js";
import { createRoom } from "./roomService.js";

export const getAll = async () => {
  const classes = await Class.find().sort({ createdAt: -1 });
  return classes;
};

export const findById = async (id) => {
  const findingClass = await Class.findById(id);
  if (!findingClass) {
    const error = new Error("Announcement with id ${id} not found");
    error.statusCode = 404;
    throw error;
  }
  return findingClass;
};

const dayLabel = (day) => {
  const days = {
    2: "Thứ 2",
    3: "Thứ 3",
    4: "Thứ 4",
    5: "Thứ 5",
    6: "Thứ 6",
    7: "Thứ 7",
  };
  return days[day] || "Không rõ";
};


export const createClass = async (data) => {
  console.log("Received class data:", data);

  const [semester, teacher, course] = await Promise.all([
    Semester.findById(data.semester),
    User.findOne({ _id: data.teacher, role: "teacher" }),
    Course.findById(data.course),
  ]);

  if (!semester || !teacher || !course) {
    const error = new Error("Invalid semester, teacher or course");
    error.statusCode = 404;
    throw error;
  }

  const teacherClasses = await Class.find({
    teacher: data.teacher,
    semester: data.semester,
  });
  if (data.schedule.length > 1) {
    const error = new Error("Mỗi lớp chỉ được có 1 buổi/tuần");
    error.statusCode = 400;
    throw error;
  }

  for (const existingClass of teacherClasses) {
    for (const existing of existingClass.schedule) {
      for (const incoming of data.schedule) {
        if (
          existing.dayOfWeek === incoming.dayOfWeek &&
          existing.shift === incoming.shift
        ) {
          const error = new Error(
            `Giảng viên đã có lớp "${existingClass.name}" trong cùng thời gian (${dayLabel(
              incoming.dayOfWeek
            )} - Ca ${incoming.shift}).`
          );
          error.statusCode = 400;
          throw error;
        }
      }
    }
  }

  const newClass = await Class.create({
    name: data.name,
    course: course._id,
    semester: semester._id,
    teacher: teacher._id,
    schedule: data.schedule,
  });

  await createRoom({
    classId: newClass._id,
    teacherId: teacher._id,
    teacherEmail: teacher.email,
    teacherName: teacher.name,
  })
  console.log(`Class created: ${newClass.name}`);
  const shiftTimes = {
    1: { startTime: "06:50", endTime: "09:20" },
    2: { startTime: "09:30", endTime: "12:00" },
    3: { startTime: "12:45", endTime: "15:15" },
    4: { startTime: "15:25", endTime: "17:55" },
  };
  const schedules = [];
  const current = new Date(semester.startDate || semester.start_date);
  const end = new Date(semester.endDate || semester.end_date);

  while (current <= end) {
    const day = current.getDay();
    const matched = newClass.schedule.find((s) => s.dayOfWeek === day);
    if (matched) {
      const { startTime, endTime } = shiftTimes[matched.shift];
      schedules.push({
        class: newClass._id,
        teacher: teacher._id,
        date: new Date(current),
        startTime,
        endTime,
        status: "SCHEDULED",
      });
    }
    current.setDate(current.getDate() + 1);
  }

  if (schedules.length > 0) {
    await TeachingSchedule.insertMany(schedules);
    console.log(`Generated ${schedules.length} teaching sessions`);
  }

  return newClass;
};


export const updateClass = async (id, data) => {
  const updates = { ...data };

  Object.keys(updates).forEach(
    (key) => updates[key] == null && delete updates[key]
  );

  if (updates.teacher) {
    const teacher = await User.findOne({
      _id: updates.teacher,
      role: "teacher",
    });
    if (!teacher) {
      const error = new Error("Invalid teacher");
      error.statusCode = 404;
      throw error;
    }
  }

  let semester = null;
  if (updates.semester) {
    semester = await Semester.findById(updates.semester);
    if (!semester) {
      const error = new Error("Invalid semester");
      error.statusCode = 404;
      throw error;
    }
  }
  if (updates.schedule.length > 1) {
    const error = new Error("Mỗi lớp chỉ được có 1 buổi/tuần");
    error.statusCode = 400;
    throw error;
  }

  if (updates.schedule) {
    updates.schedule = updates.schedule.map(({ _id, ...rest }) => rest);
  }

  const existingClass = await Class.findById(id);
  if (!existingClass) {
    const error = new Error("Class not found");
    error.statusCode = 404;
    throw error;
  }

  const teacherId = updates.teacher || existingClass.teacher;
  const semesterId = updates.semester || existingClass.semester;
  const newSchedule = updates.schedule || existingClass.schedule;

  const teacherClasses = await Class.find({
    teacher: teacherId,
    semester: semesterId,
    _id: { $ne: id },
  });

  for (const c of teacherClasses) {
    for (const existing of c.schedule) {
      for (const incoming of newSchedule) {
        if (
          existing.dayOfWeek === incoming.dayOfWeek &&
          existing.shift === incoming.shift
        ) {
          const error = new Error(
            `Giảng viên đã có lớp "${c.name}" trong cùng thời gian (${dayLabel(
              incoming.dayOfWeek
            )} - Ca ${incoming.shift}).`
          );
          error.statusCode = 400;
          throw error;
        }
      }
    }
  }

  const updatedClass = await Class.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  );

  console.log("Class updated:", updatedClass.name);

  const needToRegenerate =
    updates.schedule || updates.semester || updates.teacher;

  if (needToRegenerate) {
    console.log("🔁 Regenerating teaching schedule...");

    const targetSemester =
      semester || (await Semester.findById(updatedClass.semester));

    await TeachingSchedule.deleteMany({ class: id });
    const shiftTimes = {
      1: { startTime: "06:50", endTime: "09:20" },
      2: { startTime: "09:30", endTime: "12:00" },
      3: { startTime: "12:45", endTime: "15:15" },
      4: { startTime: "15:25", endTime: "17:55" },
    };
    const schedules = [];
    const current = new Date(targetSemester.startDate || targetSemester.start_date);
    const end = new Date(targetSemester.endDate || targetSemester.end_date);

    while (current <= end) {
      const day = current.getDay();
      const match = updatedClass.schedule.find((s) => s.dayOfWeek === day);
      if (match) {
        const { startTime, endTime } = shiftTimes[match.shift];
        schedules.push({
          class: updatedClass._id,
          teacher: updatedClass.teacher,
          date: new Date(current),
          startTime,
          endTime,
        });
      }
      current.setDate(current.getDate() + 1);
    }

    if (schedules.length > 0) {
      await TeachingSchedule.insertMany(schedules);
      console.log(`Regenerated ${schedules.length} teaching sessions`);
    }
  }

  return updatedClass;
};

export const deleteClass = async (id) => {
  const deleteClass = await Class.findByIdAndDelete(id);
  if (!deleteClass) {
    const error = new Error("Class not found");
    error.statusCode = 404;
    throw error;
  }
  return deleteClass;
};
