import TeachingSchedule from "../model/teachingSchedule.js";

export const getSchedulesByTeacher = async (teacherId) => {
    if (!teacherId) {
        const error = new Error("Teacher ID is required");
        error.statusCode = 400;
        throw error;
    }

    const schedules = await TeachingSchedule.find({ teacher: teacherId })
        .populate({
            path: "class",
            select: "name course semester",
            populate: { path: "course", select: "title" },
        })
        .populate("teacher", "full_name email")
        .sort({ date: 1, startTime: 1 });

    return schedules;
};


export const getSchedulesByClass = async (classId) => {
    if (!classId) {
        const error = new Error("Class ID is required");
        error.statusCode = 400;
        throw error;
    }

    const schedules = await TeachingSchedule.find({ class: classId })
        .populate({
            path: "class",
            select: "name course semester",
            populate: { path: "course", select: "title" },
        })
        .populate("teacher", "full_name email")
        .sort({ date: 1, startTime: 1 });

    return schedules;
};


export const getTeachingScheduleById = async (id) => {
    const schedule = await TeachingSchedule.findById(id)
        .populate({
            path: "class",
            select: "name course semester",
            populate: { path: "course", select: "title" },
        })
        .populate("teacher", "full_name email");

    if (!schedule) {
        const error = new Error("Teaching schedule not found");
        error.statusCode = 404;
        throw error;
    }

    return schedule;
};
