import TeachingSchedule from "../model/teachingSchedule.js";
import User from "../model/user.js";
import * as enrolledService from "../service/classStudentService.js"
import * as emailService from "../service/emailService.js"
import * as classService from "../service/classService.js"
import { createClassCancellationHtml } from "../utils/emailTemplete.js";
import { formatVietnameseDate } from "../utils/formatVietnameseDate.js";

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

export const markAbsence = async (teacherId, targetDate, shift, classId) => {
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
    const [teacher, classDetails, studentEnrolled] = await Promise.all([
        User.findById(teacherId),
        classService.findById(classId),
        enrolledService.getClassStudents(classId)
    ]);
    if (!teacher) {
        throw new Error("Không tìm thấy giáo viên.");
    }
    if (!classDetails) {
        throw new Error("Không tìm thấy lớp học.");
    }
    if (!studentEnrolled || studentEnrolled.length === 0) {
        throw new Error("Không tìm thấy giáo viên.");
    }
    if (!classDetails) {
        throw new Error("Không tìm thấy lớp học.");
    }
    if (!studentEnrolled || studentEnrolled.length === 0) {
        console.log("Lớp không có sinh viên nào.");
        return;
    }
    const validStudents = studentEnrolled.filter(doc => doc && doc.student && doc.student.email);

    if (validStudents.length === 0) {
        console.log("Không tìm thấy sinh viên nào có email hợp lệ.");
        return;
    }


    const htmlData = {
        className: classDetails.name,
        absenceDate: targetDate,
        classTime: `Ca ${shift}`,
        lecturerName: teacher.full_name,
    };
    const htmlContent = createClassCancellationHtml(htmlData);
    const subject = `[THÔNG BÁO] Nghỉ học môn ${classDetails.name} - Ngày ${formatVietnameseDate(targetDate)}`;
    const content = ``;

    const emailPromises = validStudents.map(doc => {
        return emailService.sendEmail(
            doc.student.email,
            subject,
            htmlContent,
            teacher.full_name,
            content
        );
    });

    await Promise.all(emailPromises);


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