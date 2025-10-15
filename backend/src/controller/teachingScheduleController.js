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