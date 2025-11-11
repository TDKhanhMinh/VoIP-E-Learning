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
const shiftTimes = {
    1: { startTime: "06:50", endTime: "09:20" },
    2: { startTime: "09:30", endTime: "12:00" },
    3: { startTime: "12:45", endTime: "15:15" },
    4: { startTime: "15:25", endTime: "17:55" },
};

export const markAbsence = async (teacherId, targetDate, shift) => {
    if (!shiftTimes[shift]) {
        const error = new Error("Ca học không hợp lệ.");
        error.statusCode = 400;
        throw error;
    }

    const { startTime } = shiftTimes[shift];

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    


    const updatedSchedule = await TeachingSchedule.findOneAndUpdate(
        {
            teacher: teacherId,
            startTime: startTime,
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
            status: "SCHEDULED",
        },
        {
            $set: {
                status: "ABSENT", 
            },
        },
        {
            new: true, 
        }
    );

    if (!updatedSchedule) {
        const error = new Error(
            "Không tìm thấy buổi học hợp lệ để báo vắng. (Có thể đã báo vắng rồi, hoặc đã hoàn thành)."
        );
        error.statusCode = 404;
        throw error;
    }

    console.log(`Đã báo vắng cho buổi học: ${updatedSchedule._id}`);
    return updatedSchedule;
};