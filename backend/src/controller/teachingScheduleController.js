import * as service from "../service/teachingScheduleService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const findByTeacherId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const submission = await service.getSchedulesByTeacher(id);
    res.status(200).json(submission);
});

export const findById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const submission = await service.getTeachingScheduleById(id);
    res.status(200).json(submission);
});
export const findByClassId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const submission = await service.getSchedulesByClass(id);
    res.status(200).json(submission);
});

export const handleReportAbsence = async (req, res, next) => {
    try {
        const teacherId = req.params.id;
        const { shift, rawDate, classId } = req.body;
        if (!shift) {
            return res.status(400).json({ message: "Vui lòng cung cấp ca học." });
        }
        const targetDate = new Date(rawDate);
        const updatedSchedule = await service.markAbsence(teacherId, targetDate, Number(shift), classId);
        res.status(200).json({
            message: "Báo vắng thành công!",
            schedule: updatedSchedule,
        });

    } catch (error) {
        next(error);
    }
};