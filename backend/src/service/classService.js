import Class from "../model/class.js";
import Course from "../model/course.js";
import room from "../model/room.js";
import Semester from "../model/semester.js";
import User from "../model/user.js";
import { createRoom } from "./roomService.js";

export const getAll = async () => {
  const classes = await Class.find().sort({ createdAt: -1 });
  return classes;
};

export const findById = async (id) => {
  const findingClass = await Class.findById(id);
  if (!findingClass) {
    const error = new Error("Class with id ${id} not found");
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

  for (const existingClass of teacherClasses) {
    for (const existing of existingClass.schedule) {
      for (const incoming of data.schedule) {
        if (
          existing.dayOfWeek === incoming.dayOfWeek &&
          existing.shift === incoming.shift
        ) {
          const error = new Error(
            `Giảng viên đã có lớp "${
              existingClass.name
            }" trong cùng thời gian (${dayLabel(incoming.dayOfWeek)} - Ca ${
              incoming.shift
            }).`
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
    theoryWeeks: data.theoryWeeks,
    practiceWeeks: data.practiceWeeks,
  });

  await createRoom({
    classId: newClass._id,
    teacherId: teacher._id,
    teacherEmail: teacher.email,
    teacherName: teacher.name,
  });

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
    const existingRoom = await room.findOne({ classId: id });
    if (existingRoom) {
      existingRoom.teacherId = teacher._id;
      existingRoom.teacherName = teacher.full_name;
      existingRoom.teacherEmail = teacher.email;
      await existingRoom.save();
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

  return updatedClass;
};

export const addAbsenceDate = async (classId, date) => {
  const classObj = await Class.findById(classId);
  if (!classObj) {
    const error = new Error("Class not found");
    error.statusCode = 404;
    throw error;
  }
  classObj.absent.push({ date: new Date(date) });
  await classObj.save();
  return classObj;
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
